import { Servicio } from './Servicio'

export type Interconsulta = {
  _id?: string
  paciente: {
    nombre: string
    edad: number
    prioridad: string
    numeroHistoria: string
  }
  servicioSolicitante: Servicio
  servicioDestino: Servicio
  objetivoConsulta: string
  historiaClinica: string
  estadoClinico: {
    subjetivo: string
    signosVitales: SignosVitales
  }
  laboratorios: Laboratorio
  imagenologia: Imagenologia
  antecedentesPersonales: string
  antecedentesFamiliares: string
  alergias: string
  medicamentos: {
    preHospitalarios: string
    hospitalarios: string
  }
  estado?: string
  prioridad: string
  fechaCreacion?: string
  fechaActualizacion?: string
  notas?: Nota[]
  notificaciones?: Notification[]
}

export type SignosVitales = {
  presionArterial: string
  frecuenciaCardiaca: string
  frecuenciaRespiratoria: string
  temperatura: number
  saturacionOxigeno: string
}

export type Laboratorio = {
  tipo: string
  fechaUltimos: string
  resultados: string
  observaciones: string
}

export type Imagenologia = {
  tipo: string
  fecha?: string
  descripcion: string
  hallazgosRelevantes: string
}

export type Nota = {
  _id?: string
  conteindo: string
  servicio: string
  autor: string
  fecha: string
}

export type Notificacion = {
  _id?: string
  mensaje: string
  fecha: string
  leida: boolean
}
