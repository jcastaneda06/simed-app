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
import { Button } from '../button/Button'
import ConfirmDialog from '../confirm-dialog/ConfirmDialog'
import Spinner from '../spinner/Spinner'
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
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA':
        return (
          <AlertTriangle
            data-tooltip-id={prioridad}
            data-tooltip-content="Prioridad alta"
            className="h-5 w-5 text-red-500"
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <Spinner />
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
    <div className="flex flex-col bg-white transition-all duration-300 border border-gray-100 hover:border-gray-200">
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
                  className="text-black font-semibold truncate"
                >
                  {interconsulta.paciente?.nombre}
                </h2>
                <Tooltip id={interconsulta.prioridad} />
                <Tooltip id={interconsulta.paciente.nombre} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-800">
                  HC: {interconsulta.paciente?.numeroHistoria}
                </p>
                <p className="text-sm text-gray-800">
                  De: {interconsulta?.servicioSolicitante?.nombre}
                </p>
                <p className="text-sm text-gray-800">
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
              <span className="text-xs text-gray-500 text-end">
                {moment(interconsulta.fechaCreacion).format('DD/MM/YYYY')}
              </span>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="w-full pb-4">
              {respuestaQuery.data?.respuesta ? (
                <div className="flex flex-col-reverse md:flex-row justify-end gap-4">
                  {decoded?.role === 'ADMIN' && (
                    <Button
                      text="Borrar interconsulta"
                      variant="danger"
                      style="flex-1 md:flex-initial"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setOpenDialog(true)}
                    />
                  )}
                  <Button
                    text="Ver respuesta"
                    icon={<Eye className="h-4 w-4" />}
                    style="flex-1 md:flex-initial"
                    onClick={() =>
                      router.push(`/interconsulta/${interconsulta._id}`)
                    }
                  />
                </div>
              ) : (
                <>
                  {interconsulta.estado === 'EN_PROCESO' ? (
                    <div className="border-b border-gray-100 pb-4 flex flex-col-reverse md:flex-row justify-end gap-2">
                      {decoded?.role === 'ADMIN' && (
                        <Button
                          text="Borrar interconsulta"
                          variant="danger"
                          style="flex-1 md:flex-initial"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => setOpenDialog(true)}
                        />
                      )}
                      <Button
                        text="Respuesta Física"
                        variant="secondary"
                        style="flex-1 md:flex-initial"
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        onClick={(e: any) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Respuesta Física clickeada')
                        }}
                      />
                      <Button
                        text="Respuesta Virtual"
                        style="flex-1 md:flex-initial"
                        icon={<MessageSquare className="h-4 w-4" />}
                        onClick={() =>
                          router.push(`/interconsulta/${interconsulta._id}`)
                        }
                      />
                    </div>
                  ) : decoded?.role === 'ADMIN' ? (
                    <div className="flex justify-end">
                      <Button
                        text="Borrar interconsulta"
                        variant="danger"
                        style="flex-1 md:flex-initial"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => setOpenDialog(true)}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="grid gap-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Estado de la Interconsulta
                  </h3>
                  <p className="text-sm text-gray-800">
                    Estado actual: {interconsulta.estado}
                  </p>
                </div>
                <select
                  value={interconsulta.estado}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={interconsultaStateMutation.isPending}
                  className={`
                      rounded-md border border-gray-300 px-3 py-2 text-gray-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${interconsultaStateMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Objetivo de la Consulta
                </h3>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                  {interconsulta.objetivoConsulta}
                </p>
              </div>

              {interconsulta.estadoClinico && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Estado Clínico
                    </h3>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {interconsulta.estadoClinico.subjetivo}
                    </p>
                  </div>

                  {interconsulta.estadoClinico.signosVitales && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Signos Vitales
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(
                          interconsulta.estadoClinico.signosVitales
                        ).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-700 mb-1">
                              {formatSignoVitalLabel(key)}
                            </p>
                            <p className="text-sm font-medium text-black">
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
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Laboratorios
                      </h3>
                      <div className="bg-gray-50 p-3 rounded space-y-2">
                        <p className="text-sm text-black">
                          {interconsulta.laboratorios.resultados}
                        </p>
                        {interconsulta.laboratorios.observaciones && (
                          <p className="text-sm text-black">
                            Nota: {interconsulta.laboratorios.observaciones}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {interconsulta.imagenologia && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Imagenología
                      </h3>
                      <div className="bg-gray-50 p-3 rounded space-y-2">
                        <p className="text-sm font-medium text-black">
                          {interconsulta.imagenologia.tipo}
                        </p>
                        <p className="text-sm text-black">
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
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => handleDeleteInterconsulta()}
        title="Borrar interconsulta"
        action="borrar la interconsulta"
      />
    </div>
  )
}

export default InterconsultaCard
