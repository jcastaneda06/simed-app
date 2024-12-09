'use client'

import { createEdgeStoreProvider } from '@edgestore/react'
import { type EdgeStoreRouter } from '../pages/api/edgestore/[...edgestore]'
import { initEdgeStore } from '@edgestore/server'
import { z } from 'zod'

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>()

export { EdgeStoreProvider, useEdgeStore }
