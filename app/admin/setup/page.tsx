'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { syncMenuItems } from '@/lib/ssr-actions'

const steps = ['Syncing Square Products', 'Setting up Webhooks', 'Creating First Menu']

export default function SetupProgressPage() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    async function runStep() {
      if (stepIndex === 0) {
        // 1. Sync Square Products
        await syncMenuItems()
      } else if (stepIndex === 1) {
        // 2. Set up Webhooks
        await setupWebhooks()
      } else if (stepIndex === 2) {
        // 3. Create initial menu
        await createDefaultMenu()
      } else {
        setComplete(true)
        setTimeout(() => router.push('/admin'), 2000)
      }

      if (stepIndex < steps.length) {
        setStepIndex((prev) => prev + 1)
      }
    }

    runStep()
  }, [stepIndex])

  useEffect(() => {
    if (stepIndex >= steps.length) {
      setComplete(true)
      const timeout = setTimeout(() => {
        router.push('/admin')
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [stepIndex])

  const progress = Math.min((stepIndex / steps.length) * 100, 100)

  const progressBarColor = progress < 100 ? 'bg-prepeat-orange' : 'bg-prepeat-green'

  return (
    <div className=' w-full flex flex-col items-center min-h-screen bg-white px-4 py-12 text-center'>
      <h1 className='text-2xl font-bold text-prepeat-orange mb-6'>
        <span className='text-black'>Welcome to </span>PrepEat.io
      </h1>
      <h2 className='text-md font-light text-black uppercase'>Setting Up Your Account</h2>
      <div className='w-full max-w-md'>
        <Progress value={progress} className={`h-3 bg-prepeat-orange/30`} />
        <p className='mt-4 text-sm text-gray-700'>{complete ? 'Setup Complete' : steps[stepIndex]}</p>
        {complete && <CheckCircle className='text-green-600 w-12 h-12 mt-6 mx-auto animate-pulse' />}
        <Button
          className='mt-6'
          onClick={() => {
            if (stepIndex < steps.length) {
              setStepIndex((prev) => prev + 1)
            } else {
              router.push('/admin')
            }
          }}
        >
          {complete ? 'Go to Admin' : 'Debug: Next Step'}
        </Button>
      </div>
    </div>
  )
}
