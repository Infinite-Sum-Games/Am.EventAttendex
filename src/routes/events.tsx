import { useState, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarDays } from "lucide-react"
import { EventCard } from "@/components/events/event-card"
import { EventsFilter } from "@/components/events/events-filter"
import { MOOCK_EVENTS } from "@/components/events/mock-data"
import { Sidebar, SidebarTrigger, useSwipeToOpen } from "@/components/sidebar"
import type { DayFilter } from "@/types/events"

export const Route = createFileRoute("/events")({
  component: EventsPage,
})

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrg, setSelectedOrg] = useState("All organizers")
  const [selectedDay, setSelectedDay] = useState<DayFilter>("All")

  // Sidebar state with swipe support
  const { isOpen, setIsOpen, close } = useSwipeToOpen()

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
      style={{ backgroundColor: "var(--navy-dark)" }}
    >
      {/* Sidebar - opens on swipe from left edge or menu button click */}
      <Sidebar isOpen={isOpen} onClose={close} />

      {/* Main content - offset by sidebar width on desktop */}
      <div className="md:ml-64 p-4 md:p-6 space-y-6 pb-20">
        {/* Header with menu button (mobile only) */}
        <div className="flex items-center gap-3 mb-14">
          <div className="md:hidden">
            <SidebarTrigger onClick={() => setIsOpen(true)} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Events
          </h1>
        </div>

        {/* Filter section - constrained width */}
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl">
          <EventsFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </div>

        {/* Cards grid - fills available width */}
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
