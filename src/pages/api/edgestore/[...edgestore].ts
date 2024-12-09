import { createContext, edgeStoreRouter } from '@/lib/utils'
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from '@edgestore/server/adapters/next/pages'

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
})

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter
