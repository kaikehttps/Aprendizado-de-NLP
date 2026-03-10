"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Upload, X } from "lucide-react"
import { useClinic } from "@/lib/clinic-context"
import Image from "next/image"

export function SettingsModal() {
  const { config, updateConfig } = useClinic()
  const [open, setOpen] = useState(false)
  const [tempConfig, setTempConfig] = useState(config)
  const [previewUrl, setPreviewUrl] = useState<string | null>(config.logoUrl)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setTempConfig({ ...tempConfig, logoUrl: url })
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    setTempConfig({ ...tempConfig, logoUrl: null })
  }

  const handleSave = () => {
    updateConfig(tempConfig)
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setTempConfig(config)
      setPreviewUrl(config.logoUrl)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
          <span className="sr-only">Configurações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Configurações da Clínica</DialogTitle>
          <DialogDescription>
            Personalize as informações que aparecem no prontuário
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo da Clínica</Label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Logo"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-primary"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/30">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG ou SVG (máx. 1MB)
                </p>
              </div>
            </div>
          </div>

          {/* Clinic Name */}
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input
              id="clinicName"
              value={tempConfig.clinicName}
              onChange={(e) =>
                setTempConfig({ ...tempConfig, clinicName: e.target.value })
              }
              placeholder="Nome da sua clínica"
            />
          </div>

          {/* Doctor Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Nome do Veterinário</Label>
              <Input
                id="doctorName"
                value={tempConfig.doctorName}
                onChange={(e) =>
                  setTempConfig({ ...tempConfig, doctorName: e.target.value })
                }
                placeholder="Dr. Nome Sobrenome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorCRMV">CRMV</Label>
              <Input
                id="doctorCRMV"
                value={tempConfig.doctorCRMV}
                onChange={(e) =>
                  setTempConfig({ ...tempConfig, doctorCRMV: e.target.value })
                }
                placeholder="CRMV-XX 00000"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={tempConfig.address}
              onChange={(e) =>
                setTempConfig({ ...tempConfig, address: e.target.value })
              }
              placeholder="Rua, número - Cidade/Estado"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={tempConfig.phone}
              onChange={(e) =>
                setTempConfig({ ...tempConfig, phone: e.target.value })
              }
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
