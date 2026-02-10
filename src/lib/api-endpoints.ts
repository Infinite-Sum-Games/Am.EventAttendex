export const apiEndpoints = {
  LOGIN: "/auth/login",

  // events page
  GET_ORGANIZER_EVENTS: "/attendance/list/event",

  // schedules page
  GET_EVENT_SCHEDULES: (eventId: string, scheduleId: string) =>
    `/attendance/list/${eventId}/${scheduleId}`,

  // ATTENDANCE SCANNER ENDPOINTS
  // solo-attendance-scanner.tsx - SOLO here means that there is only one endpoint for marking attendance, which marks both check-in and check-out at the same time. This is used for events that do not require separate check-in and check-out.
  // isTeamEvent = false
  MARK_INDIVIDUAL_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/solo/mark/BOTH/${studentId}/${scheduleId}`,
  // isTeamEvent = true
  MARK_TEAM_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/team/mark/BOTH/${studentId}/${scheduleId}`,

  // duo-attendance-scanner.tsx - DUO here means seprate check-in and check-out endpoints, not that there are two students involved
  // isTeamEvent = false
  CHECKIN_INDIVIDUAL_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/solo/mark/IN/${studentId}/${scheduleId}`,
  CHECKOUT_INDIVIDUAL_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/solo/mark/OUT/${studentId}/${scheduleId}`,

  // isTeamEvent = true
  CHECKIN_TEAM_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/team/mark/IN/${studentId}/${scheduleId}`,
  CHECKOUT_TEAM_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/team/mark/OUT/${studentId}/${scheduleId}`,

  // MANUAL UNMARKING ENDPOINTS
  // isTeamEvent = false && DUO marking (separate check-in and check-out)
  UNMARK_INDIVIDUAL_CHECKIN: (studentId: string, scheduleId: string) =>
    `/attendance/solo/unMark/IN/${studentId}/${scheduleId}`,
  UNMARK_INDIVIDUAL_CHECKOUT: (studentId: string, scheduleId: string) =>
    `/attendance/solo/unMark/OUT/${studentId}/${scheduleId}`,

  // isTeamEvent = true && DUO marking (separate check-in and check-out)
  UNMARK_TEAM_CHECKIN: (studentId: string, scheduleId: string) =>
    `/attendance/team/unMark/IN/${studentId}/${scheduleId}`,
  UNMARK_TEAM_CHECKOUT: (studentId: string, scheduleId: string) =>
    `/attendance/team/unMark/OUT/${studentId}/${scheduleId}`,

  // isTeamEvent = false && SOLO marking (marking both check-in and check-out at the same time)
  UNMARK_INDIVIDUAL_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/solo/unMark/BOTH/${studentId}/${scheduleId}`,
  UNMARK_TEAM_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/team/unMark/BOTH/${studentId}/${scheduleId}`,
} as const
