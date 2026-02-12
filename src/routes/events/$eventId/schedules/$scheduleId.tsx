import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useMemo, useEffect } from "react"
import { ArrowLeft, Search, Users, QrCode } from "lucide-react"
import { useEventStore } from "@/store/event-store"
import { SoloAttendanceScanner } from "@/components/events/solo-attendance-scanner"
import { DuoAttendanceScanner } from "@/components/events/duo-attendance-scanner"
import {
  MOCK_SCHEDULES,
  MOCK_PARTICIPANTS,
  MOOCK_EVENTS,
} from "@/components/events/mock-data"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AttendanceActions } from "@/components/events/attendance-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Participant } from "@/types/events"

export const Route = createFileRoute("/events/$eventId/schedules/$scheduleId")({
  component: ScheduleParticipantPage,
})

function ScheduleParticipantPage() {
  const { eventId, scheduleId } = Route.useParams()
  const { selectedEvent, setSelectedEvent, setSelectedSchedule } =
    useEventStore()

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Simulate Data Fetching
  const event = MOOCK_EVENTS.find((e) => e.id === eventId)
  const schedule = MOCK_SCHEDULES[eventId]?.find((s) => s.id === scheduleId)

  // Local state for participants to handle optimistic updates
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    // Reset or Fetch data
    if (event) setSelectedEvent(event)
    if (schedule) setSelectedSchedule(schedule)

    // Load participants
    const data = MOCK_PARTICIPANTS[scheduleId] ?? []
    setParticipants(data)
  }, [
    eventId,
    scheduleId,
    event,
    schedule,
    setSelectedEvent,
    setSelectedSchedule,
  ])

  // Filter Logic
  const filteredParticipants = useMemo(() => {
    return participants.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.teamName &&
          p.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [participants, searchQuery])

  // Pagination Logic
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage)
  const paginatedParticipants = filteredParticipants.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Handlers
  const handleMark = (
    participantId: string,
    type: "CHECKIN" | "CHECKOUT" | "BOTH"
  ) => {
    // Update local state to reflect change - Simulate API call
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            checkInStatus:
              type === "CHECKIN" || type === "BOTH" ? true : p.checkInStatus,
            checkOutStatus:
              type === "CHECKOUT" || type === "BOTH" ? true : p.checkOutStatus,
            attendanceStatus: type === "BOTH" ? true : p.attendanceStatus,
          }
        }
        return p
      })
    )
  }

  const handleUnmark = (
    participantId: string,
    type: "CHECKIN" | "CHECKOUT" | "BOTH"
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            checkInStatus:
              type === "CHECKIN" || type === "BOTH" ? false : p.checkInStatus,
            checkOutStatus:
              type === "CHECKOUT" || type === "BOTH" ? false : p.checkOutStatus,
            attendanceStatus: type === "BOTH" ? false : p.attendanceStatus,
          }
        }
        return p
      })
    )
  }

  // If no schedule found (e.g. direct link)
  if (!schedule) {
    return (
      <div className="p-10 text-white">Loading or Schedule Not Found...</div>
    )
  }

  const isGroup = schedule.type === "GROUP"
  const isDuo = schedule.markingType === "DUO"

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--navy-dark)" }}
    >
      <div className="container mx-auto p-4 md:p-6 pb-20 max-w-7xl">
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/events/$eventId"
            params={{ eventId }}
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {selectedEvent?.name}
            </span>
            <h1 className="text-xl font-bold text-white/90">
              {schedule.title}
            </h1>
          </div>
        </div>

        {/* Controls: Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search participants..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-400/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Participant Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Participant</TableHead>
                {/* Removed Team Column */}
                <TableHead className="text-center text-white/60">
                  Status
                </TableHead>
                <TableHead className="text-right text-white/60">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParticipants.length > 0 ? (
                paginatedParticipants.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white/90">
                          {p.name}
                        </span>
                        <span className="text-xs text-white/50">{p.email}</span>

                        {/* Team Name badge moved here */}
                        {isGroup && p.teamName && (
                          <div className="flex items-start">
                            <Badge
                              variant="secondary"
                              className="mt-1 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-[10px] h-5 px-1.5 gap-1"
                            >
                              <Users size={10} />
                              {p.teamName}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isDuo ? (
                          // DUO Status badges
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Badge
                              variant={p.checkInStatus ? "default" : "outline"}
                              className={
                                p.checkInStatus
                                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/50 justify-center"
                                  : "border-white/20 text-white/40 justify-center"
                              }
                            >
                              IN
                            </Badge>
                            <Badge
                              variant={p.checkOutStatus ? "default" : "outline"}
                              className={
                                p.checkOutStatus
                                  ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/50 justify-center"
                                  : "border-white/20 text-white/40 justify-center"
                              }
                            >
                              OUT
                            </Badge>
                          </div>
                        ) : (
                          // SOLO Status badge
                          <Badge
                            variant={p.attendanceStatus ? "default" : "outline"}
                            className={
                              p.attendanceStatus
                                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/50"
                                : "border-white/20 text-white/40"
                            }
                          >
                            {p.attendanceStatus ? "PRESENT" : "ABSENT"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AttendanceActions
                        participant={p}
                        schedule={schedule}
                        onMark={(type) => handleMark(p.id, type)}
                        onUnmark={(type) => handleUnmark(p.id, type)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-white/40"
                  >
                    No participants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-white/10 bg-transparent text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <div className="text-xs text-white/40">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-white/10 bg-transparent text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        )}
        {/* Floating Scanner Button */}
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-95 z-40"
          onClick={() => setShowScanner(true)}
        >
          <QrCode className="h-7 w-7" />
        </Button>

        {/* Scanner Modal */}
        {showScanner &&
          (isDuo ? (
            <DuoAttendanceScanner
              eventName={selectedEvent?.name || "Event"}
              scheduleId={scheduleId}
              onClose={() => setShowScanner(false)}
              isTeamEvent={isGroup}
            />
          ) : (
            <SoloAttendanceScanner
              eventName={selectedEvent?.name || "Event"}
              scheduleId={scheduleId}
              onClose={() => setShowScanner(false)}
              isTeamEvent={isGroup}
            />
          ))}
      </div>
    </div>
  )
}
