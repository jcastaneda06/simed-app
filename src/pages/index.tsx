import { useState, useEffect, FC } from 'react'
import { Activity, AlertTriangle, FileCheck, HeartPulse } from 'lucide-react'
import { Select, SelectItem } from '@/components/select/Select'
import { Usuario } from '@/types/Usuario'
import { Interconsulta } from '@/types/Interconsulta'
import { Servicio } from '@/types/Servicio'
import InterconsultaCard from '@/components/interconsulta-card/InterconsultaCard'
import { useQuery } from '@tanstack/react-query'
import servicioEndpoints from '@/lib/endpoints/servicioEndpoints'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import CollapsibleSection from '@/components/collapsible-section/CollapsibleSection'
import { useConfig } from '@/config/ConfigProvider'
import Spinner from '@/components/spinner/Spinner'
const jwt = require('jsonwebtoken')

const Home: FC = () => {
  const { user, apiUrl, token } = useConfig()
  const decoded = jwt.decode(token)
  const { getServicios } = servicioEndpoints(apiUrl || '', token || '')
  const { getInterconsultas } = interconsultaEndpoints(
    apiUrl || '',
    token || ''
  )
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    idServicio: '',
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
        .map((key) => `${key}=${filtros[key as keyof typeof filtros]}`)
        .join('&')

      query += '&filterBy=enviadas'
      return getInterconsultas(query)
    },
  })

  const interconsultasRecibidasQuery = useQuery<Interconsulta[]>({
    queryKey: ['getInterconsultasRecibidas', filtros, user],
    queryFn: () => {
      let query = Object.keys(filtros)
        .map((key) => `${key}=${filtros[key as keyof typeof filtros]}`)
        .join('&')

      query += '&filterBy=recibidas'
      return getInterconsultas(query)
    },
  })

  useEffect(() => {
    if (user && decoded?.role !== 'ADMIN') {
      setFiltros((prev) => ({
        ...prev,
        idServicio: user.servicio,
      }))
    }
  }, [user])

  const handleSetFilters = (key: string, value: string) => {
    setFiltros((prev) => ({
      ...prev,
      [key]: value === 'todos' ? '' : value,
    }))
  }

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
        <div className="mb-6 flex gap-4 mx-4 md:mx-0">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-start items-center gap-2">
              <FileCheck className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Estado</span>
            </div>
            <Select
              value={filtros.estado}
              onChange={(e) => handleSetFilters('estado', e.target.value)}
            >
              <SelectItem value="todos" selected={filtros.estado === ''}>
                Todos
              </SelectItem>
              <SelectItem value="PENDIENTE">Pendientes</SelectItem>
              <SelectItem value="EN_PROCESO">En proceso</SelectItem>
              <SelectItem value="COMPLETADA">Completadas</SelectItem>
              <SelectItem value="CANCELADA">Canceladas</SelectItem>
            </Select>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-start items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Prioridad</span>
            </div>
            <Select
              value={filtros.prioridad}
              onChange={(e) => handleSetFilters('prioridad', e.target.value)}
            >
              <SelectItem value="todos" selected={filtros.prioridad === ''}>
                Todas
              </SelectItem>
              <SelectItem value="BAJA">Baja</SelectItem>
              <SelectItem value="MEDIA">Media</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
            </Select>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-start items-center gap-2">
              <HeartPulse className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Servicio</span>
            </div>
            {decoded?.role === 'ADMIN' && (
              <Select
                value={filtros.idServicio}
                onChange={(e) => handleSetFilters('idServicio', e.target.value)}
              >
                <SelectItem value="todos" selected={filtros.idServicio === ''}>
                  Todos
                </SelectItem>
                {serviciosQuery.data?.map((servicio) => (
                  <SelectItem key={servicio._id} value={servicio._id}>
                    {servicio.nombre}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
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
