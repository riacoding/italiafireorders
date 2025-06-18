'use client'

import { StorageImage } from '@aws-amplify/ui-react-storage'
import { usePublicMerchant } from './MerchantPublicContext'

export default function HeaderLogo() {
  const { merchant } = usePublicMerchant()
  const logo = merchant?.s3ItemKey
  return (
    <header className='flex flex-col items-center justify-center min-h-32 bg-transparent'>
      {logo ? (
        <StorageImage width={128} className='h-32' path={`${logo}`} alt='logo' />
      ) : (
        <img src={logo ?? '/logo.png'} alt='Logo' className='h-16' />
      )}
    </header>
  )
}
