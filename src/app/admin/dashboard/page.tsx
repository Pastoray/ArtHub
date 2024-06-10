import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

const adminResponsibilities = [
  {
    name: 'Approve Products',
    description:
      'In this section you have to either reject products in case of violation of terms and services or approve them so they can be avaialable for purchase',
    styles: 'bg-green-600 hover:bg-green-700',
    href: '/admin/products',
  },
  {
    name: 'Assign Role',
    description:
      'In this section you can add new admins or demote them or even remove users based on your needs, note that any unecessary changes might result in your account getting deleted',
    styles: 'bg-red-700 hover:bg-red-800',
    href: '/admin/assign-role',
  },
]

const Page = () => {
  const { user, isLoaded } = useUser()
  if (!isLoaded) {
    return
  }
  if (!user) {
    return <RedirectToSignIn />
  }
  const { data: userData, isLoading } = trpc.user.getUser.useQuery({
    user_clerk_id: user.id,
  })

  if (userData?.user?.role === 'MEMBER') {
    toast.error('Not Authorized')
    return redirect('/')
  }
  if (isLoading) {
    return (
      <div className='w-full h-32 flex justify-center items-center'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }
  return (
    <>
      <div>
        <MaxWidthWrapper className='border-b border-gray-200'>
          <div className='flex flex-col justify-center items-center font-semibold p-12 text-center'>
            <h1 className='text-6xl'>
              Welcome to the <span className='text-red-600'>Admin</span>{' '}
              dashboard
            </h1>
            <p className='max-w-3xl text-xl mt-6'>
              In this dashboard you can see what you can see everything you can
              do as an admin, and as you can tell you have a lot of options
            </p>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12'>
            {adminResponsibilities.map((res, i) => (
              <div
                className='flex flex-col justify-center items-center gap-4'
                key={i}
              >
                <Link
                  href={res.href}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    res.styles,
                    'font-semibold'
                  )}
                >
                  {res.name}
                </Link>
                <p className='max-w-md text-center text-gray-800'>
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}

export default Page
