import { SQSHandler } from 'aws-lambda'
import { isDuplicate, markProcessed } from './util'
import { createOrder, fulfillmentUpdated, getMerchant, getSquareClient, updateOrder } from './hookHandlers'
import { SquareClient } from 'square'

type SquareEventPayload = {
  merchant_id: string
  event_id: string
  type: string
  data: any
}

type EventHandler = (data: any, eventId: string, merchant_id: string, squareClient: SquareClient) => Promise<void>

const handlers: Record<string, EventHandler> = {
  'order.created': async (data, eventId, merchant_id, squareClient) => {
    console.log(`🆕 Handling order.created: [${eventId}] ${JSON.stringify(data, null, 2)}`)
    await createOrder(data.id, eventId, merchant_id, squareClient)
  },

  'order.updated': async (data, eventId, merchant_id, squareClient) => {
    console.log(`🔄 Handling order.updated: [${eventId}] ${JSON.stringify(data, null, 2)}`)
    await updateOrder(data.id, eventId, merchant_id, squareClient)
  },

  'order.fulfillment.updated': async (data, eventId, merchant_id, squareClient) => {
    console.log(`🔄 Handling order.fulfillment.updated: [${eventId}] ${JSON.stringify(data, null, 2)}`)
    await fulfillmentUpdated(data.object.order_fulfillment_updated, eventId, merchant_id, squareClient)
  },

  'payment.created': async (data, eventId, merchant_id) => {
    console.log(`🔄 Handling payment.created: [${eventId}] ${JSON.stringify(data, null, 2)}`)
  },

  'payment.updated': async (data, eventId, merchant_id) => {
    console.log(`🔄 Handling payment.updated: [${eventId}] ${JSON.stringify(data, null, 2)}`)
  },
}

export const handler: SQSHandler = async (event, context) => {
  for (const record of event.Records) {
    try {
      const snsEnvelope = JSON.parse(record.body)
      const payload: SquareEventPayload = JSON.parse(snsEnvelope.Message)

      const { event_id, type, data, merchant_id } = payload
      console.log(`Lambda RequestId: ${context.awsRequestId}, event_id: ${event_id}`)
      console.log(`📦** Processing event_id: ${event_id}, type: ${type}, event:${JSON.stringify(event, null, 2)}`)

      if (await isDuplicate(event_id)) {
        console.log(`🛑 Skipping duplicate event_id: ${event_id}`)
        continue
      }

      const handlerFn = handlers[type]
      if (handlerFn) {
        const merchant = await getMerchant(merchant_id)
        const squareClient = getSquareClient(merchant.accessToken)
        await handlerFn(data, event_id, merchant_id, squareClient)
        await markProcessed(event_id)
      } else {
        console.warn(`⚠️ No handler registered for event type: ${type}`)
      }
    } catch (err) {
      console.error('❌ Error processing record:', err)
    }
  }
}
