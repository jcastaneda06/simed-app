import { filterInterconsultas } from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'

interface InterconsultaReq extends NextApiRequest {
  query: {
    id: string
    estado: string
    prioridad: string
    servicio: string
  }
}

export default async function handler(
  req: InterconsultaReq,
  res: NextApiResponse
) {
  const { id, estado, prioridad, servicio } = req.query
  const interconsulta = await filterInterconsultas(estado, prioridad, servicio)
  if (!interconsulta) {
    return res
      .status(404)
      .json({ exito: false, mensaje: 'Interconsulta no encontrada' })
  }
  return res.status(200).json(interconsulta)
}
