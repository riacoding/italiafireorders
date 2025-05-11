import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function OrderTimer({
  createdAt,
  threshold = 10 * 60,
}: {
  createdAt: string
  threshold?: number // in seconds
}) {
  const [age, setAge] = useState<number>(() => Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [createdAt])

  const minutes = Math.floor(age / 60)
  const seconds = age % 60

  const isLate = age >= threshold

  return (
    <span
      className={cn('text-sm font-mono', isLate ? 'text-red-600 animate-pulse font-bold' : 'text-muted-foreground')}
    >
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  )
}
