import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import type { EventsFilterProps } from "@/types/events"

export function EventsFilter({
  searchQuery,
  setSearchQuery,
  selectedDay,
  setSelectedDay,
}: EventsFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          id="search"
          placeholder="Search by name, organization..."
          className="pl-9 border-input text-foreground focus-visible:ring-ring"
          style={{ backgroundColor: "var(--navy-dark)" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Day toggle */}
      <div
        className="flex items-center gap-0.5 px-1 rounded-md border border-zinc-700/50 h-9"
        style={{ backgroundColor: "var(--navy-dark)" }}
      >
        {(["All", "20 Feb", "21 Feb"] as const).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "flex-1 rounded px-2 py-1 text-sm font-medium whitespace-nowrap",
              "transition-all duration-200",
              selectedDay === day
                ? "border border-amber-500/80 text-amber-400 bg-transparent"
                : "border border-transparent text-zinc-400 hover:text-zinc-200"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
