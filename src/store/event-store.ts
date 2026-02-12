import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Event, Schedule } from "@/types/events"

interface EventStoreState {
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void

  selectedSchedule: Schedule | null
  setSelectedSchedule: (schedule: Schedule | null) => void

  // Optional: Cache for participants if needed, but Query is better for this
  // kept simple for now
}

export const useEventStore = create<EventStoreState>()(
  persist(
    (set) => ({
      selectedEvent: null,
      setSelectedEvent: (event) => set({ selectedEvent: event }),

      selectedSchedule: null,
      setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule }),
    }),
    {
      name: "event-store", // unique name for localStorage
    }
  )
)
