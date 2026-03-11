"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PetRecord } from "@/lib/types"

interface PetInfoSectionProps {
  record: PetRecord
  onChange: (updates: Partial<PetRecord>) => void
  readOnly?: boolean
}

export function PetInfoSection({ record, onChange, readOnly = false }: PetInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 border-b border-border">
      {/* Row 1: Pet Name and Breed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="petName" className="text-xs font-semibold text-foreground/80">
            Nome do Pet
          </Label>
          <Input
            id="petName"
            value={record.petName}
            onChange={(e) => onChange({ petName: e.target.value })}
            placeholder="Nome do animal"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="breed" className="text-xs font-semibold text-foreground/80">
            Raça
          </Label>
          <Input
            id="breed"
            value={record.breed}
            onChange={(e) => onChange({ breed: e.target.value })}
            placeholder="Ex: Golden Retriever, Vira-lata"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Row 2: Species, Age, Weight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-foreground/80">Espécie</Label>
          <Select
            value={record.species}
            onValueChange={(value: "canino" | "felino" | "ave" | "roedor" | "outro") =>
              onChange({ species: value })
            }
            disabled={readOnly}
          >
            <SelectTrigger className="border-primary/30">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="canino">Canino</SelectItem>
              <SelectItem value="felino">Felino</SelectItem>
              <SelectItem value="ave">Ave</SelectItem>
              <SelectItem value="roedor">Roedor</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="age" className="text-xs font-semibold text-foreground/80">
            Idade
          </Label>
          <Input
            id="age"
            value={record.age}
            onChange={(e) => onChange({ age: e.target.value })}
            placeholder="Ex: 3 anos"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="weight" className="text-xs font-semibold text-foreground/80">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            value={record.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
            placeholder="Ex: 15kg"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Row 3: Sex, Neutered, Color */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-foreground/80">Sexo</Label>
          <Select
            value={record.sex}
            onValueChange={(value: "macho" | "femea") => onChange({ sex: value })}
            disabled={readOnly}
          >
            <SelectTrigger className="border-primary/30">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="macho">Macho</SelectItem>
              <SelectItem value="femea">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="color" className="text-xs font-semibold text-foreground/80">
            Cor/Pelagem
          </Label>
          <Input
            id="color"
            value={record.color}
            onChange={(e) => onChange({ color: e.target.value })}
            placeholder="Ex: Caramelo, preto"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
        
        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="neutered"
              checked={record.neutered}
              onCheckedChange={(checked) => onChange({ neutered: checked === true })}
              disabled={readOnly}
              className="border-primary data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="neutered"
              className="text-sm font-semibold text-foreground/80 cursor-pointer"
            >
              Castrado
            </Label>
          </div>
        </div>
      </div>

      {/* Row 4: Microchip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="microchip" className="text-xs font-semibold text-foreground/80">
            Microchip
          </Label>
          <Input
            id="microchip"
            value={record.microchip}
            onChange={(e) => onChange({ microchip: e.target.value })}
            placeholder="Número do microchip"
            readOnly={readOnly}
            className="border-primary/30 focus:border-primary"
          />
        </div>
      </div>
    </div>
  )
}

