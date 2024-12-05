import Servicio from '@/models/Servicio'
import Interconsulta from '@/models/Interconsulta'
import { connectToDatabase } from '@/lib/db'

type InterconsultaDto = {
  estado: string
  prioridad: string
  servicio: string
  filterBy: string
}

type InterconsultaQuery = {
  estado?: string
  prioridad?: string
  servicioSolicitante?: { $ne: string } | { $eq: string }
  servicioDestino?: { $ne: string } | { $eq: string }
}

console.log(Servicio.db.model('Servicio', Servicio.schema))
export const getInterconsultas = async (fields: InterconsultaDto) => {
  await connectToDatabase()
  if (fields.filterBy === 'recibidas') {
    let query: InterconsultaQuery = {
      servicioDestino: { $eq: fields.servicio },
    }

    if (fields.estado) {
      query = { ...query, estado: fields.estado }
    }

    if (fields.prioridad) {
      query = { ...query, prioridad: fields.prioridad }
    }

    const result = Interconsulta.find(query)
      .populate('servicioSolicitante', 'nombre') //ref: 'Servicio'
      .populate('servicioDestino', 'nombre') //ref: 'Servicio'
      .sort({ fechaCreacion: -1 })

    return result
  }

  if (fields.filterBy === 'enviadas') {
    let query: InterconsultaQuery = {
      servicioSolicitante: { $eq: fields.servicio },
    }

    if (fields.estado) {
      query = { ...query, estado: fields.estado }
    }

    if (fields.prioridad) {
      query = { ...query, prioridad: fields.prioridad }
    }

    const result = Interconsulta.find(query)
      .populate('servicioSolicitante', 'nombre') //ref: 'Servicio'
      .populate('servicioDestino', 'nombre') //ref: 'Servicio'
      .sort({ fechaCreacion: -1 })

    return result
  }
}

export const createInterconsulta = async (data: any) => {
  const interconsulta = new Interconsulta(data)
  await interconsulta.save()

  return Interconsulta.findById(interconsulta._id)
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
}

export const getInterconsultasByService = async (
  serviceId: string,
  type: 'enviadas' | 'recibidas'
) => {
  const filterKey =
    type === 'enviadas' ? 'servicioSolicitante' : 'servicioDestino'
  return Interconsulta.find({ [filterKey]: serviceId })
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
    .sort({ fechaCreacion: -1 })
}

export const updateInterconsultaState = async (id: string, estado: string) => {
  await connectToDatabase()

  if (
    !['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'].includes(estado)
  ) {
    throw new Error('Estado no válido: ' + estado)
  }

  return Interconsulta.findByIdAndUpdate(
    id,
    { estado, fechaActualizacion: Date.now() },
    { new: true }
  )
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
}

export const addNoteToInterconsulta = async (id: string, nota: any) => {
  return Interconsulta.findByIdAndUpdate(
    id,
    {
      $push: {
        notas: nota,
        notificaciones: {
          mensaje: `Nueva nota agregada por ${nota.autor}`,
          fecha: new Date(),
        },
      },
      fechaActualizacion: Date.now(),
    },
    { new: true }
  )
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
    .populate('notas.servicio', 'nombre')
}

export const getInterconsultaById = async (id: string) => {
  return Interconsulta.findById(id)
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
}

export const searchInterconsultasByHistoryNumber = async (
  numeroHistoria: string
) => {
  return Interconsulta.find({ 'paciente.numeroHistoria': numeroHistoria })
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
    .sort({ fechaCreacion: -1 })
}

export const deleteInterconsulta = async (id: string) => {
  return Interconsulta.findByIdAndDelete(id)
}

