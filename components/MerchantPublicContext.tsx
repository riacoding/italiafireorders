'use client'
import { Merchant, MerchantSelected } from '@/types'
import { createContext, useContext, useState } from 'react'

type MerchantPublicContextType = {
  merchant: MerchantSelected | null
}

const MerchantPublicContext = createContext<MerchantPublicContextType | undefined>(undefined)

export const MerchantPublicProvider = ({
  children,
  merchant,
}: {
  children: React.ReactNode
  merchant: MerchantSelected | null
}) => {
  return <MerchantPublicContext.Provider value={{ merchant }}>{children}</MerchantPublicContext.Provider>
}

export const usePublicMerchant = () => {
  const context = useContext(MerchantPublicContext)
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider')
  }
  return context
}
