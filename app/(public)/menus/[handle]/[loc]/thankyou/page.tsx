import { Suspense } from 'react'
import ThankYouClient from './ThankYouClient'

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  )
}
