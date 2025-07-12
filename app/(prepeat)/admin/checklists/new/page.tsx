'use client'

import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { useRouter } from 'next/navigation'
import { checklistFormSchema, ChecklistFormValues } from '@/app/schemas/checklistSchema'
import { useMerchant } from '@/components/MerchantContext'

const client = generateClient<Schema>()

export default function NewChecklistPage() {
  const router = useRouter()
  const merchant = useMerchant()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      title: '',
      items: [{ value: '' }],
    },
  })

  const watched = useWatch({ control })

  const { fields, append, remove } = useFieldArray<ChecklistFormValues>({
    control,
    name: 'items',
  })

  const onSubmit = async (values: ChecklistFormValues) => {
    console.log('onSubmit', values)
    try {
      const { title, items } = values

      // Replace this with actual vendorId from context
      const merchantId = merchant.id

      // Create checklist template
      const { data: template } = await client.models.ChecklistTemplate.create({
        title,
        merchantId,
      })

      // Create checklist items
      await Promise.all(
        items.map((item, index) =>
          client.models.TemplateItem.create({
            templateId: template?.id || '',
            label: item.value,
            sortOrder: index,
          })
        )
      )

      router.push('/admin/checklists')
    } catch (err) {
      console.error('Checklist creation failed:', err)
      alert('Something went wrong')
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>New Checklist</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Checklist title */}
        <div>
          <Label htmlFor='title'>Checklist Title</Label>
          <Input id='title' {...register('title')} placeholder='e.g. Daily Prep Checklist' />
          {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
        </div>

        {/* Checklist items */}
        <div>
          <Label>Checklist Items</Label>
          <div className='space-y-2 mt-2'>
            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-2'>
                <Input {...register(`items.${index}.value` as const)} placeholder={`Item ${index + 1}`} />
                <Button type='button' variant='outline' onClick={() => remove(index)}>
                  ✕
                </Button>
              </div>
            ))}
            {Array.isArray(errors.items) &&
              errors.items.map((itemError, index) =>
                itemError?.value ? (
                  <p key={index} className='text-sm text-red-600'>
                    Item {index + 1}: {itemError.value.message}
                  </p>
                ) : null
              )}
          </div>

          <Button type='button' className='mt-3' onClick={() => append({ value: 'New Item' })}>
            + Add Item
          </Button>
        </div>

        {/* Submit */}
        <Button type='submit' className='bg-green-600 text-white hover:bg-green-700' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create Checklist'}
        </Button>
      </form>
      <pre className='bg-gray-100 text-sm p-4 mt-6 rounded'>{JSON.stringify(watched, null, 2)}</pre>
    </div>
  )
}
