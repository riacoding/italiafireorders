import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import crypto from 'crypto'
import { SquareClient, SquareEnvironment } from 'square'
import type { Handler } from 'aws-lambda'
import type { Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/webhookProcessorHandler' // replace with your function name
import { sanitizeBigInts } from './util'
import { SquareFulfillmentUpdate } from './types'
import twilio from 'twilio'

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
const TWILIO_FROM = process.env.TWILIO_FROM! // your Twilio number or messaging service SID

const SQUARE_WEBHOOK_SECRET = process.env.SQUARE_WEBHOOK_SECRET!
const WEBHOOK_URL = process.env.WEBHOOK_URL!

//Amplify Client
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const amplifyClient = generateClient<Schema>()

//Square Client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  // environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  environment: SquareEnvironment.Sandbox,
})

function normalizeOrderStatus(squareState: string | undefined): 'COMPLETED' | 'OPEN' | undefined {
  if (squareState === undefined) return undefined
  return squareState === 'COMPLETED' ? 'COMPLETED' : 'OPEN'
}

async function updateFulfillmentStatus(orderId: string, newFulfillmentStatus: string, newOrderState?: string) {
  const { data: existing, errors: getErrors } = await amplifyClient.models.Order.get({ id: orderId })

  if (getErrors && getErrors.length > 0) {
    console.error('Error fetching order before update:', JSON.stringify(getErrors))
    return
  }

  if (!existing?.id) {
    console.warn(`⏳ Order ${orderId} not found yet. Skipping fulfillment update.`)
    return
  }

  const existingFulfillmentStatus = existing.fulfillmentStatus
  const existingOrderState = existing.status
  const normalizedNewState = normalizeOrderStatus(newOrderState)

  // Avoid unnecessary updates
  if (existingFulfillmentStatus === newFulfillmentStatus && existingOrderState === normalizedNewState) {
    console.log(`🟡 No change for order ${orderId}. Skipping update.`)
    return
  }

  const { data, errors } = await amplifyClient.models.Order.update({
    id: orderId,
    fulfillmentStatus: newFulfillmentStatus,
    status: normalizedNewState,
  })

  if (errors && errors.length > 0) {
    console.error('Amplify Update Order Error:', JSON.stringify(errors))
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  console.log(`✅ Amplify order updated: ${data?.id} → ${data?.fulfillmentStatus}`)
}

export async function createOrder(orderId: string, eventId: string) {
  console.log(`🆕 [${eventId}] Handling order.created:${orderId}`)
  const { order, errors: sqErrors } = await client.orders.get({ orderId })

  console.log('fetched order', JSON.stringify(sanitizeBigInts(order), null, 2))

  if (sqErrors) throw new Error(`Failed to retrieve order: ${JSON.stringify(sqErrors)}`)

  //square returns BigInt amplify needs a int
  const amount = order?.totalMoney?.amount
  const amountNumber = typeof amount === 'bigint' ? Number(amount) : amount

  let fulfillmentStatus = 'PROPOSED'
  if (order?.ticketName && order?.fulfillments && order?.fulfillments?.length > 0) {
    fulfillmentStatus = order?.fulfillments[0]?.state || 'PROPOSED'
    const phoneNumber = order.fulfillments[0].pickupDetails?.recipient?.phoneNumber
    //create phone
    if (phoneNumber) {
      const { data, errors } = await amplifyClient.models.Phone.create({
        phone: phoneNumber,
        ticketNumber: order?.ticketName,
        optIn: true,
      })

      if (errors && errors.length > 0) {
        console.error(`❌ [${eventId}] Error fetching order phone:`, JSON.stringify(errors))
        throw new Error(errors.map((e) => e.message).join(', '))
      }
    }
  }

  const { data: existing } = await amplifyClient.models.Order.get({ id: orderId })
  if (existing?.id) {
    console.log('Order already exists. Skipping creation.')
    return { statusCode: 200, body: 'already exists' }
  }

  const { data, errors } = await amplifyClient.models.Order.create({
    id: order?.id,
    locationId: order?.locationId!,
    referenceId: order?.referenceId,
    status: order?.state,
    totalMoney: amountNumber,
    fulfillmentStatus: fulfillmentStatus,
    rawData: JSON.stringify(sanitizeBigInts(order)),
  })

  if (errors && errors.length > 0) {
    console.error('Amplify Create Order Error:', JSON.stringify(errors))
    throw new Error(errors.map((e) => e.message).join(', '))
  }
  console.log(`Amplify order created:${data?.id} `)
  return data?.id
}

export async function fulfillmentUpdated(update: SquareFulfillmentUpdate, eventId: string) {
  console.log(`🆕 [${eventId}] Handling order.fulfillment.updated: ${JSON.stringify(update)}`)
  const orderId = update.order_id
  const orderState = update.state
  const status = update.fulfillment_update[0].new_state

  await updateFulfillmentStatus(orderId, status, orderState)
}

export async function updateOrder(orderId: string, eventId?: string) {
  const { order: rawOrder, errors: sqErrors } = await client.orders.get({ orderId })
  const order = sanitizeBigInts(rawOrder)
  console.log(`🔄 [${eventId}] Handling order.updated: ${JSON.stringify(order)}`)
  if (sqErrors) {
    console.error(`❌ [${eventId}] Failed to fetch order ${orderId}:`, JSON.stringify(sqErrors))
    throw new Error(sqErrors.map((e) => e.detail).join(', '))
  }

  if (!order?.id) {
    console.warn(`⚠️ [${eventId}] No order returned for ID ${orderId}`)
    return
  }

  const amount = order.totalMoney?.amount
  const amountNumber = typeof amount === 'bigint' ? Number(amount) : amount

  const { data: existing, errors: getErrors } = await amplifyClient.models.Order.get({ id: orderId })
  if (getErrors && getErrors.length > 0) {
    console.error(`❌ [${eventId}] Error fetching local order:`, JSON.stringify(getErrors))
    return
  }

  if (!existing?.id) {
    console.warn(`⏳ [${eventId}] Order not found locally. Skipping update.`)
    return
  }

  const { data, errors } = await amplifyClient.models.Order.update({
    id: order.id,
    status: order.state,
    totalMoney: amountNumber,
    rawData: JSON.stringify(order),
  })

  if (errors && errors.length > 0) {
    console.error(`❌ [${eventId}] Error updating order:`, JSON.stringify(errors))
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  if (order.ticketName && order.fulfillments && order?.fulfillments[0].state === 'PREPARED') {
    console.log('📞 fetching Phone from Amplify')
    const { data: Phone, errors } = await amplifyClient.models.Phone.listPhoneByTicketNumber({
      ticketNumber: order.ticketName,
    })

    if (errors && errors.length > 0) {
      console.error(`❌ [${eventId}] Error fetching order phone:`, JSON.stringify(errors))
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    console.log('📞 Sending SMS with twilio')
    await sendOrderReadyText('+14083682841', order.ticketName)
  }

  console.log(`✅ [${eventId}] Order updated: ${data?.id}`)
}

async function sendOrderReadyText(phone: string, ticket: string) {
  const message = `🎉 Your order #${ticket} is ready! Pick it up now.`

  await twilioClient.messages.create({
    to: phone,
    from: TWILIO_FROM,
    body: message,
  })

  console.log(`Text sent to ${phone} for ticket ${ticket}`)
}
