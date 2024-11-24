export type Servicio = {
  _id: string
  nombre: string
  descripcion: string
  jefe: Jefe
  tipo: string
  activo: boolean
  createdAt: string
}

export type Jefe = {
  nombre: string
  email: string
  telefono: string
}
