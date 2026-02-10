export const apiEndpoints = {
  LOGIN: "/auth/login",

  // ATTENDANCE SCANNER ENDPOINTS
  // solo-attendance-scanner.tsx
  // isTeamEvent = false
  MARK_INDIVIDUAL_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/solo/mark/BOTH/${studentId}/${scheduleId}`,
  // isTeamEvent = true
  MARK_TEAM_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/attendance/team/mark/BOTH/${studentId}/${scheduleId}`,

  // duo-attendance-scanner.tsx
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
} as const
