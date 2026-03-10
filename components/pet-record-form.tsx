"use client"

import { RecordHeader } from "./record-header"
import { PetInfoSection } from "./pet-info-section"
import { ServicesSection } from "./services-section"
import { AnalysisSection } from "./analysis-section"
import { TutorSection } from "./tutor-section"
import { useClinic } from "@/lib/clinic-context"
import type { PetRecord } from "@/lib/types"

interface PetRecordFormProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function PetRecordForm({ record, onChange, readOnly = false }: PetRecordFormProps) {
  const { config } = useClinic()

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <RecordHeader
        date={record.date}
        recordNumber={record.recordNumber}
        professional={record.professional || config.doctorName}
      />

      {/* Pet Information */}
      <PetInfoSection record={record} onChange={onChange} readOnly={readOnly} />

      {/* Services */}
      <ServicesSection record={record} onChange={onChange} readOnly={readOnly} />

      {/* Analysis */}
      <AnalysisSection record={record} onChange={onChange} readOnly={readOnly} />

      {/* Tutor */}
      <TutorSection record={record} onChange={onChange} readOnly={readOnly} />

      {/* Footer */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs rounded-b-lg">
        <p>{config.clinicName} • {config.address} • {config.phone}</p>
        <p className="mt-1 text-primary-foreground/70">{config.doctorName} - {config.doctorCRMV}</p>
      </div>
    </div>
  )
}
