import { useState, useCallback } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import {
  Check,
  X,
  Camera,
  ArrowLeft,
  Info,
  RefreshCw,
  LogIn,
  LogOut,
} from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import { cn } from "@/lib/utils"
import {
  markAttendanceSchema,
  type MarkAttendancePayload,
} from "@/schemas/attendance"

type ScanStatus = "idle" | "success" | "error"
type ScanMode = "IN" | "OUT"

interface DuoAttendanceScannerProps {
  eventName: string
  scheduleId: string
  onClose: () => void
  isTeamEvent: boolean
}

export function DuoAttendanceScanner({
  eventName,
  scheduleId,
  onClose,
  isTeamEvent,
}: DuoAttendanceScannerProps) {
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [scanMode, setScanMode] = useState<ScanMode>("IN")
  const [cameraError, setCameraError] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  )

  const { mutate: markAttendance } = useMutation({
    mutationFn: (payload: MarkAttendancePayload) => {
      let url = ""
      if (isTeamEvent) {
        url =
          scanMode === "IN"
            ? apiEndpoints.CHECKIN_TEAM_ATTENDANCE(
                payload.studentId,
                payload.scheduleId
              )
            : apiEndpoints.CHECKOUT_TEAM_ATTENDANCE(
                payload.studentId,
                payload.scheduleId
              )
      } else {
        url =
          scanMode === "IN"
            ? apiEndpoints.CHECKIN_INDIVIDUAL_ATTENDANCE(
                payload.studentId,
                payload.scheduleId
              )
            : apiEndpoints.CHECKOUT_INDIVIDUAL_ATTENDANCE(
                payload.studentId,
                payload.scheduleId
              )
      }
      return api.post(url)
    },
    onSuccess: () => {
      setStatus("success")
      toast.success(
        `${scanMode === "IN" ? "Check-in" : "Check-out"} marked successfully`
      )
      resetStatusAfterDelay()
    },
    onError: (error: any) => {
      setStatus("error")
      const errorMessage =
        error.response?.data?.message || "Failed to mark attendance"
      toast.error(errorMessage)
      resetStatusAfterDelay()
    },
  })

  const resetStatusAfterDelay = useCallback(() => {
    setTimeout(() => {
      setStatus("idle")
    }, 2000)
  }, [])

  const handleScan = useCallback(
    (result: any) => {
      if (status !== "idle") return

      const rawValue = result?.[0]?.rawValue
      if (!rawValue) return

      const [scannedStudentId, scannedScheduleId] = rawValue.split(":")

      if (scannedScheduleId !== scheduleId) {
        setStatus("error")
        toast.error("QR Code is for a different session")
        resetStatusAfterDelay()
        return
      }

      const validation = markAttendanceSchema.safeParse({
        studentId: scannedStudentId,
        scheduleId: scheduleId,
      })

      if (!validation.success) {
        setStatus("error")
        const errorMsg =
          validation.error.issues[0]?.message || "Invalid ID format"
        toast.error(errorMsg)
        resetStatusAfterDelay()
        return
      }

      markAttendance(validation.data)
    },
    [status, scheduleId, markAttendance, resetStatusAfterDelay]
  )

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center p-4 bg-linear-to-b from-black/90 via-black/40 to-transparent">
        <div className="flex-1">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md active:scale-95 transition-all border border-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-3 flex flex-col items-center justify-center text-center overflow-hidden px-2">
          {eventName && (
            <h2 className="text-white font-bold text-sm uppercase tracking-wider truncate w-full">
              {eventName}
            </h2>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
              {isTeamEvent ? "Group Event" : "Individual Event"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={() =>
              setFacingMode((prev) =>
                prev === "environment" ? "user" : "environment"
              )
            }
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md active:scale-95 transition-all border border-white/10"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950">
        {cameraError ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center text-destructive mb-6 border border-destructive/30">
              <Camera className="w-10 h-10" />
            </div>
            <h3 className="text-white font-black text-xl uppercase tracking-tighter">
              Camera Blocked
            </h3>
            <p className="text-zinc-400 text-sm mt-3 max-w-70 leading-relaxed">
              We can't access your camera. Please check your browser permissions
              and refresh to continue scanning.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 w-full max-w-50 py-4 rounded-2xl bg-white text-black font-bold text-sm active:scale-95 transition-all shadow-xl"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <>
            <Scanner
              onScan={handleScan}
              constraints={{ facingMode }}
              onError={(error) => {
                console.error("Scanner error:", error)
                setCameraError(true)
              }}
              styles={{
                container: {
                  width: "100%",
                  height: "100%",
                },
                video: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              }}
              components={{}}
            />

            {/* Overlays */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none z-30",
                status === "success"
                  ? "bg-green-500/90 opacity-100 scale-100"
                  : "opacity-0 scale-110"
              )}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl animate-in zoom-in duration-300">
                <Check className="w-16 h-16 text-green-500 stroke-[4px]" />
              </div>
              <p className="mt-6 text-white font-black text-3xl tracking-tight">
                SUCCESS
              </p>
              <p className="mt-2 text-white/90 font-medium">
                {scanMode === "IN" ? "Checked In" : "Checked Out"}
              </p>
            </div>

            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none z-30",
                status === "error"
                  ? "bg-destructive/90 opacity-100 scale-100"
                  : "opacity-0 scale-110"
              )}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl animate-in zoom-in duration-300">
                <X className="w-16 h-16 text-destructive stroke-[4px]" />
              </div>
              <p className="mt-6 text-white font-black text-3xl tracking-tight">
                FAILED
              </p>
              <p className="mt-2 text-white/90 font-medium">Please try again</p>
            </div>

            {/* Scanning Indicator Frame */}
            {status === "idle" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-64 h-64 relative">
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-300",
                      scanMode === "IN"
                        ? "border-green-500"
                        : "border-amber-500"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-300",
                      scanMode === "IN"
                        ? "border-green-500"
                        : "border-amber-500"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300",
                      scanMode === "IN"
                        ? "border-green-500"
                        : "border-amber-500"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300",
                      scanMode === "IN"
                        ? "border-green-500"
                        : "border-amber-500"
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-0 left-0 w-full h-full rounded-xl border border-white/20 transition-colors duration-300",
                      scanMode === "IN" ? "bg-green-500/5" : "bg-amber-500/5"
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-1/2 left-4 right-4 h-1 blur-[2px] animate-[scan_2s_ease-in-out_infinite] transition-colors duration-300",
                      scanMode === "IN" ? "bg-green-500/50" : "bg-amber-500/50"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-1/2 left-2 right-2 h-0.5 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px] transition-colors duration-300",
                      scanMode === "IN"
                        ? "bg-green-500 shadow-green-500/80"
                        : "bg-amber-500 shadow-amber-500/80"
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Control Panel */}
      {!cameraError && (
        <div className="absolute bottom-0 inset-x-0 z-20">
          <div className="bg-zinc-900/95 backdrop-blur-2xl border-t border-white/10 rounded-t-2xl p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 ease-out">
            <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4" />

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl mb-4 border border-white/5">
              <button
                onClick={() => setScanMode("IN")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300",
                  scanMode === "IN"
                    ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <LogIn className="w-4 h-4" />
                Check In
              </button>
              <button
                onClick={() => setScanMode("OUT")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300",
                  scanMode === "OUT"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <LogOut className="w-4 h-4" />
                Check Out
              </button>
            </div>

            <div className="flex items-center gap-3 px-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-300",
                  scanMode === "IN"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}
              >
                <Info className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs uppercase tracking-tight">
                  {scanMode === "IN" ? "CHECK-IN MODE" : "CHECK-OUT MODE"}
                </h3>
                <p className="text-white/50 text-[11px] leading-tight mt-0.5">
                  {isTeamEvent
                    ? "Scan any team member's QR code to mark attendance for the entire team."
                    : `Currently marking ${
                        scanMode === "IN" ? "Entry" : "Exit"
                      } time. Switch tab to change.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0%, 100% { transform: translateY(-110px); }
          50% { transform: translateY(110px); }
        }
      `,
        }}
      />
    </div>
  )
}
