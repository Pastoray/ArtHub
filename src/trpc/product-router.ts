import { ApprovementEmailHtml } from '@/components/emails/ApprovementEmail'
import { RejectionEmailHtml } from '@/components/emails/RejectionEmail'
import { publicProcedure, router } from './trpc'
import { db } from '@/db'
import { resend } from '@/lib/resend'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const productRouter = router({
  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        offset: z.number(),
        options: z
          .object({
            where: z.object({}).optional(),
            orderBy: z.object({}).optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, offset, options } = input
      const products = await db.product.findMany({
        take: limit,
        skip: offset,
        ...options,
      })
      return { products }
    }),
  deleteProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input }) => {
      const { productId } = input
      await db.product.delete({
        where: {
          id: productId,
        },
      })
    }),
  approve: publicProcedure
    .input(z.object({ product_id: z.string(), user_clerk_id: z.string() }))
    .mutation(async ({ input }) => {
      const { product_id, user_clerk_id } = input
      if (!product_id || !user_clerk_id) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      const prd = await db.product.update({
        where: {
          id: product_id,
        },
        data: {
          approved: true,
        },
      })

      const user = await db.user.findFirst({
        where: {
          clerk_id: user_clerk_id,
        },
        select: {
          email: true,
        },
      })
      if (user) {
        const data = await resend.emails.send({
          from: 'ArtHub',
          to: [user.email],
          subject: 'Thanks for your order! This is your receipt.',
          html: ApprovementEmailHtml({
            date: new Date(),
            email: user.email,
            product: prd,
          }),
        })
      }
      return { success: true }
    }),
  reject: publicProcedure
    .input(z.object({ product_id: z.string(), user_clerk_id: z.string() }))
    .mutation(async ({ input }) => {
      const { product_id, user_clerk_id } = input
      if (!product_id || !user_clerk_id) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      const prd = await db.product.delete({
        where: {
          id: product_id,
        },
      })
      const user = await db.user.findFirst({
        where: {
          clerk_id: user_clerk_id,
        },
        select: {
          email: true,
        },
      })
      if (user) {
        const data = await resend.emails.send({
          from: 'ArtHub',
          to: [user!.email],
          subject: 'Thanks for your order! This is your receipt.',
          html: RejectionEmailHtml({
            date: new Date(),
            email: user.email,
            product: prd,
          }),
        })
      }
      return { success: true }
    }),
})
