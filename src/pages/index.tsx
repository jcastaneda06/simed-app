import { useState, useEffect, FC, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select/Select'
import { Usuario } from '@/types/Usuario'
import { Interconsulta } from '@/types/Interconsulta'
import { Servicio } from '@/types/Servicio'
import InterconsultaCard from '@/components/interconsulta-card/InterconsultaCard'

type CollapsibleSectionProps = {
  title: string
  count: number
}

const CollapsibleSection: FC<PropsWithChildren<CollapsibleSectionProps>> = ({
  title,
  count,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <button
        className="w-full px-4 py-3 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {count}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  )
}

const VerInterconsultas = () => {
  const router = useRouter()
  const [interconsultasEnviadas, setInterconsultasEnviadas] = useState<
    Interconsulta[]
  >([])
  const [interconsultasRecibidas, setInterconsultasRecibidas] = useState<
    Interconsulta[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    servicio: '',
  })

  const fetchServicios = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/servicios`

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          'Error al cargar servicios:',
          response.status,
          response.statusText,
          errorText
        )
        throw new Error('Error al cargar servicios')
      }

      const data = await response.json()
      if (data.exito) {
        setServicios(data.data)
      }
    } catch (error: any) {
      console.error('Error fetching servicios:', error)
      setError(error.message || 'Error al cargar servicios')
    }
  }

  const fetchInterconsultas = async () => {
    try {
      const token = window.localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      setLoading(true)

      let query = ``
      if (filtros.estado) query += `estado=${filtros.estado}`
      if (filtros.prioridad) query += `prioaridad=${filtros.estado}`
      if (filtros.servicio) query += `servicio=${filtros.servicio}`

      const responseEnviadas = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/filtrar?${query}&tipoFiltro=enviadas&idServicio=${usuario?.servicio}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Fetch recibidas - solo las del servicio del usuario como destino
      const responseRecibidas = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/filtrar?${query}&tipoFiltro=recibidas&idServicio=${usuario?.servicio}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // if (!responseEnviadas.ok || !responseRecibidas.ok) {
      //   throw new Error('Error en la respuesta del servidor');
      // }

      const dataEnviadas = await responseEnviadas.json()
      const dataRecibidas = await responseRecibidas.json()

      console.log(dataEnviadas, dataRecibidas)

      setInterconsultasEnviadas(
        Array.isArray(dataEnviadas.data) ? dataEnviadas.data : []
      )
      setInterconsultasRecibidas(
        Array.isArray(dataRecibidas.data) ? dataRecibidas.data : []
      )
      setError(undefined)
    } catch (err: any) {
      console.error('Error fetching interconsultas:', err)
      setError(err.message || 'Error al cargar las interconsultas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado)
        setUsuario(usuarioData)
        if (usuarioData.rol === 'ADMIN') {
          fetchServicios()
        }
      } catch (error) {
        console.error('Error al procesar datos del usuario:', error)
        setError('Error al cargar la información del usuario')
      }
    } else {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    if (usuario) {
      fetchInterconsultas()
    }
  }, [filtros, usuario])

  if (
    loading &&
    interconsultasEnviadas.length === 0 &&
    interconsultasRecibidas.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center py-6">Cargando interconsultas...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-4 relative z-50">
          <Select
            value={filtros.estado}
            onValueChange={(value) =>
              setFiltros((prev) => ({
                ...prev,
                estado: value === 'todos' ? '' : value,
              }))
            }
          >
            <SelectTrigger className="w-[200px] bg-white border-gray-200">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent
              className="bg-white border border-gray-200 shadow-lg"
              style={{ backgroundColor: 'white' }}
            >
              <SelectItem
                value="todos"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Mostrar Todo
              </SelectItem>
              <SelectItem
                value="PENDIENTE"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Pendiente
              </SelectItem>
              <SelectItem
                value="EN_PROCESO"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                En Proceso
              </SelectItem>
              <SelectItem
                value="COMPLETADA"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Completada
              </SelectItem>
              <SelectItem
                value="CANCELADA"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Cancelada
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filtros.prioridad}
            onValueChange={(value) =>
              setFiltros((prev) => ({
                ...prev,
                prioridad: value === 'todos' ? '' : value,
              }))
            }
          >
            <SelectTrigger className="w-[200px] bg-white border-gray-200">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent
              className="bg-white border border-gray-200 shadow-lg"
              style={{ backgroundColor: 'white' }}
            >
              <SelectItem
                value="todos"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Mostrar Todo
              </SelectItem>
              <SelectItem
                value="ALTA"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Alta
              </SelectItem>
              <SelectItem
                value="MEDIA"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Media
              </SelectItem>
              <SelectItem
                value="BAJA"
                className="text-gray-900 hover:bg-gray-100 bg-white"
              >
                Baja
              </SelectItem>
            </SelectContent>
          </Select>

          {usuario?.rol === 'ADMIN' && (
            <Select
              value={filtros.servicio}
              onValueChange={(value) =>
                setFiltros((prev) => ({
                  ...prev,
                  servicio: value === 'todos' ? '' : value,
                }))
              }
            >
              <SelectTrigger className="w-[200px] bg-white border-gray-200">
                <SelectValue placeholder="Servicio" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border border-gray-200 shadow-lg"
                style={{ backgroundColor: 'white' }}
              >
                <SelectItem
                  value="todos"
                  className="text-gray-900 hover:bg-gray-100 bg-white"
                >
                  Mostrar Todo
                </SelectItem>
                {servicios.map((servicio) => (
                  <SelectItem
                    key={servicio._id}
                    value={servicio._id}
                    className="text-gray-900 hover:bg-gray-100 bg-white"
                  >
                    {/* {servicio.nombre} */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="relative z-0 space-y-6">
          <CollapsibleSection
            title="Interconsultas Enviadas"
            count={interconsultasEnviadas.length}
          >
            {interconsultasEnviadas.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas enviadas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasEnviadas.map((interconsulta) =>
                  interconsulta ? (
                    <InterconsultaCard
                      key={interconsulta._id}
                      interconsulta={interconsulta}
                      onStatusChange={fetchInterconsultas}
                      loading={loading}
                      error={error || ''}
                      interconsultasEnviadas={interconsultasEnviadas}
                      interconsultasRecibidas={interconsultasRecibidas}
                    />
                  ) : null
                )}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Interconsultas Recibidas"
            count={interconsultasRecibidas.length}
          >
            {interconsultasRecibidas.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas recibidas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasRecibidas.map((interconsulta) => (
                  <InterconsultaCard
                    key={interconsulta._id}
                    interconsulta={interconsulta}
                    onStatusChange={fetchInterconsultas}
                    loading={loading}
                    error={error || ''}
                    interconsultasEnviadas={interconsultasEnviadas}
                    interconsultasRecibidas={interconsultasRecibidas}
                  />
                ))}
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  )
}

export default VerInterconsultas
