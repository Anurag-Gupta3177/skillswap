"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Zap, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"

import { api, saveToken } from "@/lib/api"

type FormErrors = {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  const passwordStrength = useMemo(() => {
    const { password } = formData

    if (!password) {
      return {
        level: 0,
        label: "",
        color: "",
      }
    }

    let strength = 0

    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) {
      return {
        level: 1,
        label: "Weak",
        color: "bg-red-500",
      }
    }

    if (strength <= 3) {
      return {
        level: 2,
        label: "Fair",
        color: "bg-orange-500",
      }
    }

    return {
      level: 3,
      label: "Strong",
      color: "bg-green-500",
    }
  }, [formData.password])

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (
      !validateEmail(formData.email)
    ) {
      newErrors.email =
        "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required"
    } else if (
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password"
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match"
    }

    if (!agreedToTerms) {
      newErrors.terms =
        "You must agree to the terms"
    }

    setErrors(newErrors)

    if (
      Object.keys(newErrors).length > 0
    ) {
      return
    }

    setIsLoading(true)

    try {
      const data = await api.register(
        formData.fullName,
        formData.email,
        formData.password
      )

      if (data.message) {
        alert(
          "✅ Account created! Please check your email to verify your account."
        )

        window.location.href = "/login"
      } else {
        setErrors({
          email:
            data.message ||
            "Registration failed",
        })
      }
    } catch (error) {
      console.error(error)

      setErrors({
        email:
          "Something went wrong. Try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-background rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 mb-4"
          >
            <Zap className="h-8 w-8 text-primary fill-primary" />

            <span className="text-2xl font-bold text-primary">
              SkillSwap
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">
            Create your account
          </h1>
        </div>

        {/* Google OAuth Button */}
        <Button
          variant="outline"
          className="w-full h-11 mb-6 gap-3"
          type="button"
          onClick={() => {
            window.location.href = `${
              process.env.NEXT_PUBLIC_API_URL ||
              "http://localhost:5000/api"
            }/auth/google`
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />

            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />

            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />

            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />

          <span className="text-sm text-muted-foreground">
            or continue with email
          </span>

          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name
            </Label>

            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })

                if (errors.fullName) {
                  setErrors({
                    ...errors,
                    fullName: undefined,
                  })
                }
              }}
              className={
                errors.fullName
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : ""
              }
            />

            {errors.fullName && (
              <p className="text-sm text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                })

                if (errors.email) {
                  setErrors({
                    ...errors,
                    email: undefined,
                  })
                }
              }}
              className={
                errors.email
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : ""
              }
            />

            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })

                  if (errors.password) {
                    setErrors({
                      ...errors,
                      password: undefined,
                    })
                  }
                }}
                className={
                  errors.password
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 pr-10"
                    : "pr-10"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map(
                    (level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordStrength.level >=
                          level
                            ? passwordStrength.color
                            : "bg-border"
                        }`}
                      />
                    )
                  )}
                </div>

                <p
                  className={`text-xs ${
                    passwordStrength.level ===
                    1
                      ? "text-red-500"
                      : passwordStrength.level ===
                        2
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrength.label}
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={
                  formData.confirmPassword
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    confirmPassword:
                      e.target.value,
                  })

                  if (
                    errors.confirmPassword
                  ) {
                    setErrors({
                      ...errors,
                      confirmPassword:
                        undefined,
                    })
                  }
                }}
                className={
                  errors.confirmPassword
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 pr-10"
                    : "pr-10"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {
                  errors.confirmPassword
                }
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(
                  checked
                ) => {
                  setAgreedToTerms(
                    checked as boolean
                  )

                  if (errors.terms) {
                    setErrors({
                      ...errors,
                      terms: undefined,
                    })
                  }
                }}
                className={
                  errors.terms
                    ? "border-red-500"
                    : ""
                }
              />

              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {errors.terms && (
              <p className="text-sm text-red-500">
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Bottom Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}