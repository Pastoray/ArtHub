'use client'

import { Brush, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import Cart from './Cart'
import { Button, buttonVariants } from './ui/button'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { trpc } from '@/trpc/client'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const searchParams = useSearchParams()
  const prd = searchParams.get('product') || ''
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const [product, setProduct] = useState<string>(prd)
  const pathname = usePathname()
  const pathsToMinimize = ['/verify-email', '/sign-up', '/sign-in']
  const inputRef = useRef(null)

  const { data } = trpc.user.getUser.useQuery(
    {
      user_clerk_id: user?.id ?? '',
    },
    { enabled: !!user }
  )
  useEffect(() => {
    if (user) {
      if (data?.user?.role === 'ADMIN') {
        setIsAdmin(true)
      }
    }
  }, [data, user])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputRef.current === document.activeElement) {
        router.push(`/products?product=${product}`)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [product, router, inputRef])

  return (
    <nav className='h-16 w-full sticky top-0 z-50 border-b border-gray-200 bg-white'>
      <div className='h-full flex items-center'>
        <div className='h-full w-1/4 flex justify-start items-center pl-4 gap-2 text-indigo-600'>
          <SignedOut>
            <Link href={'/'}>
              <Brush />
            </Link>
            <h3 className='font-bold text-3xl select-none xl:block hidden'>
              ArtHub
            </h3>
          </SignedOut>
          <SignedIn>
            <div className='h-full w-full flex gap-2 items-center'>
              <UserButton />
              <h2 className='text-gray-800 text-xl font-semibold'>
                {user?.fullName}
              </h2>
            </div>
          </SignedIn>
        </div>
        <div className='relative h-full w-1/2 flex justify-center items-center'>
          {pathsToMinimize.includes(pathname) ? null : (
            <>
              <input
                ref={inputRef}
                className='h-2/3 w-10/12 border border-gray-300 bg-gray-50 focus:outline-none pl-4 border-r-transparent font-semibold rounded-lg rounded-tr-none rounded-br-none focus:border-black border-r-0'
                placeholder='Search for products..'
                onChange={(e) => setProduct(e.target.value)}
                value={product}
              />
              <Button
                className='h-2/3 w-12 rounded-tl-none rounded-bl-none'
                onClick={() => router.push(`/products?product=${product}`)}
              >
                <Search />
              </Button>
            </>
          )}
        </div>
        <div className='h-full w-1/4 flex justify-end items-center pr-4'>
          <div className='h-full w-full justify-end items-center gap-6 xl:flex hidden'>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            {isAdmin && (
              <Link
                href={'/admin/dashboard'}
                className={cn(
                  buttonVariants({ variant: 'destructive' }),
                  'font-semibold'
                )}
              >
                Admin
              </Link>
            )}
            <Cart />
          </div>
          <Menu className='h-6 w-6 xl:hidden' />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
