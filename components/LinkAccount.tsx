'use client'

import { useEffect, useState } from 'react'
import { useSignupContext } from './SignupContext'
import { Button } from '@/components/ui/button'
import { getAuthUrl } from '@/lib/ssr-actions'
import Link from 'next/link'

export default function LinkAccount() {
  const [url, setUrl] = useState<string | null>(null)
  const [auth, setAuth] = useState<string | null>(null)
  const { merchant } = useSignupContext()

  useEffect(() => {
    async function getUrl() {
      if (merchant?.id) {
        const { url, auth } = await getAuthUrl(merchant.id)
        setUrl(url)
        setAuth(auth)

        // Set the oauth_state cookie here
        if (auth) {
          document.cookie = `oauth_state=${auth}; Path=/; Secure; SameSite=Lax`
        }
      }
    }
    getUrl()
  }, [merchant])

  if (!merchant) {
    return <div className='text-center text-sm text-gray-500'>No merchant found in context.</div>
  }

  return (
    <div className='max-w-md mx-auto space-y-6 border p-6 rounded-lg shadow-sm bg-white'>
      <h1 className='text-2xl font-semibold text-center text-prepeat-orange'>Your account is almost ready</h1>

      <div className='text-center text-gray-700'>
        <p className='text-lg font-medium'>{merchant.businessName}</p>
        <p className='text-sm text-gray-500'>@{merchant.handle}</p>
      </div>

      <div className='text-center'>
        <p className='text-gray-600 mb-4'>To accept payments and manage orders, please link your Square account.</p>
        <p>{url}</p>
        <Button size='lg' className='w-full bg-prepeat-orange hover:bg-orange-600' disabled={!url} asChild>
          <Link href={url || '#'} aria-disabled={!url}>
            Link Square
          </Link>
        </Button>
      </div>
    </div>
  )
}
