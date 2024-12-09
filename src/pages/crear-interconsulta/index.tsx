import { useState } from 'react'
import { AlertTriangle, Paperclip, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import { Interconsulta } from '@/types/Interconsulta'
import { useConfig } from '@/config/ConfigProvider'
import { useEdgeStore } from '@/lib/edgestore'
import { Button } from '@/components/button/Button'
import Spinner from '@/components/spinner/Spinner'
import IconButton from '@/components/icon-button/IconButton'
import { useRouter } from 'next/router'

const CrearInterconsulta = () => {
  const { apiUrl, token, user } = useConfig()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [attachment, setAttachment] = useState<File | undefined>(undefined)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { addInterconsulta } = interconsultaEndpoints(apiUrl || '', token || '')
  const { edgestore } = useEdgeStore()
  const router = useRouter()

  const crearInterconsultaMutation = useMutation({
    mutationKey: ['addInterconsulta'],
    mutationFn: (payload: Interconsulta) => addInterconsulta(payload),
  })

  const servicios = [
    { id: '672e05bad3ce20d6407a5143', nombre: 'Cirugía' },
    { id: '672e099e636c9f5552583436', nombre: 'Medicina Interna' },
  ]

  const [formData, setFormData] = useState<{ [key: string]: any }>({
    paciente: {
      nombre: '',
      edad: 0,
      prioridad: '',
      numeroHistoria: '',
    },
    servicioSolicitante: {
      _id: '',
      nombre: '',
      descripcion: '',
      jefe: {
        nombre: '',
        email: '',
        telefono: '',
      },
      tipo: '',
      activo: false,
    },
    servicioDestino: {
      _id: '',
      nombre: '',
      descripcion: '',
      jefe: {
        nombre: '',
        email: '',
        telefono: '',
      },
      tipo: '',
      activo: false,
    },
    objetivoConsulta: '',
    historiaClinica: '',
    estadoClinico: {
      subjetivo: '',
      signosVitales: {
        presionArterial: '',
        frecuenciaCardiaca: '',
        frecuenciaRespiratoria: '',
        temperatura: 0,
        saturacionOxigeno: '',
      },
    },
    laboratorios: {
      tipo: '',
      fechaUltimos: '',
      resultados: '',
      observaciones: '',
    },
    imagenologia: {
      tipo: '',
      descripcion: '',
      hallazgosRelevantes: '',
    },
    antecedentesPersonales: '',
    antecedentesFamiliares: '',
    alergias: '',
    medicamentos: {
      preHospitalarios: '',
      hospitalarios: '',
    },
    prioridad: 'ALTA',
  })

  const handleChange = (e: any, section: string, subsection: string = '') => {
    const { name, value } = e.target

    if (section && subsection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value,
          },
        },
      }))
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await crearInterconsultaMutation.mutateAsync(
        formData as Interconsulta
      )

      if (response.error) {
        throw new Error(
          response.error
            ? response.error.message
            : 'Error creando interconsulta'
        )
      }

      setSuccess(true)
      setFormData({
        paciente: { nombre: '', edad: '', numeroHistoria: '' },
        servicioSolicitante: '',
        servicioDestino: '',
        objetivoConsulta: '',
        historiaClinica: '',
        estadoClinico: {
          subjetivo: '',
          signosVitales: {
            presionArterial: '',
            frecuenciaCardiaca: '',
            frecuenciaRespiratoria: '',
            temperatura: '',
            saturacionOxigeno: '',
          },
        },
        laboratorios: { resultados: '', observaciones: '' },
        imagenologia: { tipo: '', descripcion: '', hallazgosRelevantes: '' },
        antecedentesPersonales: '',
        antecedentesFamiliares: '',
        alergias: '',
        medicamentos: { preHospitalarios: '', hospitalarios: '' },
        prioridad: 'ALTA',
      })

      await handleUploadFile(response._id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      router.push('/')
    }
  }

  const handleUploadFile = async (interconsultaId: string) => {
    if (attachment) {
      const res = await edgestore.publicFiles.upload({
        file: attachment,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          setUploadProgress(progress)
        },
        input: {
          servicio: 'interconsulta',
          interconsultaId: interconsultaId,
        },
      })
      return res
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Crear Nueva Interconsulta
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Interconsulta creada exitosamente
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-sm rounded-lg p-6"
      >
        {/* Datos del Paciente */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Datos del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.paciente.nombre}
                onChange={(e) => handleChange(e, 'paciente')}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Edad
              </label>
              <input
                type="number"
                name="edad"
                value={formData.paciente.edad}
                onChange={(e) => handleChange(e, 'paciente')}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                N° de Historia Clínica
              </label>
              <input
                type="text"
                name="numeroHistoria"
                value={formData.paciente.numeroHistoria}
                onChange={(e) => handleChange(e, 'paciente')}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servicio Solicitante
              </label>
              <select
                name="servicioSolicitante"
                value={formData.servicioSolicitante}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    servicioSolicitante: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servicio Destino
              </label>
              <select
                name="servicioDestino"
                value={formData.servicioDestino}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    servicioDestino: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detalles de la Interconsulta */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Detalles de la Interconsulta
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Objetivo de la Consulta
            </label>
            <textarea
              name="objetivoConsulta"
              value={formData.objetivoConsulta}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  objetivoConsulta: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Historia Clínica
            </label>
            <textarea
              name="historiaClinica"
              value={formData.historiaClinica}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  historiaClinica: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Estado Clínico */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Estado Clínico
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Evaluación Subjetiva
            </label>
            <textarea
              name="subjetivo"
              value={formData.estadoClinico.subjetivo}
              onChange={(e) => handleChange(e, 'estadoClinico')}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Presión Arterial
              </label>
              <input
                type="text"
                name="presionArterial"
                value={formData.estadoClinico.signosVitales.presionArterial}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                FC
              </label>
              <input
                type="text"
                name="frecuenciaCardiaca"
                value={formData.estadoClinico.signosVitales.frecuenciaCardiaca}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                FR
              </label>
              <input
                type="text"
                name="frecuenciaRespiratoria"
                value={
                  formData.estadoClinico.signosVitales.frecuenciaRespiratoria
                }
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperatura
              </label>
              <input
                type="text"
                name="temperatura"
                value={formData.estadoClinico.signosVitales.temperatura}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SatO2
              </label>
              <input
                type="text"
                name="saturacionOxigeno"
                value={formData.estadoClinico.signosVitales.saturacionOxigeno}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Antecedentes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Antecedentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Antecedentes Personales
              </label>
              <textarea
                name="antecedentesPersonales"
                value={formData.antecedentesPersonales}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    antecedentesPersonales: e.target.value,
                  }))
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Antecedentes Familiares
              </label>
              <textarea
                name="antecedentesFamiliares"
                value={formData.antecedentesFamiliares}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    antecedentesFamiliares: e.target.value,
                  }))
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Alergias y Medicamentos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Alergias y Medicamentos
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alergias
            </label>
            <textarea
              name="alergias"
              value={formData.alergias}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, alergias: e.target.value }))
              }
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medicamentos Pre-hospitalarios
              </label>
              <textarea
                name="preHospitalarios"
                value={formData.medicamentos.preHospitalarios}
                onChange={(e) => handleChange(e, 'medicamentos')}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medicamentos Hospitalarios
              </label>
              <textarea
                name="hospitalarios"
                value={formData.medicamentos.hospitalarios}
                onChange={(e) => handleChange(e, 'medicamentos')}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Laboratorios e Imagenología */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Estudios Complementarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">
                Laboratorios
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resultados
                  </label>
                  <textarea
                    name="resultados"
                    value={formData.laboratorios.resultados}
                    onChange={(e) => handleChange(e, 'laboratorios')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.laboratorios.observaciones}
                    onChange={(e) => handleChange(e, 'laboratorios')}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">
                Imagenología
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Estudio
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.imagenologia.tipo}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.imagenologia.descripcion}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hallazgos Relevantes
                  </label>
                  <textarea
                    name="hallazgosRelevantes"
                    value={formData.imagenologia.hallazgosRelevantes}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, prioridad: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
            required
          >
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end gap-4">
          <div className="flex items-center">
            <input
              type="file"
              name="attach"
              className="hidden"
              id="attach"
              accept="image/*, .pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const extension = file.name.split('.').pop()
                  // check if the file is an image or a pdf
                  if (['jpg', 'jpeg', 'png', 'pdf'].includes(extension || '')) {
                    setAttachment(file)
                  } else {
                    alert('Archivo invalido')
                  }
                }
              }}
            />
            {!loading ? (
              <>
                {attachment && (
                  <IconButton
                    variant="danger"
                    icon={<X />}
                    onClick={() => setAttachment(undefined)}
                  />
                )}
                <label
                  htmlFor="attach"
                  className="text-black hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 w-44"
                >
                  <div className="h-4 w-4">
                    <Paperclip className="h-4 w-4 text-black" />
                  </div>
                  <span className="truncate">
                    {attachment ? attachment.name : 'Adjuntar archivo'}
                  </span>
                </label>
              </>
            ) : (
              <div className="flex  items-center gap-2">
                <div className="w-44 h-2 border-2 rounded border-gray-300 flex items-center">
                  <div
                    className="h-2 rounded bg-gray-300 transition-all ease-in-out"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  ></div>
                </div>
                <span className="text-black font-bold">{uploadProgress}%</span>
              </div>
            )}
          </div>
          <Button
            text={loading ? 'Creando...' : 'Crear Interconsulta'}
            type="submit"
            icon={loading ? <Spinner /> : null}
          />
        </div>
      </form>
    </div>
  )
}

export default CrearInterconsulta
