import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import * as querystring from 'querystring'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../data/resource'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/twilioInboundHandler'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const client = generateClient<Schema>()
export type Menu = Schema['Menu']['type']

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('event:', event)
  const routed = event.headers?.['x-twilio-routed'] === 'true'
  console.log('Was routed via TwilioDevRouter?', routed)
  const APP_BASE_URL = process.env.APP_BASE_URL
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || ''

  const parsed = querystring.parse(rawBody)
  const message = parsed.Body?.toString().trim().toLowerCase()
  const from = parsed.From?.toString()

  console.log('twilio message', rawBody, message)

  let reply = 'Sorry, we couldn’t find a menu for that code. Please try again.'

  if (message) {
    const { data: menus, errors } = await client.models.Menu.listMenuByLocationId(
      { locationId: message },
      { authMode: 'iam' }
    )

    if (errors?.length) {
      console.error('fetch menu failed:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    const menu: Menu = menus[0]
    console.log('menu', menu)

    const { data: merchant, errors: merchantErrors } = await client.models.Merchant.get(
      { id: menu.merchantId },
      { authMode: 'iam' }
    )
    if (merchantErrors?.length) {
      console.error('fetch menu failed:', errors)
      throw new Error(merchantErrors.map((e) => e.message).join(', '))
    }

    if (menu.isActive) {
      reply = `Here’s today’s menu: ${APP_BASE_URL}/menus/${merchant?.handle}/${menu.locationId}`
    }

    console.log('reply:', reply)
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: `<Response>
      <Message>
        ${reply}
       
      </Message>
    </Response>`,
  }
}
