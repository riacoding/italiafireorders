import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import crypto from 'crypto'
import { publish } from './publishSNS'

const SQUARE_WEBHOOK_SECRET = process.env.SQUARE_WEBHOOK_SECRET!
const WEBHOOK_URL = process.env.WEBHOOK_URL!

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event:', event)
  console.log('Env:', process.env)
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || ''
  const signature = event.headers['x-square-signature']

  if (!signature || !isValidSignature(rawBody, signature, WEBHOOK_URL)) {
    console.warn('Invalid Square signature')
    return {
      statusCode: 401,
      body: 'Invalid signature',
    }
  }

  try {
    const payload = JSON.parse(rawBody)
    // Handle Square event
    console.log(`📦 Publishing event ${payload.event_id} of type ${payload.type}`)
    const response = await publish(sanitizeBigInts(payload), payload.type)
    console.log('publish response', response)

    return { statusCode: 200, body: 'ok' }
  } catch (err) {
    console.error('❌ Error publishing Square webhook event:', err)
    return {
      statusCode: 500,
      body: 'Unable to process',
    }
  }
}

function sanitizeBigInts(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()
  if (Array.isArray(obj)) return obj.map(sanitizeBigInts)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeBigInts(v)]))
  }
  return obj
}

function isValidSignature(body: string, signature: string, url: string): boolean {
  const hmac = crypto.createHmac('sha1', SQUARE_WEBHOOK_SECRET)
  hmac.update(url + body)
  const expected = hmac.digest('base64')
  return expected === signature
}
