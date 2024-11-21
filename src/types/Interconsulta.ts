export type Interconsulta = {
  _id: string;
  fecha: string;
  paciente: {
    nombre: string;
    prioridad: string;
    numeroHistoria: string;
  };
  prioridad: string;
  servicioSolicitante: {
    nombre: string;
    especialidad: string;
  };
  servicioDestino: {
    nombre: string;
  };
  fechaCreacion: string;
  objetivoConsulta: string;
  estado: string;
  estadoClinico: {
    subjetivo: string;
    signosVitales: string;
  };
  laboratorios: {
    tipo: string;
    fecha: string;
    resultados: string;
    observaciones: string;
  };
  imagenologia: {
    tipo: string;
    fecha: string;
    resultados: string;
    hallazgosRelevantes: string;
  };
};
