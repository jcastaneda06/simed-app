import { NextApiRequest, NextApiResponse } from 'next'
import {
  loginUsuario,
  registerUsuario,
  deactivateUsuario,
  reactivateUsuario,
  updateUsuario,
  fetchAllUsuarios,
} from '@/services/usuarioService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST':
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
        break

      case 'GET': {
        const usuarios = await fetchAllUsuarios()
        return res.status(200).json({ exito: true, usuarios })
      }

      case 'PATCH': {
        const { id } = req.query

        if (req.query.action === 'deactivate') {
          const result = await deactivateUsuario(id as string)
          return res
            .status(200)
            .json({ exito: true, mensaje: 'Usuario desactivado', data: result })
        } else if (req.query.action === 'reactivate') {
          const result = await reactivateUsuario(id as string)
          return res
            .status(200)
            .json({ exito: true, mensaje: 'Usuario reactivado', data: result })
        } else {
          const result = await updateUsuario(id as string, req.body)
          return res
            .status(200)
            .json({ exito: true, mensaje: 'Usuario actualizado', data: result })
        }
      }

      default:
        return res
          .status(405)
          .json({ exito: false, mensaje: 'Método no permitido' })
    }
  } catch (error: any) {
    console.error(error)
    console.log('aasdasdasdasd')
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message,
    })
  }
}
