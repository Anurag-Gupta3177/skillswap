"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Invalid email format")
      return
    }

    setError("")
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSuccess(true)
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-background rounded-2xl shadow-lg p-8">
        {/* Back Arrow */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-primary">SkillSwap</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          {!isSuccess && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {"Enter your email and we'll send you reset instructions"}
            </p>
          )}
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Check your email!
            </h2>
            <p className="text-sm text-muted-foreground">
              Reset link sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <Link href="/login">
              <Button
                variant="outline"
                className="mt-6 w-full h-11"
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                className={error ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
