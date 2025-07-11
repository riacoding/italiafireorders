// components/MerchantContext.tsx
'use client'
import { Merchant, PublicMerchant } from '@/types'
import { createContext, useContext } from 'react'

const MerchantContext = createContext<PublicMerchant | null>(null)

export const MerchantProvider = ({
  merchant,
  children,
}: {
  merchant: PublicMerchant | null
  children: React.ReactNode
}) => {
  return <MerchantContext.Provider value={merchant}>{children}</MerchantContext.Provider>
}

export const useMerchant = () => {
  const context = useContext(MerchantContext)
  if (!context) throw new Error('useMerchant must be used within a MerchantProvider')
  return context
}
