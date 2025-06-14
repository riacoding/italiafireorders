'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmSignUp, resendSignUpCode, signIn, autoSignIn } from 'aws-amplify/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSignupContext } from './SignupContext'

const confirmSchema = z.object({
  code: z.string().min(6, 'Confirmation code is required'),
  password: z.string().optional(),
})

type ConfirmFormValues = z.infer<typeof confirmSchema>

interface ConfirmFormProps {
  standalone?: boolean
  initialEmail?: string
  requirePassword?: boolean
}

export default function ConfirmForm({ standalone = false, initialEmail, requirePassword = false }: ConfirmFormProps) {
  const router = useRouter()
  const context = useSignupContext()
  const [serverError, setServerError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  const email = standalone ? initialEmail : context.email
  const setStep = context?.setStep

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmSchema),
  })

  const onSubmit = async ({ code, password }: ConfirmFormValues) => {
    if (!email) {
      setServerError('Missing email address')
      return
    }

    setServerError(null)

    try {
      const result = await confirmSignUp({ username: email, confirmationCode: code })

      if (result.isSignUpComplete) {
        if (requirePassword && password) {
          await signIn({ username: email, password })
        } else {
          await autoSignIn().catch(() => {})
        }

        if (standalone) {
          router.push('/admin/onboarding')
        } else {
          setStep?.('business')
        }
      }
    } catch (err: any) {
      setServerError(err.message || 'Confirmation failed')
    }
  }

  const handleResend = async () => {
    if (!email) return
    try {
      await resendSignUpCode({ username: email })
      setResent(true)
    } catch (err: any) {
      setServerError(err.message || 'Failed to resend')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-md mx-auto mt-12'>
      <h1 className='text-2xl font-bold text-center'>Confirm Your Account</h1>

      <p className='text-sm text-gray-600'>
        Enter the confirmation code sent to <strong>{email}</strong>.
      </p>

      <div>
        <label htmlFor='confirmCode' className='text-sm font-medium'>
          Code
        </label>
        <Input
          id='code'
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code' // hint to Chrome it's a 2FA code
          placeholder='123456'
          {...register('code')}
        />
        {errors.code && <p className='text-red-500 text-sm'>{errors.code.message}</p>}
      </div>

      {requirePassword && (
        <div>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <Input
            id='password'
            autoComplete='new-password'
            type='password'
            placeholder='password'
            {...register('password')}
          />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
        </div>
      )}

      {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}
      {resent && <p className='text-green-600 text-sm'>Confirmation code resent!</p>}

      <Button type='submit' className='w-full bg-prepeat-orange' disabled={isSubmitting}>
        {isSubmitting ? 'Confirming...' : 'Confirm Account'}
      </Button>

      <Button type='button' variant='outline' onClick={handleResend} className='w-full'>
        Resend Confirmation Code
      </Button>
    </form>
  )
}
