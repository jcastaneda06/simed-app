import { backendClient } from '@/lib/edgestore-server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { interconsultaId } = req.query as { interconsultaId: string }
  const file = await backendClient.publicFiles.listFiles({
    filter: {
      path: {
        interconsultaId: { eq: interconsultaId },
      },
    },
  })

  res.status(200).json(file)
}
