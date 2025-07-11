import { getUserBySub, getServerMerchant } from '@/lib/ssr-actions'
import { MerchantProvider } from '@/components/MerchantContext'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { getCurrentUserServer } from '@/util/amplify'

export default async function DemoLayout({ children }: { children: ReactNode }) {
  const merchantId = process.env.DEMO_MERCHANT_ID!
  console.log('merchantId', merchantId)
  const merchant = (await getServerMerchant(merchantId)) || null

  return <MerchantProvider merchant={merchant}>{children}</MerchantProvider>
}
