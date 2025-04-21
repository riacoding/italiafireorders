'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type Menu } from '@/types'
import { fetchMenuById, saveMenu } from '@/lib/ssr-actions'

type FormValues = {
  name: string
  locationId: string
  squareItemIds: string // Comma-separated
  logo?: string
  theme?: string // JSON string
  isActive: boolean
}

export default function EditMenuPage() {
  const { id } = useParams()
  const router = useRouter()
  const isNew = id === 'new'

  const { register, handleSubmit, setValue, reset, watch } = useForm<FormValues>()

  const [loading, setLoading] = useState(true)

  // Load menu data if editing
  useEffect(() => {
    const load = async () => {
      if (!isNew && typeof id === 'string') {
        const menu: Menu | null = await fetchMenuById(id)
        if (menu) {
          reset({
            name: menu.name,
            locationId: menu.locationId,
            squareItemIds: menu.squareItemIds?.join(',') || '',
            logo: menu.logo || '',
            theme: JSON.stringify(menu.theme || {}, null, 2),
            isActive: menu.isActive ?? false,
          })
        }
      }
      setLoading(false)
    }

    load()
  }, [id, isNew, reset])

  const onSubmit = async (data: FormValues) => {
    const result = await saveMenu({
      id: isNew ? undefined : (id as string),
      name: data.name,
      locationId: data.locationId,
      squareItemIds: data.squareItemIds.split(',').map((s) => s.trim()),
      logo: data.logo || '',
      theme: JSON.stringify(data.theme || {}),
      isActive: data.isActive,
    })

    router.push('/admin')
  }

  if (loading) return <div className='p-4'>Loading...</div>

  return (
    <div className=' w-full md:max-w-2xl mx-auto p-4 space-y-6'>
      <h1 className='text-xl font-bold'>{isNew ? 'Add Menu' : 'Edit Menu'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input {...register('name')} placeholder='Menu Name' />
        <Input {...register('locationId')} placeholder='Location ID' />
        <Input {...register('squareItemIds')} placeholder='Square Item IDs (comma separated)' />
        <Input {...register('logo')} placeholder='Logo URL (S3 or Cloudinary)' />
        <div className='flex items-center space-x-4'>
          <Label htmlFor='isActive'>Active</Label>
          <Switch id='isActive' checked={watch('isActive')} onCheckedChange={(value) => setValue('isActive', value)} />
        </div>
        <Textarea {...register('theme')} placeholder='Theme JSON (optional)' rows={6} />

        <div className='flex gap-2'>
          <Button type='submit'>{isNew ? 'Create' : 'Update'}</Button>
          <Button type='button' variant='outline' onClick={() => router.push('/admin')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
