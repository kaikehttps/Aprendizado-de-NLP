"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Mic } from "lucide-react"
import type { PetRecord } from "@/lib/types"

interface AIAnalysisPanelProps {
  record: PetRecord
  isListening?: boolean
  isAnalyzing?: boolean
}

export function AIAnalysisPanel({ record, isListening = false, isAnalyzing = false }: AIAnalysisPanelProps) {
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
          <ScrollArea className="h-[300px] rounded-md border border-border p-3 bg-muted/50">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {record.transcription}
            </p>
          </ScrollArea>
        ) : (
          <div className="h-[120px] rounded-md border border-dashed border-border flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground text-center">
              A transcrição aparecerá aqui após gravar ou enviar um áudio e clicar em &quot;Transcrever Agora&quot;.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
