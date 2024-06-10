'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

const GoBack = () => {
  const router = useRouter()
  return (
    <div className='flex flex-col justify-center items-center p-8'>
      <h1 className='text-xl'>No products found</h1>
      <p className='text-gray-600'>There are no products in this page..</p>
      <Button
        variant={'outline'}
        className='mt-4'
        onClick={() => router.back()}
      >
        &larr; Go back
      </Button>
    </div>
  )
}

export default GoBack
