'use client'

import { Button } from '@/components/ui/button'
import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useSafeAuthenticator()
  const router = useRouter()

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login')
    }
  }, [authStatus, router])

  if (authStatus !== 'authenticated') return null

  return <div className='w-full flex flex-col items-center'>{children}</div>
}
