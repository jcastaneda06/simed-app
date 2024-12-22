import mongoose from 'mongoose'
const { Schema } = mongoose

interface DepartamentoType extends Document {
  _id: string
  nombre: string
  servicios: string[]
}

const DepartamentoSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    nombre: String,
    servicios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
      },
    ],
  },
  { collection: 'departamentos' }
)

export const Departamento =
  (mongoose.models.Departamento as mongoose.Model<DepartamentoType>) ||
  mongoose.model<DepartamentoType>('Departamento', DepartamentoSchema)
