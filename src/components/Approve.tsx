'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from './ui/textarea'
import { TtRPCCoreProduct } from '../../utils/consts'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

const Approve = ({ product }: { product: TtRPCCoreProduct }) => {
  const user = useUser()
  const [popOverOpen, setPopOverOpen] = useState(false)
  const [productStatus, setProductStatus] = useState<boolean | undefined>(
    product.approved ? true : undefined
  )
  const { mutate: approve, isLoading: isLoading1 } =
    trpc.product.approve.useMutation({
      onSuccess: () => {
        toast.success('Product approved successfully')
        setProductStatus(true)
      },
      onError: () => {
        toast.error('Product approvement failed')
      },
    })
  const { mutate: reject, isLoading: isLoading2 } =
    trpc.product.reject.useMutation({
      onSuccess: () => {
        toast.success('Product rejected successfully')
        setProductStatus(false)
      },
      onError: () => {
        toast.error('Product rejection failed')
      },
    })
  return (
    <div className='min-w-28 h-8 flex justify-center items-center gap-4'>
      {productStatus === undefined ? (
        <>
          {isLoading1 || isLoading2 ? (
            <Loader2 className='animate-spin m-auto' />
          ) : (
            <Check
              className='text-green-500 hover:cursor-pointer hover:text-green-600'
              onClick={() => {
                approve({
                  product_id: product.id,
                  user_clerk_id: user.user!.id,
                })
              }}
            />
          )}
          <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
            <PopoverTrigger asChild>
              {isLoading1 || isLoading2 ? null : (
                <X
                  className={cn(
                    'text-red-500 hover:cursor-pointer hover:text-red-600'
                  )}
                />
              )}
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Rejection</h4>
                  <p className='text-sm text-muted-foreground'>
                    If the specific rejection reason is not clear, please enter
                    it down here
                  </p>
                </div>
                <div className='grid gap-2'>
                  <div className='grid grid-cols-1 items-center gap-4'>
                    <Label htmlFor='height'>Reason</Label>
                    <Textarea
                      id='height'
                      defaultValue={`Unfortunately, your product "${product.title}", cannot be approved due to a violation of our guidelines. Thank you for your understanding.`}
                      className='col-span-2 h-32'
                    />
                  </div>
                  <div className='grid grid-cols-1 items-center'>
                    <Button
                      onClick={() => {
                        setPopOverOpen(false)
                        reject({
                          product_id: product.id,
                          user_clerk_id: user.user!.id,
                        })
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      ) : productStatus ? (
        <Check className='text-green-500 m-auto' />
      ) : (
        <X className='text-red-500 m-auto' />
      )}
    </div>
  )
}

export default Approve
