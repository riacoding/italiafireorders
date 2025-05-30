'use server'
import { redirect } from 'next/navigation'
import { fetchMenuWithItems } from '@/lib/fetchMenuWithItems'
import { MenuProvider } from './MenuProvider'
import { getCachedMenu } from '@/lib/menuCache'

type Params = Promise<{ loc: string }>

export default async function MenuLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  try {
    const { loc } = await params
    const { menu, items } = await getCachedMenu(loc)

    return (
      <MenuProvider items={items} menu={menu} location={loc}>
        {children}
      </MenuProvider>
    )
  } catch (err) {
    console.error('Menu not found or fetch failed', err)
    redirect('/')
  }
}
