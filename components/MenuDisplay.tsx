// app/menu/MenuDisplay.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMenu } from '@/app/menu/[loc]/MenuProvider'
import CurrencyDisplay from './CurrencyDisplay'

import { EagerMenu } from '@/lib/fetchMenuWithItems'
import { StorageImage } from '@aws-amplify/ui-react-storage'

export default function MenuDisplay({ menu }: { menu: EagerMenu }) {
  const { items } = useMenu()

  return (
    <div className='container max-w-md mx-auto pb-20'>
      <main className='p-4'>
        {menu.logo ? (
          <img src={menu.logo} alt='logo' />
        ) : (
          <h2 className='text-3xl text-center font-bold mb-5'>{menu.name}</h2>
        )}

        <h3 className='text-2xl font-light mb-4'>Our Menu</h3>
        <div className='flex flex-col gap-2'>
          {items.map((item) => (
            <Link key={item.id} href={`/menu/${menu.locationId}/item/${item.id}`}>
              <Card className='overflow-hidden'>
                <div className='flex h-24'>
                  <div className='w-1/3 relative'>
                    <StorageImage
                      className='w-full h-full object-cover rounded border'
                      path={`items/${item.catalogItemId}.jpg`}
                      alt='Preview'
                    />
                  </div>
                  <CardContent className='w-2/3 p-3 flex justify-between items-center'>
                    <div>
                      <h3 className='font-medium'>{item.customName ? item.customName : item.name}</h3>
                      <p className='text-sm text-muted-foreground line-clamp-1'>{item.description}</p>
                      <p className='font-bold mt-1'>
                        <CurrencyDisplay value={item.price} />
                      </p>
                      <p>{item.isFeatured ? 'featured' : ''}</p>
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
