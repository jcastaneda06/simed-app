import {
  addBulkDepartamentos,
  addBulkServiciosToDepartamento,
} from '@/services/departamentoService'
import { Deparatamento } from '@/types/Deparatamento'
import { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split('Bearer ')[1]
  const decoded = jwt.decode(token || '')

  const unauthorized = !token || !decoded || decoded.role !== 'ADMIN'
  if (unauthorized) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  if (req.method === 'POST') {
    const departamentos: Deparatamento[] = req.body
    const results = await addBulkDepartamentos(departamentos)
    return res.status(200).json(results)
  }

  if (req.method === 'PUT') {
    const { departamentoId, serviciosId } = req.body
    const results = await addBulkServiciosToDepartamento(
      departamentoId,
      serviciosId
    )
    return res.status(200).json(results)
  }
}
