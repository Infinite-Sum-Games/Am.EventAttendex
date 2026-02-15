export interface Event {
  event_id: string
  event_name: string
  organizer?: string // Optional as per real API response
  // event_date (or day) might come from schedules or be a derived property.
  // Backend likely returns 'schedules' array.
  schedules: Schedule[]
  is_group: boolean
  attendance_mode: "SOLO" | "DUO"
  // kept for backward compat if needed, but likely removed/derived
  // day: "20 Feb" | "21 Feb"
}

// Schedule entity type
export interface Schedule {
  id: string
  title?: string // Missing in real API, make optional
  venue: string
  start_time: string
  end_time: string
  event_date: string
  eventId?: string // Missing in nested API object
  // type: "INDIVIDUAL" | "GROUP" // likely derived from Event
  // markingType: "SOLO" | "DUO" // likely derived from Event
}

// Participant entity type
export interface Participant {
  attendance_id: string | number
  student_id: string
  student_name: string
  student_email: string
  check_in: string | null // ISO timestamp or null
  check_out: string | null // ISO timestamp or null
  // computed or optional fields
  team_name?: string // Not present in current backend query, keeping as optional
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
  selectedDay: DayFilter
  setSelectedDay: (day: DayFilter) => void
}
