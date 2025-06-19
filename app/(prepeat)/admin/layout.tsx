'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { getUserBySub, getMerchant, getServerMerchant } from '@/lib/ssr-actions'
import { MerchantProvider } from '@/components/MerchantContext'
import type { PublicMerchant } from '@/types'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useSafeAuthenticator()
  const router = useRouter()
  const pathname = usePathname()

  const [merchant, setMerchant] = useState<PublicMerchant | null>(null)
  const [loading, setLoading] = useState(true)

  const isOnboardingRoute = pathname.startsWith('/admin/onboarding')

  console.log('AdminLayout INIT', {
    authStatus,
    userId: user?.userId,
    pathname,
  })

  useEffect(() => {
    async function init() {
      // ⛔️ Not logged in
      if (authStatus === 'unauthenticated') {
        router.replace('/login')
        return
      }

      if (authStatus === 'authenticated' && !user?.userId) {
        // Still hydrating user — wait
        return
      }

      // ✅ Logged in and user exists
      if (authStatus === 'authenticated' && user?.userId) {
        const userRecord = await getUserBySub(user.userId)

        // 🧹 Cleanup sessionStorage once we’re in DB flow
        sessionStorage.removeItem('signupStep')
        sessionStorage.removeItem('signupEmail')
        sessionStorage.removeItem('signupUserId')
        sessionStorage.removeItem('signupMerchant')

        // 🚧 No merchant created yet — needs business step
        if (!userRecord?.merchantId) {
          if (!isOnboardingRoute) {
            router.replace('/admin/onboarding')
          }
          setLoading(false)
          return
        }

        // ✅ Has merchantId — fetch merchant
        const fetchedMerchant = await getServerMerchant(userRecord.merchantId)
        setMerchant(fetchedMerchant)

        const isLinked = !!fetchedMerchant?.accessToken

        // 🚧 Merchant exists but not linked — needs Square link step
        if (!isLinked) {
          if (!isOnboardingRoute) {
            router.replace('/admin/onboarding')
          }
          setLoading(false)
          return
        }

        // ✅ Fully onboarded but still on onboarding route — redirect to main admin
        if (isOnboardingRoute) {
          router.replace('/admin')
          return
        }

        // ✅ All good, allow rendering
        setLoading(false)
      }
    }

    init()
  }, [authStatus, user?.userId, pathname, isOnboardingRoute, router])

  if (loading || authStatus !== 'authenticated' || !user?.userId) {
    return <div className='p-4'>Loading...</div>
  }

  // 🟡 Onboarding UI (business step or Square link) — merchant may or may not exist
  if (isOnboardingRoute) {
    return <div className='w-full flex flex-col items-center'>{children}</div>
  }

  // ✅ Admin routes — requires MerchantProvider
  return (
    <MerchantProvider merchant={merchant}>
      <div className='w-full flex flex-col items-center'>{children}</div>
    </MerchantProvider>
  )
}
