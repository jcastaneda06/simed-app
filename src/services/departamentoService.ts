import { connectToDatabase } from '@/lib/db'
import { Departamento } from '@/models/Departamento'
import Servicio from '@/models/Servicio'
import { Deparatamento as DepartamentoType } from '@/types/Deparatamento'
import mongoose from 'mongoose'

console.log('Departamento', Departamento)
export const getDepartamentos = async () => {
  const departamentos = await Departamento.find()
  return departamentos
}

export const addDepartamento = async (departamento: DepartamentoType) => {
  const _id = new mongoose.Types.ObjectId()
  departamento._id = _id.toString()

  const nuevoDepartamento = new Departamento(departamento)
  await nuevoDepartamento.save()
  return nuevoDepartamento
}

export const addBulkDepartamentos = async (
  departamentos: DepartamentoType[]
) => {
  await connectToDatabase()
  const departamentosConId = departamentos.map((departamento) => {
    const _id = new mongoose.Types.ObjectId()
    departamento._id = _id.toString()
    return departamento
  })

  const result = await Departamento.insertMany(departamentosConId)
  return result
}

export const addBulkServiciosToDepartamento = async (
  departamentoId: string,
  serviciosId: string[]
) => {
  Departamento.updateMany({}, { $unset: { especialidades: '' } })
  const departamento = await Departamento.findById(departamentoId).populate({
    path: 'servicios',
    strictPopulate: false,
  })

  console.log(departamento)

  // if (departamento) {
  //   serviciosId.forEach(async (servicioId) => {
  //     const servicio = await Servicio.findById(servicioId)
  //     if (servicio) {
  //       departamento.servicios.push(servicioId)
  //     }
  //   })
  // }
  return departamento
}
