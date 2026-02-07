import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Event } from "./mock-data"

interface EventCardProps {
  event: Event
  className?: string
  isActive?: boolean
}

export function EventCard({
  event,
  className,
  isActive = false,
}: EventCardProps) {
  return (
    <Card
      className={cn(
        // Base glass effect
        "w-full overflow-hidden rounded-2xl border border-white/10",
        "bg-white/5 backdrop-blur-xl",
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
        background: isActive
          ? "linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(234,179,8,0.05) 100%)"
          : "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(147,51,234,0.05) 100%)",
      }}
    >
      <CardHeader className="pb-1">
        <CardTitle className="text-xl font-bold text-white/90">
          {event.name}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-white/60">
          {event.organizer}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div
          className={cn(
            "inline-block rounded-lg px-3 py-1 text-sm font-semibold",
            "bg-purple-500/10 text-purple-300/80 border border-purple-400/10"
          )}
        >
          {event.day}
        </div>
      </CardContent>
    </Card>
  )
}
