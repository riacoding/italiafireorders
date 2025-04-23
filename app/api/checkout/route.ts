import { NextRequest, NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'
import { randomUUID } from 'crypto'

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cartItems, locationId } = body

    const lineItems = cartItems.map((item: any) => ({
      catalogObjectId: item.squareItemId,
      quantity: item.quantity.toString(),
      name: item.name,
      basePriceMoney: {
        amount: BigInt(item.basePrice), // Ensure this is the correct price in cents
        currency: 'USD',
      },
      modifiers: item.toppings.map((t: any) => ({
        name: t.name,
        quantity: '1',
        basePriceMoney: {
          amount: BigInt(t.price),
          currency: 'USD',
        },
        catalogObjectId: t.squareModifierId,
      })),
    }))

    // Then create checkout link using that order
    const result = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        referenceId: `order-${Date.now()}`,
        lineItems,
        taxes: [
          {
            uid: 'INOISXDO45PKAMHRTDQ4MQVI',
            scope: 'ORDER',
            name: 'State Sales Tax',
            percentage: '8.25',
          },
        ],
      },
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/thankyou?order=${Date.now()}`,
      },
    })

    return NextResponse.json({ url: result.paymentLink?.longUrl })
  } catch (err) {
    console.error('Error creating Square checkout:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
