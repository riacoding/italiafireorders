'use client'

import { useSignupContext } from './SignupContext'
import { autoSignIn, confirmSignUp } from '@aws-amplify/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// Schema for confirmation form
const confirmSchema = z.object({
  code: z.string().min(6, 'Confirmation code is required'),
})

type ConfirmFormValues = z.infer<typeof confirmSchema>

export default function ConfirmForm() {
  const { email, setStep } = useSignupContext()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmSchema),
  })

  const onSubmit = async (data: ConfirmFormValues) => {
    if (!email) {
      setServerError('Missing email address from context.')
      return
    }

    setServerError(null)
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: data.code,
      })

      if (result.isSignUpComplete) {
        await autoSignIn()
      }

      setStep('business')
    } catch (err: any) {
      console.error(err)
      setServerError(err.message || 'Confirmation failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md mx-auto'>
      <h1 className='text-xl font-semibold'>Confirm your email</h1>

      <p className='text-sm text-gray-600'>
        Enter the confirmation code sent to <strong>{email}</strong>.
      </p>

      <div>
        <Input placeholder='Confirmation Code' {...register('code')} />
        {errors.code && <p className='text-red-500 text-sm'>{errors.code.message}</p>}
      </div>

      {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Confirming...' : 'Confirm'}
      </Button>
    </form>
  )
}
