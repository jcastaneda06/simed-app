import { getInterconsultaById } from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'

interface InterconsultaReq extends NextApiRequest {
  query: {
    id: string
  }
}

export default async function handler(
  req: InterconsultaReq,
  res: NextApiResponse
) {
  const { id } = req.query
  const interconsulta = await getInterconsultaById(id)
  if (!interconsulta) {
    return res
      .status(404)
      .json({ exito: false, mensaje: 'Interconsulta no encontrada' })
  }
  return res.status(200).json(interconsulta)
}
