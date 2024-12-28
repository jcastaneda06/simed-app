import { getUsuarioById } from '@/services/usuarioService'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    const { id } = req.query as { id: string }
    const usuarios = await getUsuarioById(id)
    return res.status(200).json(usuarios)
  }
}
