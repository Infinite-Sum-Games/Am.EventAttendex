import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { ORGANIZERS } from "./mock-data"

interface EventsFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedOrg: string
  setSelectedOrg: (org: string) => void
  selectedDay: "All" | "Day 1" | "Day 2" | "Day 3"
  setSelectedDay: (day: "All" | "Day 1" | "Day 2" | "Day 3") => void
}

export function EventsFilter({
  searchQuery,
  setSearchQuery,
  selectedOrg,
  setSelectedOrg,
  selectedDay,
  setSelectedDay,
}: EventsFilterProps) {
  return (
    <div
      className={cn(
        // Glass effect container
        "flex flex-col gap-4 p-4 rounded-2xl",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
        "shadow-[0_0_30px_rgba(200,200,200,0.1)]"
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(147,51,234,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(147,51,234,0.03) 100%)",
      }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300/60" />
        <Input
          id="search"
          placeholder="Search by name, organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-10 bg-purple-500/10 border-purple-400/20 text-purple-200",
            "placeholder:text-purple-200",
            "focus:border-purple-400/30 focus:ring-purple-400/10"
          )}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:flex-1">
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger
              className={cn(
                "w-full bg-purple-500/10 border-purple-400/20 text-purple-200",
                "focus:border-purple-400/30 focus:ring-purple-400/10"
              )}
            >
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/90 backdrop-blur-xl border-purple-400/20">
              {ORGANIZERS.map((org) => (
                <SelectItem
                  key={org}
                  value={org}
                  className="text-purple-200/80 focus:bg-purple-500/5 focus:text-purple-100"
                >
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:flex-1 flex gap-2">
          {(["All", "Day 1", "Day 2", "Day 3"] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex-1 rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap h-8 backdrop-blur-sm",
                "transition-all duration-200",
                selectedDay === day
                  ? "bg-purple-500/10 text-purple-200 border border-purple-400/30"
                  : "bg-purple-500/[0.03] text-purple-300/60 border border-purple-400/10 hover:bg-purple-500/[0.08] hover:text-purple-300/80"
              )}
            >
              {day === "All" ? "All" : day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
