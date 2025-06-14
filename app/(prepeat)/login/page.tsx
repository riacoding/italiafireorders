'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { signIn } from 'aws-amplify/auth'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn({ username: email, password })

      if (result.nextStep?.signInStep === 'DONE') {
        router.push('/admin/kds') // Redirect after successful login
      } else {
        if (result.nextStep.signInStep === 'CONFIRM_SIGN_UP') router.push(`/confirm?email=${encodeURIComponent(email)}`)
        // Optionally handle MFA here
      }
    } catch (err: any) {
      if (err.name === 'UserAlreadyAuthenticatedException') {
        toast({
          title: 'Account already logged in',
          description: 'Redirecting to admin...',
        })

        // Slight delay before redirect so user sees the toast
        setTimeout(() => router.push('/admin'), 1500)
        console.log(err)

        setError(err.message || 'Already Logged in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center  px-4'>
      <form onSubmit={handleLogin} className='w-full max-w-sm space-y-6'>
        <h1 className='text-2xl font-bold text-center'>Sign In</h1>

        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            autoComplete='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <Input
            id='password'
            type='password'
            autoComplete='current-password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <Button className='w-full bg-prepeat-orange' type='submit' disabled={loading || !email || !password}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </div>
  )
}
