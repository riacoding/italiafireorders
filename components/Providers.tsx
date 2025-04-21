'use client'
import React, { ReactNode } from 'react'
import outputs from '../amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { CartProvider } from '@/components/CartContext'

Amplify.configure(outputs, { ssr: true })

type RootLayoutProps = {
  children: ReactNode
}

const Providers: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <Authenticator.Provider>
      <CartProvider>
        <div className='flex-1 flex flex-col'>{children}</div>
      </CartProvider>
    </Authenticator.Provider>
  )
}

export default Providers
