import { CreateUsuarioDto } from '@/types/Usuario'
import ConfigProvider from '@/config/ConfigProvider'

function userEndpoints() {
  const { apiUrl } = ConfigProvider()
  // Fetch all users
  async function fetchUsuarios() {
    const response = await fetch(`${apiUrl}/auth`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  }

  // Register a new user
  async function registerUsuario(data: CreateUsuarioDto) {
    const response = await fetch(`${apiUrl}/auth?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error('Failed to register user')
    }

    return response.json()
  }

  // Login a user
  async function loginUsuario(data: { email: string; password: string }) {
    const response = await fetch(`${apiUrl}/auth?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to login')
    }
    return response.json()
  }

  return {
    fetchUsuarios,
    registerUsuario,
    loginUsuario,
  }
}

export default userEndpoints
