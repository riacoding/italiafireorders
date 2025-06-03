'use client'
import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { getUserBySub, getMerchant } from '@/lib/ssr-actions' // your data client or fetch functions
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MerchantProvider } from '@/components/MerchantContext'
import { Merchant, MerchantSelectionSet, PublicMerchant } from '@/types'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useSafeAuthenticator()
  const router = useRouter()

  const [merchant, setMerchant] = useState<PublicMerchant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMerchant() {
      if (authStatus === 'authenticated' && user?.userId) {
        const userRecord = await getUserBySub(user.userId)
        if (!userRecord?.merchantId) {
          router.replace('/no-merchant') // optional fallback
          return
        }
        const merchant = await getMerchant(userRecord.merchantId)
        setMerchant(merchant)
        setLoading(false)
      }
    }

    if (authStatus === 'unauthenticated') {
      router.replace('/login')
    } else {
      loadMerchant()
    }
  }, [authStatus, user?.userId, router])

  if (authStatus !== 'authenticated' || loading) return null

  return (
    <MerchantProvider merchant={merchant}>
      <div className='w-full flex flex-col items-center'>{children}</div>
    </MerchantProvider>
  )
}
