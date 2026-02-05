import { LoginForm } from "@/components/login-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login/")({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 blur-3xl" />
      <div className="z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
