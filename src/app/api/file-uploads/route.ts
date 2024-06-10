import { NextRequest, NextResponse } from 'next/server'
import { Index } from '@upstash/vector'
import { writeFile } from 'fs/promises'
import { db } from '@/db'
import path from 'path'
import { stripe } from '@/lib/stripe'
import { vectorize } from '@/lib/vectorize'

const index = new Index()

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()

  const files = formData.getAll('files') as File[]
  const downloadUrls = formData.getAll('downloadUrls') as string[]
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const ucid = formData.get('ucid') as string
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files received.', status: 400 })
  }
  if (files.length > 3) {
    return NextResponse.json({ error: 'Too many files.', status: 400 })
  }
  let arr: string[] = []
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = Date.now() + file.name.replaceAll(' ', '_')

    try {
      await writeFile(
        path.join(process.cwd(), 'public/uploads/', filename),
        buffer
      )
      arr.push(filename)
    } catch (error) {
      console.log('Error occurred ', error)
      return NextResponse.json({ Message: 'Failed', status: 500 })
    }
  }

  const createdStripeProduct = await stripe.products.create({
    name: title,
    default_price_data: {
      currency: 'USD',
      unit_amount: Math.round((price as unknown as number) * 100),
    },
  })

  console.log(downloadUrls)

  const product = await db.product.create({
    data: {
      user_clerk_id: ucid,
      stripe_id: createdStripeProduct.id,
      price_id: createdStripeProduct.default_price as string,
      title,
      description,
      price: parseFloat(price),
      image_refs: arr,
    },
  })

  await index.upsert({
    id: product.id!,
    vector: await vectorize(`${product.title}: ${product.description}`),
    metadata: {
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      imageId: Array(32)
        .map(() => Math.random().toString(36)[2])
        .join(''),
    },
  })
  return NextResponse.json({ Message: 'Success', status: 201 })
}
