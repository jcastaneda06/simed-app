import { type RespuestaInterconsulta as Respuesta } from '@/types/Interconsulta'
import mongoose from 'mongoose'

const respuestaSchema = new mongoose.Schema(
  {
    interconsulta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interconsulta',
      required: true,
    },
    respuesta: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const RespuestaInterconsulta =
  (mongoose.models.RespuestaInterconsulta as mongoose.Model<Respuesta>) ||
  mongoose.model<Respuesta>('RespuestaInterconsulta', respuestaSchema)

export default RespuestaInterconsulta
