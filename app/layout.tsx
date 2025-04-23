// app/layout.tsx (or wherever your RootLayout is defined)

import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import CartIcon from '@/components/CartIcon'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ItaliaFire',
  description: 'ItaliaFire Menu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const year = new Date().getFullYear()

  return (
    <html lang='en'>
      <body className='min-h-screen flex flex-col'>
        <Providers>
          {/* Header */}
          <header className='bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center'>
            <Link href='/'>
              <Image src='/ItaliaFire.png' alt='ItaliaFire Logo' width={200} height={75} />
            </Link>
            <CartIcon />
          </header>

          {/* Main content */}
          <main className='flex-1 p-4 bg-gray-50'>{children}</main>

          {/* Footer */}
          <footer className='bg-white border-t border-gray-200 text-center p-4 text-sm text-gray-600'>
            © Italiafire {year}
          </footer>
        </Providers>
      </body>
    </html>
  )
}
