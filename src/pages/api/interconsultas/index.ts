import { NextApiRequest, NextApiResponse } from 'next'
import {
  filterInterconsultas,
  createInterconsulta,
  getInterconsultaById,
  updateInterconsultaState,
  addNoteToInterconsulta,
} from '@/services/interconsultaSerivce'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        const { id, estado, prioridad, servicio, tipoFiltro } = req.query

        if (id) {
        }

        const interconsultas = await filterInterconsultas({
          estado,
          prioridad,
          servicio,
          tipoFiltro,
        })
        return res.status(200).json({ exito: true, data: interconsultas })
      }

      case 'POST': {
        const interconsulta = await createInterconsulta(req.body)
        return res.status(201).json({
          exito: true,
          mensaje: 'Interconsulta creada exitosamente',
          data: interconsulta,
        })
      }

      case 'PUT': {
        const { id } = req.query
        if (!id) {
          return res
            .status(400)
            .json({ exito: false, mensaje: 'ID es requerido' })
        }

        const { estado } = req.body
        const updated = await updateInterconsultaState(id as string, estado)
        return res.status(200).json({
          exito: true,
          mensaje: 'Estado actualizado exitosamente',
          data: updated,
        })
      }

      default:
        return res
          .status(405)
          .json({ exito: false, mensaje: 'Método no permitido' })
    }
  } catch (error: any) {
    console.error('API Error:', error.message)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      detalles: error.message,
    })
  }
}
