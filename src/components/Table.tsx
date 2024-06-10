'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TtRPCCoreProduct } from '../../utils/consts'
import Approve from './Approve'
import ImageSlider from './ImageSlider'

export const Copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const ProductsTable = ({ products }: { products: TtRPCCoreProduct[] }) => {
  return (
    <Table className='table-fixed overflow-hidden'>
      <TableHeader>
        <TableRow>
          <TableHead className='lg:table-cell hidden'>Stripe id</TableHead>
          <TableHead className='sm:table-cell hidden'>User clerk id</TableHead>
          <TableHead>Images</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className='lg:table-cell hidden'>Price (USD)</TableHead>
          <TableHead className='sm:table-cell hidden'>Created at</TableHead>
          <TableHead className=''>Approved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className='select-none'>
            <TableCell
              className='truncate lg:table-cell hidden hover:cursor-pointer hover:bg-gray-100'
              onClick={() => Copy(product.stripe_id)}
            >
              {product.stripe_id}
            </TableCell>
            <TableCell
              className='truncate hover:cursor-pointer hover:bg-gray-100 sm:table-cell hidden'
              onClick={() => Copy(product.user_clerk_id)}
            >
              {product.user_clerk_id}
            </TableCell>
            <TableCell
              className='truncate hover:cursor-pointer hover:bg-gray-100'
              onClick={() => Copy(product.image_refs.join(', '))}
            >
              <ImageSlider image_refs={product.image_refs} />
            </TableCell>
            <TableCell
              className='truncate hover:cursor-pointer hover:bg-gray-100'
              onClick={() => Copy(product.title)}
            >
              {product.title}
            </TableCell>
            <TableCell
              className='truncate hover:cursor-pointer hover:bg-gray-100'
              onClick={() => Copy(product.description || '')}
            >
              {product.description}
            </TableCell>
            <TableCell
              className='truncate lg:table-cell hidden hover:cursor-pointer hover:bg-gray-100'
              onClick={() => Copy(product.price.toString())}
            >
              {product.price}
            </TableCell>
            <TableCell
              className='truncate hover:cursor-pointer hover:bg-gray-100 sm:table-cell hidden'
              onClick={() => Copy(product.created_at.split(' (')[0])}
            >
              {product.created_at.split(' (')[0]}
            </TableCell>
            <TableCell className='hover:bg-gray-100'>
              <Approve product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProductsTable
