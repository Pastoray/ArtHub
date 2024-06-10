'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { trpc } from '@/trpc/client'
import { X } from 'lucide-react'
import { TCoreProduct } from '../../utils/consts'
import { toast } from 'sonner'
import { useState } from 'react'

export function DialogDemo({ product }: { product: TCoreProduct }) {
  const [deleted, setDeleted] = useState(false)
  const { mutate: deleteProduct } = trpc.product.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success('Product deleted successfully')
    },
    onError: () => {
      toast.error('Product deletion failed')
    },
  })
  return (
    <>
      {!deleted ? (
        <Dialog>
          <DialogTrigger asChild>
            <X className='absolute right-3 top-3 z-10 cursor-pointer hover:text-red-600 transition-all duration-300' />
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Delete product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type='submit'
                  variant={'destructive'}
                  onClick={() => {
                    deleteProduct({ productId: product.id })
                    setDeleted(true)
                  }}
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}
