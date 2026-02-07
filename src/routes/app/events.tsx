import { useState, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarDays } from "lucide-react"
import { EventCard } from "@/components/events/event-card"
import { EventsFilter } from "@/components/events/events-filter"
import { MOOCK_EVENTS } from "@/components/events/mock-data"

export const Route = createFileRoute("/app/events")({
  component: EventsPage,
})

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrg, setSelectedOrg] = useState("All organizers")
  const [selectedDay, setSelectedDay] = useState<
    "All" | "Day 1" | "Day 2" | "Day 3"
  >("All")

  const filteredEvents = useMemo(() => {
    return MOOCK_EVENTS.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesOrg =
        selectedOrg === "All organizers" || event.organizer === selectedOrg
      const matchesDay = selectedDay === "All" || event.day === selectedDay

      return matchesSearch && matchesOrg && matchesDay
    })
  }, [searchQuery, selectedOrg, selectedDay])

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(to bottom right, hsl(240 10% 4%), hsl(260 30% 15%))",
      }}
    >
      <div className="container mx-auto p-4 max-w-md md:max-w-2xl lg:max-w-4xl space-y-6 pb-20">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="h-8 w-8" />
          Events
        </h1>

        <EventsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center py-10 col-span-full">
              <p className="text-muted-foreground">
                No events found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
