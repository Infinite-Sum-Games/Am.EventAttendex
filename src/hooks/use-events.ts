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
      // We assume the response data is the list of events directly or in a standard wrapper
      // Adjust this if your API returns { data: [...] } or similiar
      return response.data as Event[]
    },
  })
}
