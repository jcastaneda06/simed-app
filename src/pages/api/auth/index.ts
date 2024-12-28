import { NextApiRequest, NextApiResponse } from 'next'
import {
  loginUsuario,
  registerUsuario,
  deactivateUsuario,
  updateUsuario,
  fetchAllUsuarios,
  deleteUsuario,
} from '@/services/usuarioService'
import { Usuario } from '@/types/Usuario'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.method === 'GET') {
      const usuarios = await fetchAllUsuarios()
      return res.status(200).json(usuarios)
    }

    if (req.method === 'POST') {
      if (req.query.action === 'login') {
        const { email, password } = req.body
        const result = await loginUsuario(email, password)

        return res.status(200).json({ exito: true, ...result })
      }

      if (req.query.action === 'register') {
        const result = await registerUsuario(req.body)

        return res.status(201).json({
          exito: true,
          mensaje: 'Usuario registrado exitosamente',
          data: result,
        })
      }
    }

    if (req.method === 'PUT') {
      const user = req.body as Usuario
      const result = await updateUsuario(user)

      return res.status(200).json(result)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const result = await deleteUsuario(id as string)

      return res.status(200).json(result)
    }

    return res
      .status(405)
      .json({ exito: false, mensaje: 'Método no permitido' })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message,
    })
  }
}
