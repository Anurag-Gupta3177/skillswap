"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
RefreshCw, Clock, Star, Trophy,
ArrowRight, Users, MessageCircle,
Calendar, Search, BarChart3
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api, getToken } from "@/lib/api"
export default function DashboardPage() {
const [user, setUser] = useState<any>(null)
const [swaps, setSwaps] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
useEffect(() => {
const token = getToken()
if (!token) { window.location.href = "/login"; return }
const fetchData = async () => {
  try {
    const [userData, swapsData] = await Promise.all([
      api.getMe(token),
      api.getSwaps(token)
    ])
    setUser(userData)
    setSwaps(swapsData)
  } catch (error) {
    console.error("Error:", error)
  }
  setIsLoading(false)
}
fetchData()
}, [])
const activeSwaps = swaps.filter(s => s.status === "accepted" || s.status === "active")
const stats = [
{ label: "Total Swaps Completed", value: user?.totalSwaps || 0, icon: RefreshCw, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
{
  label: "Hours Taught",
  value: `${user?.totalHoursTaught || 0} hrs`,
  icon: Clock,
  color: "text-blue-600",
  bgColor: "bg-blue-50",
  borderColor: "border-blue-200"
},{ label: "Your Rating", value: user?.rating || "New", icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
{ label: "Badges Earned", value: user?.badges?.length || 0, icon: Trophy, color: "text-primary", bgColor: "bg-primary/5", borderColor: "border-primary/20" },
]
if (isLoading) {
return (
<div className="p-8 flex items-center justify-center min-h-screen">
<div className="text-center">
<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
<p className="text-muted-foreground">Loading your dashboard...</p>
</div>
</div>
)
}
return (
<div className="p-4 md:p-6 lg:p-8 space-y-6">
{/* Header */}
<div>
<h1 className="text-2xl font-bold text-foreground">
Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
</h1>
<p className="text-muted-foreground mt-1">
Here's what's happening with your skill swaps.
</p>
</div>
  {/* Stats Row */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div key={stat.label} className={cn("bg-background rounded-xl p-4 border", stat.borderColor)}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", stat.bgColor)}>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Active Swaps */}
  <div>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-foreground">Active Swaps</h2>
      <Link href="/dashboard/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
        View All <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {activeSwaps.length === 0 ? (
      <div className="bg-muted/30 rounded-xl border border-dashed border-border p-10 text-center">
        <div className="text-4xl mb-3">🤝</div>
        <h3 className="font-semibold text-foreground mb-2">No active swaps yet</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Find someone to swap skills with and start learning!
        </p>
        <Link href="/dashboard/browse">
          <Button className="bg-primary hover:bg-primary/90">
            <Search className="mr-2 h-4 w-4" />
            Find a Match
          </Button>
        </Link>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {activeSwaps.map((swap) => {
          const partner = swap.sender?._id === user?._id ? swap.receiver : swap.sender
          return (
            <div key={swap._id} className="bg-background rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {partner?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{partner?.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    You teach: {swap.senderOffersSkill}
                  </p>
                </div>
                <Badge className="ml-auto" variant="secondary">
                  {swap.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-0">
                  {swap.senderOffersSkill}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">
                  {swap.senderWantsSkill}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule a session</span>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>

  {/* Quick Actions */}
  <div>
    <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
    <div className="flex flex-col sm:flex-row gap-3">
      <Link href="/dashboard/browse">
        <Button className="bg-primary hover:bg-primary/90">
          <Search className="mr-2 h-4 w-4" />
          Find New Match
        </Button>
      </Link>
      <Link href="/dashboard/requests">
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          View Requests
        </Button>
      </Link>
      <Link href="/dashboard/progress">
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Progress
        </Button>
      </Link>
    </div>
  </div>

  {/* Profile Completion */}
  {!user?.onboardingComplete && (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
      <h3 className="font-semibold text-yellow-800 mb-1">⚠️ Complete Your Profile</h3>
      <p className="text-yellow-700 text-sm mb-3">
        Add your skills and availability to start getting matched!
      </p>
      <Link href="/onboarding">
        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Complete Profile
        </Button>
      </Link>
    </div>
  )}
</div>
)
}
