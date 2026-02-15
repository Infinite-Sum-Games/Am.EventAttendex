import { useQuery } from "@tanstack/react-query"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import type { Event } from "@/types/events"

export function useOrganizerEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // Fetch organizer events
      const response = await axiosClient.get(apiEndpoints.GET_ORGANIZER_EVENTS)
      console.log("Events API Response:", response.data) // Debugging

      // Handle different response structures
      if (Array.isArray(response.data)) {
        return response.data as Event[]
      } else if (response.data && Array.isArray((response.data as any).data)) {
        return (response.data as any).data as Event[]
      } else if (
        response.data &&
        Array.isArray((response.data as any).events)
      ) {
        return (response.data as any).events as Event[]
      }

      console.error("Unexpected API response structure:", response.data)
      return [] // Return empty array to prevent filter error
    },
  })
}
