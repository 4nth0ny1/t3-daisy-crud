import { z } from 'zod'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './server/api/root'

type RouterOutputs = inferRouterOutputs<AppRouter>
type allPostsOutput = RouterOutputs['post']['getAll']

export type Post = allPostsOutput[number]

export const postInput = z.object({
    title: z.string(),
    content: z.string(),
})