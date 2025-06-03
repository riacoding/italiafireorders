import { getMenuItemWithCatalogItem } from '@/lib/ssr-actions'
import EditMenuItemForm from './EditMenuItemForm'

export default async function EditMenuItemPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const menuItem = await getMenuItemWithCatalogItem(id)

  if (!menuItem) {
    return <div className='p-4 text-red-600'>Menu item not found</div>
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Edit Menu Item</h1>
      <EditMenuItemForm menuItem={menuItem} />
    </div>
  )
}
