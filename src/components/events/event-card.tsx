import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { EventCardProps } from "@/types/events"

export function EventCard({
  event,
  className,
  isActive = false,
}: EventCardProps) {
  const isGroup = event.type === "GROUP"

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-2xl group"
    >
      <Card
        className={cn(
          // Base glass effect
          "w-full overflow-hidden rounded-2xl border border-white/10",
          "backdrop-blur-xl",
          // Soft inner highlight
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          // Grey outer glow
          "shadow-[0_0_30px_rgba(200,200,200,0.1)]",
          // Smooth transitions
          "transition-all duration-300 ease-out",
          // Hover/Active states
          isActive
            ? "shadow-[0_0_40px_rgba(234,179,8,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] border-amber-400/30"
            : "hover:shadow-[0_0_40px_rgba(200,200,200,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-white/20 hover:-translate-y-1",
          className
        )}
        style={{
          backgroundColor: "var(--navy-card)",
        }}
      >
        <CardHeader className="pb-1">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl font-bold text-white/90 group-hover:text-white transition-colors">
              {event.name}
            </CardTitle>

            {/* Type Badges - DISTINCT COLORS */}
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border shadow-sm",
                isGroup
                  ? "bg-sky-500/10 text-sky-200 border-sky-400/20 shadow-sky-500/10"
                  : "bg-rose-500/10 text-rose-200 border-rose-400/20 shadow-rose-500/10"
              )}
            >
              {isGroup ? "Group" : "Individual"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "inline-block rounded-lg px-3 py-1 text-sm font-semibold",
                "bg-amber-500/10 text-amber-300/80 border border-amber-400/10"
              )}
            >
              {event.day}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
