import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, CalendarDays, Building2 } from "lucide-react"
import { ScheduleCard } from "@/components/events/schedule-card"
import { MOOCK_EVENTS, MOCK_SCHEDULES } from "@/components/events/mock-data"
import { useEventStore } from "@/store/event-store"
import { useEffect } from "react"

export const Route = createFileRoute("/events/$eventId/")({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const { setSelectedEvent } = useEventStore()

  // Mock data fetch
  const event = MOOCK_EVENTS.find((e) => e.id === eventId)
  const schedules = MOCK_SCHEDULES[eventId] ?? []

  // Update store on load
  useEffect(() => {
    if (event) {
      setSelectedEvent(event)
    }
  }, [event, setSelectedEvent])

  if (!event) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--navy-dark)" }}
      >
        <p className="text-white/60 text-lg">Event not found</p>
        <Link
          to="/events"
          className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
        >
          ← Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--navy-dark)" }}
    >
      <div className="container mx-auto p-4 md:p-6 pb-20 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/events"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
          >
            <ArrowLeft size={22} />
          </Link>
        </div>

        {/* Event Info */}
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 leading-tight">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-white/50">
              <Building2 size={14} className="text-amber-400/60" />
              <span>{event.organizer}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-300/80 border border-amber-400/10">
              <CalendarDays size={12} />
              {event.day}
            </div>
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/70">Schedules</h2>

          {schedules.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  eventId={eventId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-xl border border-white/5 bg-white/5">
              <p className="text-white/40">No schedules found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
