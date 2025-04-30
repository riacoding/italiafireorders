import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from '@/types' // or use Schema['Menu']['type']
import { Eye, Trash } from 'lucide-react'
import { syncMenuItems } from '@/lib/ssr-actions'
import { MenuSelection } from './page'

type AdminPageProps = {
  menus: MenuSelection[]
}

export default function AdminPage({ menus }: AdminPageProps) {
  async function handleSync() {
    console.log('syncing')
    await syncMenuItems()
  }
  return (
    <div className='max-w-xl mx-auto p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Menus</h1>
        <Button onClick={() => handleSync()} className='bg-purple-600'>
          Sync Square
        </Button>
        <Link href='/admin/edit/new'>
          <Button className='bg-green-600'>Add Menu</Button>
        </Link>
      </div>

      <ul className='space-y-2'>
        {menus.map((menu) => (
          <li key={menu.id} className='border rounded p-4 flex justify-between items-center'>
            <div className='p-4'>
              <div className='font-medium'>{menu.name}</div>
              <div className='text-sm text-muted-foreground'>
                {menu.locationId} <span className='text-green-500'>{menu.isActive === true ? 'active' : null}</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <Link href={`/admin/edit/${menu.id}`}>
                <Button variant='outline'>
                  <Eye className='w-5 h-5' />
                </Button>
              </Link>
              <Button variant='destructive'>
                <Trash className='w-5 h-5' />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
