import { z } from "zod"

export const mapQrSchema = z.object({
  student_id: z.uuid("Invalid Student ID format"),
  hospitality_id: z
    .string()
    .regex(
      /^P\d{3}$/,
      "Invalid Hospitality ID. Must be P + 3 digits (e.g., P001)."
    ),
})

export const gateCheckInSchema = z.object({
  hospitality_id: z
    .string()
    .regex(
      /^P\d{3}$/,
      "Invalid Hospitality ID. Must be P + 3 digits (e.g., P001)."
    ),
})

export const gateCheckOutSchema = gateCheckInSchema

export type MapQrSchema = z.infer<typeof mapQrSchema>
export type GateCheckInSchema = z.infer<typeof gateCheckInSchema>
export type GateCheckOutSchema = z.infer<typeof gateCheckOutSchema>
