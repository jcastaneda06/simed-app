import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import userEndpoints from '@/lib/endpoints/userEndpoints'
import { useMutation } from '@tanstack/react-query'
import { LoginResult, Usuario } from '@/types/Usuario'
import { useConfig } from '@/config/ConfigProvider'
import { Lock, Mail } from 'lucide-react'
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
    toast.info(`Bienvenid@ ${response.usuario.nombre}!`)
    // Redirigir al usuario
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background p-4 pt-32 flex justify-center">
      <div className="flex flex-col gap-4 w-full md:w-96">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">SIMED</CardTitle>
            <CardDescription>Sistema de Interconsultas Médicas</CardDescription>
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
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
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
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">
                ¿No tiene una cuenta?{' '}
              </span>
              <Link
                href="/registro"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Registrarse
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
