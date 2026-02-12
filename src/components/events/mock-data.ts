import type { Event, Schedule, Participant } from "@/types/events"

export const MOOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Tech Talk 2024",
    organizer: "Computer Science Dept",
    day: "20 Feb",
    type: "INDIVIDUAL",
    markingType: "SOLO",
  },
  {
    id: "2",
    name: "Cultural Fest",
    organizer: "Arts Club",
    day: "21 Feb",
    type: "GROUP",
    markingType: "SOLO",
  },
  {
    id: "4",
    name: "Coding Marathon",
    organizer: "Computer Science Dept",
    day: "20 Feb",
    type: "INDIVIDUAL",
    markingType: "DUO",
  },
  {
    id: "5",
    name: "Music Concert",
    organizer: "Music Club",
    day: "21 Feb",
    type: "GROUP",
    markingType: "DUO",
  },
  {
    id: "7",
    name: "AI Seminar",
    organizer: "AI Research Group",
    day: "20 Feb",
    type: "INDIVIDUAL",
    markingType: "SOLO",
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

// MOCK SCHEDULES
export const MOCK_SCHEDULES: Record<string, Schedule[]> = {
  "1": [
    // Tech Talk (Individual, Solo)
    {
      id: "s1",
      title: "Morning Session",
      venue: "Auditorium A",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      date: "20 Feb 2024",
      eventId: "1",
      type: "INDIVIDUAL",
      markingType: "SOLO",
    },
  ],
  "2": [
    // Cultural Fest (Group, Solo)
    {
      id: "s2",
      title: "Dance Competition",
      venue: "Open Air Theatre",
      startTime: "05:00 PM",
      endTime: "08:00 PM",
      date: "21 Feb 2024",
      eventId: "2",
      type: "GROUP",
      markingType: "SOLO",
    },
  ],
  "4": [
    // Coding Marathon (Individual, Duo - Check In/Out)
    {
      id: "s3",
      title: "Hackathon Round 1",
      venue: "Lab 201",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      date: "20 Feb 2024",
      eventId: "4",
      type: "INDIVIDUAL",
      markingType: "DUO",
    },
  ],
  "5": [
    // Music Concert (Group, Duo - Rehearsal?)
    {
      id: "s4",
      title: "Band Rehearsals",
      venue: "Music Room",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      date: "21 Feb 2024",
      eventId: "5",
      type: "GROUP",
      markingType: "DUO",
    },
  ],
}

// MOCK PARTICIPANTS
export const MOCK_PARTICIPANTS: Record<string, Participant[]> = {
  s1: [
    // Individual, Solo
    {
      id: "p1",
      name: "Alice Johnson",
      email: "alice@example.com",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: false,
    },
    {
      id: "p2",
      name: "Bob Smith",
      email: "bob@example.com",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: true,
    },
    {
      id: "p3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: false,
    },
  ],
  s2: [
    // Group, Solo
    {
      id: "g1",
      name: "Team Alphas",
      email: "leader@alphas.com",
      teamName: "Alphas",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: true,
    },
    {
      id: "g2",
      name: "Team Betas",
      email: "contact@betas.com",
      teamName: "Betas",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: false,
    },
  ],
  s3: [
    // Individual, Duo
    {
      id: "p4",
      name: "David Lee",
      email: "david@example.com",
      checkInStatus: true,
      checkOutStatus: false,
      attendanceStatus: false,
    },
    {
      id: "p5",
      name: "Eva Green",
      email: "eva@example.com",
      checkInStatus: true,
      checkOutStatus: true,
      attendanceStatus: true,
    }, // Both marked
    {
      id: "p6",
      name: "Frank White",
      email: "frank@example.com",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: false,
    },
  ],
  s4: [
    // Group, Duo
    {
      id: "g3",
      name: "The Rockers",
      email: "rockers@band.com",
      teamName: "The Rockers",
      checkInStatus: true,
      checkOutStatus: false,
      attendanceStatus: false,
    },
    {
      id: "g4",
      name: "Jazz Hands",
      email: "jazz@band.com",
      teamName: "Jazz Hands",
      checkInStatus: false,
      checkOutStatus: false,
      attendanceStatus: false,
    },
  ],
}
