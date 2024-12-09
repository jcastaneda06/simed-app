import { initEdgeStoreClient } from '@edgestore/server/core'
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/pages'
import { createContext, edgeStoreRouter } from '@/lib/utils'

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
})

// ...

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
})
