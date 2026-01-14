import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import userEndpoints from '@/lib/endpoints/userEndpoints'
import servicioEndpoints from '@/lib/endpoints/servicioEndpoints'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateUsuarioDto } from '@/types/Usuario'
import { Servicio } from '@/types/Servicio'
import { useConfig } from '@/config/ConfigProvider'
import { Lock, Mail, User, Briefcase, Shield } from 'lucide-react'
import { toast } from 'react-toastify'

const ROLES = [
  { value: 'medico', label: 'Médico' },
  { value: 'especialista', label: 'Especialista' },
  { value: 'admin', label: 'Administrador' },
]

export default function Registro() {
  const router = useRouter()
  const { apiUrl } = useConfig()
  const { registerUsuario } = userEndpoints(apiUrl || '')
  const { getServicios } = servicioEndpoints(apiUrl || '', '')

  const [formData, setFormData] = useState<CreateUsuarioDto>({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    servicio: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: servicios = [] } = useQuery<Servicio[]>({
    queryKey: ['servicios'],
    queryFn: getServicios,
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: (payload: CreateUsuarioDto) => registerUsuario(payload),
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente. Por favor inicie sesión.')
      router.push('/login')
    },
    onError: (error: Error) => {
      setError(error.message || 'Error al crear la cuenta')
      setLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!formData.rol) {
      setError('Por favor seleccione un rol')
      return
    }

    if (!formData.servicio) {
      setError('Por favor seleccione un servicio')
      return
    }

    setLoading(true)
    await registerMutation.mutateAsync(formData)
  }

  const updateField = (field: keyof CreateUsuarioDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-16 flex justify-center">
      <div className="flex flex-col gap-4 w-full md:w-96">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            SIMED
          </h2>
          <div className="text-gray-600 text-center mt-2 text-sm">
            <h3>Crear una cuenta</h3>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <User className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Nombre completo
              </span>
            </div>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <Mail className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Correo electrónico
              </span>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <Shield className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">Rol</span>
            </div>
            <select
              id="rol"
              name="rol"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              value={formData.rol}
              onChange={(e) => updateField('rol', e.target.value)}
            >
              <option value="">Seleccione un rol</option>
              {ROLES.map((rol) => (
                <option key={rol.value} value={rol.value}>
                  {rol.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <Briefcase className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Servicio
              </span>
            </div>
            <select
              id="servicio"
              name="servicio"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              value={formData.servicio}
              onChange={(e) => updateField('servicio', e.target.value)}
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio._id} value={servicio._id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <Lock className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Contraseña
              </span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <div>
                <Lock className="h-6 w-6 text-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Confirmar contraseña
              </span>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tiene una cuenta? </span>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
