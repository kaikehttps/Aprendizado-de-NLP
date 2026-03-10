"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PetRecord } from "@/lib/types"

interface TutorSectionProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function TutorSection({ record, onChange, readOnly = false }: TutorSectionProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Declaração */}
      <div className="text-xs text-foreground/70 bg-muted p-3 rounded-lg border border-border">
        <p className="text-justify leading-relaxed">
          Assinando este documento, declaro que li e estou de acordo com as informações aqui
          descritas e marcadas, bem como o resultado dos serviços solicitados e que recebi o
          animal em perfeito estado e estou ciente das possíveis anormalidades presentes.
        </p>
      </div>

      {/* Nome e Assinatura */}
      <div className="space-y-1">
        <Label htmlFor="tutorName" className="text-xs font-semibold text-foreground/80">
          Nome e Assinatura do Tutor
        </Label>
        <Input
          id="tutorName"
          value={record.tutorName}
          onChange={(e) => onChange({ tutorName: e.target.value })}
          placeholder=""
          readOnly={readOnly}
          className="border-primary/30 focus:border-primary"
        />
      </div>

      {/* Telefone e CPF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tutorPhone" className="text-xs font-semibold text-foreground/80">
            Telefone
          </Label>
          <Input
            id="tutorPhone"
            value={record.tutorPhone}
            onChange={(e) => onChange({ tutorPhone: e.target.value })}
            placeholder="(00) 00000-0000"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tutorCPF" className="text-xs font-semibold text-foreground/80">
            CPF
          </Label>
          <Input
            id="tutorCPF"
            value={record.tutorCPF}
            onChange={(e) => onChange({ tutorCPF: e.target.value })}
            placeholder="000.000.000-00"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
      </div>
    </div>
  )
}
