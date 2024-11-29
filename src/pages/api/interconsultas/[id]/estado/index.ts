import { updateInterconsultaState } from '@/services/interconsultaSerivce'
import { NextApiRequest, NextApiResponse } from 'next'

interface EstadoReq extends NextApiRequest {
  query: {
    id: string
  }
}

export default async function handler(req: EstadoReq, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query
    const { estado } = JSON.parse(req.body)
    console.log(estado, req.body)
    // Update the interconsulta with the new estado
    const updatedInterconsulta = await updateInterconsultaState(id, estado)

    return res.status(200).json(updatedInterconsulta)
  }
}
