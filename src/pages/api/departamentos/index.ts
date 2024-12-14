import {
  addDepartamento,
  getDepartamentos,
} from '@/services/departamentoService'
import { Deparatamento } from '@/types/Deparatamento'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const departamentos = await getDepartamentos()
    return res.status(200).json(departamentos)
  }

  if (req.method === 'POST') {
    const departamento = req.body as Deparatamento
    const newDepartamento = await addDepartamento(departamento)
    res.status(201).json(newDepartamento)
  }

  if (req.method === 'PUT') {
    res.status(200).json({ mensaje: 'Método PUT' })
  }
}
