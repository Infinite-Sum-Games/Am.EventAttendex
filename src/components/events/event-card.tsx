import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { EventCardProps } from "@/types/events"

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
        <CardTitle className="text-xl font-bold text-white/90">
          {event.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div
          className={cn(
            "inline-block rounded-lg px-3 py-1 text-sm font-semibold",
            "bg-amber-500/10 text-amber-300/80 border border-amber-400/10"
          )}
        >
          {event.day}
        </div>
      </CardContent>
    </Card>
  )
}
