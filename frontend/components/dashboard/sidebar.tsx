"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
Home, Search, Users, Calendar, MessageCircle,
BarChart3, Bell, Settings, LogOut, Zap,
ChevronLeft, ChevronRight
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api, getToken, removeToken } from "@/lib/api"
interface SidebarProps {
isCollapsed: boolean
onToggle: () => void
}
const navItems = [
{ href: "/dashboard", icon: Home, label: "Dashboard", badge: null },
{ href: "/dashboard/browse", icon: Search, label: "Browse Matches", badge: null },
{ href: "/dashboard/requests", icon: Users, label: "Swap Requests", badge: null },
{ href: "/dashboard/schedule", icon: Calendar, label: "Schedule", badge: null },
{ href: "/dashboard/messages", icon: MessageCircle, label: "Messages", badge: null },
{ href: "/dashboard/progress", icon: BarChart3, label: "My Progress", badge: null },
{ href: "/dashboard/notifications", icon: Bell, label: "Notifications", badge: null },
{ href: "/dashboard/settings", icon: Settings, label: "Settings", badge: null },
]
export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
const pathname = usePathname()
const [user, setUser] = useState<any>(null)
useEffect(() => {
const token = getToken()
if (!token) return
api.getMe(token).then(data => setUser(data)).catch(console.error)
}, [])
const handleLogout = () => {
removeToken()
window.location.href = "/login"
}
const initials = user?.name
?.split(" ")
.map((n: string) => n[0])
.join("")
.toUpperCase() || "?"
return (
<aside className={cn(
"fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 hidden md:flex flex-col",
isCollapsed ? "w-[72px]" : "w-60"
)}>
{/* Logo */}
<div className="flex h-16 items-center justify-between px-4 border-b border-border">
<Link href="/" className="flex items-center gap-2">
<Zap className="h-7 w-7 text-primary fill-primary shrink-0" />
{!isCollapsed && (
<span className="text-xl font-bold text-primary">SkillSwap</span>
)}
</Link>
<Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 shrink-0">
{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
</Button>
</div>
  {/* User Info */}
  <div className={cn("p-4 border-b border-border", isCollapsed ? "flex justify-center" : "")}>
    <div className={cn("flex items-center gap-3", isCollapsed ? "flex-col" : "")}>
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {user?.name || "Loading..."}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="text-yellow-500">★</span>
            <span>{user?.rating || "New"}</span>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
    {navItems.map((item) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            isCollapsed && "justify-center px-2"
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">{item.label}</span>
          )}
        </Link>
      )
    })}
  </nav>

  {/* Logout */}
  <div className="p-3 border-t border-border">
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={cn(
        "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
        isCollapsed ? "justify-center px-2" : "justify-start"
      )}
    >
      <LogOut className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="ml-3">Logout</span>}
    </Button>
  </div>
</aside>
)
}
