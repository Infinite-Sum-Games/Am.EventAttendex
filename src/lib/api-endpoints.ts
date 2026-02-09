export const apiEndpoints = {
  LOGIN: "/auth/login",

  // attendance
  // SOLO ATTENDANCE ENDPOINT
  MARK_ATTENDANCE: (studentId: string, scheduleId: string) =>
    `/solo/mark/BOTH/${studentId}/${scheduleId}`,
} as const
