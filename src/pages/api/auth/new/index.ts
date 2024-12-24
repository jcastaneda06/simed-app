import { NextApiRequest, NextApiResponse } from 'next'
import { runCors } from '@/lib/cors'
import { registerUsuario } from '@/services/usuarioService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('method', req.method)

  if (req.method === 'OPTIONS') {
    await runCors(req, res)
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    await runCors(req, res)
    const user = req.body
    const usuario = await registerUsuario(user)
    return res.status(200).json(usuario)
  }

  return res.status(400).json({ error: 'Ocurrio un error en el servidor' })
}
