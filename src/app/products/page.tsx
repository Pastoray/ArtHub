import Product from '@/components/Product'
import Products from '@/components/Products'
import { db } from '@/db'
import { vectorize } from '@/lib/vectorize'
import { RedirectToSignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Index } from '@upstash/vector'
import { TCoreProduct } from '../../../utils/consts'

const index = new Index<TCoreProduct>()

export const dynamic = 'force-dynamic'

const Page = async ({ searchParams }: any) => {
  const product = searchParams.product
  const { userId } = auth()
  if (!userId) {
    return <RedirectToSignIn />
  }
  if (product) {
    const products: TCoreProduct[] =
      await db.$queryRaw`SELECT * FROM products WHERE to_tsvector('simple', lower(
        products.title
       || ' ' || products.description)) @@ to_tsquery ('simple', lower(${product
         .trim()
         .split(' ')
         .join(' & ')})) LIMIT 6`
    await Promise.all(
      products.map(async (prd) => {
        const author = await db.user.findFirst({
          where: {
            clerk_id: prd.user_clerk_id,
          },
        })
      })
    )

    return <Product receivedProducts={products} />
  } else {
    const products: TCoreProduct[] = await db.product.findMany({
      where: {
        user_clerk_id: userId,
      },
    })
    if (products.length < 6) {
      const vector = await vectorize(product)
      const res = await index.query({
        topK: 12,
        vector,
        includeMetadata: true,
      })
      const vectorProducts = res
        .filter(
          (existingProduct) =>
            !products.some(
              (product) =>
                product.id === existingProduct.id || existingProduct.score < 0.9
            )
        )
        .map(({ metadata }) => metadata!)
      products.push(...vectorProducts)
    }
    return <Products userProducts={products} />
  }
}

export default Page
