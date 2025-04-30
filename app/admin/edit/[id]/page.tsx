import EditPage from './EditPage'
import { getCatalogItems } from '@/lib/ssr-actions'

export default async function EditMenuPage({ params }: { params: { id: string } }) {
  const items = await getCatalogItems()
  console.log('items', items)
  const { id } = await params

  return <EditPage id={id} items={items} />
}
