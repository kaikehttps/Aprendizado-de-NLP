"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, Upload, Loader2, Trash2 } from "lucide-react"
import type { TranscriptionResult } from "@/lib/types"

interface AudioRecorderProps {
  onTranscriptionComplete: (result: TranscriptionResult) => void
  isRecording: boolean
  setIsRecording: (value: boolean) => void
}

export function AudioRecorder({
  onTranscriptionComplete,
  isRecording,
  setIsRecording,
}: AudioRecorderProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [status, setStatus] = useState<{ message: string; type: "info" | "success" | "error" } | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4"
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // bitrate adequado para gravações longas (2+ min)
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        if (audioBlob.size > 0) {
          const ext = mimeType.includes("mp4") ? "m4a" : "webm"
          const file = new File([audioBlob], `recording.${ext}`, { type: mimeType })
          setAudioFile(file)
        } else {
          setStatus({ message: "Gravação vazia. Tente novamente.", type: "error" })
        }
        stream.getTracks().forEach((track) => track.stop())
      }

      // timeslice 1s: permite gravações longas (2+ min) sem truncar
      mediaRecorder.start(1000)
      setIsRecording(true)
      setStatus({ message: "Gravando... Fale sobre o paciente", type: "info" })
    } catch (error) {
      console.error("Erro ao acessar microfone:", error)
      setStatus({ message: "Erro ao acessar microfone. Verifique as permissões.", type: "error" })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.requestData() // força envio do último chunk
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setStatus({ message: "Gravação concluída! Clique em transcrever.", type: "success" })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setStatus({ message: `Arquivo "${file.name}" carregado`, type: "success" })
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile) {
      setStatus({ message: "Selecione ou grave um áudio primeiro", type: "error" })
      return
    }

    setIsProcessing(true)
    setStatus({ message: "Processando áudio com IA...", type: "info" })

    try {
      const formData = new FormData()
      formData.append("file", audioFile)
      const response = await fetch("http://127.0.0.1:8000/transcrever", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok || data.erro) {
        throw new Error(data.erro || `Erro ${response.status}`)
      }
      onTranscriptionComplete({
        transcription: data.transcription ?? "",
        petName: data.petName,
        species: data.species,
        age: data.age,
        colorRace: data.colorRace,
        sex: data.sex,
        neutered: data.neutered,
        weight: data.weight,
        items: data.items,
        tutorName: data.tutorName,
        tutorPhone: data.tutorPhone,
        tutorCPF: data.tutorCPF,
        analysisNotes: data.analysisNotes,
        bathServices: data.bathServices,
        groomingServices: data.groomingServices,
        parasites: data.parasites,
        lesions: data.lesions,
      })
      setStatus({ message: "Transcrição concluída com sucesso!", type: "success" })
    } catch (error) {
      console.error("Erro ao transcrever:", error)
      const msg = error instanceof Error ? error.message : "Erro ao transcrever. Verifique se o backend está rodando (python backend.py)."
      setStatus({ message: msg, type: "error" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setAudioFile(null)
    setStatus(null)
    audioChunksRef.current = []
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Gravação de Consulta
            </CardTitle>
          </div>
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              REC
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botões de Gravação */}
        <div className="flex gap-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4 mr-2" />
              Iniciar Gravação
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="flex-1"
            >
              <MicOff className="h-4 w-4 mr-2" />
              Parar Gravação
            </Button>
          )}
        </div>

        {/* Upload de Arquivo */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground/80">Ou envie um arquivo de áudio</Label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="flex-1 border-primary/30"
              disabled={isRecording || isProcessing}
            />
            {audioFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Arquivo Selecionado */}
        {audioFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <Upload className="h-4 w-4 text-primary" />
            <span className="text-sm truncate flex-1">{audioFile.name}</span>
            <Badge variant="outline" className="text-xs">
              {(audioFile.size / 1024).toFixed(1)} KB
            </Badge>
          </div>
        )}

        {/* Botão Transcrever */}
        <Button
          onClick={handleTranscribe}
          disabled={!audioFile || isProcessing || isRecording}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            "Transcrever Agora"
          )}
        </Button>

        {/* Status */}
        {status && (
          <div
            className={`p-3 rounded-lg text-sm font-medium text-center ${
              status.type === "info"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
