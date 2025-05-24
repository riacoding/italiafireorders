'use client'

import { signUp } from '@aws-amplify/auth'
import { useState } from 'react'

export function useSignupUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
          },
        },
      })

      return { success: true, userId: result.userId }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Signup failed')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { signup, loading, error }
}
