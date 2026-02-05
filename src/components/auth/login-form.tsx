import axiosClient from "@/lib/axios"
import { apiEndpoints } from "@/lib/api-endpoints"
import { cn } from "@/lib/utils"
import { loginSchema } from "@/schemas/auth"
import type { LoginSchema } from "@/schemas/auth"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { z } from "zod"
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
  FieldDescription,
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

  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axiosClient.post(apiEndpoints.LOGIN, data)
      return response.data
    },
    onSuccess: (data) => {
      // Handle success (e.g., redirect, toast)
      console.log("Login success:", data)
      // For now just logging, navigation would handle redirect
      alert("Login successful!")
    },
    onError: (error: any) => {
      console.error("Login failed:", error)
      setErrors({
        root:
          error.response?.data?.message || "Login failed. Please try again.",
      })
    },
  })

  const validateField = (field: keyof LoginSchema, value: string) => {
    try {
      loginSchema.shape[field].parse(value)
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }))
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error on change or validate on change?
    // AGENTS.md says "Show validation errors directly below corresponding fields"
    // Let's validate on change to give immediate feedback or clear error
    validateField(id as keyof LoginSchema, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
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
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  // invalid={!!errors.username} // Input component might not accept invalid prop directly, checking simple input usage
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
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
