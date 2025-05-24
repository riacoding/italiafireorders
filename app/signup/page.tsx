// app/signup/page.tsx
'use client'

import { SignupProvider, useSignupContext } from '@/components/SignupContext'
import SignupForm from '@/components/SignUpForm'
import ConfirmForm from '@/components/ConfirmForm'
import CreateBusinessForm from '@/components/CreateBusinessForm' // create this next
import LinkAccount from '@/components/LinkAccount'

function SignupStepManager() {
  const { currentStep } = useSignupContext()

  return (
    <div className='max-w-md mx-auto p-4'>
      {currentStep === 'signup' && <SignupForm />}
      {currentStep === 'confirm' && <ConfirmForm />}
      {currentStep === 'business' && <CreateBusinessForm />}
      {currentStep === 'link' && <LinkAccount />}
    </div>
  )
}

export default function SignupPage() {
  return (
    <SignupProvider>
      <SignupStepManager />
    </SignupProvider>
  )
}
