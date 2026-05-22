"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <MobileNav />
      <main
        className={cn(
          "min-h-screen pb-20 md:pb-0 transition-all duration-300",
          isCollapsed ? "md:pl-[72px]" : "md:pl-60"
        )}
      >
        {children}
      </main>
    </div>
  )
}
