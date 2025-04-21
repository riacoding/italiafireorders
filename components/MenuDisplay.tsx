// app/menu/MenuDisplay.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { SquareItem } from '@/types'
import { Menu } from '@/types'
import { useMenu } from '@/app/menu/[loc]/MenuProvider'
import CurrencyDisplay from './CurrencyDisplay'

export default function MenuDisplay({ menu }: { menu: Menu }) {
  const { items } = useMenu()
  return (
    <div className='container max-w-md mx-auto pb-20'>
      <header className='sticky top-0 bg-white z-10 border-b'>
        <div className='flex justify-between items-center p-4'>
          <h1 className='text-xl font-bold uppercase'>ItaliaFire.com</h1>
          <Link href='/cart' className='relative'>
            <span className='sr-only'>Cart</span>
            <CartIcon />
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              0
            </span>
          </Link>
        </div>
      </header>

      <main className='p-4'>
        <h2 className='text-3xl text-center font-bold mb-5'>{menu.name}</h2>

        <h3 className='text-2xl font-light mb-4'>Our Menu</h3>
        <div className='space-y-4'>
          {items.map((item) => (
            <Link key={item.id} href={`/menu/${menu.locationId}/item/${item.id}`}>
              <Card className='overflow-hidden'>
                <div className='flex h-24'>
                  <div className='w-1/3 relative'>
                    <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className='object-cover' />
                  </div>
                  <CardContent className='w-2/3 p-3 flex justify-between items-center'>
                    <div>
                      <h3 className='font-medium'>{item.name}</h3>
                      <p className='text-sm text-muted-foreground line-clamp-1'>{item.description}</p>
                      <p className='font-bold mt-1'>
                        <CurrencyDisplay value={item.price} />
                      </p>
                    </div>
                    <ChevronRight className='h-5 w-5 text-muted-foreground' />
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-6 w-6'
    >
      <circle cx='8' cy='21' r='1' />
      <circle cx='19' cy='21' r='1' />
      <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
    </svg>
  )
}
