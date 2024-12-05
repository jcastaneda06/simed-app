import {
  deleteInterconsulta,
  getInterconsultaById,
} from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query as { id: string }
    const interconsulta = await getInterconsultaById(id)
    return res.status(200).json(interconsulta)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string }
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return res.status(401).end()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== 'ADMIN') {
      return res.status(403).end()
    }

    const result = await deleteInterconsulta(id)
    if (!result) {
      return res
        .status(404)
        .json({ message: 'Interconsulta no encontrada', ok: true })
    }
    return res.status(200).json(result)
  }
}
