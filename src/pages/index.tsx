import { useState, useEffect, FC, useRef } from 'react'
import {
  Activity,
  AlertTriangle,
  FileCheck,
  Filter,
  HeartPulse,
} from 'lucide-react'
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
import departamentoEndpoints from '@/lib/endpoints/departamentoEndpoints'
import { Deparatamento } from '@/types/Deparatamento'
import normalizeText from '@/helpers/normalizeText'
import InterconsultaFilters from '@/components/interconsulta-filters/InterconsultaFIlters'
import { Button } from '@/components/button/Button'
const jwt = require('jsonwebtoken')

const Home: FC = () => {
  const { user, apiUrl, token } = useConfig()
  const decoded = jwt.decode(token)
  const { getServicios } = servicioEndpoints(apiUrl || '', token || '')
  const { getDepartamentos } = departamentoEndpoints(apiUrl || '', token || '')
  const { getInterconsultas } = interconsultaEndpoints(
    apiUrl || '',
    token || ''
  )
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    idServicio: '',
  })

  const [searchFilter, setSearchFilter] = useState('')
  const [searchFilterBy, setSearchFilterBy] = useState<
    'servicio' | 'departamento'
  >('servicio')

  const [abierto, setAbierto] = useState(false)

  const handleInputClick = () => {
    setAbierto(true)
  }

  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ['getServicios', user],
    queryFn: () => getServicios(),
    enabled: decoded?.role === 'ADMIN',
  })

  const departamentosQuery = useQuery<Deparatamento[]>({
    queryKey: ['getDepartamentos', user],
    queryFn: () => getDepartamentos(),
    enabled: decoded?.role === 'ADMIN' && serviciosQuery.isSuccess,
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

  // useEffect(() => {
  //   if (!('Notification' in window)) {
  //     alert('This browser does not support desktop notification')
  //   } else if (Notification.permission === 'granted') {
  //     const notification = new Notification('Nueva interconsulta', {
  //       body: 'Se ha creado una nueva interconsulta',
  //     })
  //     // …
  //   } else if (Notification.permission !== 'denied') {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         const notification = new Notification('Nueva interconsulta', {
  //           body: 'Se ha creado una nueva interconsulta',
  //         })
  //       }
  //     })
  //   }
  // }, [])

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

  const handleSetSearchFilteryBy = (value: 'servicio' | 'departamento') => {
    setSearchFilterBy(value)
  }

  const getServiceDepartamento = (serviceId: string) => {
    const servicio = serviciosQuery.data?.find((s) => s._id === serviceId)
    const departamento = departamentosQuery.data?.find((d) =>
      d.servicios.includes(serviceId)
    )

    if (!servicio || !departamento) return null
    return (
      <>
        <span>{servicio.nombre}</span> -{' '}
        <span className=" text-gray-400">{departamento.nombre}</span>
      </>
    )
  }

  const filterByServicio = () => {
    const filteredServicio =
      searchFilter.length === 0
        ? serviciosQuery.data
        : serviciosQuery.data?.filter((servicio) =>
            normalizeText(servicio.nombre)
              .toLowerCase()
              .startsWith(normalizeText(searchFilter.toLowerCase()))
          )

    if (filteredServicio?.length === 0) return <div>No hay resultados</div>

    const filteredElement = (
      <div className="absolute top-2 shadow-md flex flex-col bg-white border border-gray-200 w-full z-10 rounded-md max-h-56 overflow-auto text-ellipsis">
        {filteredServicio?.map((servicio) => (
          <button
            key={servicio._id}
            onClick={() => handleSetFilters('idServicio', servicio._id)}
            className="text-left text-sm text-gray-600 hover:bg-gray-100 p-2"
          >
            {getServiceDepartamento(servicio._id)}
          </button>
        ))}
      </div>
    )

    return filteredElement
  }

  const filterByDepartamento = () => {
    const filteredDepartamento =
      searchFilter.length === 0
        ? serviciosQuery.data
        : serviciosQuery.data?.filter((servicio) =>
            departamentosQuery.data
              ?.find((d) =>
                normalizeText(d.nombre)
                  .toLowerCase()
                  .startsWith(normalizeText(searchFilter.toLowerCase()))
              )
              ?.servicios.includes(servicio._id)
          )

    if (filteredDepartamento?.length === 0)
      return (
        <div className="text-sm text-gray-600 p-2 text-center">
          No hay resultados
        </div>
      )

    const filteredElement = (
      <div className="absolute top-2 shadow-md flex flex-col bg-white border border-gray-200 w-full z-10 rounded-md max-h-56 overflow-auto text-ellipsis">
        {filteredDepartamento?.map((servicio) => (
          <button
            key={servicio._id}
            onClick={() => handleSetFilters('idServicio', servicio._id)}
            className="text-left text-sm text-gray-600 hover:bg-gray-100 p-2"
          >
            {getServiceDepartamento(servicio._id)}
          </button>
        ))}
      </div>
    )

    return filteredElement
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
    <div className="min-h-scree bg-gray-50 text-gray-600">
      <div className="flex flex-col mx-auto p-0 md:p-4">
        <InterconsultaFilters
          abierto={abierto}
          setAbierto={setAbierto}
          handleInputClick={handleInputClick}
          filtros={filtros}
          setFiltros={handleSetFilters}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          searchFilterBy={searchFilterBy}
          setSearchFilterBy={handleSetSearchFilteryBy}
          filterByServicio={filterByServicio}
          filterByDepartamento={filterByDepartamento}
        />
        <div className="flex flex-col gap-0 md:gap-6 mt-4">
          <CollapsibleSection
            title="Interconsultas Enviadas"
            count={interconsultasEnviadasQuery.data?.length || 0}
          >
            {interconsultasEnviadasQuery.data?.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas enviadas para mostrar
              </div>
            ) : (
              interconsultasEnviadasQuery.data?.map((interconsulta) =>
                interconsulta ? (
                  <InterconsultaCard
                    key={interconsulta._id}
                    interconsulta={interconsulta}
                    onStatusChange={() => interconsultasEnviadasQuery.refetch()}
                    loading={interconsultasEnviadasQuery.isLoading}
                    error={interconsultasEnviadasQuery.error ? 'Error' : ''}
                    interconsultasEnviadas={interconsultasEnviadasQuery.data}
                    interconsultasRecibidas={
                      interconsultasRecibidasQuery.data || []
                    }
                  />
                ) : null
              )
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
