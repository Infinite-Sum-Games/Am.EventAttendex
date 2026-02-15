import { useState, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { MapQrScannerUi } from "./map-qr-scanner-ui"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import { mapQrSchema } from "@/schemas/hospitality"
import type { Step, ScanStatus, MapQrResponse } from "@/schemas/hospitality"

interface MapQrScannerViewProps {
  studentId: string | null
  onStudentIdChange: (id: string | null) => void
  onHospitalityIdChange: (id: string | null) => void
  onMappingComplete: (data: MapQrResponse) => void
}

export function MapQrScannerView({
  studentId,
  onStudentIdChange,
  onHospitalityIdChange,
  onMappingComplete,
}: MapQrScannerViewProps) {
  const [step, setStep] = useState<Step>("SCAN_STUDENT")
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [cameraError, setCameraError] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  )

  const mapQrMutation = useMutation({
    mutationFn: async (data: {
      student_id: string
      hospitality_id: string
    }) => {
      const response = await axiosClient.post(apiEndpoints.MAP_QR, data)
      return response.data as MapQrResponse
    },
    onSuccess: (data) => {
      setStatus("success")
      setTimeout(() => {
        onMappingComplete(data)
      }, 1500)
    },
    onError: (error: any) => {
      setStatus("error")
      toast.error(error.response?.data?.message || "Failed to map QR codes")
      resetStatusAfterDelay()
    },
  })

  const resetStatusAfterDelay = useCallback(() => {
    setTimeout(() => {
      setStatus("idle")
      if (step === "MAPPING") {
        setStep("SCAN_STUDENT")
        onStudentIdChange(null)
        onHospitalityIdChange(null)
      }
    }, 2000)
  }, [step, onStudentIdChange, onHospitalityIdChange])

  const handleScan = useCallback(
    (result: any) => {
      if (status !== "idle" || step === "MAPPING") return

      const rawValue = result?.[0]?.rawValue
      if (!rawValue) return

      if (step === "SCAN_STUDENT") {
        const validation = mapQrSchema.shape.student_id.safeParse(rawValue)
        if (!validation.success) {
          setStatus("error")
          toast.error(validation.error.issues[0].message)
          resetStatusAfterDelay()
          return
        }

        onStudentIdChange(rawValue)
        setStep("SCAN_HOSPITALITY")
        setStatus("success")
        setTimeout(() => setStatus("idle"), 1000)
        toast.info("Profile QR scanned. Now scan Hospitality QR.")
      } else if (step === "SCAN_HOSPITALITY") {
        const validation = mapQrSchema.shape.hospitality_id.safeParse(rawValue)
        if (!validation.success) {
          setStatus("error")
          toast.error(validation.error.issues[0].message)
          resetStatusAfterDelay()
          return
        }

        onHospitalityIdChange(rawValue)
        setStep("MAPPING")

        if (studentId) {
          mapQrMutation.mutate({
            student_id: studentId,
            hospitality_id: rawValue,
          })
        } else {
          setStatus("error")
          toast.error("Student ID missing. Please restart.")
          resetStatusAfterDelay()
        }
      }
    },
    [
      step,
      studentId,
      status,
      mapQrMutation,
      resetStatusAfterDelay,
      onStudentIdChange,
      onHospitalityIdChange,
    ]
  )

  const handleFacingModeChange = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
  }

  const handleCameraError = () => {
    setCameraError(true)
  }

  return (
    <MapQrScannerUi
      step={step}
      status={status}
      cameraError={cameraError}
      facingMode={facingMode}
      onScan={handleScan}
      onCameraError={handleCameraError}
      onFacingModeChange={handleFacingModeChange}
    />
  )
}
