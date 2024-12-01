import { getInterconsultaById } from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query as { id: string }
    const interconsulta = await getInterconsultaById(id)
    return res.status(200).json(interconsulta)
  }

  return res.status(405).end()
}
