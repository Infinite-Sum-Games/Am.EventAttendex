import { createFileRoute } from "@tanstack/react-router"
import { use, useEffect } from "react"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  const navigate = Route.useNavigate()

  useEffect(() => {
    navigate({ to: "/login" })
  }, [navigate])
  return <div className="text-center">Hello World!</div>
}
