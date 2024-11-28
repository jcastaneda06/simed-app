import Servicio from '@/models/Servicio' //Antes no estaba importado
import Usuario from '@/models/Usuario'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../lib/db'

// User Service Functions

const loginUsuario = async (email: string, password: string) => {
  await connectToDatabase()

  const usuario = await Usuario.findOne({ email })
    .select('+password')
    .populate('servicio')
  if (!usuario || !usuario.activo) {
    throw new Error('Credenciales inválidas')
  }

  const passwordValido = await usuario.compararPassword(password)
  if (!passwordValido) {
    throw new Error('Credenciales inválidas')
  }

  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  })

  return {
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      servicio: usuario.servicio,
      rol: usuario.rol,
    },
  }
}

const registerUsuario = async (data: any) => {
  await connectToDatabase()

  const usuarioExistente = await Usuario.findOne({ email: data.email })
  if (usuarioExistente) {
    throw new Error('El usuario ya existe')
  }

  const usuario = await Usuario.create(data)
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    servicio: usuario.servicio,
    rol: usuario.rol,
  }
}

const deactivateUsuario = async (id: string) => {
  await connectToDatabase()

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { activo: false },
    { new: true }
  )
  if (!usuario) {
    throw new Error('Usuario no encontrado')
  }

  return usuario
}

const reactivateUsuario = async (id: string) => {
  await connectToDatabase()

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { activo: true },
    { new: true }
  )
  if (!usuario) {
    throw new Error('Usuario no encontrado')
  }

  return usuario
}

const updateUsuario = async (id: string, updates: any) => {
  await connectToDatabase()

  const usuario = await Usuario.findByIdAndUpdate(id, updates, {
    new: true,
  }).populate('servicio')
  if (!usuario) {
    throw new Error('Usuario no encontrado')
  }

  return usuario
}

const fetchAllUsuarios = async () => {
  await connectToDatabase()

  const usuarios = await Usuario.find().populate('servicio').select('-password')
  return usuarios.map((usuario) => ({
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    servicio: usuario.servicio,
    rol: usuario.rol,
    activo: usuario.activo,
  }))
}

export {
  loginUsuario,
  registerUsuario,
  deactivateUsuario,
  reactivateUsuario,
  updateUsuario,
  fetchAllUsuarios,
}
