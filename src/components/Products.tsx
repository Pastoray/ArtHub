import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { TCoreProduct } from '../../utils/consts'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import ImageSlider from './ImageSlider'
import { DialogDemo } from './DeleteProduct'

const Products = ({
  userProducts: products,
}: {
  userProducts: TCoreProduct[]
}) => {
  return (
    <>
      <MaxWidthWrapper className='border-b border-gray-300'>
        <div className='justify-center items-center my-12'>
          <h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl text-center'>
            Take a look at all your posted products in this page
          </h1>
          <div className='flex justify-center items-center mt-8 gap-4'>
            <Link
              href={'/'}
              className={buttonVariants({ variant: 'secondary' })}
            >
              &larr; Home
            </Link>
            <Link
              href={'/products/create-product'}
              className={buttonVariants()}
            >
              Create Products &rarr;
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <div>
        {products.length !== 0 ? (
          <div
            className={cn(
              'grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 p-8 gap-4',
              {
                'grid-cols-1': products.length === 0,
              }
            )}
          >
            {products.map((product: TCoreProduct) => (
              <div
                key={product.id}
                className='flex flex-col h-fit p-2 bg-gray-100 rounded-lg border border-gray-200 relative'
              >
                <DialogDemo product={product} />
                <div className='flex justify-between p-2 items-center'>
                  <div className='group flex flex-col gap-2 h-64 w-11/12 relative'>
                    <ImageSlider image_refs={product.image_refs} />
                  </div>
                </div>
                <div className='flex items-center mt-3'>
                  <h2 className='text-2xl font-semibold pl-4 line-clamp-1'>
                    {product.title}
                  </h2>
                </div>
                <div className='flex-grow'>
                  <div className='text-gray-700 font-semibold px-8 my-3 line-clamp-3 min-h-8'>
                    {product.description !== '' ? (
                      <p className='text-center'>{product.description}</p>
                    ) : (
                      <span className='text-stone-700 text-lg text-start'>
                        No description was provided
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex justify-between items-center p-2'>
                  <p className='text-lg font-semibold'>${product.price}</p>
                  <Link
                    className={cn(
                      'w-24',
                      buttonVariants({ variant: 'default' })
                    )}
                    href={`/products/${product.id}`}
                  >
                    <p className='font-semibold'>Checkout &rarr;</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3>Whoops! looks like you don&apos;t have any</h3>
            <p>You don&apos;t have any products posted for the moment</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Products
