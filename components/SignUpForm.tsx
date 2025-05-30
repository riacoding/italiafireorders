'use client'

import { useSignupContext } from './SignupContext'
import { signUp } from '@aws-amplify/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

// Zod schema
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupForm() {
  const { setEmail, setUserId, setStep } = useSignupContext()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null)
    try {
      const result = await signUp({
        username: data.email,
        password: data.password,
        options: {
          autoSignIn: true,
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
          },
        },
      })
      console.log('signup Result', result)
      setEmail(data.email)
      setUserId(result.userId!)
      setStep('confirm')
    } catch (err: any) {
      console.error(err)
      setServerError(err.message || 'Signup failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md mx-auto'>
      <h1 className='text-xl font-semibold'>Sign up</h1>

      <div>
        <Input placeholder='First Name' {...register('firstName')} />
        {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
      </div>

      <div>
        <Input placeholder='Last Name' {...register('lastName')} />
        {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName.message}</p>}
      </div>

      <div>
        <Input type='email' placeholder='Email' {...register('email')} />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
      </div>

      <div>
        <Input type='password' placeholder='Password' {...register('password')} />
        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
      </div>

      {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  )
}
