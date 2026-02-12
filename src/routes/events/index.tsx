import { useState, useMemo } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { CalendarDays, LogOut } from "lucide-react"
import { EventCard } from "@/components/events/event-card"
import { EventsFilter } from "@/components/events/events-filter"
import { MOOCK_EVENTS } from "@/components/events/mock-data"
import { Button } from "@/components/ui/button"
import type { DayFilter } from "@/types/events"

export const Route = createFileRoute("/events/")({
  component: EventsPage,
})

function EventsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDay, setSelectedDay] = useState<DayFilter>("All")

  const filteredEvents = useMemo(() => {
    return MOOCK_EVENTS.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDay = selectedDay === "All" || event.day === selectedDay

      return matchesSearch && matchesDay
    })
  }, [searchQuery, selectedDay])

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate({ to: "/login" })
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--navy-dark)" }}
    >
      {/* Main content - Centered max width container */}
      <div className="container mx-auto p-4 md:p-6 space-y-6 pb-20 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-14">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CalendarDays className="h-8 w-8 text-amber-400" />
              <span className="text-white">Events</span>
            </h1>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter section */}
        <div className="w-full">
          <EventsFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
