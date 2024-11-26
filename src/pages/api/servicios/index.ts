import { NextApiRequest, NextApiResponse } from 'next'
import {
  getAllServices,
  createService,
  searchServicesByName,
} from '@/services/serviceService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        const { nombre } = req.query
        if (nombre) {
          const servicios = await searchServicesByName(nombre as string)
          return res.status(200).json({ exito: true, data: servicios })
        }

        const servicios = await getAllServices()
        return res.status(200).json({ exito: true, data: servicios })
      }

      case 'POST': {
        const servicio = await createService(req.body)
        return res.status(201).json({
          exito: true,
          mensaje: 'Servicio creado exitosamente',
          data: servicio,
        })
      }

      default:
        return res
          .status(405)
          .json({ exito: false, mensaje: 'Método no permitido' })
    }
  } catch (error: any) {
    console.error('Error en API de servicios:', error.message)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      detalles: error.message,
    })
  }
}
