import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Schedule } from "@/types/events"

interface ScheduleCardProps {
  schedule: Schedule
  eventId: string
  className?: string
}

export function ScheduleCard({
  schedule,
  eventId,
  className,
}: ScheduleCardProps) {
  return (
    <Link
      to="/events/$eventId/schedules/$scheduleId"
      params={{ eventId, scheduleId: schedule.id }}
      className="block focus:outline-none group"
    >
      <Card
        className={cn(
          "w-full overflow-hidden rounded-xl border border-white/10 backdrop-blur-md",
          "transition-all duration-300 ease-out",
          "hover:border-amber-400/30 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]",
          "bg-white/5",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg font-semibold text-white/90 group-hover:text-amber-400 transition-colors">
              {schedule.title}
            </CardTitle>
            {/* Badges removed as per user request */}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-amber-400/70" />
            <span>{schedule.venue}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-400/70" />
            <span>
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-amber-400/70" />
            <span>{schedule.date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
