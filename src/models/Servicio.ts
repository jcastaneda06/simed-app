import mongoose, { Schema, Document } from 'mongoose'

interface Jefe {
  nombre: string
  email: string
  telefono: string
}

export interface Servicio extends Document {
  nombre: string
  descripcion: string
  jefe: Jefe
  tipo: string
  activo: boolean
  createdAt: Date
}

const serviceSchema = new Schema<Servicio>(
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
      enum: [
        'MEDICINA_INTERNA',
        'CIRUGIA',
        'PEDIATRIA',
        'GINECOLOGIA',
        'CARDIOLOGIA',
        'NEUROLOGIA',
        'TRAUMATOLOGIA',
        'PSIQUIATRIA',
      ],
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
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
)

// Export the model or retrieve it if it already exists (to prevent re-compilation issues)
const Servicio =
  mongoose.models.Servicio ||
  mongoose.model<Servicio>('Servicio', serviceSchema)
export default Servicio
