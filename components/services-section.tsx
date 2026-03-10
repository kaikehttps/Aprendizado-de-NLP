"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PetRecord } from "@/lib/types"

interface ServicesSectionProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function ServicesSection({ record, onChange, readOnly = false }: ServicesSectionProps) {
  return (
    <div className="border-b border-border">
      {/* Section Title */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <h2 className="text-lg font-semibold text-center">Serviços</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banho */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1">
              Banho
            </h3>
            <div className="space-y-2">
              {[
                { key: "padrao", label: "Padrão" },
                { key: "hidratacao", label: "Hidratação" },
                { key: "selagem", label: "Selagem" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bath-${key}`}
                    checked={record.bathServices[key as keyof typeof record.bathServices]}
                    onCheckedChange={(checked) =>
                      onChange({
                        bathServices: {
                          ...record.bathServices,
                          [key]: checked === true,
                        },
                      })
                    }
                    disabled={readOnly}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`bath-${key}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tosa */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1">
              Tosa
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "tesoura", label: "Tesoura" },
                { key: "tosaBebe", label: "Tosa Bebê" },
                { key: "maquina", label: "Máquina" },
                { key: "tosaDaRaca", label: "Tosa da Raça" },
                { key: "higienica", label: "Higiênica" },
                { key: "desembolo", label: "Desembolo" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grooming-${key}`}
                    checked={
                      record.groomingServices[key as keyof typeof record.groomingServices]
                    }
                    onCheckedChange={(checked) =>
                      onChange({
                        groomingServices: {
                          ...record.groomingServices,
                          [key]: checked === true,
                        },
                      })
                    }
                    disabled={readOnly}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`grooming-${key}`}
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
              value={record.servicesNotes}
              onChange={(e) => onChange({ servicesNotes: e.target.value })}
              placeholder="Observações sobre os serviços..."
              readOnly={readOnly}
              className="min-h-[100px] border-primary/30 focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
