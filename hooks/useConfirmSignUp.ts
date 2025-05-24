'use client'

import { confirmSignUp } from '@aws-amplify/auth'
import { useState } from 'react'

export function useConfirmSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirm = async ({ email, code }: { email: string; code: string }) => {
    setLoading(true)
    setError(null)

    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      return { success: true }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Confirmation failed')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { confirm, loading, error }
}
