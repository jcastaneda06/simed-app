import { initEdgeStore } from '@edgestore/server'
import { CreateContextOptions } from '@edgestore/server/adapters/next/pages'
import { z } from 'zod'

export type EdgeStoreContext = {
  servicio: string
  interconsultaId: string
}

const es = initEdgeStore.context<EdgeStoreContext>().create()

/**
 * This is the main router for the edgestore buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 10, // 1MB
    })
    .input(
      z.object({
        servicio: z.string(),
        interconsultaId: z.string(),
      })
    )
    .path(({ ctx, input }) => [
      {
        servicio: input.servicio,
      },
      {
        interconsultaId: input.interconsultaId,
      },
    ]),
})

async function createContext({
  req,
}: CreateContextOptions): Promise<EdgeStoreContext> {
  return {
    servicio: 'uploads',
    interconsultaId: 'interconsulta',
  }
}

export { edgeStoreRouter, createContext }
