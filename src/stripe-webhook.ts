import express from 'express'
import { WebhookRequest } from '@/server'
import { stripe } from '@/lib/stripe'
import { resend } from '@/lib/resend'
import type Stripe from 'stripe'
import { ReceiptEmailHtml } from '@/components/emails/ReceiptEmail'
import { db } from '@/db'
import { TCoreProduct, TCoreUser } from '../utils/consts'

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody
  const signature = req.headers['stripe-signature'] || ''

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`
      )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`)
  }

  if (event.type === 'checkout.session.completed') {
    const user = db.user.findFirst({
      where: {
        id: session.metadata.userId,
      },
    }) as unknown as TCoreUser
    if (!user) return res.status(404).json({ error: 'No such user exists.' })

    const order = await db.order.findFirst({
      where: {
        id: session.metadata.orderId,
      },
    })

    if (!order) return res.status(404).json({ error: 'No such order exists.' })

    await db.order.update({
      where: {
        id: session.metadata.orderId,
      },
      data: {
        is_paid: true,
      },
    })

    const products = (await db.product.findMany({
      where: {
        id: {
          in: order.product_ids,
        },
      },
    })) as unknown as Omit<TCoreProduct, 'author'>[]
    try {
      const data = await resend.emails.send({
        from: 'ArtHub',
        to: [user.email],
        subject: 'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: products,
        }),
      })
      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  return res.status(200).send()
}
