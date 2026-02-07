export interface Event {
  id: string
  name: string
  organizer: string
  day: "Day 1" | "Day 2" | "Day 3"
}

export const MOOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Tech Talk 2024",
    organizer: "Computer Science Dept",
    day: "Day 1",
  },
  {
    id: "2",
    name: "Cultural Fest",
    organizer: "Arts Club",
    day: "Day 2",
  },
  {
    id: "3",
    name: "Robotics Workshop",
    organizer: "Robotics Club",
    day: "Day 3",
  },
  {
    id: "4",
    name: "Coding Marathon",
    organizer: "Computer Science Dept",
    day: "Day 1",
  },
  {
    id: "5",
    name: "Music Concert",
    organizer: "Music Club",
    day: "Day 2",
  },
  {
    id: "6",
    name: "Gaming Tournament",
    organizer: "Gaming Club",
    day: "Day 3",
  },
  {
    id: "7",
    name: "AI Seminar",
    organizer: "AI Research Group",
    day: "Day 1",
  },
]

export const ORGANIZERS = [
  "All organizers",
  "Computer Science Dept",
  "Arts Club",
  "Robotics Club",
  "Music Club",
  "Gaming Club",
  "AI Research Group",
]
