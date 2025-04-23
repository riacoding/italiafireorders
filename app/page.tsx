import Locations from '@/components/Locations'

export const dynamic = 'force-dynamic'

export default function MenuPage() {
  return (
    <div className='container max-w-md mx-auto pb-20'>
      <main className='p-4'>
        <h2 className='text-2xl text-center font-bold mb-4'>Today's Locations</h2>
        <Locations />
      </main>
    </div>
  )
}
