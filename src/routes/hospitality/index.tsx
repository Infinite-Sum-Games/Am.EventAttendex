import { createFileRoute } from "@tanstack/react-router"
import { HospitalityDashboard } from "@/components/hospitality/dashboard"

export const Route = createFileRoute("/hospitality/")({
  component: HospitalityDashboard,
})
