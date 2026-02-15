import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Check,
  LogIn,
  Loader2,
  ScanLine,
  Info,
  ArrowLeft,
  User,
  MapPin,
  Building2,
  Mail,
  Phone,
  School,
  Hash,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import type { MapQrResponse, AccommodationDetails } from "@/schemas/hospitality"

interface MapQrResultViewProps {
  studentId: string | null
  hospitalityId: string | null
  mapQrData: MapQrResponse | undefined
  onReset: () => void
}

export function MapQrResultView({
  studentId,
  hospitalityId,
  mapQrData,
  onReset,
}: MapQrResultViewProps) {
  const navigate = useNavigate()

  const accommodationQuery = useQuery({
    queryKey: ["accommodation", mapQrData?.accommodation_id],
    queryFn: async () => {
      if (!mapQrData?.accommodation_id || !mapQrData.has_opted_accommodation)
        return null
      const response = await axiosClient.get(
        apiEndpoints.ACCOMMODATION_DETAILS(mapQrData.accommodation_id)
      )
      return response.data.accommodation as AccommodationDetails
    },
    enabled: !!mapQrData?.accommodation_id && mapQrData.has_opted_accommodation,
  })

  const checkInMutation = useMutation({
    mutationFn: async (hospId: string) => {
      const url = apiEndpoints.GATE_CHECKIN(hospId)
      const response = await axiosClient.post(url)
      return response.data
    },
    onSuccess: () => {
      toast.success("Guest checked in successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to check in")
    },
  })

  const handleCheckIn = () => {
    if (hospitalityId) {
      checkInMutation.mutate(hospitalityId)
    }
  }

  const hasAccommodation = mapQrData?.has_opted_accommodation
  const isCheckInComplete = checkInMutation.isSuccess

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
        <h1 className="font-bold text-lg">Mapping Result</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        {/* Success Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-green-500/20">
            <Check className="h-6 w-6 text-white stroke-[3px]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-green-700 dark:text-green-400">
              Successfully Mapped
            </h2>
            <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-0.5">
              IDs linked. Proceed to check-in.
            </p>
          </div>
        </div>

        {/* IDs Card */}
        <Card className="border shadow-sm py-2 gap-2">
          <CardHeader className="pt-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Linked IDs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Student ID
                </p>
                <p
                  className="font-mono text-sm font-bold truncate"
                  title={studentId || ""}
                >
                  {studentId}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 text-amber-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Hospitality Tag
                </p>
                <p className="font-mono text-xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {hospitalityId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2 px-1">
            <Building2 className="h-4 w-4" />
            Guest Details
          </h3>

          {hasAccommodation ? (
            accommodationQuery.isLoading ? (
              <div className="h-48 flex items-center justify-center border rounded-2xl bg-muted/10 border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Card
                className={cn(
                  "border shadow-sm transition-all duration-500 overflow-hidden p-0",
                  isCheckInComplete
                    ? "border-green-500/30 bg-green-500/5"
                    : "bg-card"
                )}
              >
                <div className="p-5 border-b bg-muted/30">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-lg text-foreground">
                        {accommodationQuery.data?.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />{" "}
                        {accommodationQuery.data?.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Phone className="h-3 w-3" />{" "}
                        {accommodationQuery.data?.phone_number}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                        accommodationQuery.data?.is_male
                          ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                          : "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800"
                      )}
                    >
                      {accommodationQuery.data?.is_male ? "MALE" : "FEMALE"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <School className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          College
                        </p>
                        <p className="text-sm font-medium leading-tight">
                          {accommodationQuery.data?.college_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Roll Number
                        </p>
                        <p className="text-sm font-mono font-medium">
                          {accommodationQuery.data?.college_roll_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-muted/30 rounded-xl p-3 border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 text-amber-600 dark:text-amber-400">
                        Expected In
                      </p>
                      <p className="font-bold text-sm">
                        {accommodationQuery.data?.check_in_date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {accommodationQuery.data?.check_in_time}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 text-amber-600 dark:text-amber-400">
                        Expected Out
                      </p>
                      <p className="font-bold text-sm">
                        {accommodationQuery.data?.check_out_date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {accommodationQuery.data?.check_out_time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-6 border rounded-2xl bg-amber-500/5 border-amber-500/10 space-y-2 text-center">
              <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mb-1">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-amber-700 dark:text-amber-400">
                No Accommodation Opted
              </h4>
              <p className="text-xs text-muted-foreground max-w-[250px]">
                This participant does not have accommodation details. Proceed
                with mandatory gate check-in.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-background border-t sticky bottom-0 z-20 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {!isCheckInComplete ? (
          <Button
            className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 rounded-xl"
            size="lg"
            onClick={handleCheckIn}
            disabled={
              checkInMutation.isPending ||
              (hasAccommodation && accommodationQuery.isLoading)
            }
          >
            {checkInMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-5 w-5" />
            )}
            CONFIRM CHECK IN
          </Button>
        ) : (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md">
              <Check className="h-5 w-5 stroke-[3px]" />
              Check In Recorded
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
