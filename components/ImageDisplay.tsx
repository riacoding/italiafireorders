'use client'

import { StorageImage } from '@aws-amplify/ui-react-storage'
import Image from 'next/image'
import clsx from 'clsx'

type ImageDisplayProps = {
  item: {
    name: string
    image?: string
    catalogItemId?: string
  }
  useImages: boolean
  className?: string
}

export default function ImageDisplay({ item, useImages, className }: ImageDisplayProps) {
  const isPlaceholder = item.image === '/placeholder.svg'
  const showPlaceholder = useImages && item.image && isPlaceholder

  if (!item.image || !item) return null

  return (
    <div className={clsx('relative w-1/4', className)}>
      {showPlaceholder ? (
        <Image src={item.image} alt={item.name || 'food image'} fill className='object-cover rounded border' />
      ) : item.catalogItemId ? (
        <StorageImage
          path={`items/${item.catalogItemId}.jpg`}
          alt={item.name || 'food image'}
          className='w-full h-full object-cover rounded border'
        />
      ) : (
        <div className='w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded border'>
          No image
        </div>
      )}
    </div>
  )
}
