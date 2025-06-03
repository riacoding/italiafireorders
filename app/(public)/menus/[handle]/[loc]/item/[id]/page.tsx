'use client'
import { useMenuItem } from '../../MenuProvider'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import ItemDetail from '../../ItemDetail'

export default function MenuItemPage() {
  const { id, handle } = useParams()
  const item = useMenuItem(id as string)

  if (!item) return notFound()

  return <ItemDetail item={item} handle={handle as string} />
}
