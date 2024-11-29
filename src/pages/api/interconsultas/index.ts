import { getInterconsultas } from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'

interface InterconsultaReq extends NextApiRequest {
  query: {
    estado: string
    prioridad: string
    idServicio: string
    filterBy: string
  }
}

export default async function handler(
  req: InterconsultaReq,
  res: NextApiResponse
) {
  const query = req.query
  const interconsulta = await getInterconsultas({
    estado: query.estado,
    prioridad: query.prioridad,
    servicio: query.idServicio,
    filterBy: query.filterBy,
  })
  if (!interconsulta) {
    return res
      .status(404)
      .json({ exito: false, mensaje: 'Interconsulta no encontrada' })
  }
  return res.status(200).json(interconsulta)
}
