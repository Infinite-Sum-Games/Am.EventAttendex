import { DuoAttendanceScanner } from "@/components/events/duo-attendance-scanner"
// import { SoloAttendanceScanner } from "@/components/events/solo-attendance-scanner"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/scanner")({
  component: ScannerPage,
})

// this page is currently added for demo - will be removed before the PR merge
function ScannerPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-black">
      {/* <SoloAttendanceScanner
        eventName="Sample Event"
        scheduleId="550e8400-e29b-41d4-a716-446655440000"
        isTeamEvent={false}
        onClose={() => navigate({ to: ".." })}
      /> */}
      <DuoAttendanceScanner
        eventName="Sample Event"
        scheduleId="550e8400-e29b-41d4-a716-446655440000"
        onClose={() => navigate({ to: ".." })}
        isTeamEvent={true}
      />
    </div>
  )
}
