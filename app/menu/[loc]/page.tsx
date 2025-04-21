// app/menu/page.tsx
'use client'
import MenuDisplay from '@/components/MenuDisplay'
import { useMenu } from './MenuProvider'

export default function MenuPage() {
  const { menu } = useMenu()

  return <MenuDisplay menu={menu} />
}
