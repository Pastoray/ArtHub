import { paymentRouter } from './payment-router'
import { productRouter } from './product-router'
import { router } from './trpc'
import { userRouter } from './user-router'

export const appRouter = router({
  payment: paymentRouter,
  product: productRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
