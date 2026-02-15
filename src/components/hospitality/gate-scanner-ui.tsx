import { ArrowLeft, Check, X, Info, RefreshCw, Camera } from "lucide-react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import type { ScanStatus } from "@/schemas/hospitality"

interface GateScannerUiProps {
  title: string
  status: ScanStatus
  cameraError: boolean
  facingMode: "environment" | "user"
  colorTheme: "blue" | "amber"
  onScan: (result: any) => void
  onCameraError: () => void
  onFacingModeChange: () => void
}

const colorClasses = {
  blue: {
    dot: "bg-blue-500",
    border: "border-blue-500",
    bg: "bg-blue-500/5",
    accent: "text-blue-500",
    bgLight: "bg-blue-500/10",
    borderLight: "border-blue-500/20",
    shadow: "shadow-blue-500/80",
  },
  amber: {
    dot: "bg-amber-500",
    border: "border-amber-500",
    bg: "bg-amber-500/5",
    accent: "text-amber-500",
    bgLight: "bg-amber-500/10",
    borderLight: "border-amber-500/20",
    shadow: "shadow-amber-500/80",
  },
}

export function GateScannerUi({
  title,
  status,
  cameraError,
  facingMode,
  colorTheme,
  onScan,
  onCameraError,
  onFacingModeChange,
}: GateScannerUiProps) {
  const navigate = useNavigate()
  const colors = colorClasses[colorTheme]

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center p-4 bg-linear-to-b from-black/90 via-black/40 to-transparent">
        <div className="flex-1">
          <button
            onClick={() => navigate({ to: "/hospitality" })}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md active:scale-95 transition-all border border-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-3 flex flex-col items-center justify-center text-center overflow-hidden px-2">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider truncate w-full">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  colors.dot.replace("bg-", "bg-")
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  colors.dot
                )}
              ></span>
            </span>
            <span className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
              Live Scanner
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={onFacingModeChange}
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
              onScan={onScan}
              constraints={{ facingMode }}
              onError={(error) => {
                console.error(error)
                onCameraError()
              }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { width: "100%", height: "100%", objectFit: "cover" },
              }}
            />

            {/* Overlays - Success */}
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
                SCANNED
              </p>
            </div>

            {/* Overlays - Error */}
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
                INVALID QR
              </p>
            </div>

            {/* Scanning Indicator Frame */}
            {status === "idle" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-64 h-64 relative">
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-300",
                      colors.border
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-300",
                      colors.border
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300",
                      colors.border
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300",
                      colors.border
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-0 left-0 w-full h-full rounded-xl border border-white/20 transition-colors duration-300",
                      colors.bg
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-1/2 left-4 right-4 h-1 blur-[2px] animate-[scan_2s_ease-in-out_infinite] transition-colors duration-300",
                      colors.dot.replace("bg-", "bg-"),
                      "opacity-50"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-1/2 left-2 right-2 h-0.5 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px] transition-colors duration-300",
                      colors.dot,
                      colors.shadow
                    )}
                  />
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
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-300",
                  colors.bgLight,
                  colors.accent,
                  colors.borderLight
                )}
              >
                <Info className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs uppercase tracking-tight">
                  SCAN HOSPITALITY QR
                </h3>
                <p className="text-white/50 text-[11px] leading-tight mt-0.5">
                  Point camera at the P-series Hospitality QR (e.g., P001) to
                  verify {colorTheme === "blue" ? "entry" : "exit"} status.
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
