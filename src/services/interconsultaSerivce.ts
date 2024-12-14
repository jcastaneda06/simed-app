import Servicio from '@/models/Servicio'
import Interconsulta from '@/models/Interconsulta'

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

console.log('Servicio', Servicio)
export const getInterconsultas = async (fields: InterconsultaDto) => {
  try {
    if (fields.filterBy === 'recibidas') {
      let query: InterconsultaQuery = {}

      if (fields.servicio !== '') {
        query = { ...query, servicioDestino: { $eq: fields.servicio } }
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
      let query: InterconsultaQuery = {}

      if (fields.servicio !== '') {
        query = { ...query, servicioSolicitante: { $eq: fields.servicio } }
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
  } catch (err: any) {
    console.error(err.message)
  }
}

export const createInterconsulta = async (data: any) => {
  try {
    const interconsulta = new Interconsulta(data)
    await interconsulta.save()

    return Interconsulta.findById(interconsulta._id)
      .populate('servicioSolicitante', 'nombre')
      .populate('servicioDestino', 'nombre')
  } catch (err: any) {
    console.error(err.message)
  }
}

export const getInterconsultasByService = async (
  serviceId: string,
  type: 'enviadas' | 'recibidas'
) => {
  try {
    const filterKey =
      type === 'enviadas' ? 'servicioSolicitante' : 'servicioDestino'
    return Interconsulta.find({ [filterKey]: serviceId })
      .populate('servicioSolicitante', 'nombre')
      .populate('servicioDestino', 'nombre')
      .sort({ fechaCreacion: -1 })
  } catch (err: any) {
    console.error(err.message)
  }
}

export const updateInterconsultaState = async (id: string, estado: string) => {
  try {
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
  } catch (err: any) {
    console.error(err.message)
  }
}

export const addNoteToInterconsulta = async (id: string, nota: any) => {
  try {
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
  } catch (err: any) {
    console.error(err.message)
  }
}

export const getInterconsultaById = async (id: string) => {
  try {
    return Interconsulta.findById(id)
      .populate('servicioSolicitante', 'nombre')
      .populate('servicioDestino', 'nombre')
  } catch (err: any) {
    console.error(err.message)
  }
}

export const searchInterconsultasByHistoryNumber = async (
  numeroHistoria: string
) => {
  try {
    return Interconsulta.find({ 'paciente.numeroHistoria': numeroHistoria })
      .populate('servicioSolicitante', 'nombre')
      .populate('servicioDestino', 'nombre')
      .sort({ fechaCreacion: -1 })
  } catch (err: any) {
    console.error(err.message)
  }
}

export const deleteInterconsulta = async (id: string) => {
  try {
    return Interconsulta.findByIdAndDelete(id)
  } catch (err: any) {
    console.error(err.message)
  }
}
