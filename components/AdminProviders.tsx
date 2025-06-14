'use client'
import React, { ReactNode } from 'react'
import outputs from '../amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { CartProvider } from '@/components/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantPublicProvider } from './MerchantPublicContext'

Amplify.configure(outputs, { ssr: true })

type RootLayoutProps = {
  children: ReactNode
}

const queryClient = new QueryClient()

const AdminProviders: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
        <MerchantPublicProvider merchant={null}>
          <CartProvider>
            <div className='flex-1 flex flex-col'>{children}</div>
          </CartProvider>
        </MerchantPublicProvider>
      </QueryClientProvider>
    </Authenticator.Provider>
  )
}

export default AdminProviders
