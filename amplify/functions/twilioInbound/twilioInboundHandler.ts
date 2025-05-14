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

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('event:', event)
  console.log(process.env)
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || ''

  const parsed = querystring.parse(rawBody)
  const message = parsed.Body?.toString().trim().toLowerCase()
  const from = parsed.From?.toString()

  let reply = 'Sorry, we couldn’t find a menu for that code. Please try again.'

  if (message) {
    const { data: menu, errors } = await client.models.Menu.listMenuByLocationId(
      { locationId: message },
      { authMode: 'identityPool' }
    )
    console.log('menu', menu)
    if (errors?.length) {
      console.error('fetch menu failed:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    if (menu[0]?.isActive) {
      reply = `Here’s today’s menu: https://main.d1tk6naxmgg6kb.amplifyapp.com/menu/${menu[0].locationId}`
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: `<Response><Message>
      ${reply}
      <Media>https://https://main.d1tk6naxmgg6kb.amplifyapp.com/ItaliaFire.png</Media>
    </Message></Response>`,
  }
}
