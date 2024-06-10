import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PaymentStatus from '@/components/PaymentStatus'
import { RedirectToSignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { TCoreProduct, TCoreUser } from '../../../utils/consts'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId
  const { userId } = auth()
  const dbUser = await db.user.findFirst({
    where: {
      clerk_id: userId!,
    },
  })

  const order = await db.order.findFirst({
    where: {
      id: orderId as string,
    },
  })

  if (!order) return notFound()

  const orderUserId = order.user_clerk_id

  if (orderUserId !== userId) {
    return <RedirectToSignIn />
  }

  const products = (await db.product.findMany({
    where: {
      id: {
        in: order.product_ids,
      },
    },
  })) as Omit<TCoreProduct, 'author'>[]

  const orderTotal = products.reduce((total, product) => {
    return total + product.price
  }, 0)

  return (
    <main className='relative lg:min-h-full'>
      <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
        <Image
          fill
          src='/checkout-thank-you.jpg'
          className='h-full w-full object-cover object-center'
          alt='thank you for your order'
        />
      </div>

      <div>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
          <div className='lg:col-start-2'>
            <p className='text-sm font-medium text-blue-600'>
              Order successful
            </p>
            <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              Thanks for ordering
            </h1>
            {order.is_paid ? (
              <p className='mt-2 text-base text-muted-foreground'>
                Your order was processed and your assets are available to
                download below. We&apos;ve sent your receipt and order details
                to{' '}
                {dbUser ? (
                  <span className='font-medium text-gray-900'>
                    {dbUser.email}
                  </span>
                ) : (
                  'You'
                )}
              </p>
            ) : (
              <p className='mt-2 text-base text-muted-foreground'>
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}

            <div className='mt-16 text-sm font-medium'>
              <div className='text-muted-foreground'>Order nr.</div>
              <div className='mt-2 text-gray-900'>{order.id}</div>

              <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                {products.map((product) => {
                  const image = product.image_refs[0]

                  return (
                    <li key={product.id} className='flex space-x-6 py-6'>
                      <div className='relative h-24 w-24'>
                        {image !== '' ? (
                          <Image
                            fill
                            src={image}
                            alt={`${product.title} image`}
                            className='flex-none rounded-md bg-gray-100 object-cover object-center'
                          />
                        ) : null}
                      </div>

                      <div className='flex-auto flex flex-col justify-between'>
                        <div className='space-y-1'>
                          <h3 className='text-gray-900'>{product.title}</h3>

                          <p className='my-1'>Category: Art</p>
                        </div>

                        {order.is_paid
                          ? product.image_refs.map((ref, i) => (
                              <a
                                key={i}
                                href={`/uploads/${ref}`}
                                download={`${product.title}(${i})`}
                                className='text-blue-600 hover:underline underline-offset-2'
                              >
                                Download asset
                              </a>
                            ))
                          : null}
                      </div>

                      <p className='flex-none font-medium text-gray-900'>
                        ${product.price}
                      </p>
                    </li>
                  )
                })}
              </ul>

              <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p className='text-gray-900'>${orderTotal}</p>
                </div>

                <div className='flex justify-between'>
                  <p>Transaction Fee</p>
                  <p className='text-gray-900'>${1}</p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                  <p className='text-base'>Total</p>
                  <p className='text-base'>${orderTotal + 1}</p>
                </div>
              </div>

              <PaymentStatus
                isPaid={order.is_paid}
                orderEmail={(dbUser as TCoreUser).email}
                orderId={order.id}
              />

              <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                <Link
                  href='/products'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ThankYouPage
