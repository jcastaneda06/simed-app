import { createInterconsulta } from '@/services/interconsultaSerivce'
import { Interconsulta } from '@/types/Interconsulta'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const interconsulta: Interconsulta = JSON.parse(req.body)
    const interconsultaCreada = await createInterconsulta(interconsulta)
    if (!interconsultaCreada) {
      return res
        .status(400)
        .json({ exito: false, mensaje: 'Interconsulta es requerida' })
    }

    return res.status(200).json(interconsultaCreada)
  } catch (err: any) {
    console.error(err)
  }
}
