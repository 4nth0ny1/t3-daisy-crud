import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,

} from "~/server/api/trpc";
import { postInput } from '../../../types'

export const postRouter = createTRPCRouter({


  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: {
        likes: true
      }
    })
    return posts
  }),

  create: protectedProcedure.input(postInput).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        user: {
          connect: {
            id: ctx.session.user.id
          }
        }
      }
    })
  }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.post.delete({
      where: {
        id: input
      }
    })
  })

});