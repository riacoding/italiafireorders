// app/confirm/page.tsx
'use client'

import { Suspense } from 'react'
import ConfirmPageInner from './ConfirmPageInner'

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmPageInner />
    </Suspense>
  )
}
