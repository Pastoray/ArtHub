'use client'

import { useCart } from '@/app/hooks/use-cart'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TCoreProduct } from '../../utils/consts'
import { Button } from './ui/button'

const AddToCartButton = ({ product }: { product: TCoreProduct }) => {
  const { addItem, items } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        if (
          items.find((item) => item.product.id === product.id) === undefined
        ) {
          addItem(product)
          setIsSuccess(true)
        } else {
          toast.error('Item is already in your cart')
        }
      }}
      size='lg'
      className='w-11/12'
    >
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
  )
}

export default AddToCartButton
