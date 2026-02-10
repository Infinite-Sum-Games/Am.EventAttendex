import { useState, useEffect, useRef } from "react"
import { LogOut, X, Menu } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import type { SidebarProps } from "@/types/sidebar"

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any auth tokens/state here if needed
    navigate({ to: "/login" })
  }

  return (
    <>
      {/* Backdrop - only visible on mobile when sidebar is open */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar - always visible on desktop, slide-in on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 ease-out",
          "border-r border-amber-500/20",
          // On desktop (md+), always visible. On mobile, slide based on isOpen
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{
          backgroundColor: "var(--navy-dark)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Pragati 2026
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Attendance App
              </p>
            </div>
            {/* Close button - only on mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Spacer - pushes logout to bottom */}
        <div className="flex-1" />

        {/* Footer with Logout */}
        <div className="p-4 border-t border-amber-500/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10 flex items-center justify-center text-amber-500 font-bold shadow-inner">
                U
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">
                  User
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  user@pragati.edu
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg 
                       text-xs font-medium text-muted-foreground
                       bg-black/20 backdrop-blur-sm border border-amber-500/30
                       hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500 
                       transition-all duration-300 group"
            >
              <LogOut
                size={14}
                className="group-hover:scale-105 transition-transform"
              />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// Hook for swipe gesture detection
export function useSwipeToOpen() {
  const [isOpen, setIsOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const swipeDistance = touchEndX.current - touchStartX.current
      const startedFromEdge = touchStartX.current < 30 // Started from left edge

      // Open sidebar if swiped right from left edge
      if (startedFromEdge && swipeDistance > 50) {
        setIsOpen(true)
      }

      // Close sidebar if swiped left while open
      if (isOpen && swipeDistance < -50) {
        setIsOpen(false)
      }

      // Reset
      touchStartX.current = 0
      touchEndX.current = 0
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isOpen])

  return { isOpen, setIsOpen, close: () => setIsOpen(false) }
}

// Menu button component for triggering sidebar
export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
  )
}
