import mongoose, { Schema, Document } from 'mongoose'

interface Jefe {
  nombre: string
  email: string
  telefono: string
}

interface ServicioShema extends Document {
  nombre: string
  descripcion: string
  jefe: Jefe
  tipo: string
  activo: boolean
  createdAt: Date
}

const servicioSchema = new Schema<ServicioShema>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
    },
    jefe: {
      nombre: {
        type: String,
        required: [true, 'El nombre del jefe es requerido'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'El email del jefe es requerido'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Por favor ingresa un email válido',
        ],
      },
      telefono: {
        type: String,
        required: [true, 'El teléfono del jefe es requerido'],
      },
    },
    tipo: {
      type: String,
      required: [true, 'El tipo de servicio es requerido'],
    },
    activo: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'servicios',
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
)

servicioSchema.index({ nombre: 1 })
servicioSchema.index({ descripcion: 1 })

export const Servicio =
  (mongoose.models.Servicio as mongoose.Model<ServicioShema>) ||
  mongoose.model<ServicioShema>('Servicio', servicioSchema)

export default Servicio
