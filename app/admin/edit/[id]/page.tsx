'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SquareCatalogObject, SquareItem, type Menu } from '@/types'
import { fetchMenuById, getAllSquareCatalogItems, saveMenu } from '@/lib/ssr-actions'

type FormValues = {
  name: string
  locationId: string
  logo?: string
  theme?: string // JSON string
  isActive: boolean
}

export default function EditMenuPage() {
  console.log('REACT_APP_TEST_VARIABLE', process.env.REACT_APP_TEST_VARIABLE)
  const [squareItems, setSquareItems] = useState<SquareCatalogObject[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { id } = useParams()
  const router = useRouter()
  const isNew = id === 'new'

  const { register, handleSubmit, setValue, reset, watch } = useForm<FormValues>()
  const [loading, setLoading] = useState(true)

  const toggle = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  function isSquareItem(obj: SquareCatalogObject): obj is SquareItem {
    return obj.type === 'ITEM' && 'item_data' in obj
  }

  useEffect(() => {
    async function fetchSquareItems() {
      const objs = await getAllSquareCatalogItems()
      if (objs) setSquareItems(objs)
    }
    fetchSquareItems()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!isNew && typeof id === 'string') {
        const menu: Menu | null = await fetchMenuById(id)
        if (menu) {
          reset({
            name: menu.name,
            locationId: menu.locationId,
            logo: menu.logo || '',
            theme: JSON.stringify(menu.theme || {}, null, 2),
            isActive: menu.isActive ?? false,
          })
          setSelected(new Set((menu.squareItemIds ?? []).filter((id): id is string => id !== null)))
        }
      }
      setLoading(false)
    }
    load()
  }, [id, isNew, reset])

  const onSubmit = async (data: FormValues) => {
    let parsedTheme: object | null = null
    try {
      const temp = data.theme?.trim()
      if (temp) {
        const parsed = JSON.parse(temp)
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          parsedTheme = parsed
        }
      }
    } catch (err) {
      console.warn('Invalid theme JSON:', err)
      // Optional: show toast or error
    }

    await saveMenu({
      id: isNew ? undefined : (id as string),
      name: data.name,
      locationId: data.locationId,
      squareItemIds: Array.from(selected),
      logo: data.logo || '',
      theme: parsedTheme,
      isActive: data.isActive,
    })
    router.push('/admin')
  }

  if (loading) return <div className='p-4'>Loading...</div>

  return (
    <div className='w-full md:max-w-2xl mx-auto p-4 space-y-6'>
      <h1 className='text-xl font-bold'>{isNew ? 'Add Menu' : 'Edit Menu'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <Label htmlFor='name'>Menu Name</Label>
          <Input id='name' {...register('name')} />
        </div>
        <div>
          <Label htmlFor='locationId'>Location Id</Label>
          <Input id='locationId' {...register('locationId')} />
        </div>
        <div>
          <Label htmlFor='logo'>Logo URL</Label>
          <Input id='logo' {...register('logo')} />
        </div>

        <div>
          <h2 className='font-semibold mb-2'>Select Menu Items</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto border p-2 rounded'>
            {squareItems.filter(isSquareItem).map((item) => (
              <label key={item.id} className='flex items-center space-x-2'>
                <input type='checkbox' checked={selected.has(item.id)} onChange={() => toggle(item.id)} />
                <span>{item.item_data.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <Label htmlFor='isActive'>Active</Label>
          <Switch
            className='data-[state=checked]:bg-green-600 bg-gray-300'
            id='isActive'
            checked={watch('isActive')}
            onCheckedChange={(value) => setValue('isActive', value)}
          />
        </div>

        <div>
          <Label htmlFor='theme'>Theme JSON</Label>
          <Textarea id='theme' {...register('theme')} rows={6} />
        </div>

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
