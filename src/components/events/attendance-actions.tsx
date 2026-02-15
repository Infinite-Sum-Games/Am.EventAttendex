import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
} from "lucide-react"
import type { Schedule, Participant } from "@/types/events"

interface AttendanceActionsProps {
  participant: Participant
  schedule: Schedule
  onMark: (type: "CHECKIN" | "CHECKOUT" | "BOTH") => void
  onUnmark: (type: "CHECKIN" | "CHECKOUT" | "BOTH") => void
}

export function AttendanceActions({
  participant,
  schedule,
  onMark,
  onUnmark,
}: AttendanceActionsProps) {
  const isDuo = schedule.markingType === "DUO"
  // const isGroup = schedule.type === "GROUP" // Logic might differ if needed, but actions are similar

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10 text-white/70"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-gray-900 border-gray-800 text-white"
      >
        <DropdownMenuLabel>Attendance</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />

        {isDuo ? (
          <>
            {/* DUO MARKING: Check In / Check Out */}
            <DropdownMenuItem
              onClick={() => onMark("CHECKIN")}
              disabled={participant.checkInStatus}
              className="focus:bg-green-900/50 focus:text-green-300 cursor-pointer"
            >
              <LogIn className="mr-2 h-4 w-4 text-green-400" />
              <span>Mark Check In</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onMark("CHECKOUT")}
              disabled={participant.checkOutStatus}
              className="focus:bg-blue-900/50 focus:text-blue-300 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 text-blue-400" />
              <span>Mark Check Out</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-800" />

            <DropdownMenuItem
              onClick={() => onUnmark("CHECKIN")}
              disabled={!participant.checkInStatus}
              className="focus:bg-red-900/50 focus:text-red-300 cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-400" />
              <span>Unmark Check In</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onUnmark("CHECKOUT")}
              disabled={!participant.checkOutStatus}
              className="focus:bg-red-900/50 focus:text-red-300 cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-400" />
              <span>Unmark Check Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* SOLO MARKING: One time mark */}
            <DropdownMenuItem
              onClick={() => onMark("BOTH")}
              disabled={participant.attendanceStatus}
              className="focus:bg-green-900/50 focus:text-green-300 cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />
              <span>Mark Present</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-800" />

            <DropdownMenuItem
              onClick={() => onUnmark("BOTH")}
              disabled={!participant.attendanceStatus}
              className="focus:bg-red-900/50 focus:text-red-300 cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-400" />
              <span>Unmark Present</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
