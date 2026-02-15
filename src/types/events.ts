// Event entity type
export interface Event {
  id: string
  name: string
  organizer: string
  day: "20 Feb" | "21 Feb"
  type: "INDIVIDUAL" | "GROUP" // <--- Added for badge on Event Card
  markingType?: "SOLO" | "DUO" // <--- Optional, good for context
}

// Schedule entity type
export interface Schedule {
  id: string
  title: string
  venue: string
  startTime: string
  endTime: string
  date: string
  eventId: string
  type: "INDIVIDUAL" | "GROUP"
  markingType: "SOLO" | "DUO"
}

// Participant entity type
export interface Participant {
  id: string
  name: string
  email: string
  teamName?: string // Only for Group events
  // Attendance status
  // For SOLO: "PRESENT" | "ABSENT"
  // For DUO: checkInStatus, checkOutStatus
  checkInStatus: boolean
  checkOutStatus: boolean
  attendanceStatus: boolean // For SOLO marking, typically maps to this
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
