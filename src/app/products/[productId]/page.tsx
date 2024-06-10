import ImageSlider from '@/components/ImageSlider'
import { db } from '@/db'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import { TCoreProduct } from '../../../../utils/consts'
import { Check } from 'lucide-react'

interface PageProps {
  params: {
    productId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const product = (await db.product.findFirst({
    where: {
      id: params.productId,
    },
  })) as TCoreProduct
  if (!product) {
    return notFound()
  }
  return (
    <div className='gap-4 flex flex-col'>
      <div className='grid grid-cols-2 p-16'>
        <div className='gap-8 flex flex-col'>
          <div className='flex flex-col gap-8 relative'>
            <h1 className='text-4xl font-semibold'>{product.title}</h1>
            <h2 className='absolute top-14 left-4 bg-white text-gray-700 px-2 font-semibold rounded-lg'>
              Description
            </h2>
            <p className='max-w-prose border border-gray-200 bg-gray-100 rounded-lg p-4'>
              {product.description}
            </p>
          </div>
          <div className='flex flex-col gap-1'>
            <p>
              <b>Posted on: </b>
              {product.created_at.toString().split('(')[0].trim()}
            </p>
            <p>
              <b>Price: </b>${product.price}
            </p>
            <div className='flex gap-2 mt-4'>
              <Check className='text-green-600' />
              <p className='text-gray-700'>Eligible for instant delivery</p>
            </div>
          </div>
        </div>
        <div className='relative h-96 w-full'>
          <ImageSlider image_refs={product.image_refs} />
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}

export default Page
