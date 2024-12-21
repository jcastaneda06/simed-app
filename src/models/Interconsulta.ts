import { type Interconsulta as InterconsultaSchema } from '@/types/Interconsulta'
import mongoose from 'mongoose'

// Define the Interconsulta schema and model
const notaSchema = new mongoose.Schema({
  contenido: { type: String, required: true, trim: true },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true,
  },
  autor: { type: String, required: true, trim: true },
  fecha: { type: Date, default: Date.now },
})

const interconsultaSchema = new mongoose.Schema(
  {
    paciente: {
      nombre: { type: String, required: true, trim: true },
      edad: { type: Number, required: true },
      numeroHistoria: { type: String, required: true, unique: true },
    },
    servicioSolicitante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    servicioDestino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    objetivoConsulta: { type: String, required: true, trim: true },
    historiaClinica: { type: String, required: true, trim: true },
    estadoClinico: {
      subjetivo: { type: String, required: true, trim: true },
      signosVitales: {
        PresiónArterial: String,
        frecuenciaCardiaca: String,
        frecuenciaRespiratoria: String,
        temperatura: String,
        saturacionOxigeno: String,
      },
    },
    laboratorios: {
      fechaUltimos: Date,
      resultados: { type: String, required: true, trim: true },
      observaciones: { type: String, trim: true },
    },
    imagenologia: {
      fecha: Date,
      tipo: String,
      descripcion: { type: String, required: true, trim: true },
      hallazgosRelevantes: { type: String, required: true, trim: true },
    },
    antecedentesPersonales: { type: String, required: true, trim: true },
    antecedentesFamiliares: { type: String, required: true, trim: true },
    alergias: { type: String, default: 'Ninguna conocida', trim: true },
    medicamentos: {
      preHospitalarios: { type: String, default: 'Ninguno', trim: true },
      hospitalarios: { type: String, default: 'Ninguno', trim: true },
    },
    estado: {
      type: String,
      enum: ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'],
      default: 'PENDIENTE',
    },
    prioridad: {
      type: String,
      enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
      default: 'MEDIA',
    },
    notas: [notaSchema],
    notificaciones: [
      {
        mensaje: String,
        fecha: { type: Date, default: Date.now },
        leida: { type: Boolean, default: false },
      },
    ],
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now },
  },
  { collection: 'interconsultas' }
)

interconsultaSchema.index({ 'paciente.numeroHistoria': 1 })
interconsultaSchema.index({ estado: 1 })
interconsultaSchema.index({ prioridad: 1 })
interconsultaSchema.index({ fechaCreacion: -1 })
interconsultaSchema.index({ 'servicioSolicitante.nombre': 1 })
interconsultaSchema.index({ 'servicioDestino.nombre': 1 })

export const Interconsulta =
  (mongoose.models.Interconsulta as mongoose.Model<InterconsultaSchema>) ||
  mongoose.model<InterconsultaSchema>('Interconsulta', interconsultaSchema)

export default Interconsulta
