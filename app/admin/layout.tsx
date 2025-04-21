'use client'

import { Button } from '@/components/ui/button'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className='w-full flex flex-col items-center'>
          <p>Welcome, {user?.username}</p>
          <Button onClick={signOut}>Sign Out</Button>
          {children}
        </div>
      )}
    </Authenticator>
  )
}
