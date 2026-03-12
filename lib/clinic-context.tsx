"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ClinicConfig {
  clinicName: string
  doctorName: string
  doctorCRMV: string
  logoUrl: string | null
  address: string
  phone: string
}

interface ClinicContextType {
  config: ClinicConfig
  updateConfig: (config: Partial<ClinicConfig>) => void
}

const defaultConfig: ClinicConfig = {
  clinicName: "Kronos Clínica Veterinária",
  doctorName: "Dr. João Silva",
  doctorCRMV: "CRMV-SP 12345",
  logoUrl: null,
  address: "Rua das Flores, 123 - São Paulo/SP",
  phone: "(11) 99999-9999",
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined)

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ClinicConfig>(defaultConfig)

  const updateConfig = (newConfig: Partial<ClinicConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  return (
    <ClinicContext.Provider value={{ config, updateConfig }}>
      {children}
    </ClinicContext.Provider>
  )
}

export function useClinic() {
  const context = useContext(ClinicContext)
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider")
  }
  return context
}
