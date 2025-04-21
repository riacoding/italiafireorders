import React from 'react'
import { fetchMenus } from '@/lib/ssr-actions'
import { Menu } from '@/types'
import AdminPage from './AdminPage'

type Props = {}

// const fetchMenus = async()=> {
//     const menus = await client.models.Menu.list({
//         filter: { locationId: { eq: "truck-west" }, isActive: { eq: true } }
//       })
// }

export default async function admin({}: Props) {
  const menus: Menu[] = await fetchMenus()
  return <AdminPage menus={menus} />
}
