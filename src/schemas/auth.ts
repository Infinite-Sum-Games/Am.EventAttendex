import { z } from "zod"

export const organizerLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const hospitalityLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type OrganizerLoginSchema = z.infer<typeof organizerLoginSchema>
export type HospitalityLoginSchema = z.infer<typeof hospitalityLoginSchema>
