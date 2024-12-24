import { NextApiRequest, NextApiResponse } from 'next'
import { registerUsuario } from '@/services/usuarioService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    const user = req.body
    const usuario = await registerUsuario(user)
    return res.status(200).json(usuario)
  }

  return res.status(400).json({ error: 'Ocurrio un error en el servidor' })
}
