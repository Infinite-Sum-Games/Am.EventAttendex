import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axiosClient.post(apiEndpoints.LOGIN, data)
      return response.data
    },
    onSuccess: () => {
      navigate({ to: "/events" })
    },
    onError: (error: any) => {
      console.error("Login failed:", error)
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Please enter both email and password")
      return
    }

    loginMutation.mutate({ email: username, password })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background/60 backdrop-blur-xl border-accent/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your organizer credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Email</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="email@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </Field>

              {/* Error message */}
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
