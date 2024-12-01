import {
  getRespuestaByInterconsultaId,
  responderInterconsulta,
} from '@/services/respuestaService'
import { RespuestaInterconsulta } from '@/types/Interconsulta'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query as { id: string }
    const respuesta = await getRespuestaByInterconsultaId(id)

    return res.status(200).json(respuesta)
  }

  if (req.method === 'POST') {
    const respuestaInterconsutla: RespuestaInterconsulta = JSON.parse(req.body)
    const respuesta = await getRespuestaByInterconsultaId(
      respuestaInterconsutla.interconsulta
    )

    if (respuesta) {
      return res
        .status(400)
        .json({ message: 'Ya se ha respondido esta interconsulta' })
    }

    const response = await responderInterconsulta(respuestaInterconsutla)

    return res.status(200).json(response)
  }

  return res.status(405).end()
}
