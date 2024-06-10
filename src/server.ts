import express, { NextFunction } from 'express'
import { nextApp, nextHandler } from './next-utils'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './trpc'
import { inferAsyncReturnType } from '@trpc/server'
import bodyParser from 'body-parser'
import { IncomingMessage } from 'http'
import { stripeWebhookHandler } from './stripe-webhook'
import nextBuild from 'next/dist/build'
import path from 'path'
import { db } from './db'
const app = express()
const PORT = Number(process.env.PORT) || 3000

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>

export type WebhookRequest = IncomingMessage & { rawBody: Buffer }

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer
    },
  })
  app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler)

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      console.log('NextJS is building for production')
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))

      process.exit()
    })
    return
  }

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )
  app.use((req, res) => nextHandler(req, res))
  nextApp.prepare().then(() => {
    console.log('NextJS Started')
    app.listen(PORT, async () => {
      console.log(`NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
