import Interconsulta from '@/models/Interconsulta'

export const filterInterconsultas = async (filters: any) => {
  const { estado, prioridad, servicio, tipoFiltro } = filters
  const query: any = {}

  if (estado) query.estado = estado
  if (prioridad) query.prioridad = prioridad
  if (servicio) {
    query.$or = [
      { servicioSolicitante: servicio },
      { servicioDestino: servicio },
    ]
  }

  return Interconsulta.find(query)
    .populate('servicioSolicitante', 'nombre')
    .populate('servicioDestino', 'nombre')
    .sort({ fechaCreacion: -1 })
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
  if (
    !['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'].includes(estado)
  ) {
    throw new Error('Estado no válido')
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
