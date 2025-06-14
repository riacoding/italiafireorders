'use client'

import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useSafeAuthenticator()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login')
    } else if (authStatus === 'authenticated') {
      setChecking(false)
    }
  }, [authStatus, router])

  if (checking || authStatus !== 'authenticated') {
    return <div className='p-8 text-gray-500'>Loading...</div>
  }

  return <div className='w-full flex flex-col items-center'>{children}</div>
}
