import { createFileRoute, redirect, Outlet } from "@tanstack/react-router"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"

export const Route = createFileRoute("/hospitality")({
  beforeLoad: async () => {
    try {
      await axiosClient.get(apiEndpoints.HOSPITALITY_SESSION)
    } catch (error) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: () => <Outlet />,
})
