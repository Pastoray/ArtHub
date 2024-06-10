import { z } from 'zod'
import { publicProcedure, router } from './trpc'
import { db } from '@/db'
import { AssignRoleSchema } from '@/lib/validators/product-creations-validator'
import { clerkClient } from '@clerk/nextjs/server'
export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ user_clerk_id: z.string() }))
    .query(async ({ input }) => {
      const { user_clerk_id: clerk_id } = input
      const user = await db.user.findFirst({
        where: {
          clerk_id,
        },
      })
      return { user }
    }),
  removeUser: publicProcedure
    .input(AssignRoleSchema)
    .mutation(async ({ input }) => {
      const { email } = input
      const user = await db.user.delete({
        where: {
          email,
        },
      })
      await clerkClient.users.deleteUser(user.clerk_id)
      return { success: true }
    }),
  updateUserRole: publicProcedure
    .input(AssignRoleSchema)
    .mutation(async ({ input }) => {
      const { email, role } = input
      await db.user.update({
        where: {
          email,
        },
        data: {
          role,
        },
      })
      return { success: true }
    }),
})
