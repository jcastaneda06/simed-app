import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: 6,
      select: false,
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    rol: {
      type: String,
      enum: ['MEDICO', 'JEFE_SERVICIO', 'ADMIN'],
      default: 'MEDICO',
    },
    activo: { type: Boolean, default: true },
    ultimoAcceso: Date,
  },
  { timestamps: true }
)

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

usuarioSchema.methods.compararPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

const Usuario =
  mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema)

export default Usuario
