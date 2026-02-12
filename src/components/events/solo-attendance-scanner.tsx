import { useState, useCallback } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { Check, X, Camera, ArrowLeft, Info, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  markAttendanceSchema,
  type MarkAttendancePayload,
} from "@/schemas/attendance"
import { useMarkAttendance } from "@/hooks/use-attendance"

type ScanStatus = "idle" | "success" | "error"

interface SoloAttendanceScannerProps {
  eventName: string
  scheduleId: string
  onClose: () => void
  isTeamEvent: boolean
}

export function SoloAttendanceScanner({
  eventName,
  scheduleId,
  onClose,
  isTeamEvent = false,
}: SoloAttendanceScannerProps) {
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [cameraError, setCameraError] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  )

  const { mutate: markAttendance } = useMarkAttendance()

  const handleMark = (payload: MarkAttendancePayload) => {
    markAttendance(
      {
        studentId: payload.studentId,
        scheduleId: payload.scheduleId,
        type: "BOTH", // Solo matches "BOTH" in our hook logic
        isTeam: isTeamEvent,
        markingType: "SOLO",
      },
      {
        onSuccess: () => {
          setStatus("success")
          resetStatusAfterDelay()
        },
        onError: (error: any) => {
          setStatus("error")
          const errorMessage =
            error.response?.data?.message || "Failed to mark attendance"
          toast.error(errorMessage)
          resetStatusAfterDelay()
        },
      }
    )
  }

  const resetStatusAfterDelay = useCallback(() => {
    setTimeout(() => {
      setStatus("idle")
    }, 2000)
  }, [])

  const handleScan = useCallback(
    (result: any) => {
      // Don't process if already processing, successful, or in error state
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

      handleMark(validation.data)
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
                Attendance Marked
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
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-xl" />

                  <div className="absolute top-0 left-0 w-full h-full bg-green-500/5 rounded-xl border border-white/20" />

                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-green-500/50 blur-[2px] animate-[scan_2s_ease-in-out_infinite]" />
                  <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-green-500 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px] shadow-green-500/80" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Sheet */}
      {!cameraError && (
        <div className="absolute bottom-0 inset-x-0 z-20">
          <div className="bg-zinc-900/95 backdrop-blur-2xl border-t border-white/10 rounded-t-2xl p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 ease-out">
            <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-3" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 border border-green-500/20">
                <Info className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs uppercase tracking-tight">
                  SINGLE ATTENDANCE MODE
                </h3>
                <p className="text-white/50 text-[11px] leading-tight mt-0.5">
                  {isTeamEvent ? (
                    "Only one member of the team needs to mark attendance for the whole team."
                  ) : (
                    <>
                      Attendance is marked only{" "}
                      <span className="text-primary font-semibold">
                        one-time
                      </span>
                      . Your check-in is final once the green screen appears.
                    </>
                  )}
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
