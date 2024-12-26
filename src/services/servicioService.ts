import { connectToDatabase } from '@/lib/db'
import Servicio from '@/models/Servicio'

export const getAllServices = async () => {
  await connectToDatabase()
  const servicios = await Servicio.find({})
  return servicios
}

export const getServiceById = async (id: string) => {
  const servicio = await Servicio.findById(id)
  if (!servicio) {
    throw new Error('Servicio no encontrado')
  }
  return servicio
}

export const createService = async (data: any) => {
  const servicio = new Servicio(data)
  return await servicio.save()
}

export const updateService = async (id: string, data: any) => {
  const servicio = await Servicio.findByIdAndUpdate(id, data, {
    new: true,
  })
  if (!servicio) {
    throw new Error('Servicio no encontrado')
  }
  return servicio
}

export const deleteService = async (id: string) => {
  const servicio = await Servicio.findByIdAndDelete(id)
  if (!servicio) {
    throw new Error('Servicio no encontrado')
  }
  return servicio
}

export const searchServicesByName = async (name: string) => {
  return await Servicio.find({
    nombre: { $regex: name, $options: 'i' },
  }).sort('nombre')
}

export const addBulkServices = async (services: any[]) => {
  return await Servicio.insertMany(services)
}
