import { useState, useCallback } from "react"
import { toast } from "sonner"
import { GateScannerUi } from "./gate-scanner-ui"
import { GateStatusResultView } from "./gate-status-result-view"
import { gateCheckInSchema } from "@/schemas/hospitality"
import type { GateScanStep, ScanStatus } from "@/schemas/hospitality"

export function GateCheckInScanner() {
  const [step, setStep] = useState<GateScanStep>("SCANNING")
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [hospitalityId, setHospitalityId] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  )

  const handleScan = useCallback(
    (result: any) => {
      if (step !== "SCANNING" || status !== "idle") return

      const rawValue = result?.[0]?.rawValue
      if (!rawValue) return

      const validation = gateCheckInSchema.safeParse({
        hospitality_id: rawValue,
      })

      if (!validation.success) {
        setStatus("error")
        toast.error(validation.error.issues[0].message)
        setTimeout(() => setStatus("idle"), 2000)
        return
      }

      setHospitalityId(rawValue)
      setStatus("success")
      setTimeout(() => {
        setStep("FETCHING_STATUS")
        setStatus("idle")
      }, 1000)
    },
    [step, status]
  )

  const handleReset = () => {
    setStep("SCANNING")
    setHospitalityId(null)
    setStatus("idle")
  }

  if (step === "FETCHING_STATUS" || step === "RESULT") {
    return (
      <GateStatusResultView
        title="Gate Check-In"
        hospitalityId={hospitalityId}
        step={step}
        variant="checkin"
        onReset={handleReset}
        onStepChange={(newStep) => setStep(newStep)}
      />
    )
  }

  return (
    <GateScannerUi
      title="Gate Check-In"
      status={status}
      cameraError={cameraError}
      facingMode={facingMode}
      colorTheme="blue"
      onScan={handleScan}
      onCameraError={() => setCameraError(true)}
      onFacingModeChange={() =>
        setFacingMode((prev) =>
          prev === "environment" ? "user" : "environment"
        )
      }
    />
  )
}
