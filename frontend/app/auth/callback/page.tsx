"use client"

import { useEffect } from "react"
import { saveToken } from "@/lib/api"
import { Zap } from "lucide-react"

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const onboarding = params.get("onboarding")

    if (token) {
      saveToken(token)
      if (onboarding === "false") {
        window.location.href = "/onboarding"
      } else {
        window.location.href = "/dashboard"
      }
    } else {
      window.location.href = "/login"
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#6C3BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="w-8 h-8 border-4 border-[#6C3BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Signing you in with Google...</p>
      </div>
    </div>
  )
}