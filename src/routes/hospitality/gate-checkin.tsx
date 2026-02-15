import { createFileRoute } from "@tanstack/react-router"
import { GateCheckInScanner } from "@/components/hospitality/gate-checkin-scanner"

export const Route = createFileRoute("/hospitality/gate-checkin")({
  component: GateCheckInScanner,
})
