import type { Event, Schedule, Participant } from "@/types/events"

export const MOOCK_EVENTS: Event[] = [
  {
    event_id: "1",
    event_name: "Tech Talk 2024",
    organizer: "Computer Science Dept",
    is_group: false,
    attendance_mode: "SOLO",
    schedules: [
      {
        id: "s1",
        title: "Morning Session",
        venue: "Auditorium A",
        start_time: "10:00 AM",
        end_time: "12:00 PM",
        event_date: "20 Feb 2024",
        eventId: "1",
      },
    ],
  },
  {
    event_id: "2",
    event_name: "Cultural Fest",
    organizer: "Arts Club",
    is_group: true,
    attendance_mode: "SOLO",
    schedules: [
      {
        id: "s2",
        title: "Dance Competition",
        venue: "Open Air Theatre",
        start_time: "05:00 PM",
        end_time: "08:00 PM",
        event_date: "21 Feb 2024",
        eventId: "2",
      },
    ],
  },
  {
    event_id: "4",
    event_name: "Coding Marathon",
    organizer: "Computer Science Dept",
    is_group: false,
    attendance_mode: "DUO",
    schedules: [
      {
        id: "s3",
        title: "Hackathon Round 1",
        venue: "Lab 201",
        start_time: "09:00 AM",
        end_time: "05:00 PM",
        event_date: "20 Feb 2024",
        eventId: "4",
      },
    ],
  },
  {
    event_id: "5",
    event_name: "Music Concert",
    organizer: "Music Club",
    is_group: true,
    attendance_mode: "DUO",
    schedules: [
      {
        id: "s4",
        title: "Band Rehearsals",
        venue: "Music Room",
        start_time: "02:00 PM",
        end_time: "04:00 PM",
        event_date: "21 Feb 2024",
        eventId: "5",
      },
    ],
  },
  {
    event_id: "7",
    event_name: "AI Seminar",
    organizer: "AI Research Group",
    is_group: false,
    attendance_mode: "SOLO",
    schedules: [],
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
      start_time: "10:00 AM",
      end_time: "12:00 PM",
      event_date: "20 Feb 2024",
      eventId: "1",
    },
  ],
  "2": [
    // Cultural Fest (Group, Solo)
    {
      id: "s2",
      title: "Dance Competition",
      venue: "Open Air Theatre",
      start_time: "05:00 PM",
      end_time: "08:00 PM",
      event_date: "21 Feb 2024",
      eventId: "2",
    },
  ],
  "4": [
    // Coding Marathon (Individual, Duo - Check In/Out)
    {
      id: "s3",
      title: "Hackathon Round 1",
      venue: "Lab 201",
      start_time: "09:00 AM",
      end_time: "05:00 PM",
      event_date: "20 Feb 2024",
      eventId: "4",
    },
  ],
  "5": [
    // Music Concert (Group, Duo - Rehearsal?)
    {
      id: "s4",
      title: "Band Rehearsals",
      venue: "Music Room",
      start_time: "02:00 PM",
      end_time: "04:00 PM",
      event_date: "21 Feb 2024",
      eventId: "5",
    },
  ],
}

// MOCK PARTICIPANTS
export const MOCK_PARTICIPANTS: Record<string, Participant[]> = {
  s1: [
    // Individual, Solo
    {
      attendance_id: "p1",
      student_id: "s1",
      student_name: "Alice Johnson",
      student_email: "alice@example.com",
      check_in: null,
      check_out: null,
    },
    {
      attendance_id: "p2",
      student_id: "s2",
      student_name: "Bob Smith",
      student_email: "bob@example.com",
      check_in: "2023-10-27T10:00:00Z",
      check_out: null,
    },
    {
      attendance_id: "p3",
      student_id: "s3",
      student_name: "Charlie Brown",
      student_email: "charlie@example.com",
      check_in: null,
      check_out: null,
    },
  ],
  s4: [
    // Group, Duo
    {
      attendance_id: "g3",
      student_id: "s4",
      student_name: "The Rockers",
      student_email: "rockers@band.com",
      team_name: "The Rockers",
      check_in: "2023-10-27T14:00:00Z",
      check_out: null,
    },
    {
      attendance_id: "g4",
      student_id: "s5",
      student_name: "Jazz Hands",
      student_email: "jazz@band.com",
      team_name: "Jazz Hands",
      check_in: null,
      check_out: null,
    },
  ],
}
