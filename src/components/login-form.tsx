import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import { cn } from "@/lib/utils"
import { loginSchema } from "@/schemas/auth"
import type { LoginSchema } from "@/schemas/auth"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<LoginSchema>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axiosClient.post(apiEndpoints.LOGIN, data)
      return response.data
    },
    onSuccess: (_data) => {
      // TODO: Navigate to dashboard or handle success state
      // window.location.href = "/dashboard"
    },
    onError: (error: any) => {
      console.error("Login failed:", error)
      setErrors({
        root:
          error.response?.data?.message || "Login failed. Please try again.",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(newErrors)
      return
    }

    loginMutation.mutate(result.data)
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
                  value={formData.username}
                  onChange={handleChange}
                  className={
                    errors.username
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                <FieldError>
                  {errors.username && <p>{errors.username}</p>}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive pr-10"
                        : "pr-10"
                    }
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
                <FieldError>
                  {errors.password && <p>{errors.password}</p>}
                </FieldError>
              </Field>

              {errors.root && (
                <div className="text-destructive text-sm font-medium">
                  {errors.root}
                </div>
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
