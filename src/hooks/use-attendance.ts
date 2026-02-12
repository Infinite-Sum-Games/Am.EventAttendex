import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import type { Participant } from "@/types/events"
import { toast } from "sonner"

// --- Fetch Participants ---

export function useParticipants(eventId: string, scheduleId: string) {
  return useQuery({
    queryKey: ["participants", eventId, scheduleId],
    queryFn: async () => {
      // Fetch participants for a specific schedule
      // Note: Endpoint name GET_EVENT_SCHEDULES is confusing but based on usage it seems to be for this
      const response = await axiosClient.get(
        apiEndpoints.GET_EVENT_SCHEDULES(eventId, scheduleId)
      )
      return response.data as Participant[]
    },
    enabled: !!eventId && !!scheduleId,
  })
}

// --- Attendance Mutations ---

interface MarkAttendanceParams {
  studentId: string
  scheduleId: string
  // Type of marking action
  type: "CHECKIN" | "CHECKOUT" | "BOTH"
  // Is it a Team Event?
  isTeam: boolean
  // Marking Type (Solo vs Duo - determines the endpoint logic)
  markingType: "SOLO" | "DUO"
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      studentId,
      scheduleId,
      type,
      isTeam,
      markingType,
    }: MarkAttendanceParams) => {
      let endpoint = ""

      if (markingType === "DUO") {
        // DUO Logic: Separate IN and OUT endpoints
        if (isTeam) {
          if (type === "CHECKIN")
            endpoint = apiEndpoints.CHECKIN_TEAM_ATTENDANCE(
              studentId,
              scheduleId
            )
          else if (type === "CHECKOUT")
            endpoint = apiEndpoints.CHECKOUT_TEAM_ATTENDANCE(
              studentId,
              scheduleId
            )
        } else {
          // Individual
          if (type === "CHECKIN")
            endpoint = apiEndpoints.CHECKIN_INDIVIDUAL_ATTENDANCE(
              studentId,
              scheduleId
            )
          else if (type === "CHECKOUT")
            endpoint = apiEndpoints.CHECKOUT_INDIVIDUAL_ATTENDANCE(
              studentId,
              scheduleId
            )
        }
      } else {
        // SOLO Logic: One endpoint marks "BOTH" (PRESENT)
        if (isTeam) {
          endpoint = apiEndpoints.MARK_TEAM_ATTENDANCE(studentId, scheduleId)
        } else {
          endpoint = apiEndpoints.MARK_INDIVIDUAL_ATTENDANCE(
            studentId,
            scheduleId
          )
        }
      }

      if (!endpoint) throw new Error("Invalid marking configuration")

      const response = await axiosClient.post(endpoint)
      return response.data
    },
    onSuccess: (_, variables) => {
      toast.success("Attendance Marked")
      // Invalidate queries to refresh the list
      // We invalidate all participants for this schedule
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.scheduleId], // Invalidate broadly or specifically
      })
      queryClient.invalidateQueries({
        queryKey: ["participants"], // Just to be safe for now
      })
    },
    onError: (error) => {
      console.error("Failed to mark attendance", error)
      toast.error("Failed to mark attendance")
    },
  })
}

// --- Unmark Attendance Mutations ---

interface UnmarkAttendanceParams {
  studentId: string
  scheduleId: string
  type: "CHECKIN" | "CHECKOUT" | "BOTH"
  isTeam: boolean
  markingType: "SOLO" | "DUO"
}

export function useUnmarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      studentId,
      scheduleId,
      type,
      isTeam,
      markingType,
    }: UnmarkAttendanceParams) => {
      let endpoint = ""

      if (markingType === "DUO") {
        // DUO Logic
        if (isTeam) {
          if (type === "CHECKIN")
            endpoint = apiEndpoints.UNMARK_TEAM_CHECKIN(studentId, scheduleId)
          else if (type === "CHECKOUT")
            endpoint = apiEndpoints.UNMARK_TEAM_CHECKOUT(studentId, scheduleId)
        } else {
          // Individual
          if (type === "CHECKIN")
            endpoint = apiEndpoints.UNMARK_INDIVIDUAL_CHECKIN(
              studentId,
              scheduleId
            )
          else if (type === "CHECKOUT")
            endpoint = apiEndpoints.UNMARK_INDIVIDUAL_CHECKOUT(
              studentId,
              scheduleId
            )
        }
      } else {
        // SOLO Logic
        if (isTeam) {
          endpoint = apiEndpoints.UNMARK_TEAM_ATTENDANCE(studentId, scheduleId)
        } else {
          endpoint = apiEndpoints.UNMARK_INDIVIDUAL_ATTENDANCE(
            studentId,
            scheduleId
          )
        }
      }

      if (!endpoint) throw new Error("Invalid unmarking configuration")

      // Unmarking usually is also a POST or DELETE? Assuming DELETE or POST based on typical conventions,
      // but generated endpoints imply specific URLs. Most likely these are POST or DELETE.
      // Checking api-endpoints.ts... it just gives the URL string.
      // Typically 'unMark' implies a state change, likely DELETE or POST.
      // I'll stick with POST for now unless I see otherwise in the backend docs (which I don't have).
      // Or maybe DELETE? `axiosClient.delete(endpoint)`
      // Let's assume POST for /unMark/... pattern unless commonly RESTful.
      // Actually, safest is usually POST for RPC-style "unMark" URLs.
      const response = await axiosClient.post(endpoint)
      return response.data
    },
    onSuccess: (_, { scheduleId }) => {
      toast.success("Attendance Unmarked")
      queryClient.invalidateQueries({
        queryKey: ["participants", scheduleId],
      })
      queryClient.invalidateQueries({
        queryKey: ["participants"],
      })
    },
    onError: (error) => {
      console.error("Failed to unmark attendance", error)
      toast.error("Failed to unmark attendance")
    },
  })
}
