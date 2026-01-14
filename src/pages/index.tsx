import { useState, useEffect, FC } from 'react'
import { AlertTriangle, Send, Inbox, Filter } from 'lucide-react'
import { Interconsulta } from '@/types/Interconsulta'
import { Servicio } from '@/types/Servicio'
import InterconsultaCard from '@/components/interconsulta-card/InterconsultaCard'
import { useQuery } from '@tanstack/react-query'
import servicioEndpoints from '@/lib/endpoints/servicioEndpoints'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import { useConfig } from '@/config/ConfigProvider'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import departamentoEndpoints from '@/lib/endpoints/departamentoEndpoints'
import { Deparatamento } from '@/types/Deparatamento'
import normalizeText from '@/helpers/normalizeText'
import InterconsultaFilters from '@/components/interconsulta-filters/InterconsultaFIlters'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const [openFilters, setOpenFilters] = useState(false)

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
        <span className="text-muted-foreground">{departamento.nombre}</span>
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
      <div className="absolute top-2 shadow-md flex flex-col bg-background border border-border w-full z-10 rounded-md max-h-56 overflow-auto text-ellipsis">
        {filteredServicio?.map((servicio) => (
          <button
            key={servicio._id}
            onClick={() => handleSetFilters('idServicio', servicio._id)}
            className="text-left text-sm text-muted-foreground hover:bg-muted p-2"
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
        <div className="text-sm text-muted-foreground p-2 text-center">
          No hay resultados
        </div>
      )

    const filteredElement = (
      <div className="absolute top-2 shadow-md flex flex-col bg-background border border-border w-full z-10 rounded-md max-h-56 overflow-auto text-ellipsis">
        {filteredDepartamento?.map((servicio) => (
          <button
            key={servicio._id}
            onClick={() => handleSetFilters('idServicio', servicio._id)}
            className="text-left text-sm text-muted-foreground hover:bg-muted p-2"
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
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const enviadasCount = interconsultasEnviadasQuery.data?.length || 0
  const recibidasCount = interconsultasRecibidasQuery.data?.length || 0

  return (
    <div className="min-h-screen bg-muted/30 text-muted-foreground">
      <div className="flex flex-col mx-auto p-0 md:p-4">
        <div className="flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-foreground">Interconsultas</h1>
          {/* Mobile filter button */}
          <Button
            variant="ghost"
            size="sm"
            className={`md:hidden ${openFilters ? 'text-primary' : ''}`}
            onClick={() => setOpenFilters(!openFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Tabs defaultValue="enviadas" className="mt-4">
          <div className="flex items-center justify-center md:justify-between px-4 md:px-0">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
              <TabsTrigger value="enviadas" className="gap-2">
                <Send className="h-4 w-4" />
                <span>Enviadas</span>
                {enviadasCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    {enviadasCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="recibidas" className="gap-2">
                <Inbox className="h-4 w-4" />
                <span>Recibidas</span>
                {recibidasCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    {recibidasCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            {/* Desktop filter button */}
            <Button
              variant="ghost"
              size="sm"
              className={`hidden md:flex ${openFilters ? 'text-primary' : ''}`}
              onClick={() => setOpenFilters(!openFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

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
            openFilters={openFilters}
          />

          <TabsContent value="enviadas">
            <div className="bg-background md:rounded-lg md:shadow-sm md:border border-border overflow-hidden">
              {interconsultasEnviadasQuery.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay interconsultas enviadas para mostrar
                </div>
              ) : (
                <div className="divide-y divide-border">
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
                        interconsultasEnviadas={
                          interconsultasEnviadasQuery.data
                        }
                        interconsultasRecibidas={
                          interconsultasRecibidasQuery.data || []
                        }
                      />
                    ) : null
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recibidas">
            <div className="bg-background md:rounded-lg md:shadow-sm md:border border-border overflow-hidden">
              {interconsultasRecibidasQuery.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay interconsultas recibidas para mostrar
                </div>
              ) : (
                <div className="divide-y divide-border">
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
                      interconsultasRecibidas={
                        interconsultasRecibidasQuery.data
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Home
