import { createFileRoute } from "@tanstack/react-router"
import { MapQrScanner } from "@/components/hospitality/map-qr-scanner"

export const Route = createFileRoute("/hospitality/map-qr")({
  component: MapQrScanner,
})
