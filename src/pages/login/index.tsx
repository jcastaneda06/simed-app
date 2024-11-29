import { useState } from 'react'
import { useRouter } from 'next/router'
import userEndpoints from '@/lib/endpoints/userEndpoints'
import { useMutation } from '@tanstack/react-query'
import { LoginResult, Usuario } from '@/types/Usuario'
import { useConfig } from '@/config/ConfigProvider'

type LoginCredentials = {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const { setToken, setUser, apiUrl } = useConfig()
  const { loginUsuario } = userEndpoints(apiUrl || '')
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loginMutation = useMutation<LoginResult, Error, LoginCredentials>({
    mutationKey: ['login', credentials],
    mutationFn: (payload) => loginUsuario(payload),
    onSuccess: () => router.push('/'),
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const response = await loginMutation.mutateAsync(credentials)

    const usuarioInfo: Usuario = {
      nombre: response.usuario.nombre,
      email: response.usuario.email,
      rol: response.usuario.rol,
      servicio: response.usuario.servicio,
      especialidad: response.usuario.especialidad,
    }

    localStorage.setItem('token', response.token)
    localStorage.setItem('usuario', JSON.stringify(usuarioInfo))
    setToken(response.token)
    setUser(usuarioInfo)

    // Redirigir al usuario
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Interconsultas
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingrese sus credenciales para acceder
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
