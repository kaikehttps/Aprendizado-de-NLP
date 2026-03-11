/**
 * Tipos para o Prontuário Veterinário ApexVet
 * Modelo completo com sinais vitais, clínicos e sistema de diagnóstico
 */

// ============ SINAIS VITAIS ============
export interface VitalSigns {
  temperature: string      // Temperatura em Celsius (ex: "38.5")
  heartRate: string        // Frequência cardíaca em bpm (ex: "120")
  respiratoryRate: string  // Frequência respiratória em rpm (ex: "30")
  capillaryRefillTime: string  // TRC em segundos (ex: "< 2")
  mucousMembrane: string    // Coloração das mucosas (ex: "rosadas", "pálidas", "ictéricas", "cianóticas")
  hydration: string         // Estado de hidratação (ex: "normal", "desidratado leve", "moderado", "severo")
  bodyCondition: string    // Condição corporal (ex: "magro", "normal", "obes")
  pulse: string            // Pulso (ex: "forte", "fraco", "rítmico")
}

// ============ SINAIS CLÍNICOS ============
export interface ClinicalSigns {
  vomiting: boolean        // Vômito
  vomitingFrequency: string  // Frequência vômito (ex: "3x ao dia")
  diarrhea: boolean        // Diarreia
  diarrheaFrequency: string  // Frequência diarreia
  coughing: boolean        // Tosse
  coughingType: string     // Tipo de tosse (ex: "seca", "produtiva")
  lethargy: boolean        // Letargia
  anorexia: boolean        // Anorexia/Inapetência
  polyuria: boolean        // Poliúria (aumento urine)
  polydipsia: boolean      // Polidipsia (aumento sede)
  dyspnea: boolean         // Dispneia (dificuldade respirar)
  nasalDischarge: boolean // Descarga nasal
  ocularDischarge: boolean // Descarga ocular
  pruritus: boolean        // Prurido (coceira)
  pain: boolean            // Dor
  painLevel: string        // Nível de dor (1-10)
  weightLoss: boolean       // Perda de peso
  weakness: boolean        // Fraqueza
  collapse: boolean        // Colapso
  seizures: boolean        // Convulsões
  otherSigns: string       // Outros sinais
}

// ============ EXAME FÍSICO ============
export interface PhysicalExam {
  generalState: string     // Estado geral (ex: "alerta", "deprimido", "letárgico")
  posture: string          // Postura (ex: "normal", "encurvada", "relutante")
  consciousness: string    // Consciência (ex: "lúcido", "obnubilado", "comatoso")
  integumentary: string    // Sistema tegumentar (pelo, pele)
  musculoskeletal: string  // Sistema musculoesquelético
  cardiovascular: string   // Sistema cardiovascular
  respiratory: string     // Sistema respiratório
  digestive: string       // Sistema digestivo
  urogenital: string      // Sistema urogenital
  nervous: string         // Sistema nervoso
  lymphNodes: string       // Linfonodos
  abdominalPalpation: string  // Palpação abdominal
  notes: string           // Observações adicionais
}

// ============ HISTÓRICO MÉDICO ============
export interface MedicalHistory {
  currentMedications: string  // Medicamentos atuais
  previousIllnesses: string   // doenças anteriores
  previousSurgeries: string   // Cirurgias anteriores
  allergies: string          // Alergias
  vaccinesStatus: string     // Status vaccinal
  deworming: string          // Vermifugação
  diet: string               // Dieta atual
  environment: string        // Ambiente (ex: "casa", "apartamento", "externo")
  recentTravel: boolean      // Viagem recente
  contactWithSickAnimals: boolean  // Contato com animais doentes
  toxicExposure: boolean     // Exposição a tóxinas
  toxicDetails: string       // Detalhes da exposição
}

// ============ HIPÓTESES DIAGNÓSTICAS ============
export interface DiagnosticHypothesis {
  id: string
  condition: string         // Patologia
  probability: "alta" | "media" | "baixa"  // Probabilidade
  notes: string            // Observações
  selected: boolean        // Se foi selecionada
}

// ============ TRATAMENTO ============
export interface Treatment {
  id: string
  medication: string        // Medicamento
  dosage: string           // Dosagem
  frequency: string        // Frequência
  route: string            // Via de administração
  duration: string         // Duração
  notes: string           // Observações
}

// ============ EXAMES COMPLEMENTARES ============
export interface ComplementaryExam {
  id: string
  type: string             // Tipo de exame
  result: string           // Resultado
  date: string            // Data
  notes: string           // Observações
}

// ============ PRONTUÁRIO PRINCIPAL ============
export interface PetRecord {
  // Dados básicos do animal
  petName: string
  species: "canino" | "felino" | "ave" | "roedor" | "outro"
  breed: string            // Raça
  age: string
  weight: string
  sex: "macho" | "femea" | ""
  neutered: boolean
  color: string           // Cor/Pelagem
  microchip: string       // Microchip

  // Dados do tutor
  tutorName: string
  tutorPhone: string
  tutorCPF: string
  tutorAddress: string
  tutorEmail: string

  // Sinais vitais
  vitalSigns: VitalSigns

  // Sinais clínicos
  clinicalSigns: ClinicalSigns

  // Exame físico
  physicalExam: PhysicalExam

  // Histórico médico
  medicalHistory: MedicalHistory

  // Hipóteses diagnósticas (sugestões da IA)
  diagnosticHypotheses: DiagnosticHypothesis[]

  // Tratamento prescrito
  treatments: Treatment[]

  // Exames complementares
  complementaryExams: ComplementaryExam[]

  // Observações gerais
  chiefComplaint: string   // Queixa principal
  anamnesis: string       // Anamnese
  clinicalNotes: string   // Notas clínicas
  clinicalObservations: string  // Observações clínicas
  evolution: string       // Evolução

  // Serviços de banho e tosa (para petshop/creche)
  bathServices?: {
    padrao: boolean
    hidratacao: boolean
    selagem: boolean
  }
  groomingServices?: {
    tesoura: boolean
    maquina: boolean
    higienica: boolean
    tosaBebe: boolean
    tosaDaRaca: boolean
    desembolo: boolean
  }
  servicesNotes?: string

  // Itens/Acessórios
  items?: {
    coleira: boolean
    peitoral: boolean
    enforcador: boolean
    focinheira: boolean
    guia: boolean
  }

  // Parasitas
  parasites?: {
    pulgas: boolean
    carrapatos: boolean
  }

  // Lesões
  lesions?: {
    pele: boolean
    olhos: boolean
    secrecao: boolean
    ouvido: boolean
  }

  // Análise da IA
  aiAnalysis: string
  aiDiagnosis: string[]
  aiRecommendations: string[]
  analysisNotes?: string

  // Metadados
  date: string
  recordNumber: string
  professional: string

  // Dados do atendimento
  reasonForVisit: string  // Motivo da consulta
  attendingVeterinarian: string  // Veterinário responsável

  // Transcrição original
  transcription: string
}

// ============ RESULTADO DA TRANSCRIÇÃO (API) ============
export interface TranscriptionResult {
  // Dados básicos
  transcription: string
  petName?: string
  species?: string
  age?: string
  breed?: string
  color?: string
  sex?: string
  neutered?: boolean
  weight?: string

  // Dados do tutor
  tutorName?: string
  tutorPhone?: string
  tutorCPF?: string

  // Sinais vitais
  temperature?: string
  heartRate?: string
  respiratoryRate?: string
  capillaryRefillTime?: string
  mucousMembrane?: string
  hydration?: string
  bodyCondition?: string
  pulse?: string

  // Sinais clínicos
  clinicalSigns?: Partial<ClinicalSigns>
  
  // Observações extraídas
  chiefComplaint?: string    // Queixa principal
  anamnesis?: string        // Anamnese
  clinicalObservations?: string  // Observações clínicas
  otherSigns?: string       // Outros sinais

  // Histórico
  currentMedications?: string
  previousIllnesses?: string
  allergies?: string
  diet?: string

  // Exame físico
  physicalExam?: Partial<PhysicalExam>

  // Observações da IA
  analysisNotes?: string
  aiDiagnosis?: string[]
  aiRecommendations?: string[]

  // Serviços (para petshop/creche)
  bathServices?: {
    padrao: boolean
    hidratacao: boolean
    selagem: boolean
  }
  groomingServices?: {
    tesoura: boolean
    maquina: boolean
    higienica: boolean
    tosaBebe: boolean
    tosaDaRaca: boolean
    desembolo: boolean
  }
  servicesNotes?: string

  // Itens/Acessórios
  items?: {
    coleira: boolean
    peitoral: boolean
    enforcador: boolean
    focinheira: boolean
    guia: boolean
  }

  // Parasitas
  parasites?: {
    pulgas: boolean
    carrapatos: boolean
  }

  // Lesões
  lesions?: {
    pele: boolean
    olhos: boolean
    secrecao: boolean
    ouvido: boolean
  }
}

// ============ CONSTANTES ============

// Tabela de sintomas para o sistema de diagnóstico
export const SYMPTOM_PATOLOGY_TABLE = [
  // Vômito
  { symptom: "vomito", pathology: "Gastrite", breeds: ["Todas"], probability: "alta" },
  { symptom: "vomito", pathology: "Enterite", breeds: ["Todas"], probability: "alta" },
  { symptom: "vomito", pathology: "Pancreatite", breeds: ["Yorkshire", "Poodle", "Miniature Schnauzer"], probability: "media" },
  { symptom: "vomito", pathology: "Obstrução intestinal", breeds: ["Todas"], probability: "alta" },
  { symptom: "vomito", pathology: "Insuficiência renal", breeds: ["Idosos"], probability: "media" },
  { symptom: "vomito", pathology: "Hepatite", breeds: ["Todas"], probability: "media" },
  { symptom: "vomito", pathology: "Cetoacidose diabética", breeds: ["Todas"], probability: "baixa" },

  // Diarreia
  { symptom: "diarreia", pathology: "Enterite", breeds: ["Todas"], probability: "alta" },
  { symptom: "diarreia", pathology: "Gastrite", breeds: ["Todas"], probability: "alta" },
  { symptom: "diarreia", pathology: "Parvovirose", breeds: ["Cães jovens não vacinados"], probability: "alta" },
  { symptom: "diarreia", pathology: "Giardíase", breeds: ["Todas"], probability: "media" },
  { symptom: "diarreia", pathology: "Colite", breeds: ["Todas"], probability: "media" },
  { symptom: "diarreia", pathology: "Doença inflamatória intestinal", breeds: ["German Shepherd", "Boxer"], probability: "media" },

  // Tosse
  { symptom: "tosse", pathology: "Traqueobronquite infectiosa (Tosse dos canis)", breeds: ["Todas"], probability: "alta" },
  { symptom: "tosse", pathology: "Bronquite alérgica", breeds: ["Todas"], probability: "media" },
  { symptom: "tosse", pathology: "Pneumonia", breeds: ["Todas"], probability: "media" },
  { symptom: "tosse", pathology: "Cardiomiopatia", breeds: ["Doberman", "Boxer", "Golden Retriever"], probability: "media" },
  { symptom: "tosse", pathology: "Colapso de traqueia", breeds: ["Yorkshire", "Poodle", "Chihuahua", "Pomeranian"], probability: "alta" },
  { symptom: "tosse", pathology: "Doença do verme do coração", breeds: ["Todas"], probability: "media" },

  // Letargia
  { symptom: "letargia", pathology: "Anemia", breeds: ["Todas"], probability: "alta" },
  { symptom: "letargia", pathology: "Doença sistêmica", breeds: ["Todas"], probability: "alta" },
  { symptom: "letargia", pathology: "Hipotireoidismo", breeds: ["Golden Retriever", "Labrador", "Doberman"], probability: "media" },
  { symptom: "letargia", pathology: "Insuficiência adrenal", breeds: ["Todas"], probability: "baixa" },

  // Anorexia
  { symptom: "anorexia", pathology: "Doença periodontal", breeds: ["Todas"], probability: "alta" },
  { symptom: "anorexia", pathology: "Gastrite", breeds: ["Todas"], probability: "alta" },
  { symptom: "anorexia", pathology: "Pancreatite", breeds: ["Yorkshire", "Poodle", "Schnauzer"], probability: "media" },
  { symptom: "anorexia", pathology: "Insuficiência renal", breeds: ["Idosos"], probability: "media" },
  { symptom: "anorexia", pathology: "Neoplasia", breeds: ["Idosos"], probability: "media" },

  // Dispneia
  { symptom: "dispneia", pathology: "Asma felina", breeds: ["Gatos"], probability: "alta" },
  { symptom: "dispneia", pathology: "Doença cardíaca", breeds: ["Todas"], probability: "alta" },
  { symptom: "dispneia", pathology: "Pneumonia", breeds: ["Todas"], probability: "media" },
  { symptom: "dispneia", pathology: "Pneumotórax", breeds: ["Todas"], probability: "baixa" },
  { symptom: "dispneia", pathology: "Edema pulmonar", breeds: ["Todas"], probability: "media" },

  // Prurido
  { symptom: "prurido", pathology: "Dermatite alérgica", breeds: ["Todas"], probability: "alta" },
  { symptom: "prurido", pathology: "Sarna", breeds: ["Todas"], probability: "alta" },
  { symptom: "prurido", pathology: "Dermatite atópica", breeds: ["Golden", "Labrador", "Bulldog", "Boxer"], probability: "alta" },
  { symptom: "prurido", pathology: "Alergia alimentar", breeds: ["Todas"], probability: "media" },
  { symptom: "prurido", pathology: "Pulgas", breeds: ["Todas"], probability: "alta" },

  // Poliúria/Polidipsia
  { symptom: "poliuria", pathology: "Diabetes mellitus", breeds: ["Todas"], probability: "alta" },
  { symptom: "poliuria", pathology: "Insuficiência renal", breeds: ["Idosos"], probability: "alta" },
  { symptom: "poliuria", pathology: "Hipertireoidismo", breeds: ["Gatos idosos"], probability: "alta" },
  { symptom: "poliuria", pathology: "Hipertireoidismo", breeds: ["Gatos"], probability: "alta" },
  { symptom: "poliuria", pathology: "Cetoacidose diabética", breeds: ["Todas"], probability: "baixa" },
  { symptom: "poliuria", pathology: "Hiperadrenocorticismo (Síndrome de Cushing)", breeds: ["Poodle", "Dachshund", "Yorkshire"], probability: "media" },

  // Convulsões
  { symptom: "convulsoes", pathology: "Epilepsia idiopática", breeds: ["Golden", "Labrador", "Beagle", "Boxer"], probability: "alta" },
  { symptom: "convulsoes", pathology: "Intoxicação", breeds: ["Todas"], probability: "media" },
  { symptom: "convulsoes", pathology: "Tumor cerebral", breeds: ["Idosos"], probability: "baixa" },
  { symptom: "convulsoes", pathology: "Hipoglicemia", breeds: ["Cães miniaturas", "Filhotes"], probability: "media" },

  // Perda de peso
  { symptom: "perda_peso", pathology: "Parasitismo intestinal", breeds: ["Todas"], probability: "alta" },
  { symptom: "perda_peso", pathology: "Doença inflamatória intestinal", breeds: ["German Shepherd", "Boxer"], probability: "media" },
  { symptom: "perda_peso", pathology: "Neoplasia", breeds: ["Idosos"], probability: "media" },
  { symptom: "perda_peso", pathology: "Hipertireoidismo", breeds: ["Gatos idosos"], probability: "alta" },
  { symptom: "perda_peso", pathology: "Diabetes mellitus", breeds: ["Todas"], probability: "media" },

  // Dor abdominal
  { symptom: "dor_abdominal", pathology: "Gastrite", breeds: ["Todas"], probability: "alta" },
  { symptom: "dor_abdominal", pathology: "Pancreatite", breeds: ["Yorkshire", "Poodle", "Schnauzer"], probability: "alta" },
  { symptom: "dor_abdominal", pathology: "Obstrução intestinal", breeds: ["Todas"], probability: "alta" },
  { symptom: "dor_abdominal", pathology: "Peritonite", breeds: ["Todas"], probability: "baixa" },
  { symptom: "dor_abdominal", pathology: "Cistite", breeds: ["Todas"], probability: "media" },

  // Icterícia
  { symptom: "ictericia", pathology: "Hepatite", breeds: ["Todas"], probability: "alta" },
  { symptom: "ictericia", pathology: "Pancreatite", breeds: ["Todas"], probability: "media" },
  { symptom: "ictericia", pathology: "Colestase", breeds: ["Todas"], probability: "media" },
  { symptom: "ictericia", pathology: "Hemólise", breeds: ["Todas"], probability: "baixa" },

  // Descarga nasal
  { symptom: "descarga_nasal", pathology: "Rinite", breeds: ["Todas"], probability: "alta" },
  { symptom: "descarga_nasal", pathology: "Sinusite", breeds: ["Todas"], probability: "media" },
  { symptom: "descarga_nasal", pathology: "Complexo respiratório felino (FVR)", breeds: ["Gatos"], probability: "alta" },
  { symptom: "descarga_nasal", pathology: "Pneumonia", breeds: ["Todas"], probability: "media" },

  // Descarga ocular
  { symptom: "descarga_ocular", pathology: "Conjuntivite", breeds: ["Todas"], probability: "alta" },
  { symptom: "descarga_ocular", pathology: "Úlcera corneana", breeds: ["Todas"], probability: "media" },
  { symptom: "descarga_ocular", pathology: "Glaucoma", breeds: ["Cocker Spaniel", "Bassê"], probability: "media" },
  { symptom: "descarga_ocular", pathology: "Uveíte", breeds: ["Todas"], probability: "media" },
] as const

// Valores padrão para sinais vitais
export const emptyVitalSigns: VitalSigns = {
  temperature: "",
  heartRate: "",
  respiratoryRate: "",
  capillaryRefillTime: "",
  mucousMembrane: "rosadas",
  hydration: "normal",
  bodyCondition: "normal",
  pulse: ""
}

// Valores padrão para sinais clínicos
export const emptyClinicalSigns: ClinicalSigns = {
  vomiting: false,
  vomitingFrequency: "",
  diarrhea: false,
  diarrheaFrequency: "",
  coughing: false,
  coughingType: "",
  lethargy: false,
  anorexia: false,
  polyuria: false,
  polydipsia: false,
  dyspnea: false,
  nasalDischarge: false,
  ocularDischarge: false,
  pruritus: false,
  pain: false,
  painLevel: "",
  weightLoss: false,
  weakness: false,
  collapse: false,
  seizures: false,
  otherSigns: ""
}

// Valores padrão para exame físico
export const emptyPhysicalExam: PhysicalExam = {
  generalState: "alerta",
  posture: "normal",
  consciousness: "lúcido",
  integumentary: "normal",
  musculoskeletal: "normal",
  cardiovascular: "normal",
  respiratory: "normal",
  digestive: "normal",
  urogenital: "normal",
  nervous: "normal",
  lymphNodes: "normal",
  abdominalPalpation: "normal",
  notes: ""
}

// Valores padrão para histórico médico
export const emptyMedicalHistory: MedicalHistory = {
  currentMedications: "",
  previousIllnesses: "",
  previousSurgeries: "",
  allergies: "",
  vaccinesStatus: "",
  deworming: "",
  diet: "",
  environment: "",
  recentTravel: false,
  contactWithSickAnimals: false,
  toxicExposure: false,
  toxicDetails: ""
}

// Prontuário vazio
export const emptyPetRecord: PetRecord = {
  // Dados básicos
  petName: "",
  species: "canino",
  breed: "",
  age: "",
  weight: "",
  sex: "",
  neutered: false,
  color: "",
  microchip: "",

  // Tutor
  tutorName: "",
  tutorPhone: "",
  tutorCPF: "",
  tutorAddress: "",
  tutorEmail: "",

  // Sinais vitais
  vitalSigns: emptyVitalSigns,

  // Sinais clínicos
  clinicalSigns: emptyClinicalSigns,

  // Exame físico
  physicalExam: emptyPhysicalExam,

  // Histórico médico
  medicalHistory: emptyMedicalHistory,

  // Hipóteses diagnósticas
  diagnosticHypotheses: [],

  // Tratamento
  treatments: [],

  // Exames complementares
  complementaryExams: [],

  // Observações
  chiefComplaint: "",
  anamnesis: "",
  clinicalNotes: "",
  clinicalObservations: "",
  evolution: "",

  // Metadados
  date: new Date().toLocaleDateString("pt-BR"),
  recordNumber: "",
  professional: "",

  // Dados do atendimento
  reasonForVisit: "",
  attendingVeterinarian: "",

  // Serviços
  bathServices: {
    padrao: false,
    hidratacao: false,
    selagem: false,
  },
  groomingServices: {
    tesoura: false,
    maquina: false,
    higienica: false,
    tosaBebe: false,
    tosaDaRaca: false,
    desembolo: false,
  },
  servicesNotes: "",

  // Itens
  items: {
    coleira: false,
    peitoral: false,
    enforcador: false,
    focinheira: false,
    guia: false,
  },

  // Parasitas
  parasites: {
    pulgas: false,
    carrapatos: false,
  },

  // Lesões
  lesions: {
    pele: false,
    olhos: false,
    secrecao: false,
    ouvido: false,
  },

  // Análise da IA
  aiAnalysis: "",
  aiDiagnosis: [],
  aiRecommendations: [],
  analysisNotes: "",

  // Transcrição
  transcription: ""
}

