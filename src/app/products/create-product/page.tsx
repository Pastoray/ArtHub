'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  UploadFileSchema,
  TUploadFileSchema,
} from '@/lib/validators/product-creations-validator'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

const Page = () => {
  const user = useUser()
  const router = useRouter()
  const [files, setFiles] = useState<
    {
      file: File
      url: string
    }[]
  >([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<TUploadFileSchema, 'ucid'>>({
    resolver: zodResolver(UploadFileSchema.omit({ ucid: true })),
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData: FormData) =>
      await fetch('/api/file-uploads', {
        method: 'POST',
        body: formData,
      }),
    onError: (error: any) => {
      toast.error(error || 'Product upload failed')
    },
    onSuccess: () => {
      toast.success('Product uploaded successfully')
      router.refresh()
      reset()
      if (files.length !== 0) {
        files.forEach((file) => {
          URL.revokeObjectURL(file.url)
        })
      }
      setFiles([])
    },
  })

  const onSubmit = async ({
    title,
    description,
    price,
  }: Omit<TUploadFileSchema, 'ucid'>) => {
    console.log('boop')
    if (user.user) {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price.toString())
      files.forEach((file) => {
        formData.append('files', file.file)
      })
      formData.append('ucid', user.user.id)
      mutate(formData)
    } else {
      toast.error('Please login before trying to create a product')
    }
  }
  return (
    <div className='grid grid-cols-2 gap-2 mt-32'>
      <Card className='mx-auto max-w-md w-full'>
        <CardHeader>
          <CardTitle className='text-xl'>Create Your Product</CardTitle>
          <CardDescription>
            Enter your some information to create your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1'>
              <div className='grid gap-2'>
                <Label htmlFor='product-title'>
                  Title<span className='text-red-600'>*</span>
                </Label>
                <Input
                  {...register('title')}
                  id='product-title'
                  placeholder='Product Title'
                  className='w-full'
                  spellCheck='false'
                  autoComplete='off'
                  required
                />
                {errors?.title && (
                  <p className='text-sm text-red-500'>{errors.title.message}</p>
                )}
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description (Optional)</Label>
              <Textarea
                {...register('description')}
                id='description'
                placeholder='Type your description here'
                className='resize-none w-full h-full'
                spellCheck='false'
                autoComplete='off'
                maxLength={256}
              />
              {errors?.description && (
                <p className='text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className='grid grid-cols-2 w-full'>
              <div className='grid gap-2'>
                <Label htmlFor='price' className='line-clamp-1'>
                  Price<span className='text-red-600'>*</span> (USD)
                </Label>
                <Input
                  {...register('price')}
                  id='price'
                  placeholder='Price In USD'
                  className='w-full'
                  spellCheck='false'
                  autoComplete='off'
                  required
                />
                {errors?.price && (
                  <p className='text-sm text-red-500'>{errors.price.message}</p>
                )}
              </div>
            </div>
            <Button disabled={isLoading} type='submit' className='w-full'>
              Create product
            </Button>
            <Button
              disabled={isLoading}
              variant='outline'
              className='w-full'
              onClick={() => router.push('/')}
            >
              Discard product
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className='max-w-3xl mx-auto'>
        <div className='flex items-center justify-center w-full relative'>
          <label
            htmlFor='dropzone-file'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <svg
                className='w-10 h-10 mb-3 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                ></path>
              </svg>
              <p className='mb-2 text-sm text-gray-400'>
                <span className='font-semibold'>Click to upload</span> or drag
                and drop
              </p>
              <p className='text-xs text-gray-400'>SVG, PNG, JPG, WEBP, AVIF</p>
            </div>

            <input
              id='dropzone-file'
              type='file'
              className='hidden'
              accept='.png, .jpg, .svg, .webp, .avif'
              autoComplete='off'
              onChange={async (event) => {
                if (files.length !== 3 && event.target.files?.[0]) {
                  setFiles((prev) => [
                    ...prev,

                    {
                      file: event.target.files?.[0]!,
                      url: URL.createObjectURL(event.target.files?.[0]!),
                    },
                  ])
                } else if (files.length === 3 && event.target.files?.[0]) {
                  setFiles((prev) => [
                    ...prev.filter((_, i) => i !== 0),
                    {
                      file: event.target.files?.[0]!,
                      url: URL.createObjectURL(event.target.files?.[0]!),
                    },
                  ])
                }
              }}
            />
          </label>
        </div>

        <div className='w-full flex justify-center items-center flex-col'>
          <p className='mt-4 text-center max-w-prose'>
            In this space, you can effortlessly upload and share your
            post&apos;s thumbnail. Simply drag and drop your chosen image file
            right here
            <span className='text-red-600'>*</span>
          </p>
        </div>
        <div className='w-full h-fit grid grid-cols-3 gap-2 mt-4'>
          {files.map((file, i) => (
            <div
              key={i}
              className='relative rounded-lg aspect-square group'
              onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
            >
              <Image
                className='object-scale-down group-hover:opacity-80 rounded-lg group-hover:cursor-pointer w-full'
                src={file.url}
                fill
                alt='Selected Image'
              />
              <X
                size={50}
                className='absolute hidden group-hover:block hover:cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
