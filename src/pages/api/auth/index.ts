import { NextApiRequest, NextApiResponse } from 'next'
import {
  loginUsuario,
  registerUsuario,
  deactivateUsuario,
  updateUsuario,
  fetchAllUsuarios,
} from '@/services/usuarioService'
import { runCors } from '@/lib/cors'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runCors(req, res)
    if (req.method === 'OPTIONS') {
      await runCors(req, res)
      return res.status(200).end()
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

    if (req.method === 'GET') {
      const usuarios = await fetchAllUsuarios()
      return res.status(200).json(usuarios)
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
