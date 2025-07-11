// app/checklists/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ListChecks } from 'lucide-react'

const client = generateClient<Schema>()

export default function ChecklistPage() {
  const [checklists, setChecklists] = useState<Schema['ChecklistTemplate']['type'][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChecklists() {
      const { data, errors } = await client.models.ChecklistTemplate.list()

      if (errors) {
        console.error('Error fetching checklists:', errors)
      } else {
        setChecklists(data)
      }

      setLoading(false)
    }

    fetchChecklists()
  }, [])

  return (
    <div className='p-6 max-w-4xl mx-auto bg-orange-50'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Checklists</h1>
        <Link href='/admin/checklists/new'>
          <Button className='bg-green-600 hover:bg-green-700 text-white'>+ New Checklist</Button>
        </Link>
      </div>

      {loading ? (
        <p className='text-gray-500'>Loading...</p>
      ) : checklists.length === 0 ? (
        <p className='text-gray-500'>No checklists yet.</p>
      ) : (
        <ul className='space-y-3'>
          {checklists.map((checklist) => (
            <li key={checklist.id} className='p-4 border rounded-lg shadow-sm bg-white'>
              <div className='flex justify-between'>
                <Link href={`/admin/checklists/${checklist.id}`} className='font-medium hover:underline text-blue-600'>
                  {checklist.title || '(Untitled)'}
                </Link>
                <Link
                  href={`/admin/checklists/entries/${checklist.id}`}
                  className='font-medium hover:underline text-blue-600'
                >
                  <ListChecks className='w-5 h-5 text-gray-600' />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
