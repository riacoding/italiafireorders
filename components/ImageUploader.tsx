'use client'

import { useState } from 'react'
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage'
import { getUrl } from 'aws-amplify/storage'
import Image from 'next/image'
import '@aws-amplify/ui-react/styles.css'

type Props = {
  onUpload: (key: string) => void
  label?: string
  path?: string
  existingKey?: string
}

export default function ImageUploader({ onUpload, label = 'Upload Image', path = 'items/', existingKey }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadSuccess = async (event: any) => {
    const { key } = event
    try {
      setPreviewUrl(key)
      onUpload(key)
    } catch (err) {
      console.error('Error generating preview URL:', err)
    }
  }

  const processFile = async ({ file }: { file: File }): Promise<{ file: File; key: string }> => {
    const fileExtension = file.name.split('.').pop() ?? 'bin'

    // const fileBuffer: ArrayBuffer = await file.arrayBuffer()
    // const hashBuffer: ArrayBuffer = await window.crypto.subtle.digest('SHA-1', fileBuffer)

    // const hashArray = Array.from(new Uint8Array(hashBuffer))
    // const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return {
      file,
      key: `${existingKey}.${fileExtension}`,
    }
  }

  return (
    <div className='space-y-2'>
      <label className='block font-semibold'>{label}</label>
      <FileUploader
        acceptedFileTypes={['image/*']}
        path={path}
        maxFileCount={1}
        isResumable
        processFile={processFile}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={(err) => {
          console.error('Upload failed:', err)
        }}
      />
      {previewUrl && (
        <div className='mt-2'>
          <StorageImage path={previewUrl} alt='Preview' width={200} className='rounded border' />
        </div>
      )}
    </div>
  )
}
