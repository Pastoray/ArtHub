import { z } from 'zod'
import { publicProcedure, router } from './trpc'
import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'
import { TRPCError } from '@trpc/server'
export const paymentRouter = router({
  createSession: publicProcedure
    .input(
      z.object({ user_clerk_id: z.string(), productIds: z.array(z.string()) })
    )
    .mutation(async ({ input }) => {
      const { user_clerk_id, productIds } = input
      const user = await db.user.findFirst({
        where: {
          clerk_id: user_clerk_id,
        },
      })
      const products = await db.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      })
      const order = await db.order.create({
        data: {
          user_clerk_id,
          product_ids: products.map((product) => product.id),
          is_paid: false,
        },
      })
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      products.forEach((product) => {
        line_items.push({
          price: product.price_id,
          quantity: 1,
        })
      })
      line_items.push({
        price: 'price_1PLulE1BrMUnXkspRmJpDFdC',
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ['card', 'paypal', 'cashapp'],
          mode: 'payment',
          metadata: {
            userId: user!.id,
            orderId: order.id,
          },
          line_items,
        })
        return { url: stripeSession.url }
      } catch (err) {
        console.log(err)
        return { url: null }
      }
    }),
  pollOrderStatus: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const order = await db.order.findFirst({
        where: {
          id: orderId,
        },
      })
      if (!order) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (order.is_paid) {
        await db.product.updateMany({
          where: {
            id: {
              in: order.product_ids,
            },
          },
          data: {
            purchases: {
              increment: 1,
            },
          },
        })
      }
      return { isPaid: order.is_paid }
    }),
})
