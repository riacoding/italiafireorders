import { NextRequest, NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment, Square } from 'square'
import { cookieBasedClient } from '@/util/amplify'
import jwt from 'jsonwebtoken'

const env = process.env
console.log('SQUARE_APP_ID', env.SQUARE_APPLICATION_ID)
console.log('SQUARE_SECRET', env.SQUARE_CLIENT_SECRET ? '✅ loaded' : '❌ MISSING')
console.log('Redirect URI:', 'http://localhost:3000/square/callback')

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
  }

  let prepEatMerchantId: string

  try {
    const decoded = jwt.verify(state!, env.OAUTH_STATE_SECRET!) as { merchantId: string }
    prepEatMerchantId = decoded.merchantId
  } catch (err) {
    console.error('Invalid or expired state token:', err)
    return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/onboarding/error`)
  }

  try {
    const square = new SquareClient({
      environment: env.SQUARE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
      token: undefined, // We're obtaining one now
    })

    const tokenResult: Square.ObtainTokenResponse = await square.oAuth.obtainToken({
      code,
      clientId: env.SQUARE_APPLICATION_ID!,
      clientSecret: process.env.SQUARE_CLIENT_SECRET,
      grantType: 'authorization_code',
      redirectUri: 'http://localhost:3000/square/callback',
    })

    const { accessToken, refreshToken, expiresAt, merchantId } = tokenResult
    const authedSquare = new SquareClient({
      environment: SquareEnvironment.Sandbox,
      token: accessToken!,
    })

    const merchantProfile: Square.GetMerchantResponse = await authedSquare.merchants.get({ merchantId: merchantId! })

    const locationsResponse: Square.ListLocationsResponse = await authedSquare.locations.list()
    const activeLocations = locationsResponse.locations?.filter((loc) => loc.status === 'ACTIVE') ?? []

    const locationIds = activeLocations.map((loc) => loc.id!)
    console.log('Fetched location IDs:', locationIds)

    await cookieBasedClient.models.Merchant.update({
      id: prepEatMerchantId,
      accessToken,
      refreshToken,
      tokenExpiresAt: expiresAt,
      tokenrefreshedAt: new Date().toISOString(),
      squareMerchantId: merchantId,
      businessName: merchantProfile.merchant?.businessName || 'Unnamed Business',
      locationIds: locationIds || [],
    })

    return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/admin/setup`)
  } catch (err: any) {
    console.error('OAuth callback error', err)
    return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/onboarding/error`)
  }
}
