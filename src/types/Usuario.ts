export type Usuario = {
  _id?: string
  nombre: string
  password?: string
  email: string
  rol: string
  servicio: string
  activo?: boolean
  especialidad: string
  createdAt?: string
  updatedAt?: string
}

export type CreateUsuarioDto = {
  nombre: string
  password: string
  email: string
  rol: string
  servicio: string
}

export type LoginResult = {
  token: string
  usuario: Usuario
}
