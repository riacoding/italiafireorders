import { useEffect, useState } from 'react'

export default function useOrderAge(createdAt: string) {
  const [age, setAge] = useState(() => Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [createdAt])

  return age
}
