"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PetRecord } from "@/lib/types"

interface AnalysisSectionProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function AnalysisSection({ record, onChange, readOnly = false }: AnalysisSectionProps) {
  return (
    <div className="border-b border-border">
      {/* Section Title */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <h2 className="text-lg font-semibold text-center">Análise do Pet</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Parasitas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1">
              Parasitas
            </h3>
            <div className="space-y-2">
              {[
                { key: "pulgas", label: "Pulgas" },
                { key: "carrapatos", label: "Carrapatos" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`parasite-${key}`}
                    checked={record.parasites[key as keyof typeof record.parasites]}
                    onCheckedChange={(checked) =>
                      onChange({
                        parasites: {
                          ...record.parasites,
                          [key]: checked === true,
                        },
                      })
                    }
                    disabled={readOnly}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`parasite-${key}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Lesões */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1">
              Lesões
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "pele", label: "Pele" },
                { key: "secrecao", label: "Secreção" },
                { key: "olhos", label: "Olhos" },
                { key: "ouvido", label: "Ouvido" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lesion-${key}`}
                    checked={record.lesions[key as keyof typeof record.lesions]}
                    onCheckedChange={(checked) =>
                      onChange({
                        lesions: {
                          ...record.lesions,
                          [key]: checked === true,
                        },
                      })
                    }
                    disabled={readOnly}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`lesion-${key}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1">
              Obs.
            </h3>
            <Textarea
              value={record.analysisNotes}
              onChange={(e) => onChange({ analysisNotes: e.target.value })}
              placeholder="Observações sobre a análise..."
              readOnly={readOnly}
              className="min-h-[80px] border-primary/30 focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
