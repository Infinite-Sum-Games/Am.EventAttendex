import { useState } from "react"
import { MapQrScannerView } from "./map-qr-scanner-view"
import { MapQrResultView } from "./map-qr-result-view"
import type { Step, MapQrResponse } from "@/schemas/hospitality"

export function MapQrScanner() {
  const [step, setStep] = useState<Step>("SCAN_STUDENT")
  const [studentId, setStudentId] = useState<string | null>(null)
  const [hospitalityId, setHospitalityId] = useState<string | null>(null)
  const [mapQrData, setMapQrData] = useState<MapQrResponse | undefined>()

  const handleMappingComplete = (data: MapQrResponse) => {
    setMapQrData(data)
    setStep("RESULT")
  }

  const handleReset = () => {
    setStep("SCAN_STUDENT")
    setStudentId(null)
    setHospitalityId(null)
    setMapQrData(undefined)
  }

  if (step === "RESULT") {
    return (
      <MapQrResultView
        studentId={studentId}
        hospitalityId={hospitalityId}
        mapQrData={mapQrData}
        onReset={handleReset}
      />
    )
  }

  return (
    <MapQrScannerView
      studentId={studentId}
      onStudentIdChange={setStudentId}
      onHospitalityIdChange={setHospitalityId}
      onMappingComplete={handleMappingComplete}
    />
  )
}
