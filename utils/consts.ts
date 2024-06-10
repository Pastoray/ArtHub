import { z } from 'zod'

export const CoreUser = z.object({
  id: z.string(),
  clerk_id: z.string(),
  username: z.string(),
  email: z.string(),
  created_at: z.date(),
})

export const CoreProduct = z.object({
  id: z.string(),
  stripe_id: z.string(),
  user_clerk_id: z.string(),
  image_refs: z.array(z.string()),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  price_id: z.string(),
  created_at: z.date(),
  approved: z.boolean(),
  purchases: z.number().int(),
})

// date had to be a string since it's not supported using JSON
export const tRPCCoreProduct = z.object({
  id: z.string(),
  stripe_id: z.string(),
  user_clerk_id: z.string(),
  image_refs: z.array(z.string()),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  price_id: z.string(),
  created_at: z.string(),
  approved: z.boolean(),
  purchases: z.number().int(),
})

export type TtRPCCoreProduct = z.infer<typeof tRPCCoreProduct>
export type TCoreUser = z.infer<typeof CoreUser>
export type TCoreProduct = z.infer<typeof CoreProduct>

export const FILTERS = [
  {
    name: 'Budget',
    options: [
      {
        text: 'Under $75',
        method: (arr: TCoreProduct[]) => {
          const filtered_arr = arr.filter((product) => product.price <= 75)
          return filtered_arr
        },
      },
      {
        text: '$75 - $150',
        method: (arr: TCoreProduct[]) => {
          const filtered_arr = arr.filter(
            (product) => product.price <= 150 && product.price >= 75
          )
          return filtered_arr
        },
      },
      {
        text: '$150 - $500',
        method: (arr: TCoreProduct[]) => {
          const filtered_arr = arr.filter(
            (product) => product.price <= 500 && product.price >= 150
          )
          return filtered_arr
        },
      },
      {
        text: '$500+',
        method: (arr: TCoreProduct[]) => {
          const filtered_arr = arr.filter((product) => product.price >= 500)
          return filtered_arr
        },
      },
    ] as const,
  },
  {
    name: 'Sort By',
    options: [
      {
        text: 'Best selling',
        method: (arr: TCoreProduct[]) => {
          arr.sort((a, b) => {
            return b.purchases - a.purchases
          })
          return arr
        },
      },
      {
        text: 'Newest arrivals',
        method: (arr: TCoreProduct[]) => {
          arr.sort((a, b) => {
            return a.created_at.getTime() - b.created_at.getTime()
          })
          return arr
        },
      },
    ] as const,
  },
]
