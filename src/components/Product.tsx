'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X, Frown } from 'lucide-react'
import { useOnClickOutside } from '@/app/hooks/use-on-click-outside'
import Link from 'next/link'
import ImageSlider from './ImageSlider'
import { FILTERS, TCoreProduct } from '../../utils/consts'

interface ReceivedProducts {
  receivedProducts: TCoreProduct[]
}

interface TFilter {
  text: string
  method: (arr: TCoreProduct[]) => TCoreProduct[]
}

const Product = ({ receivedProducts }: ReceivedProducts) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<TFilter[]>([])
  const [products, setProducts] = useState<TCoreProduct[]>(receivedProducts)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setActiveIndex(null))

  useEffect(() => {
    let newProducts = receivedProducts.slice()
    if (selectedFilters.length !== 0) {
      selectedFilters.forEach((filter) => {
        newProducts = filter.method(newProducts)
      })
    }
    setProducts(newProducts)
  }, [selectedFilters, receivedProducts])
  return (
    <div>
      <div className='border-b border-gray-300'>
        <MaxWidthWrapper>
          <div className='justify-center items-center my-12'>
            <h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl text-center'>
              Customize your search to match your preferences and standards
            </h1>
          </div>
          <div className='mt-8 mb-2 flex justify-between'>
            <div className='flex border rounded-lg' ref={ref}>
              {FILTERS.map((filter, i) => (
                <div key={`filter ${i}`} className='relative'>
                  <Button
                    variant={'ghost'}
                    className='h-16 w-fit text-center font-semibold text-lg text-gray-800 gap-2'
                    onClick={() =>
                      activeIndex === i
                        ? setActiveIndex(null)
                        : setActiveIndex(i)
                    }
                  >
                    {filter.name}
                    <ChevronDown
                      className={cn('duration-300 transition-all', {
                        '-rotate-180': activeIndex === i,
                      })}
                    />
                  </Button>
                  <div
                    className={cn(
                      'flex flex-col absolute bg-gray-100 rounded-lg h-fit w-fit opacity-100 z-20 transition-all duration-300',
                      {
                        'opacity-0 -z-10': activeIndex !== i,
                      }
                    )}
                  >
                    {FILTERS[i].options.map((option, _) => (
                      <Button
                        key={i}
                        variant={'ghost'}
                        className='justify-start'
                        onClick={() => {
                          setActiveIndex(null)
                          setSelectedFilters((prev) => {
                            const idx = selectedFilters.findIndex((filter) =>
                              filter.text.startsWith(`${FILTERS[i].name}`)
                            )
                            if (idx === -1) {
                              return [
                                ...prev,
                                {
                                  text: `${FILTERS[i].name}: ${option.text}`,
                                  method: option.method,
                                } as TFilter,
                              ]
                            }
                            let updatedFilters = [...prev]
                            updatedFilters[idx] = {
                              text: `${FILTERS[i].name}: ${option.text}`,
                              method: prev[idx].method,
                            }
                            return updatedFilters
                          })
                        }}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex gap-2 flex-wrap my-2'>
            {selectedFilters.map((filter, i) => (
              <Button
                key={filter.text}
                className='flex gap-2 px-4 w-fit h-fit py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-200 duration-100 transition-all'
                onClick={() =>
                  setSelectedFilters((prev) => prev.filter((_, j) => j !== i))
                }
                variant={'ghost'}
              >
                <p className='font-semibold'>{filter.text}</p>
                <X />
              </Button>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
      <div
        className={cn('grid grid-cols-3 p-8 gap-4', {
          'grid-cols-1': products.length === 0,
        })}
      >
        {products.length !== 0 ? (
          products.map((product: TCoreProduct) => (
            <div
              key={product.id}
              className='flex flex-col h-fit p-2 bg-gray-100 rounded-lg border border-gray-200'
            >
              <div className='flex justify-between p-2 items-center'>
                <div className='group flex flex-col gap-2 h-64 w-full relative'>
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
                    <span className='text-red-400 text-lg text-start'>
                      No description was provided
                    </span>
                  )}
                </div>
              </div>
              <div className='flex justify-between items-center p-2'>
                <p className='text-lg font-semibold'>${product.price}</p>
                <Link
                  className={cn('w-24', buttonVariants({ variant: 'default' }))}
                  href={`/products/${product.id}`}
                >
                  <p className='font-semibold'>Checkout &rarr;</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex justify-center items-center gap-2'>
                <h2 className='text-3xl text-gray-800 font-semibold'>
                  Not Found
                </h2>
                <Frown />
              </div>
              <p className='text-lg text-center text-gray-700'>
                No products match your search criteria and specified filters{' '}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Product
