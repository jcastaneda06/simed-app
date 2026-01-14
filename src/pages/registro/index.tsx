import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    <div className="min-h-screen bg-background p-4 pt-16 flex justify-center">
      <div className="flex flex-col gap-4 w-full md:w-96">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">SIMED</CardTitle>
            <CardDescription>Crear una cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="nombre"
                  className="flex items-center gap-2 text-foreground"
                >
                  <User className="h-5 w-5 text-primary" />
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-foreground"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  Rol
                </Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value) => updateField('rol', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((rol) => (
                      <SelectItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Servicio
                </Label>
                <Select
                  value={formData.servicio}
                  onValueChange={(value) => updateField('servicio', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicios.map((servicio) => (
                      <SelectItem key={servicio._id} value={servicio._id}>
                        {servicio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-foreground"
                >
                  <Lock className="h-5 w-5 text-primary" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2 text-foreground"
                >
                  <Lock className="h-5 w-5 text-primary" />
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">
                ¿Ya tiene una cuenta?{' '}
              </span>
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
