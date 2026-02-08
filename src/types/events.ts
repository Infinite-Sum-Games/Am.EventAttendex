// Event entity type
export interface Event {
  id: string
  name: string
  organizer: string
  day: "20 Feb" | "21 Feb"
}

// Event card props
export interface EventCardProps {
  event: Event
  className?: string
  isActive?: boolean
}

// Day filter type
export type DayFilter = "All" | "20 Feb" | "21 Feb"

// Events filter props interface
export interface EventsFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedOrg: string
  setSelectedOrg: (org: string) => void
  selectedDay: DayFilter
  setSelectedDay: (day: DayFilter) => void
}
