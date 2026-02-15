import { createFileRoute } from "@tanstack/react-router"
import { GateCheckOutScanner } from "@/components/hospitality/gate-checkout-scanner"

export const Route = createFileRoute("/hospitality/gate-checkout")({
  component: GateCheckOutScanner,
})
