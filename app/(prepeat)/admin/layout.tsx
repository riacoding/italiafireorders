'use client'

import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { getUserBySub, getMerchant } from '@/lib/ssr-actions'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MerchantProvider } from '@/components/MerchantContext'
import { PublicMerchant } from '@/types'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useSafeAuthenticator()
  const router = useRouter()
  const pathname = usePathname()

  const [merchant, setMerchant] = useState<PublicMerchant | null>(null)
  const [checking, setChecking] = useState(true)

  const isOnboardingRoute = pathname.startsWith('/admin/onboarding')

  useEffect(() => {
    async function load() {
      console.log('loading layout')
      if (authStatus === 'authenticated' && user?.userId) {
        const userRecord = await getUserBySub(user.userId)

        if (!userRecord?.merchantId) {
          if (!isOnboardingRoute) {
            router.replace('/signup/onboarding')
            return
          }
          setChecking(false)
          return
        }

        const fetchedMerchant = await getMerchant(userRecord.merchantId)
        setMerchant(fetchedMerchant)

        // If merchant exists but user is on onboarding, redirect them to /admin
        if (isOnboardingRoute) {
          router.replace('/admin')
          return
        }

        setChecking(false)
      }
    }

    if (authStatus === 'unauthenticated') {
      router.replace('/login')
    } else {
      load()
    }
  }, [authStatus, user?.userId, pathname, isOnboardingRoute, router])

  if (checking || authStatus !== 'authenticated') {
    return
  }

  // If we're still here on onboarding route, they are allowed through without MerchantProvider
  if (isOnboardingRoute && !merchant) {
    return <div className='w-full flex flex-col items-center'>{children}</div>
  }

  // All other admin routes require MerchantProvider
  return (
    <MerchantProvider merchant={merchant}>
      <div className='w-full flex flex-col items-center'>{children}</div>
    </MerchantProvider>
  )
}
