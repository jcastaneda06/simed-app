export type Interconsulta = {
  _id: string;
  paciente: {
    nombre: string;
    prioridad: string;
    numeroHistoria: string;
  };
  servicioSolicitante: string;
  servicioDestino: string;
  objetivoConsulta: string;
  historiaClinica: string;
  estadoClinico: {
    subjetivo: string;
    signosVitales: SignosVitales;
  };
  laboratorios: Laboratorio;
  imagenologia: Imagenologia;
  antecedentesPersonales: string;
  antecesdentesFamiliares: string;
  alergias: string;
  medicamentos: {
    preHospitalarios: string;
    hospitalarios: string;
  };
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  notas: Nota[];
  notificaciones: Notification[];
};

export type SignosVitales = {
  presionArterial: string;
  frecuenciaCardiaca: string;
  fecuenciaRespiratoria: string;
  tempreratura: string;
  saturacionOxigeno: string;
};

export type Laboratorio = {
  tipo: string;
  fechaUltimos: string;
  resultados: string;
  observaciones: string;
};

export type Imagenologia = {
  tipo: string;
  fecha: string;
  descripcion: string;
  hallazgosRelevantes: string;
};

export type Nota = {
  _id: string;
  conteindo: string;
  servicio: string;
  autor: string;
  fecha: string;
};

export type Notificacion = {
  _id: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
};
