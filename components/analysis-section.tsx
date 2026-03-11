"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Heart, 
  Thermometer, 
  Wind, 
  Droplets, 
  Stethoscope,
  Activity
} from "lucide-react"
import type { PetRecord } from "@/lib/types"

interface AnalysisSectionProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function AnalysisSection({ record, onChange, readOnly = false }: AnalysisSectionProps) {
  const handleVitalSignChange = (field: string, value: string) => {
    onChange({
      vitalSigns: {
        ...record.vitalSigns,
        [field]: value,
      },
    })
  }

  const handleClinicalSignChange = (field: string, value: boolean | string) => {
    onChange({
      clinicalSigns: {
        ...record.clinicalSigns,
        [field]: value,
      },
    })
  }

  return (
    <div className="border-b border-border space-y-6">
      {/* Section Title */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <h2 className="text-lg font-semibold text-center">Avaliação Clínica</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* SINAIS VITAIS */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Sinais Vitais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Temperatura */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Thermometer className="h-3 w-3" /> Temp. (°C)
                </Label>
                <Input
                  type="text"
                  value={record.vitalSigns.temperature}
                  onChange={(e) => handleVitalSignChange("temperature", e.target.value)}
                  placeholder="38.5"
                  disabled={readOnly}
                  className="border-primary/30"
                />
              </div>

              {/* Frequência Cardíaca */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Heart className="h-3 w-3" /> FC (bpm)
                </Label>
                <Input
                  type="text"
                  value={record.vitalSigns.heartRate}
                  onChange={(e) => handleVitalSignChange("heartRate", e.target.value)}
                  placeholder="120"
                  disabled={readOnly}
                  className="border-primary/30"
                />
              </div>

              {/* Frequência Respiratória */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wind className="h-3 w-3" /> FR (rpm)
                </Label>
                <Input
                  type="text"
                  value={record.vitalSigns.respiratoryRate}
                  onChange={(e) => handleVitalSignChange("respiratoryRate", e.target.value)}
                  placeholder="30"
                  disabled={readOnly}
                  className="border-primary/30"
                />
              </div>

              {/* TRC */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">TRC (seg)</Label>
                <Input
                  type="text"
                  value={record.vitalSigns.capillaryRefillTime}
                  onChange={(e) => handleVitalSignChange("capillaryRefillTime", e.target.value)}
                  placeholder="< 2"
                  disabled={readOnly}
                  className="border-primary/30"
                />
              </div>

              {/* Mucosas */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Mucosas</Label>
                <select
                  value={record.vitalSigns.mucousMembrane}
                  onChange={(e) => handleVitalSignChange("mucousMembrane", e.target.value)}
                  disabled={readOnly}
                  className="w-full h-9 rounded-md border border-primary/30 bg-background px-3 py-1 text-sm"
                >
                  <option value="">Selecionar...</option>
                  <option value="rosadas">Rosadas</option>
                  <option value="pálidas">Pálidas</option>
                  <option value="ictéricas">Ictéricas</option>
                  <option value="cianóticas">Cianóticas</option>
                  <option value="hiperêmicas">Hiperêmicas</option>
                </select>
              </div>

              {/* Hidratação */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> Hidratação
                </Label>
                <select
                  value={record.vitalSigns.hydration}
                  onChange={(e) => handleVitalSignChange("hydration", e.target.value)}
                  disabled={readOnly}
                  className="w-full h-9 rounded-md border border-primary/30 bg-background px-3 py-1 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="desidratado leve">Desidratado Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="severo">Severo</option>
                </select>
              </div>

              {/* Condição Corporal */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Condição Corporal</Label>
                <select
                  value={record.vitalSigns.bodyCondition}
                  onChange={(e) => handleVitalSignChange("bodyCondition", e.target.value)}
                  disabled={readOnly}
                  className="w-full h-9 rounded-md border border-primary/30 bg-background px-3 py-1 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="magro">Magro</option>
                  <option value="obesidade">Obesidade</option>
                </select>
              </div>

              {/* Pulso */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Pulso</Label>
                <select
                  value={record.vitalSigns.pulse}
                  onChange={(e) => handleVitalSignChange("pulse", e.target.value)}
                  disabled={readOnly}
                  className="w-full h-9 rounded-md border border-primary/30 bg-background px-3 py-1 text-sm"
                >
                  <option value="">Selecionar...</option>
                  <option value="forte">Forte</option>
                  <option value="fraco">Fraco</option>
                  <option value="rítmico">Rítmico</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SINAIS CLÍNICOS */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Sinais Clínicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Vômito */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vomiting"
                  checked={record.clinicalSigns.vomiting}
                  onCheckedChange={(checked) => handleClinicalSignChange("vomiting", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="vomiting" className="text-sm cursor-pointer">Vômito</Label>
              </div>

              {/* Diarreia */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diarrhea"
                  checked={record.clinicalSigns.diarrhea}
                  onCheckedChange={(checked) => handleClinicalSignChange("diarrhea", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="diarrhea" className="text-sm cursor-pointer">Diarreia</Label>
              </div>

              {/* Tosse */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coughing"
                  checked={record.clinicalSigns.coughing}
                  onCheckedChange={(checked) => handleClinicalSignChange("coughing", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="coughing" className="text-sm cursor-pointer">Tosse</Label>
              </div>

              {/* Letargia */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lethargy"
                  checked={record.clinicalSigns.lethargy}
                  onCheckedChange={(checked) => handleClinicalSignChange("lethargy", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="lethargy" className="text-sm cursor-pointer">Letargia</Label>
              </div>

              {/* Anorexia */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anorexia"
                  checked={record.clinicalSigns.anorexia}
                  onCheckedChange={(checked) => handleClinicalSignChange("anorexia", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="anorexia" className="text-sm cursor-pointer">Anorexia</Label>
              </div>

              {/* Poliúria */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="polyuria"
                  checked={record.clinicalSigns.polyuria}
                  onCheckedChange={(checked) => handleClinicalSignChange("polyuria", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="polyuria" className="text-sm cursor-pointer">Poliúria</Label>
              </div>

              {/* Polidipsia */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="polydipsia"
                  checked={record.clinicalSigns.polydipsia}
                  onCheckedChange={(checked) => handleClinicalSignChange("polydipsia", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="polydipsia" className="text-sm cursor-pointer">Polidipsia</Label>
              </div>

              {/* Dispneia */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dyspnea"
                  checked={record.clinicalSigns.dyspnea}
                  onCheckedChange={(checked) => handleClinicalSignChange("dyspnea", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="dyspnea" className="text-sm cursor-pointer">Dispneia</Label>
              </div>

              {/* Prurido */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pruritus"
                  checked={record.clinicalSigns.pruritus}
                  onCheckedChange={(checked) => handleClinicalSignChange("pruritus", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="pruritus" className="text-sm cursor-pointer">Prurido</Label>
              </div>

              {/* Dor */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pain"
                  checked={record.clinicalSigns.pain}
                  onCheckedChange={(checked) => handleClinicalSignChange("pain", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="pain" className="text-sm cursor-pointer">Dor</Label>
              </div>

              {/* Fraqueza */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weakness"
                  checked={record.clinicalSigns.weakness}
                  onCheckedChange={(checked) => handleClinicalSignChange("weakness", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="weakness" className="text-sm cursor-pointer">Fraqueza</Label>
              </div>

              {/* Convulsões */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seizures"
                  checked={record.clinicalSigns.seizures}
                  onCheckedChange={(checked) => handleClinicalSignChange("seizures", checked === true)}
                  disabled={readOnly}
                  className="border-primary"
                />
                <Label htmlFor="seizures" className="text-sm cursor-pointer">Convulsões</Label>
              </div>
            </div>

            {/* Observações clínicas */}
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">Observações Clínicas</Label>
              <Textarea
                value={record.clinicalObservations || ""}
                onChange={(e) => onChange({ clinicalObservations: e.target.value })}
                placeholder="Descreva observações adicionais..."
                readOnly={readOnly}
                className="mt-1 border-primary/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* OBSERVAÇÕES GERAIS */}
        <Card className="border-primary/20">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Queixa Principal</Label>
                <Textarea
                  value={record.chiefComplaint}
                  onChange={(e) => onChange({ chiefComplaint: e.target.value })}
                  placeholder="Motivo da consulta..."
                  readOnly={readOnly}
                  className="mt-1 border-primary/30"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Anamnese</Label>
                <Textarea
                  value={record.anamnesis}
                  onChange={(e) => onChange({ anamnesis: e.target.value })}
                  placeholder="Histórico do paciente..."
                  readOnly={readOnly}
                  className="mt-1 border-primary/30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

