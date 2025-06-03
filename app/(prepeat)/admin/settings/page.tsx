'use client'
import ImageUploader from '@/components/ImageUploader'
import { useMerchant } from '@/components/MerchantContext'
import { useSafeAuthenticator } from '@/hooks/useSafeAuthenticator'
import { updateMerchant } from '@/lib/ssr-actions'

import React, { useEffect, useState } from 'react'

type Props = {}

export default function Settings({}: Props) {
  const [merchantLogo, setMerchantLogo] = useState('')
  const { handle, id } = useMerchant()
  const { user, authStatus } = useSafeAuthenticator()

  useEffect(() => {
    async function updateMerchantLogo() {
      await updateMerchant({ id, s3ItemKey: merchantLogo })
    }

    updateMerchantLogo()
  }, [merchantLogo])

  return (
    <div>
      <h1>Settings {authStatus}</h1>
      <ImageUploader
        onUpload={(key) => setMerchantLogo(key)}
        label='Your Business Logo'
        path='logos/'
        existingKey={handle}
      />
    </div>
  )
}
