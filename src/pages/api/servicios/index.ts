import { NextApiRequest, NextApiResponse } from 'next'
import {
  getAllServices,
  createService,
  searchServicesByName,
} from '@/services/servicioService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const servicios = await getAllServices()
      return res.status(200).json(servicios)
    }

    if (req.method === 'POST') {
      const servicio = await createService(req.body)
      return res.status(201).json({
        exito: true,
        mensaje: 'Servicio creado exitosamente',
        data: servicio,
      })
    }

    if (req.method === 'PUT') {
      const { nombre } = req.body
      const servicios = await searchServicesByName(nombre)
      return res.status(200).json({ exito: true, data: servicios })
    }

    return res
      .status(405)
      .json({ exito: false, mensaje: 'Método no permitido' })
  } catch (error: any) {
    console.error('Error en API de servicios:', error.message)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      detalles: error.message,
    })
  }
}
