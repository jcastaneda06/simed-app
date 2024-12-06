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
import Spinner from '@/components/spinner/Spinner'
const jwt = require('jsonwebtoken')

const Home: FC = () => {
  const { user, apiUrl, token } = useConfig()
  const decoded = jwt.decode(token)
  const { getServicios } = servicioEndpoints(apiUrl || '', token || '')
  const router = useRouter()
  const { getInterconsultas } = interconsultaEndpoints(
    apiUrl || '',
    token || ''
  )
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({
    estado: '',
    prioridad: '',
    idServicio: user?.servicio || '',
  })

  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ['getServicios', user],
    queryFn: () => getServicios(),
    enabled: decoded?.role === 'ADMIN',
  })

  const interconsultasEnviadasQuery = useQuery<Interconsulta[]>({
    queryKey: ['getInterconsultasEnviadas', filtros, user],
    queryFn: () => {
      let query = Object.keys(filtros)
        .map((key) => `${key}=${filtros[key]}`)
        .join('&')

      query += '&filterBy=enviadas'
      return getInterconsultas(query)
    },
    enabled: !!user?.servicio && !!filtros.idServicio,
  })

  const interconsultasRecibidasQuery = useQuery<Interconsulta[]>({
    queryKey: ['getInterconsultasRecibidas', filtros, user],
    queryFn: () => {
      let query = Object.keys(filtros)
        .map((key) => `${key}=${filtros[key]}`)
        .join('&')

      query += '&filterBy=recibidas'
      return getInterconsultas(query)
    },
    enabled: !!user?.servicio,
  })

  useEffect(() => {
    if (user) {
      setFiltros((prev) => ({
        ...prev,
        idServicio: user.servicio,
      }))
    }
  }, [user])

  if (
    interconsultasEnviadasQuery.isLoading ||
    interconsultasRecibidasQuery.isLoading
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    )
  }

  if (
    interconsultasEnviadasQuery.isError ||
    interconsultasRecibidasQuery.isError
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{'Error'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="container mx-auto p-0 md:p-4">
        <div className="mb-6 flex flex-wrap gap-4 relative">
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

          {decoded?.role === 'ADMIN' && (
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
                    {servicio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex flex-col gap-0 md:gap-6">
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
                      error={interconsultasEnviadasQuery.error ? 'Error' : ''}
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
                    error={interconsultasRecibidasQuery.error ? 'Error' : ''}
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
