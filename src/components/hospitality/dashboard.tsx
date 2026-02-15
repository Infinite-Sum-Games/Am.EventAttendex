import { useNavigate } from "@tanstack/react-router"
import { QrCode, LogIn, LogOut, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"

export function HospitalityDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axiosClient.post(apiEndpoints.HOSPITALITY_LOGOUT)
    } finally {
      localStorage.removeItem("hospitality_user_name")
      navigate({ to: "/login" })
    }
  }

  const userName = localStorage.getItem("hospitality_user_name")

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Hospitality
          </h1>
          <p className="text-sm text-muted-foreground">
            {userName ? `Welcome, ${userName}` : "Dashboard"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 max-w-md mx-auto w-full justify-center">
        <DashboardButton
          icon={
            <div className="relative">
              <Map className="h-8 w-8 mb-1" />
              <QrCode className="h-4 w-4 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
          }
          title="Map ID & QR"
          description="Link ID cards to guests"
          onClick={() => navigate({ to: "/hospitality/map-qr" })}
        />

        <div className="grid grid-cols-2 gap-4">
          <DashboardButton
            icon={<LogIn className="h-8 w-8 mb-1 text-green-500" />}
            title="Check In"
            description="Guest arrival"
            onClick={() => navigate({ to: "/hospitality/gate-checkin" })}
            variant="secondary"
            className="h-full"
          />

          <DashboardButton
            icon={<LogOut className="h-8 w-8 mb-1 text-red-500" />}
            title="Check Out"
            description="Guest departure"
            onClick={() => navigate({ to: "/hospitality/gate-checkout" })}
            variant="secondary"
            className="h-full"
          />
        </div>
      </main>
    </div>
  )
}

interface DashboardButtonProps extends React.ComponentProps<typeof Button> {
  icon: React.ReactNode
  title: string
  description?: string
}

function DashboardButton({
  icon,
  title,
  description,
  className,
  ...props
}: DashboardButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto py-8 flex flex-col items-center justify-center gap-2 border-2 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all",
        className
      )}
      {...props}
    >
      {icon}
      <div className="text-center">
        <div className="font-bold text-lg">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground font-normal">
            {description}
          </div>
        )}
      </div>
    </Button>
  )
}
