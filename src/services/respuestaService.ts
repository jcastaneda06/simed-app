import { RespuestaInterconsulta as RespuestaInterconsultaModel } from '@/models/Respuesta'
import { RespuestaInterconsulta } from '@/types/Interconsulta'

export const responderInterconsulta = async (data: RespuestaInterconsulta) => {
  const respuesta = new RespuestaInterconsultaModel(data)
  await respuesta.save()

  return respuesta
}

export const getRespuestaByInterconsultaId = async (id: string) => {
  const respuesta = await RespuestaInterconsultaModel.findOne({
    interconsulta: id,
  })

  return respuesta
}
