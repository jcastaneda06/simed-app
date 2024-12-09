import { useState, FC, useRef } from 'react'
import { useRouter } from 'next/router'
import { AlertTriangle, Download, Printer } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import { useConfig } from '@/config/ConfigProvider'
import { RespuestaInterconsulta } from '@/types/Interconsulta'
import { Button } from '@/components/button/Button'
import { useReactToPrint } from 'react-to-print'
import { getDownloadUrl } from '@edgestore/react/utils'

// Example structure of interconsulta. Adjust as needed to match your API.
interface Interconsulta {
  paciente?: {
    nombre?: string
    numeroHistoria?: string
  }
  servicioSolicitante?: {
    nombre?: string
  }
  servicioDestino?: {
    nombre?: string
  }
  prioridad?: string
  fechaCreacion?: string // Use `Date` if you're handling it as a Date object.
  objetivoConsulta?: string
  estadoClinico?: {
    signosVitales?: {
      presionArterial?: string
      frecuenciaCardiaca?: string
      frecuenciaRespiratoria?: string
      temperatura?: string
      saturacionOxigeno?: string
    }
    subjetivo?: string
  }
}

const RespuestaVirtual: FC = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { apiUrl, token } = useConfig()
  const {
    getRespuestaByInterconsultaId,
    getInterconsultaById,
    responderInterconsulta,
    updateInterconsultaState,
    getInterconsultaFile,
  } = interconsultaEndpoints(apiUrl || '', token || '')
  const printRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef: printRef })
  const [respuesta, setRespuesta] = useState('')
  const [error, setError] = useState(false)

  const interconsultaQuery = useQuery<Interconsulta>({
    queryKey: ['interconsulta', id],
    queryFn: () => getInterconsultaById(id),
  })

  const respuestaInterconsultaQuery = useQuery<RespuestaInterconsulta>({
    queryKey: ['respuestaInterconsulta', id],
    queryFn: () => getRespuestaByInterconsultaId(id),
  })

  const interconsultaFileQuery = useQuery({
    queryKey: ['interconsultaFile', id],
    queryFn: () => getInterconsultaFile(id),
    enabled: !!interconsultaQuery.data,
  })

  const interconsulta = interconsultaQuery.data

  const respuestaInterconsultaMutation = useMutation<
    RespuestaInterconsulta,
    Error,
    any
  >({
    mutationKey: ['respuestaInterconsulta', id],
    mutationFn: (payload: RespuestaInterconsulta) =>
      responderInterconsulta(payload),
    onError: () => setError(true),
  })

  const updateInterconsultaMutation = useMutation({
    mutationKey: ['updateInterconsulta', id],
    mutationFn: (id: string) => updateInterconsultaState(id, 'COMPLETADA'),

    onSuccess: () => router.push('/'),
  })
  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return 'Fecha inválida'
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

  const handleSubmit = async () => {
    const payload = {
      interconsulta: id,
      respuesta: respuesta,
    } satisfies RespuestaInterconsulta

    const response = await respuestaInterconsultaMutation.mutateAsync(payload)

    if (response && !error) {
      updateInterconsultaMutation.mutateAsync(id)
    }
  }

  if (interconsultaQuery.isLoading)
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center py-6">Cargando interconsulta...</div>
        </div>
      </div>
    )

  if (interconsultaQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span>{interconsultaQuery.error.message}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={printRef} className="min-h-screen text-black bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-6">
          Respuesta Virtual a la Interconsulta
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-xl font-semibold">
              {interconsulta?.paciente?.nombre || 'Nombre no disponible'}
            </h2>
            {interconsulta?.prioridad === 'ALTA' && (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <p className="text-gray-700">
              <span className="font-medium">HC:</span>{' '}
              {interconsulta?.paciente?.numeroHistoria || 'No disponible'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">De:</span>{' '}
              {interconsulta?.servicioSolicitante?.nombre || 'No especificado'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Para:</span>{' '}
              {interconsulta?.servicioDestino?.nombre || 'No especificado'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Prioridad:</span>{' '}
              {interconsulta?.prioridad || 'No especificada'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Fecha:</span>{' '}
              {formatFecha(interconsulta?.fechaCreacion)}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Objetivo de la Consulta
              </h3>
              <p className="bg-gray-50 p-4 rounded-lg">
                {interconsulta?.objetivoConsulta || 'No especificado'}
              </p>
            </div>

            {interconsulta?.estadoClinico && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Estado Clínico</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {interconsulta?.estadoClinico.signosVitales && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Signos Vitales
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <p className="text-gray-700">
                          <span className="font-medium">Presión Arterial:</span>{' '}
                          {
                            interconsulta?.estadoClinico.signosVitales
                              .presionArterial
                          }
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">
                            Frecuencia Cardíaca:
                          </span>{' '}
                          {
                            interconsulta?.estadoClinico.signosVitales
                              .frecuenciaCardiaca
                          }
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">
                            Frecuencia Respiratoria:
                          </span>{' '}
                          {
                            interconsulta?.estadoClinico.signosVitales
                              .frecuenciaRespiratoria
                          }
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Temperatura:</span>{' '}
                          {
                            interconsulta?.estadoClinico.signosVitales
                              .temperatura
                          }
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Saturación O2:</span>{' '}
                          {
                            interconsulta?.estadoClinico.signosVitales
                              .saturacionOxigeno
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {interconsulta?.estadoClinico.subjetivo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Evaluación Subjetiva
                      </h4>
                      <p className="text-gray-700">
                        {interconsulta?.estadoClinico.subjetivo}
                      </p>
                    </div>
                  )}
                </div>
                {respuestaInterconsultaQuery.data ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Respuesta</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {respuestaInterconsultaQuery.data.respuesta}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
            {!interconsultaFileQuery?.isLoading &&
              interconsultaFileQuery?.data && (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Archivos Adjuntos
                  </h3>
                  {interconsultaFileQuery.data?.data.map((file: any) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center text-start gap-2 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg"
                    >
                      {file.url.split('.').pop() === 'pdf' ? (
                        <div className="flex justify-start gap-2 w-full">
                          <Download className="w-5 h-5" />
                          <span>Adjunto de interconsulta.pdf</span>
                        </div>
                      ) : (
                        <img
                          src={getDownloadUrl(file.url)}
                          className="rounded-md shadow"
                          alt="interconsulta"
                        />
                      )}
                    </a>
                  ))}
                </>
              )}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-6">
              <div className="flex items-center">
                <span>{'Esta interconsulta ya fue respondida'}</span>
              </div>
            </div>
          )}
          {/* Área de respuesta */}
          {!respuestaInterconsultaQuery.data ? (
            <div className="bg-white p-6 rounded-lg shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">
                Escribir Respuesta Virtual
              </h2>
              <textarea
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Escriba su respuesta aquí..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleSubmit()}
              >
                Enviar Respuesta
              </button>
            </div>
          ) : (
            <div className="mt-6 flex w-full print:hidden">
              <Button
                text="Imprimir respuesta"
                icon={<Printer />}
                onClick={() => reactToPrintFn()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RespuestaVirtual
