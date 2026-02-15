import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import {
  Check,
  Loader2,
  ScanLine,
  ArrowLeft,
  User,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  LogOut,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import { cn } from "@/lib/utils"
import type { GateStatusResponse, GateScanStep } from "@/schemas/hospitality"

interface GateStatusResultViewProps {
  title: string
  hospitalityId: string | null
  step: GateScanStep
  variant: "checkin" | "checkout"
  onReset: () => void
  onStepChange?: (step: GateScanStep) => void
}

const variantConfig = {
  checkin: {
    color: "green",
    loadingText: "Verifying Entry Status...",
    successTitle: "Access Allowed",
    successDesc: "Participant cleared for entry.",
    successButton: "CONFIRM ENTRY",
    successRecorded: "Entry Recorded",
    deniedTitle: "Access Denied",
    deniedDesc: "Entry not permitted.",
  },
  checkout: {
    color: "amber",
    loadingText: "Verifying Exit Status...",
    successTitle: "Ready to Exit",
    successDesc: "Participant cleared for departure.",
    successButton: "CONFIRM EXIT",
    successRecorded: "Exit Recorded",
    deniedTitle: "Exit Denied",
    deniedDesc: "Check-out not permitted.",
  },
}

export function GateStatusResultView({
  title,
  hospitalityId,
  step,
  variant,
  onReset,
  onStepChange,
}: GateStatusResultViewProps) {
  const navigate = useNavigate()
  const config = variantConfig[variant]
  const isLoading = step === "FETCHING_STATUS"

  const statusQuery = useQuery({
    queryKey: [
      variant === "checkin" ? "gate-status" : "gate-checkout-status",
      hospitalityId,
    ],
    queryFn: async () => {
      if (!hospitalityId) return null
      const endpoint =
        variant === "checkin"
          ? apiEndpoints.GATE_CHECKIN_STATUS(hospitalityId)
          : apiEndpoints.GATE_CHECKOUT_STATUS(hospitalityId)
      const response = await axiosClient.get(endpoint)
      return response.data as GateStatusResponse
    },
    enabled: step === "FETCHING_STATUS" && !!hospitalityId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (step === "FETCHING_STATUS") {
      if (statusQuery.isError) {
        toast.error(
          statusQuery.error instanceof Error
            ? statusQuery.error.message
            : "Failed to fetch status"
        )
        onReset()
      } else if (statusQuery.isSuccess && statusQuery.data) {
        onStepChange?.("RESULT")
      }
    }
  }, [
    step,
    statusQuery.isError,
    statusQuery.isSuccess,
    statusQuery.data,
    onReset,
    onStepChange,
  ])

  const mutation = useMutation({
    mutationFn: async (hospId: string) => {
      const endpoint =
        variant === "checkin"
          ? apiEndpoints.GATE_CHECKIN(hospId)
          : apiEndpoints.GATE_CHECKOUT(hospId)
      const response = await axiosClient.post(endpoint)
      return response.data
    },
    onSuccess: () => {
      toast.success(
        variant === "checkin"
          ? "Check-in confirmed successfully"
          : "Check-out confirmed successfully"
      )
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          `Failed to confirm ${variant === "checkin" ? "check-in" : "check-out"}`
      )
    },
  })

  const handleConfirm = () => {
    if (hospitalityId) {
      mutation.mutate(hospitalityId)
    }
  }

  const data = statusQuery.data

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 -ml-2"
          onClick={() => navigate({ to: "/hospitality" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold text-lg">{title}</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        {/* Status Banner */}
        {isLoading || statusQuery.isLoading ? (
          <div className="h-48 flex flex-col items-center justify-center border rounded-2xl bg-muted/10 border-dashed gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              {config.loadingText}
            </p>
          </div>
        ) : (
          <>
            {data?.allow ? (
              <div
                className={cn(
                  "border rounded-2xl p-6 flex flex-col items-center gap-4 text-center",
                  variant === "checkin"
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                )}
              >
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shadow-lg",
                    variant === "checkin"
                      ? "bg-green-500 shadow-green-500/30"
                      : "bg-amber-500 shadow-amber-500/30"
                  )}
                >
                  {variant === "checkin" ? (
                    <ShieldCheck className="h-8 w-8 text-white stroke-[3px]" />
                  ) : (
                    <LogOut className="h-8 w-8 text-white stroke-[3px] ml-1" />
                  )}
                </div>
                <div>
                  <h2
                    className={cn(
                      "text-2xl font-black tracking-tight uppercase",
                      variant === "checkin"
                        ? "text-green-700 dark:text-green-400"
                        : "text-amber-700 dark:text-amber-400"
                    )}
                  >
                    {config.successTitle}
                  </h2>
                  <p
                    className={cn(
                      "text-sm font-medium mt-1",
                      variant === "checkin"
                        ? "text-green-600/90 dark:text-green-400/90"
                        : "text-amber-600/90 dark:text-amber-400/90"
                    )}
                  >
                    {config.successDesc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 bg-destructive rounded-full flex items-center justify-center shadow-lg shadow-destructive/30">
                  <ShieldAlert className="h-8 w-8 text-white stroke-[3px]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-destructive dark:text-red-400 tracking-tight uppercase">
                    {config.deniedTitle}
                  </h2>
                  <p className="text-sm text-destructive/90 dark:text-red-400/90 font-bold mt-1">
                    {data?.reason || config.deniedDesc}
                  </p>
                </div>
              </div>
            )}

            {/* Participant Details Card */}
            <Card className="border shadow-sm overflow-hidden p-0 gap-2">
              <CardHeader className="bg-muted/30 border-b [.border-b]:pb-0 px-4 py-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Participant Info
                  </CardTitle>
                  <span className="font-mono text-xs font-bold bg-background border px-2 py-0.5 rounded-md text-muted-foreground">
                    {hospitalityId}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4 space-y-5">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-bold leading-tight">
                    {data?.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      College
                    </p>
                    <p className="text-sm font-medium">{data?.college_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {data?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-background border-t sticky bottom-0 z-20 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {isLoading || statusQuery.isLoading ? (
          <Button disabled className="w-full h-14 rounded-xl">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Checking...
          </Button>
        ) : !mutation.isSuccess ? (
          data?.allow ? (
            <Button
              className={cn(
                "w-full h-14 text-base font-bold shadow-xl rounded-xl",
                variant === "checkin"
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
              )}
              size="lg"
              onClick={handleConfirm}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : variant === "checkin" ? (
                <LogIn className="mr-2 h-5 w-5" />
              ) : (
                <LogOut className="mr-2 h-5 w-5" />
              )}
              {config.successButton}
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full h-14 text-base font-bold shadow-xl shadow-destructive/20 rounded-xl"
              size="lg"
              onClick={onReset}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              SCAN NEXT
            </Button>
          )
        ) : (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            <div
              className={cn(
                "text-white p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md",
                variant === "checkin" ? "bg-green-600" : "bg-amber-600"
              )}
            >
              <Check className="h-5 w-5 stroke-[3px]" />
              {config.successRecorded}
            </div>
            <Button
              variant="outline"
              className="w-full h-12 border-2 text-sm font-bold rounded-xl hover:bg-muted/50 transition-colors"
              onClick={onReset}
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Next Participant
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
