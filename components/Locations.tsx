import { fetchCurrentMenus } from '@/lib/ssr-actions'
import Link from 'next/link'
import React from 'react'

export default async function Locations() {
  const locations = await fetchCurrentMenus()
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      {locations?.map((location) => (
        <div key={location.id}>
          <Link href={`/menu/${location.locationId}`}>
            <h2 className=' className="block text-blue-600 underline text-lg hover:text-blue-800 transition"'>
              {location.name}
            </h2>
          </Link>
        </div>
      ))}
    </div>
  )
}
