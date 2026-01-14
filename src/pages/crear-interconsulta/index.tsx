import { useState } from 'react'
import { AlertTriangle, Paperclip, X } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import interconsultaEndpoints from '@/lib/endpoints/interconsultaEndpoints'
import { Interconsulta } from '@/types/Interconsulta'
import { useConfig } from '@/config/ConfigProvider'
import { useEdgeStore } from '@/lib/edgestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/router'
import servicioEndpoints from '@/lib/endpoints/servicioEndpoints'
import { Servicio } from '@/types/Servicio'

const CrearInterconsulta = () => {
  const { apiUrl, token, user } = useConfig()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [attachment, setAttachment] = useState<File | undefined>(undefined)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { addInterconsulta } = interconsultaEndpoints(apiUrl || '', token || '')
  const { getServicios } = servicioEndpoints(apiUrl || '', token || '')
  const { edgestore } = useEdgeStore()
  const router = useRouter()

  const crearInterconsultaMutation = useMutation({
    mutationKey: ['addInterconsulta'],
    mutationFn: (payload: Interconsulta) => addInterconsulta(payload),
  })

  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ['getAllServicios'],
    queryFn: async () => getServicios(),
  })

  const servicios = serviciosQuery.data || []

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
      <h1 className="text-2xl font-bold text-foreground px-4">
        Crear Nueva Interconsulta
      </h1>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>Interconsulta creada exitosamente</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-background shadow-sm rounded-lg p-6"
      >
        {/* Datos del Paciente */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Datos del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.paciente.nombre}
                onChange={(e) => handleChange(e, 'paciente')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                name="edad"
                value={formData.paciente.edad}
                onChange={(e) => handleChange(e, 'paciente')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>N° de Historia Clínica</Label>
              <Input
                type="text"
                name="numeroHistoria"
                value={formData.paciente.numeroHistoria}
                onChange={(e) => handleChange(e, 'paciente')}
                required
              />
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Servicio Solicitante</Label>
              <Select
                value={formData.servicioSolicitante._id || formData.servicioSolicitante}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    servicioSolicitante: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((servicio) => (
                    <SelectItem key={servicio._id} value={servicio._id}>
                      {servicio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Servicio Destino</Label>
              <Select
                value={formData.servicioDestino._id || formData.servicioDestino}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    servicioDestino: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((servicio) => (
                    <SelectItem key={servicio._id} value={servicio._id}>
                      {servicio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Detalles de la Interconsulta */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Detalles de la Interconsulta
          </h2>
          <div className="space-y-2">
            <Label>Objetivo de la Consulta</Label>
            <Textarea
              name="objetivoConsulta"
              value={formData.objetivoConsulta}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  objetivoConsulta: e.target.value,
                }))
              }
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Historia Clínica</Label>
            <Textarea
              name="historiaClinica"
              value={formData.historiaClinica}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  historiaClinica: e.target.value,
                }))
              }
              rows={3}
              required
            />
          </div>
        </div>

        {/* Estado Clínico */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Estado Clínico
          </h2>
          <div className="space-y-2">
            <Label>Evaluación Subjetiva</Label>
            <Textarea
              name="subjetivo"
              value={formData.estadoClinico.subjetivo}
              onChange={(e) => handleChange(e, 'estadoClinico')}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Presión Arterial</Label>
              <Input
                type="text"
                name="presionArterial"
                value={formData.estadoClinico.signosVitales.presionArterial}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>FC</Label>
              <Input
                type="text"
                name="frecuenciaCardiaca"
                value={formData.estadoClinico.signosVitales.frecuenciaCardiaca}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>FR</Label>
              <Input
                type="text"
                name="frecuenciaRespiratoria"
                value={
                  formData.estadoClinico.signosVitales.frecuenciaRespiratoria
                }
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Temperatura</Label>
              <Input
                type="text"
                name="temperatura"
                value={formData.estadoClinico.signosVitales.temperatura}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>SatO2</Label>
              <Input
                type="text"
                name="saturacionOxigeno"
                value={formData.estadoClinico.signosVitales.saturacionOxigeno}
                onChange={(e) =>
                  handleChange(e, 'estadoClinico', 'signosVitales')
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Antecedentes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Antecedentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Antecedentes Personales</Label>
              <Textarea
                name="antecedentesPersonales"
                value={formData.antecedentesPersonales}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    antecedentesPersonales: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Antecedentes Familiares</Label>
              <Textarea
                name="antecedentesFamiliares"
                value={formData.antecedentesFamiliares}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    antecedentesFamiliares: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Alergias y Medicamentos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Alergias y Medicamentos
          </h2>
          <div className="space-y-2">
            <Label>Alergias</Label>
            <Textarea
              name="alergias"
              value={formData.alergias}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, alergias: e.target.value }))
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Medicamentos Pre-hospitalarios</Label>
              <Textarea
                name="preHospitalarios"
                value={formData.medicamentos.preHospitalarios}
                onChange={(e) => handleChange(e, 'medicamentos')}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Medicamentos Hospitalarios</Label>
              <Textarea
                name="hospitalarios"
                value={formData.medicamentos.hospitalarios}
                onChange={(e) => handleChange(e, 'medicamentos')}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Laboratorios e Imagenología */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Estudios Complementarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-medium text-foreground mb-2">
                Laboratorios
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Resultados</Label>
                  <Textarea
                    name="resultados"
                    value={formData.laboratorios.resultados}
                    onChange={(e) => handleChange(e, 'laboratorios')}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Textarea
                    name="observaciones"
                    value={formData.laboratorios.observaciones}
                    onChange={(e) => handleChange(e, 'laboratorios')}
                    rows={2}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-foreground mb-2">
                Imagenología
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Tipo de Estudio</Label>
                  <Input
                    type="text"
                    name="tipo"
                    value={formData.imagenologia.tipo}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    name="descripcion"
                    value={formData.imagenologia.descripcion}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hallazgos Relevantes</Label>
                  <Textarea
                    name="hallazgosRelevantes"
                    value={formData.imagenologia.hallazgosRelevantes}
                    onChange={(e) => handleChange(e, 'imagenologia')}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label>Prioridad</Label>
          <Select
            value={formData.prioridad}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, prioridad: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALTA">Alta</SelectItem>
              <SelectItem value="MEDIA">Media</SelectItem>
              <SelectItem value="BAJA">Baja</SelectItem>
            </SelectContent>
          </Select>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setAttachment(undefined)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <label
                  htmlFor="attach"
                  className="text-foreground hover:bg-muted px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 w-44"
                >
                  <div className="h-4 w-4">
                    <Paperclip className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="truncate">
                    {attachment ? attachment.name : 'Adjuntar archivo'}
                  </span>
                </label>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-44 h-2 border-2 rounded border-border flex items-center">
                  <div
                    className="h-2 rounded bg-primary transition-all ease-in-out"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  ></div>
                </div>
                <span className="text-foreground font-bold">
                  {uploadProgress}%
                </span>
              </div>
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner size="sm" className="mr-2" />}
            {loading ? 'Creando...' : 'Crear Interconsulta'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CrearInterconsulta
