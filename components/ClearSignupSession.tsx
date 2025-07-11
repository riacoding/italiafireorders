'use client'
import { useEffect } from 'react'

export function ClearSignupSession() {
  useEffect(() => {
    sessionStorage.removeItem('signupStep')
    sessionStorage.removeItem('signupEmail')
    sessionStorage.removeItem('signupUserId')
    sessionStorage.removeItem('signupMerchant')
  }, [])

  return null
}
