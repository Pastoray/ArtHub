'use client'

import Table from '@/components/Table'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { redirect, useSearchParams } from 'next/navigation'
import GoBack from '@/components/GoBack'
import { trpc } from '@/trpc/client'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export const Page = () => {
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  if (!isLoaded) {
    return
  }
  if (!user) {
    return <RedirectToSignIn />
  }
  const page =
    typeof searchParams.get('page') !== null
      ? parseInt(searchParams.get('page')!) || 1
      : 1
  if (page <= 0) {
    return redirect('/admin/products')
  }
  const { data: userData, isLoading: isLoading1 } = trpc.user.getUser.useQuery({
    user_clerk_id: user.id,
  })

  if (userData?.user?.role === 'MEMBER') {
    toast.error('Not Authorized')
    return redirect('/')
  }

  const { data: productsData, isLoading: isLoading2 } =
    trpc.product.getProducts.useQuery(
      {
        limit: 20,
        offset: (page - 1) * 20,
      },
      {
        retry: 3,
        retryDelay: 3000,
      }
    )

  if (isLoading1 || isLoading2) {
    return (
      <div className='w-full h-32 flex justify-center items-center'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }
  return (
    <>
      {!isLoading2 && productsData && productsData.products.length !== 0 ? (
        <>
          <Table products={productsData.products} />
          <Pagination className='pt-4'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={`/admin/products?page=${page - 5}`} />
              </PaginationItem>
              {Array.from({ length: 5 }, (_, i) => (
                <>
                  {page - 2 <= 0 ? (
                    <PaginationItem key={`pagination ${i}`}>
                      <PaginationLink
                        href={`/admin/products?page=${
                          page === 1 ? page + i : page + i - 1
                        }`}
                        isActive={page === 1 ? i === 0 : i === 1}
                      >
                        {page === 1 ? page + i : page + i - 1}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`pagination ${i}`}>
                      <PaginationLink
                        href={`/admin/products?page=${page - 2 + i}`}
                        isActive={i == 2}
                      >
                        {page - 2 + i}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              ))}
              <PaginationItem>
                <PaginationNext href={`/admin/products?page=${page + 5}`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <GoBack />
      )}
    </>
  )
}

export default Page
