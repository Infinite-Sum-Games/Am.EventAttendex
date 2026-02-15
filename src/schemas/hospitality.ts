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

export type Step = "SCAN_STUDENT" | "SCAN_HOSPITALITY" | "MAPPING" | "RESULT"
export type ScanStatus = "idle" | "success" | "error"

export interface MapQrResponse {
  message: string
  accommodation_id: string
  has_opted_accommodation: boolean
}

export interface AccommodationDetails {
  name: string
  email: string
  phone_number: string
  is_male: boolean
  college_name: string
  college_roll_number: string
  check_in_date: string
  check_in_time: string
  check_out_date: string
  check_out_time: string
}

export type GateScanStep = "SCANNING" | "FETCHING_STATUS" | "RESULT"

export interface GateStatusResponse {
  message: string
  allow: boolean
  reason?: string
  name: string
  email: string
  college_name: string
}
