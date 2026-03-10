"use client"

import { useClinic } from "@/lib/clinic-context"
import { Stethoscope } from "lucide-react"
import Image from "next/image"

interface RecordHeaderProps {
  date: string
  recordNumber: string
  professional: string
}

export function RecordHeader({ date, recordNumber, professional }: RecordHeaderProps) {
  const { config } = useClinic()

  return (
    <div className="bg-primary text-primary-foreground rounded-t-lg">
      <div className="flex items-start gap-4 p-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          {config.logoUrl ? (
            <Image
              src={config.logoUrl}
              alt={config.clinicName}
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-primary-foreground/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Title and Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Ficha de Atendimento</h1>
          <p className="text-primary-foreground/80 text-sm">{config.clinicName}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-sm">
            <div className="bg-primary-foreground/10 rounded px-3 py-1.5">
              <span className="text-primary-foreground/70 text-xs block">Data</span>
              <span className="font-medium">{date || "___/___/______"}</span>
            </div>
            <div className="bg-primary-foreground/10 rounded px-3 py-1.5">
              <span className="text-primary-foreground/70 text-xs block">Número</span>
              <span className="font-medium">{recordNumber || "________"}</span>
            </div>
            <div className="bg-primary-foreground/10 rounded px-3 py-1.5 col-span-2 md:col-span-1">
              <span className="text-primary-foreground/70 text-xs block">Profissional</span>
              <span className="font-medium">{professional || config.doctorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
