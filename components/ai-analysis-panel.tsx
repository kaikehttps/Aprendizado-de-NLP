"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Mic, Stethoscope, AlertTriangle } from "lucide-react"
import type { PetRecord, DiagnosticHypothesis } from "@/lib/types"

interface AIAnalysisPanelProps {
  record: PetRecord
  isListening?: boolean
  isAnalyzing?: boolean
}

// Função para gerar sugestões de diagnóstico baseadas nos sinais clínicos
function generateDiagnosticSuggestions(
  clinicalSigns: PetRecord["clinicalSigns"],
  species: string,
  breed: string
): DiagnosticHypothesis[] {
  const suggestions: DiagnosticHypothesis[] = []
  const breedLower = breed.toLowerCase()

  const signs = {
    vomiting: clinicalSigns.vomiting,
    diarrhea: clinicalSigns.diarrhea,
    coughing: clinicalSigns.coughing,
    lethargy: clinicalSigns.lethargy,
    anorexia: clinicalSigns.anorexia,
    dyspnea: clinicalSigns.dyspnea,
    pruritus: clinicalSigns.pruritus,
    polyuria: clinicalSigns.polyuria,
    seizures: clinicalSigns.seizures,
  }

  const pathologyData: Record<string, Array<{condition: string, probability: "alta" | "media" | "baixa", breeds: string[]}>> = {
    vomiting: [
      { condition: "Gastrite", probability: "alta", breeds: ["Todas"] },
      { condition: "Enterite", probability: "alta", breeds: ["Todas"] },
      { condition: "Pancreatite", probability: "media", breeds: ["yorkshire", "poodle", "schnauzer"] },
      { condition: "Obstrução intestinal", probability: "alta", breeds: ["Todas"] },
    ],
    diarrhea: [
      { condition: "Enterite", probability: "alta", breeds: ["Todas"] },
      { condition: "Gastrite", probability: "alta", breeds: ["Todas"] },
      { condition: "Parvovirose", probability: "alta", breeds: ["filhotes"] },
      { condition: "Giardíase", probability: "media", breeds: ["Todas"] },
    ],
    coughing: [
      { condition: "Traqueobronquite infecciosa", probability: "alta", breeds: ["Todas"] },
      { condition: "Bronquite alérgica", probability: "media", breeds: ["Todas"] },
      { condition: "Colapso de traqueia", probability: "alta", breeds: ["yorkshire", "poodle", "chihuahua"] },
    ],
    lethargy: [
      { condition: "Anemia", probability: "alta", breeds: ["Todas"] },
      { condition: "Doença sistêmica", probability: "alta", breeds: ["Todas"] },
      { condition: "Hipotireoidismo", probability: "media", breeds: ["golden", "labrador"] },
    ],
    anorexia: [
      { condition: "Doença periodontal", probability: "alta", breeds: ["Todas"] },
      { condition: "Gastrite", probability: "alta", breeds: ["Todas"] },
      { condition: "Pancreatite", probability: "media", breeds: ["yorkshire", "poodle"] },
    ],
    dyspnea: [
      { condition: "Asma felina", probability: "alta", breeds: ["gato", "felino"] },
      { condition: "Doença cardíaca", probability: "alta", breeds: ["Todas"] },
      { condition: "Pneumonia", probability: "media", breeds: ["Todas"] },
    ],
    pruritus: [
      { condition: "Dermatite alérgica", probability: "alta", breeds: ["Todas"] },
      { condition: "Sarna", probability: "alta", breeds: ["Todas"] },
      { condition: "Dermatite atópica", probability: "alta", breeds: ["golden", "labrador", "bulldog"] },
    ],
    polyuria: [
      { condition: "Diabetes mellitus", probability: "alta", breeds: ["Todas"] },
      { condition: "Insuficiência renal", probability: "alta", breeds: ["idosos"] },
      { condition: "Hipertireoidismo", probability: "alta", breeds: ["gato", "felino"] },
    ],
    seizures: [
      { condition: "Epilepsia idiopática", probability: "alta", breeds: ["golden", "labrador", "beagle"] },
      { condition: "Intoxicação", probability: "media", breeds: ["Todas"] },
      { condition: "Hipoglicemia", probability: "media", breeds: ["miniaturas"] },
    ],
  }

  let id = 0
  for (const [sign, present] of Object.entries(signs)) {
    if (present && pathologyData[sign]) {
      for (const pat of pathologyData[sign]) {
        const breedMatch = pat.breeds.some(b => 
          b === "Todas" || 
          (b === "gato" && species === "felino") ||
          (b === "idosos" && parseInt("0") > 7) ||
          breedLower.includes(b)
        )
        
        if (breedMatch) {
          suggestions.push({
            id: `hyp-${id++}`,
            condition: pat.condition,
            probability: pat.probability,
            notes: `Sinal: ${sign}`,
            selected: false,
          })
        }
      }
    }
  }

  // Ordena por probabilidade
  const priority = { alta: 0, media: 1, baixa: 2 }
  suggestions.sort((a, b) => priority[a.probability] - priority[b.probability])

  return suggestions.slice(0, 8)
}

export function AIAnalysisPanel({ record, isListening = false, isAnalyzing = false }: AIAnalysisPanelProps) {
  // Gera sugestões de diagnóstico apenas quando há sinais clínicos marcados
  const diagnosticSuggestions = useMemo(() => {
    const hasClinicalSigns = 
      record.clinicalSigns.vomiting ||
      record.clinicalSigns.diarrhea ||
      record.clinicalSigns.coughing ||
      record.clinicalSigns.lethargy ||
      record.clinicalSigns.anorexia ||
      record.clinicalSigns.dyspnea ||
      record.clinicalSigns.pruritus ||
      record.clinicalSigns.polyuria ||
      record.clinicalSigns.seizures

    if (!hasClinicalSigns) return []

    return generateDiagnosticSuggestions(record.clinicalSigns, record.species, record.breed)
  }, [record.clinicalSigns, record.species, record.breed])

  return (
    <Card className="h-full border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Transcrição da Consulta</CardTitle>
          {isAnalyzing && (
            <Badge variant="secondary" className="animate-pulse">
              Transcrevendo...
            </Badge>
          )}
        </div>
        <CardDescription>
          O que foi ouvido e transcrito pelo áudio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isListening && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-primary/10 rounded-lg border border-primary/20">
            <Mic className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              Gravando...
            </span>
          </div>
        )}

        {record.transcription ? (
          <ScrollArea className="h-[200px] rounded-md border border-border p-3 bg-muted/50 mb-4">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {record.transcription}
            </p>
          </ScrollArea>
        ) : (
          <div className="h-[80px] rounded-md border border-dashed border-border flex items-center justify-center p-4 mb-4">
            <p className="text-sm text-muted-foreground text-center">
              A transcrição aparecerá aqui após gravar ou enviar um áudio.
            </p>
          </div>
        )}

        {/* Sugestões de Diagnóstico - Apenas para o Veterinário */}
        {diagnosticSuggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Sugestões de Diagnóstico</CardTitle>
              <Badge variant="outline" className="ml-auto text-xs">
                Veterinário
              </Badge>
            </div>
            <CardDescription className="mb-3">
              Baseado nos sinais clínicos marcados. Apenas para referência do veterinário.
            </CardDescription>
            <ScrollArea className="h-[180px] rounded-md border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3">
              <div className="space-y-2">
                {diagnosticSuggestions.map((hypothesis, index) => (
                  <div 
                    key={hypothesis.id || index}
                    className="flex items-center justify-between p-2 rounded-md bg-background/80"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        hypothesis.probability === "alta" ? "text-red-500" : 
                        hypothesis.probability === "media" ? "text-amber-500" : "text-green-500"
                      }`} />
                      <span className="text-sm font-medium">
                        {hypothesis.condition}
                      </span>
                    </div>
                    <Badge 
                      variant={hypothesis.probability === "alta" ? "destructive" : 
                              hypothesis.probability === "media" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {hypothesis.probability}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Sempre confirme com exames complementares.
              </p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

