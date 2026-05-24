"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  Check,
  Calendar,
  MessageCircle,
  Star,
  Users,
  Trophy
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { api, getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

function getIcon(type: string) {
  switch (type) {
    case "swap_request":
      return <Users className="h-4 w-4" />

    case "message":
      return <MessageCircle className="h-4 w-4" />

    case "session_reminder":
      return <Calendar className="h-4 w-4" />

    case "review":
      return <Star className="h-4 w-4" />

    case "badge":
      return <Trophy className="h-4 w-4" />

    default:
      return <Bell className="h-4 w-4" />
  }
}

function getIconColor(type: string) {
  switch (type) {
    case "swap_request":
      return "bg-blue-100 text-blue-600"

    case "message":
      return "bg-green-100 text-green-600"

    case "session_reminder":
      return "bg-purple-100 text-purple-600"

    case "review":
      return "bg-yellow-100 text-yellow-600"

    case "badge":
      return "bg-orange-100 text-orange-600"

    default:
      return "bg-gray-100 text-gray-600"
  }
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )

  if (seconds < 60) return "Just now"

  if (seconds < 3600)
    return `${Math.floor(seconds / 60)}m ago`

  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)}h ago`

  return `${Math.floor(seconds / 86400)}d ago`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      window.location.href = "/login"
      return
    }

    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications(token)

        setNotifications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }

      setIsLoading(false)
    }

    fetchNotifications()
  }, [])

  const markAllRead = async () => {
    const token = getToken()

    if (!token) return

    try {
      await api.markNotificationsRead(token)

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          isRead: true
        }))
      )
    } catch (error) {
      console.error("Error marking read:", error)
    }
  }

  const unreadCount = notifications.filter(
    n => !n.isRead
  ).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Notifications
          </h1>

          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "All caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>

          <h3 className="font-semibold text-foreground mb-2">
            No notifications yet
          </h3>

          <p className="text-muted-foreground text-sm">
            When someone sends you a swap request or schedules a
            session, you'll see it here!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                notification.isRead
                  ? "bg-background border-border"
                  : "bg-primary/5 border-primary/20"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full flex-shrink-0",
                  getIconColor(notification.type)
                )}
              >
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    !notification.isRead && "text-primary"
                  )}
                >
                  {notification.title}
                </p>

                <p className="text-sm text-muted-foreground mt-0.5">
                  {notification.body}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(notification.createdAt)}
                </p>
              </div>

              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}