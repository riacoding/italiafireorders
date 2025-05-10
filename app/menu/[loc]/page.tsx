// app/menu/page.tsx
import MenuDisplay from '@/components/MenuDisplay'
import { fetchMenuWithItems } from '@/lib/fetchMenuWithItems'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { loc: string } }): Promise<Metadata> {
  const { menu } = await fetchMenuWithItems(params.loc)

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  const fullUrl = `${siteUrl}/menu/${params.loc}`

  return {
    title: menu?.name || 'View Today’s Menu',
    description: 'Check out the latest offerings from our food truck!',
    openGraph: {
      title: menu?.name || 'View Today’s Menu',
      description: 'Check out the latest offerings from our food truck!',
      url: fullUrl,
      images: [
        {
          url: menu?.logo || `${siteUrl}/ItaliaFire.png`,
          width: 1200,
          height: 630,
          alt: 'Menu preview',
        },
      ],
      type: 'website',
    },
    metadataBase: new URL(siteUrl),
  }
}

export default function MenuPage() {
  return <MenuDisplay />
}
