'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updateMenuItem } from '@/lib/ssr-actions'
import ImageUploader from '@/components/ImageUploader'

export default function EditMenuItemForm({ menuItem }: { menuItem: any }) {
  const [name, setName] = useState(menuItem.customName ?? '')
  const [image, setImage] = useState(menuItem.s3ImageKey ?? '')
  const [sortOrder, setSortOrder] = useState(menuItem.sortOrder ?? 0)
  const [isFeatured, setIsFeatured] = useState(menuItem.isFeatured ?? false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateMenuItem({
      id: menuItem.id,
      customName: name,
      sortOrder,
      isFeatured,
    })
    setSaving(false)
  }

  return (
    <div className='space-y-4'>
      <div>
        <Label htmlFor='name'>Override Name</Label>
        <Input id='name' value={name} onChange={(e) => setName(e.target.value)} />
        <p className='text-sm text-gray-500 mt-1'>
          Default: <strong>{menuItem.catalogData?.item?.item_data?.name}</strong>
        </p>
      </div>

      <ImageUploader onUpload={(key) => setImage(key)} label='Menu Item Image' existingKey={menuItem.catalogItemId} />

      <div>
        <Label htmlFor='sortOrder'>Sort Order</Label>
        <Input id='sortOrder' type='number' value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
      </div>

      <div className='flex items-center space-x-2'>
        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
        <Label>Featured</Label>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
