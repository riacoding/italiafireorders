import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '$amplify/env/squareAuthHandler'

const SQUARE_ENV = process.env.SQUARE_ENV || 'sandbox'
const SQUARE_APP_ID = process.env.SQUARE_APP_ID!

export const handler = async (event: any) => {
  console.log('getSquareAuth event', event)

  const handle = event.arguments.handle as string

  // Generate a jwt token
  const state = jwt.sign(
    {
      handle,
      nonce: crypto.randomBytes(32).toString('hex'),
    },
    process.env.OAUTH_STATE_SECRET!,
    { expiresIn: '1h' }
  )

  // Store this state in your DB or pass it back to client to set in cookie
  // (e.g., state -> handle map in DynamoDB with TTL)

  const isSandbox = SQUARE_ENV.toLowerCase() === 'sandbox'
  const basePath = isSandbox ? 'https://app.squareupsandbox.com' : 'https://app.squareup.com'

  const redirectUri = `${env.APP_BASE_URL}/square/callback` // replace with your actual sandbox callback

  console.log('redirectURI', redirectUri)

  const scopes = [
    'ITEMS_READ',
    'MERCHANT_PROFILE_READ',
    'PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS',
    'PAYMENTS_WRITE',
    'PAYMENTS_READ',
  ]

  const url =
    `${basePath}/oauth2/authorize` +
    `?client_id=${SQUARE_APP_ID}` +
    `&response_type=code` +
    `&scope=${scopes.join('+')}` +
    `&state=${state}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`

  return {
    url,
    state,
  }
}
