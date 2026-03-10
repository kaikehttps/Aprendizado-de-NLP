export interface PetRecord {
  // Dados básicos
  petName: string
  colorRace: string
  age: string
  weight: string
  sex: "macho" | "femea" | ""
  neutered: boolean
  species: "canino" | "felino" | "ave" | "roedor" | "outro"

  // Itens/Acessórios
  items: {
    coleira: boolean
    peitoral: boolean
    enforcador: boolean
    focinheira: boolean
    guia: boolean
  }

  // Serviços - Banho
  bathServices: {
    padrao: boolean
    hidratacao: boolean
    selagem: boolean
  }

  // Serviços - Tosa
  groomingServices: {
    tesoura: boolean
    maquina: boolean
    higienica: boolean
    tosaBebe: boolean
    tosaDaRaca: boolean
    desembolo: boolean
  }

  // Análise do Pet
  parasites: {
    pulgas: boolean
    carrapatos: boolean
  }

  lesions: {
    pele: boolean
    olhos: boolean
    secrecao: boolean
    ouvido: boolean
  }

  // Observações
  servicesNotes: string
  analysisNotes: string

  // Dados do Tutor
  tutorName: string
  tutorPhone: string
  tutorCPF: string

  // Metadados
  date: string
  recordNumber: string
  professional: string

  // Análise da IA
  aiAnalysis: string
  aiDiagnosis: string[]
  aiRecommendations: string[]

  // Transcrição
  transcription: string
}

/** Resposta do backend - transcrição + dados extraídos automaticamente */
export interface TranscriptionResult {
  transcription: string
  petName?: string
  species?: string
  age?: string
  colorRace?: string
  sex?: string
  neutered?: boolean
  weight?: string
  tutorName?: string
  tutorPhone?: string
  tutorCPF?: string
  analysisNotes?: string
  items?: Partial<PetRecord["items"]>
  bathServices?: Partial<PetRecord["bathServices"]>
  groomingServices?: Partial<PetRecord["groomingServices"]>
  parasites?: Partial<PetRecord["parasites"]>
  lesions?: Partial<PetRecord["lesions"]>
}

export const emptyPetRecord: PetRecord = {
  petName: "",
  colorRace: "",
  age: "",
  weight: "",
  sex: "",
  neutered: false,
  species: "canino",
  items: {
    coleira: false,
    peitoral: false,
    enforcador: false,
    focinheira: false,
    guia: false,
  },
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
  parasites: {
    pulgas: false,
    carrapatos: false,
  },
  lesions: {
    pele: false,
    olhos: false,
    secrecao: false,
    ouvido: false,
  },
  servicesNotes: "",
  analysisNotes: "",
  tutorName: "",
  tutorPhone: "",
  tutorCPF: "",
  date: new Date().toLocaleDateString("pt-BR"),
  recordNumber: "",
  professional: "",
  aiAnalysis: "",
  aiDiagnosis: [],
  aiRecommendations: [],
  transcription: "",
}
