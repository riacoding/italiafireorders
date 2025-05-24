// app/components/SignupContext.tsx
'use client'

import { Merchant } from '@/types'
import { createContext, useContext, useState } from 'react'

// Types for each step of the signup flow
type SignupStep = 'signup' | 'confirm' | 'business' | 'link' | 'done'

interface SignupContextType {
  email: string | null
  setEmail: (email: string | null) => void
  userId: string | null
  setUserId: (id: string | null) => void
  merchant: Merchant | null
  setMerchant: (merchant: Merchant | null) => void
  currentStep: SignupStep
  setStep: (step: SignupStep) => void
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStep, setStep] = useState<SignupStep>('signup')
  const [merchant, setMerchant] = useState<Merchant | null>(null)

  return (
    <SignupContext.Provider
      value={{
        email,
        setEmail,
        userId,
        setUserId,
        merchant,
        setMerchant,
        currentStep,
        setStep,
      }}
    >
      {children}
    </SignupContext.Provider>
  )
}

export function useSignupContext() {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error('useSignupContext must be used inside SignupProvider')
  return ctx
}
