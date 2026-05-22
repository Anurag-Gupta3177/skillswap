"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Search, 
  Calendar, 
  MessageCircle, 
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/browse", icon: Search, label: "Browse" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Schedule" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard/settings", icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
