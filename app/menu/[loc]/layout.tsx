'use server'
import { fetchMenuWithItems } from '@/lib/fetchMenuWithItems'
import { MenuProvider } from './MenuProvider'

type Params = Promise<{ loc: string }>

export default async function MenuLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { loc } = await params
  const { menu, items } = await fetchMenuWithItems(loc)
  if (!menu) return null

  return (
    <MenuProvider items={items} menu={menu} location={loc}>
      {children}
    </MenuProvider>
  )
}
