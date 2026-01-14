import { FC, useState } from 'react'
import { Interconsulta, RespuestaInterconsulta } from '@/types/Interconsulta'
import { useRouter } from 'next/router'
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Eye,
  Trash2,
} from 'lucide-react'
import moment from 'moment'
import { useMutation, useQuery } from '@tanstack/react-query'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import { useConfig } from '@/config/ConfigProvider'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tooltip } from 'react-tooltip'
const jwt = require('jsonwebtoken')

type InterconsultaCardProps = {
  interconsulta: Interconsulta
  interconsultasEnviadas: Interconsulta[]
  interconsultasRecibidas: Interconsulta[]
  onStatusChange: () => void
  loading: boolean
  error: string
}

const InterconsultaCard: FC<InterconsultaCardProps> = ({
  interconsulta,
  interconsultasEnviadas,
  interconsultasRecibidas,
  onStatusChange,
  loading,
  error,
}) => {
  const { apiUrl, token, user } = useConfig()
  const decoded = jwt.decode(token)
  const {
    getRespuestaByInterconsultaId,
    updateInterconsultaState,
    deleteInterconsulta,
  } = interconsultaEndpoints(apiUrl || '', token || '')
  const [expanded, setExpanded] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const respuestaQuery = useQuery<RespuestaInterconsulta>({
    queryKey: ['respuesta', interconsulta._id],
    queryFn: () => getRespuestaByInterconsultaId(interconsulta._id || ''),
  })

  const interconsultaStateMutation = useMutation<
    Interconsulta,
    Error,
    { estado: string }
  >({
    mutationKey: ['updateIntercunsultaState', interconsulta._id],
    mutationFn: (payload: { estado: string }) =>
      updateInterconsultaState(interconsulta._id || '', payload.estado),
  })

  const deleteInterconsultaMutation = useMutation<any, Error, any>({
    mutationKey: ['deleteInterconsulta'],
    mutationFn: (id: string) => deleteInterconsulta(id),
  })

  const formatSignoVitalLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      presionArterial: 'Presión Arterial',
      frecuenciaCardiaca: 'Frecuencia Cardíaca',
      frecuenciaRespiratoria: 'Frecuencia Respiratoria',
      temperatura: 'Temperatura',
      saturacionOxigeno: 'Saturación de Oxígeno',
    }
    return labels[key] || key
  }

  const handleStatusChange = async (newStatus: string) => {
    if (interconsultaStateMutation.isPending) return

    const response = await interconsultaStateMutation.mutateAsync({
      estado: newStatus,
    })

    if (response.estado === newStatus) {
      onStatusChange()
    }
  }

  const handleDeleteInterconsulta = async () => {
    if (deleteInterconsultaMutation.isPending) return

    const response = await deleteInterconsultaMutation.mutateAsync(
      interconsulta._id
    )

    if (response.ok) {
      router.reload()
    }
  }

  const getStatusColor = (estado: string) => {
    const colors: { [key: string]: string } = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      EN_PROCESO: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETADA: 'bg-green-100 text-green-800 border-green-200',
    }
    return colors[estado] || 'bg-muted text-muted-foreground border-border'
  }

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA':
        return (
          <AlertTriangle
            data-tooltip-id={prioridad}
            data-tooltip-content="Prioridad alta"
            className="h-5 w-5 text-destructive"
          />
        )
      case 'MEDIA':
        return (
          <Clock
            data-tooltip-id={prioridad}
            data-tooltip-content="Prioridad media"
            className="h-5 w-5 text-yellow-500"
          />
        )
      case 'BAJA':
        return (
          <CheckCircle2
            data-tooltip-id={prioridad}
            data-tooltip-content="Prioridad baja"
            className="h-5 w-5 text-green-500"
          />
        )
      default:
        return null
    }
  }

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  if (
    loading &&
    interconsultasEnviadas.length === 0 &&
    interconsultasRecibidas.length === 0
  ) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto p-4">
          <Spinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background transition-all duration-300 border border-border hover:border-border/80">
      <div className="p-4">
        <div
          className="cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-2 w-36 sm:w-40">
                {getPriorityIcon(interconsulta.prioridad)}
                <h2
                  data-tooltip-id={interconsulta.paciente.nombre}
                  data-tooltip-content={interconsulta.paciente.nombre}
                  className="text-foreground font-semibold truncate"
                >
                  {interconsulta.paciente?.nombre}
                </h2>
                <Tooltip id={interconsulta.prioridad} />
                <Tooltip id={interconsulta.paciente.nombre} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  HC: {interconsulta.paciente?.numeroHistoria}
                </p>
                <p className="text-sm text-foreground">
                  De: {interconsulta?.servicioSolicitante?.nombre}
                </p>
                <p className="text-sm text-foreground">
                  Para: {interconsulta?.servicioDestino?.nombre}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                  interconsulta.estado || ''
                )}`}
              >
                {interconsulta.estado}
              </span>
              <span className="text-xs text-muted-foreground text-end">
                {moment(interconsulta.fechaCreacion).format('DD/MM/YYYY')}
              </span>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="w-full pb-4">
              {respuestaQuery.data?.respuesta ? (
                <div className="flex flex-col-reverse md:flex-row justify-end gap-4">
                  {decoded?.role === 'ADMIN' && (
                    <Button
                      variant="destructive"
                      className="flex-1 md:flex-initial"
                      onClick={() => setOpenDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Borrar interconsulta
                    </Button>
                  )}
                  <Button
                    className="flex-1 md:flex-initial"
                    onClick={() =>
                      router.push(`/interconsulta/${interconsulta._id}`)
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver respuesta
                  </Button>
                </div>
              ) : (
                <>
                  {interconsulta.estado === 'EN_PROCESO' ? (
                    <div className="border-b border-border pb-4 flex flex-col-reverse md:flex-row justify-end gap-2">
                      {decoded?.role === 'ADMIN' && (
                        <Button
                          variant="destructive"
                          className="flex-1 md:flex-initial"
                          onClick={() => setOpenDialog(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Borrar interconsulta
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="flex-1 md:flex-initial"
                        onClick={(e: any) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Respuesta Física clickeada')
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Respuesta Física
                      </Button>
                      <Button
                        className="flex-1 md:flex-initial"
                        onClick={() =>
                          router.push(`/interconsulta/${interconsulta._id}`)
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respuesta Virtual
                      </Button>
                    </div>
                  ) : decoded?.role === 'ADMIN' ? (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        className="flex-1 md:flex-initial"
                        onClick={() => setOpenDialog(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Borrar interconsulta
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="grid gap-6">
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    Estado de la Interconsulta
                  </h3>
                  <p className="text-sm text-foreground">
                    Estado actual: {interconsulta.estado}
                  </p>
                </div>
                <Select
                  value={interconsulta.estado}
                  onValueChange={(value) => handleStatusChange(value)}
                  disabled={interconsultaStateMutation.isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                    <SelectItem value="COMPLETADA">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Objetivo de la Consulta
                </h3>
                <p className="text-sm text-foreground bg-muted p-3 rounded">
                  {interconsulta.objetivoConsulta}
                </p>
              </div>

              {interconsulta.estadoClinico && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Estado Clínico
                    </h3>
                    <p className="text-sm text-foreground bg-muted p-3 rounded">
                      {interconsulta.estadoClinico.subjetivo}
                    </p>
                  </div>

                  {interconsulta.estadoClinico.signosVitales && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Signos Vitales
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(
                          interconsulta.estadoClinico.signosVitales
                        ).map(([key, value]) => (
                          <div key={key} className="bg-muted p-3 rounded">
                            <p className="text-xs text-muted-foreground mb-1">
                              {formatSignoVitalLabel(key)}
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(interconsulta.laboratorios || interconsulta.imagenologia) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {interconsulta.laboratorios && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Laboratorios
                      </h3>
                      <div className="bg-muted p-3 rounded space-y-2">
                        <p className="text-sm text-foreground">
                          {interconsulta.laboratorios.resultados}
                        </p>
                        {interconsulta.laboratorios.observaciones && (
                          <p className="text-sm text-foreground">
                            Nota: {interconsulta.laboratorios.observaciones}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {interconsulta.imagenologia && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Imagenología
                      </h3>
                      <div className="bg-muted p-3 rounded space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {interconsulta.imagenologia.tipo}
                        </p>
                        <p className="text-sm text-foreground">
                          {interconsulta.imagenologia.hallazgosRelevantes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Borrar interconsulta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro/a de que quiere borrar la interconsulta? Esta acción
              es irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteInterconsulta()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default InterconsultaCard
