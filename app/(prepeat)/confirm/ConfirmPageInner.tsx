// app/confirm/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { SignupProvider } from '@/components/SignupContext'
import ConfirmForm from '@/components/ConfirmForm'

export default function ConfirmPage() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  return (
    <SignupProvider>
      <ConfirmForm standalone initialEmail={email} requirePassword />
    </SignupProvider>
  )
}
