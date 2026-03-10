"use client"

import { useState, useEffect } from "react"
import { ClinicProvider } from "@/lib/clinic-context"
import { PetRecordForm } from "@/components/pet-record-form"
import { AIAnalysisPanel } from "@/components/ai-analysis-panel"
import { AudioRecorder } from "@/components/audio-recorder"
import { SettingsModal } from "@/components/settings-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Brain, 
  Printer, 
  RefreshCw, 
  Stethoscope,
  ClipboardList
} from "lucide-react"
import { emptyPetRecord, type PetRecord, type TranscriptionResult } from "@/lib/types"

function generateRecordNumber() {
  return `APX-${Math.floor(Math.random() * 900000 + 100000)}`
}

function ProntuarioContent() {
  const [record, setRecord] = useState<PetRecord>({
    ...emptyPetRecord,
    date: "",
    recordNumber: "",
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setRecord(prev => ({
      ...prev,
      date: new Date().toLocaleDateString("pt-BR"),
      recordNumber: generateRecordNumber(),
    }))
  }, [])
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRecordChange = (updates: Partial<PetRecord>) => {
    setRecord((prev) => ({ ...prev, ...updates }))
  }

  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setIsAnalyzing(true)
    setRecord((prev) => {
      const speciesMap: Record<string, PetRecord["species"]> = {
        canino: "canino",
        felino: "felino",
      }
      const species = result.species
        ? speciesMap[result.species.toLowerCase()] ?? prev.species
        : prev.species
      const sexMap: Record<string, PetRecord["sex"]> = {
        macho: "macho",
        femea: "femea",
        fêmea: "femea",
      }
      const sex = result.sex ? sexMap[result.sex.toLowerCase()] ?? prev.sex : prev.sex
      return {
        ...prev,
        transcription: result.transcription,
        petName: result.petName || prev.petName,
        species,
        age: result.age || prev.age,
        colorRace: result.colorRace || prev.colorRace,
        sex,
        neutered: result.neutered ?? prev.neutered,
        weight: result.weight || prev.weight,
        tutorName: result.tutorName || prev.tutorName,
        tutorPhone: result.tutorPhone || prev.tutorPhone,
        tutorCPF: result.tutorCPF || prev.tutorCPF,
        analysisNotes: result.analysisNotes || prev.analysisNotes,
        items: result.items
          ? { ...prev.items, ...result.items }
          : prev.items,
        bathServices: result.bathServices
          ? { ...prev.bathServices, ...result.bathServices }
          : prev.bathServices,
        groomingServices: result.groomingServices
          ? { ...prev.groomingServices, ...result.groomingServices }
          : prev.groomingServices,
        parasites: result.parasites
          ? { ...prev.parasites, ...result.parasites }
          : prev.parasites,
        lesions: result.lesions
          ? { ...prev.lesions, ...result.lesions }
          : prev.lesions,
        aiAnalysis: result.analysisNotes || prev.aiAnalysis,
      }
    })
    setIsAnalyzing(false)
  }

  const handleNewRecord = () => {
    setRecord({
      ...emptyPetRecord,
      date: new Date().toLocaleDateString("pt-BR"),
      recordNumber: generateRecordNumber(),
    })
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando prontuário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">ApexVet</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Prontuário Inteligente com IA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden md:flex">
                <Brain className="h-3 w-3 mr-1" />
                IA Ativa
              </Badge>
              <SettingsModal />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Record Form */}
          <div className="flex-1 lg:max-w-3xl">
            <Tabs defaultValue="prontuario" className="space-y-4 no-print">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="prontuario" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Prontuário
                </TabsTrigger>
                <TabsTrigger value="gravacao" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Gravação
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prontuario" className="space-y-4">
                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleNewRecord} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Novo Prontuário
                  </Button>
                  <Button variant="outline" onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
                <PetRecordForm record={record} onChange={handleRecordChange} />
              </TabsContent>

              <TabsContent value="gravacao" className="space-y-4">
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
                <PetRecordForm record={record} onChange={handleRecordChange} />
              </TabsContent>
            </Tabs>

            {/* Print version - always show form */}
            <div className="hidden" id="print-area">
              <PetRecordForm record={record} onChange={handleRecordChange} readOnly />
            </div>
          </div>

          {/* Right Side - AI Analysis */}
          <div className="lg:w-[380px] no-print">
            <div className="sticky top-4">
              <AIAnalysisPanel
                record={record}
                isListening={isRecording}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-8 no-print">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            ApexVet © 2026 — Sistema de prontuário veterinário com inteligência artificial
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <ClinicProvider>
      <ProntuarioContent />
    </ClinicProvider>
  )
}
