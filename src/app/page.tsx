'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { BotOff, CreditCard, Earth, Leaf, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { trpc } from '@/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const perks = [
  {
    name: 'Global Reach',
    description:
      'Access to a diverse pool of artists and clients from around the world, enabling global collaborations and opportunities',
    icon: Earth,
  },
  {
    name: 'Price Selection',
    description:
      'Users have the freedom to select the price that best fits their requirements from a range of options provided by artists',
    icon: CreditCard,
  },
  {
    name: 'No AI',
    description:
      'Embrace a human-centric experience without the influence of artificial intelligence, ensuring personalized interactions',
    icon: BotOff,
  },
  {
    name: 'Instant Delivery',
    description:
      'Get what you need in the blink of an eye. No waiting, no wasting time just instant gratificationng',
    icon: Zap,
  },
  {
    name: 'For the planet',
    description:
      'We contribute a portion of our annual revenue to support charities and organizations worldwide',
    icon: Leaf,
  },
]

export default function Home() {
  const { data: newest, isLoading: isLoading1 } =
    trpc.product.getProducts.useQuery({
      limit: 5,
      offset: 0,
      options: { orderBy: { created_at: 'desc' } },
    })
  const { data: popular, isLoading: isLoading2 } =
    trpc.product.getProducts.useQuery({
      limit: 5,
      offset: 0,
      options: { orderBy: { purshases: 'desc' } },
    })

  return (
    <>
      <MaxWidthWrapper className='my-12 flex flex-col justify-center items-center text-center'>
        <h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Your <span className='text-indigo-600'>#1</span> marketplace for
          high-quality{' '}
          <span className=' text-indigo-600'>Drawings & Artworks</span>
        </h1>
        <p className='max-w-prose text-gray-800 sm:text-xl font-semibold mt-16'>
          Welcome to <span className='text-indigo-600'>ArtHub</span>, your
          premier destination for discovering and acquiring stunning artwork.
          Our fully managed platform allows artists to effortlessly post their
          creations, while art enthusiasts can easily explore and purchase
          unique pieces
        </p>
        <Link href={'/products'} className={cn(buttonVariants(), 'mt-6')}>
          Products Dashboard &rarr;
        </Link>
      </MaxWidthWrapper>
      <div className='flex flex-col justify-center items-start'>
        <section id='trending-products' className='mt-28 mx-10'>
          <div className='flex justify-between items-center'>
            <h2 className='font-bold text-gray-800 text-3xl'>
              Newest Artworks
            </h2>
            <Link href={'/products'} className='text-indigo-600 font-semibold'>
              Browse Artworks &rarr;
            </Link>
          </div>
          <p className='text-muted-foreground mt-1'>
            Explore ArtHub&apos;s latest artworks, connecting buyers with
            skilled professionals globally
          </p>
          <ul className='flex items-center gap-4 mt-4 p-4 w-full'>
            {isLoading1
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div className='flex flex-col space-y-3' key={`v ${i}`}>
                    <Skeleton className='h-[125px] w-[250px] rounded-xl' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[250px]' />
                      <Skeleton className='h-4 w-[200px]' />
                    </div>
                  </div>
                ))
              : newest?.products.map((art, i) => (
                  <li key={`n${i}`}>
                    <Link href={`/products/${art.id}`}>
                      <div className='relative flex-1 hover:scale-105 transition-all duration-200 h-64 w-64'>
                        <div className='absolute inset-0 flex flex-col justify-start items-start p-4'>
                          <h2 className='z-10 text-white font-semibold text-2xl tracking-loose'>
                            {art.title}
                          </h2>
                          <p className='z-10 text-gray-100 font-semibold text-md line-clamp-2'>
                            {art.description}
                          </p>
                        </div>
                        <Image
                          className='object-fit rounded-xl'
                          src={`/uploads/${art.image_refs[0]}`}
                          fill
                          alt={`${art.title} Image`}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
          </ul>
        </section>
        <section id='popular-products' className='mt-28 mx-10'>
          <div className='flex justify-between items-center'>
            <h2 className='font-bold text-gray-800 text-3xl'>
              Popular Artworks
            </h2>
            <Link href={`/products`} className='text-indigo-600 font-semibold'>
              Browse Artworks &rarr;
            </Link>
          </div>
          <p className='text-muted-foreground mt-1'>
            Explore ArtHub&apos;s sought-after art, where top-rated
            professionals post their high-quality art
          </p>
          <ul className='flex gap-4 mt-4'>
            {isLoading2
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div className='flex flex-col space-y-3' key={`v2 ${i}`}>
                    <Skeleton className='h-[125px] w-[250px] rounded-xl' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[250px]' />
                      <Skeleton className='h-4 w-[200px]' />
                    </div>
                  </div>
                ))
              : popular?.products.map((art, i) => (
                  <li key={`p ${i}`}>
                    <Link href={`/products/${art.id}`}>
                      <div className='relative flex-1 hover:scale-105 transition-all duration-200 h-64 w-64'>
                        <div className='absolute inset-0 flex flex-col justify-start items-start p-4'>
                          <h2 className='z-10 text-white font-semibold text-2xl tracking-loose'>
                            {art.title}
                          </h2>
                          <p className='z-10 text-gray-100 font-semibold text-md'>
                            {art.description}
                          </p>
                        </div>
                        <Image
                          className='object-fit rounded-xl'
                          src={`/uploads/${art.image_refs[0]}`}
                          fill
                          alt={`${art.title} Image`}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
          </ul>
        </section>
      </div>
      <MaxWidthWrapper>
        <div className='p-16 mt-32 flex flex-col justify-center items-center'>
          <h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl'>
            Why <span className='text-indigo-600'>ArtHub</span> ?
          </h1>
          <p className='max-w-4xl text-gray-800 sm:text-xl font-semibold mt-16 text-center'>
            Well, because we believe in empowering talent globally. By providing
            a platform where artists and clients can connect seamlessly, we
            facilitate opportunities for growth, collaboration, and success.
            With our user-friendly interface, secure payment system, and
            commitment to supporting both artists and clients,{' '}
            <span className='text-indigo-600'>ArtHub</span> also provides the
            following perks
          </p>
        </div>
        <div className='grid lg:grid-cols-3 gap-8 md:grid-cols-2 sm:grid-cols-1 mt-4 mb-16'>
          {perks.map((perk, i) => (
            <div
              key={i}
              className='flex flex-col justify-center items-center gap-4'
            >
              <div className='h-16 w-16 rounded-full bg-indigo-200 text-indigo-600 flex justify-center items-center'>
                <perk.icon />
              </div>
              <p className='max-w-md sm:text-xl font-semibold text-center'>
                {perk.name}
              </p>
              <p className='max-w-md text-gray-800 sm:text-xl text-center'>
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </>
  )
}
