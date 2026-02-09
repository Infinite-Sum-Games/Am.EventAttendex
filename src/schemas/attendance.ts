import { z } from "zod"

export const markAttendanceSchema = z.object({
  studentId: z.uuid("Invalid Student ID format"),
  scheduleId: z.uuid("Invalid Schedule ID format"),
})

export type MarkAttendancePayload = z.infer<typeof markAttendanceSchema>
