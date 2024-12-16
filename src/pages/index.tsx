import { useState, useEffect, FC, useRef } from 'react'
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
import TextField from '@/components/text-field/TextField'
import departamentoEndpoints from '@/lib/endpoints/departamentoEndpoints'
import { Deparatamento } from '@/types/Deparatamento'
import normalizeText from '@/helpers/normalizeText'
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
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verifica si el click fue fuera del contenedor
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setAbierto(false)
      }
    }

    // Agregamos el listener al hacer mount
    document.addEventListener('mousedown', handleClickOutside)

    // Removemos el listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <div className="min-h-screen text-black bg-gray-50">
      <div className="container mx-auto p-0 md:p-4">
        <div className="md:hidden flex flex-col gap-2 px-4 mb-4">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Servicio</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="servicio"
                  name="searchByMobile"
                  value="servicio"
                  checked={searchFilterBy === 'servicio'}
                  onChange={() => handleSetSearchFilteryBy('servicio')}
                />
                <label htmlFor="servicio" className="text-gray-500 text-sm">
                  Servicio
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="departamento"
                  name="searchByMobile"
                  value="departamento"
                  checked={searchFilterBy === 'departamento'}
                  onChange={() => handleSetSearchFilteryBy('departamento')}
                />
                <label htmlFor="departamento" className="text-gray-500 text-sm">
                  Departamento
                </label>
              </div>
            </div>
          </div>
          <div ref={contenedorRef} className="flex-col">
            <TextField
              value={searchFilter}
              onClick={handleInputClick}
              onChange={(value) => setSearchFilter(value)}
              placeholder="Buscar..."
            />
            <div className="relative">
              {abierto &&
                (searchFilterBy === 'servicio'
                  ? filterByServicio()
                  : searchFilterBy === 'departamento'
                    ? filterByDepartamento()
                    : null)}
            </div>
          </div>
        </div>
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

          <div className="md:flex hidden flex-col flex-1 gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-gray-500" />{' '}
                <span className="text-gray-500 text-sm">Servicio</span>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="servicio"
                      name="searchBy"
                      value="servicio"
                      checked={searchFilterBy === 'servicio'}
                      onChange={() => handleSetSearchFilteryBy('servicio')}
                    />
                    <label htmlFor="servicio" className="text-gray-500 text-sm">
                      Servicio
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="departamento"
                      name="searchBy"
                      value="departamento"
                      checked={searchFilterBy === 'departamento'}
                      onChange={() => handleSetSearchFilteryBy('departamento')}
                    />
                    <label
                      htmlFor="departamento"
                      className="text-gray-500 text-sm"
                    >
                      Departamento
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div ref={contenedorRef} className="flex-col">
              <TextField
                value={searchFilter}
                onClick={handleInputClick}
                onChange={(value) => setSearchFilter(value)}
                placeholder="Buscar..."
              />
              <div className="relative">
                {abierto &&
                  (searchFilterBy === 'servicio'
                    ? filterByServicio()
                    : searchFilterBy === 'departamento'
                      ? filterByDepartamento()
                      : null)}
              </div>
            </div>
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
