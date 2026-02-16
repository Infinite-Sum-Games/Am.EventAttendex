import { apiEndpoints } from "@/lib/api-endpoints"
import axiosClient from "@/lib/axios"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/events")({
  component: EventsLayout,
  beforeLoad: async () => {
    try {
      await axiosClient.get(apiEndpoints.ORGANIZER_SESSION)
    } catch (error) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function EventsLayout() {
  return <Outlet />
}
