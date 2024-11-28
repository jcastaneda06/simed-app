import { useState, useEffect, FC } from 'react'
import { AlertTriangle } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'
import servicioEndpoints from '@/lib/endpoints/servicioEndpoints'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import CollapsibleSection from '@/components/collapsible-section/CollapsibleSection'
import { useConfig } from '@/config/ConfigProvider'
import { useRouter } from 'next/router'

const Home: FC = () => {
  const { userState } = useConfig()
  const { user } = userState
  const { getServicios } = servicioEndpoints()
  const router = useRouter()
  const { getInterconsultasEnviadas, getInterconsultasRecibidas } =
    interconsultaEndpoints()
  const [error, setError] = useState<string | undefined>(undefined)
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({
    estado: '',
    prioridad: '',
    servicio: '',
  })

  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ['getServicios', user],
    queryFn: () => getServicios(),
    enabled: user?.rol === 'ADMIN',
  })

  const interconsultasEnviadasQuery = useQuery<Interconsulta[]>({
    queryKey: ['getInterconsultasEnviadas', filtros, user],
    queryFn: () => {
      const query = Object.keys(filtros)
        .map((key) => `${key}=${filtros[key]}`)
        .join('&')

      return getInterconsultasEnviadas(query, user!)
    },
    enabled: !!user,
  })

  const interconsultasRecibidasQuery = useQuery<Interconsulta[]>({
    queryKey: ['getInterconsultasRecibidas', filtros, user],
    queryFn: () => {
      const query = Object.keys(filtros)
        .map((key) => `${key}=${filtros[key]}`)
        .join('&')

      return getInterconsultasRecibidas(query, user!)
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [])

  if (
    interconsultasEnviadasQuery.isLoading ||
    interconsultasRecibidasQuery.isLoading
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

          {user?.rol === 'ADMIN' && (
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
                {serviciosQuery.data?.map((servicio) => (
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
            count={interconsultasEnviadasQuery.data?.length || 0}
          >
            {interconsultasEnviadasQuery.data?.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas enviadas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasEnviadasQuery.data?.map((interconsulta) =>
                  interconsulta ? (
                    <InterconsultaCard
                      key={interconsulta._id}
                      interconsulta={interconsulta}
                      onStatusChange={() =>
                        interconsultasEnviadasQuery.refetch()
                      }
                      loading={interconsultasEnviadasQuery.isLoading}
                      error={error || ''}
                      interconsultasEnviadas={interconsultasEnviadasQuery.data}
                      interconsultasRecibidas={
                        interconsultasRecibidasQuery.data || []
                      }
                    />
                  ) : null
                )}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Interconsultas Recibidas"
            count={interconsultasRecibidasQuery.data?.length || 0}
          >
            {interconsultasRecibidasQuery.data?.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas recibidas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasRecibidasQuery.data?.map((interconsulta) => (
                  <InterconsultaCard
                    key={interconsulta._id}
                    interconsulta={interconsulta}
                    onStatusChange={() =>
                      interconsultasRecibidasQuery.refetch()
                    }
                    loading={interconsultasRecibidasQuery.isLoading}
                    error={error || ''}
                    interconsultasEnviadas={
                      interconsultasEnviadasQuery.data || []
                    }
                    interconsultasRecibidas={interconsultasRecibidasQuery.data}
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

export default Home
