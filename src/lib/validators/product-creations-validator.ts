import { z } from 'zod'
export const ProductCreationValidator = z.object({
  title: z
    .string()
    .min(8, { message: 'Product Title must be at least 8 characters long' })
    .max(64, { message: 'Product Title can only be 64 characters long' }),
  description: z.string().max(192, {
    message: 'Product Description can only be 192 characters long',
  }),
  thumbnail: z.instanceof(File, {
    message: 'Prodct thumbnail must be an image',
  }),
})

export type TProductCreationValidator = z.infer<typeof ProductCreationValidator>

export const UploadFileSchema = z.object({
  ucid: z.string(),
  title: z
    .string()
    .min(8, { message: 'Product Title must be at least 8 characters long' })
    .max(64, { message: 'Product Title can only be 64 characters long' }),
  description: z.string().max(192, {
    message: 'Product Description can only be 192 characters long',
  }),
  price: z.coerce
    .number()
    .min(1, { message: 'Product Price must have a price of atleast 1 USD' })
    .max(1000000, { message: 'Product Price cannot exceed 1,000,000 USD' }),
})

export const AssignRoleSchema = z.object({
  email: z.string().email(),
  role: z.string(z.union([z.literal('Admin'), z.literal('User')])),
})

export type TAssignRoleSchema = z.infer<typeof AssignRoleSchema>
export type TUploadFileSchema = z.infer<typeof UploadFileSchema>
