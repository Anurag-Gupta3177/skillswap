"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api, getToken } from "@/lib/api"

function getInitials(name: string) {
  return name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"
}

function ReceivedRequestCard({
  swap,
  currentUserId,
  onAccept,
  onDecline,
}: {
  swap: any
  currentUserId: string
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}) {
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sender = swap.sender

  const handleAccept = async () => {
    setIsLoading(true)
    await onAccept(swap._id)
    setIsLoading(false)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    await onDecline(swap._id)
    setIsLoading(false)
  }

  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-6">
        {/* User Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {getInitials(sender?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{sender?.name}</h3>
              <span className="text-muted-foreground text-sm">{sender?.location || "Remote"}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {sender?.rating || "New"}
              </span>
              <span>{sender?.totalSwaps || 0} swaps completed</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        </div>

        {/* Skills Exchange */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">They offer:</p>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {swap.senderOffersSkill}
            </Badge>
          </div>
          <div className="hidden sm:block text-muted-foreground">↔</div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">They want:</p>
            <Badge variant="secondary">{swap.senderWantsSkill}</Badge>
          </div>
        </div>

        {/* Roadmap Preview */}
        {sender?.skillOffered?.roadmap?.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isRoadmapExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              View Teaching Roadmap
            </button>
            {isRoadmapExpanded && (
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-primary/20">
                {sender.skillOffered.roadmap.map((topic: any, index: number) => (
                  <div key={index} className="py-2">
                    <p className="text-sm font-medium">Topic {index + 1}: {topic.topic}</p>
                    <p className="text-xs text-muted-foreground">{topic.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {swap.message && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground italic">&quot;{swap.message}&quot;</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Received {new Date(swap.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAccept}
              disabled={isLoading}
            >
              ✓ Accept
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleDecline}
              disabled={isLoading}
            >
              ✕ Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SentRequestCard({
  swap,
  currentUserId,
  onCancel,
}: {
  swap: any
  currentUserId: string
  onCancel: (id: string) => void
}) {
  const receiver = swap.receiver

  const statusConfig: Record<string, any> = {
    accepted: {
      badge: <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Accepted ✅</Badge>,
      action: (
        <Link href="/dashboard/schedule">
          <Button className="bg-primary hover:bg-primary/90">Schedule Session →</Button>
        </Link>
      )
    },
    pending: {
      badge: <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending ⏳</Badge>,
      action: (
        <button
          onClick={() => onCancel(swap._id)}
          className="text-sm text-muted-foreground hover:text-red-500 underline transition-colors"
        >
          Cancel Request
        </button>
      )
    },
    declined: {
      badge: <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Declined ❌</Badge>,
      action: (
        <Link href="/dashboard/browse">
          <Button variant="outline">Find Similar Match</Button>
        </Link>
      )
    }
  }

  const config = statusConfig[swap.status] || statusConfig.pending

  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(receiver?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold">{receiver?.name}</h3>
              {config.badge}
            </div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                {swap.senderOffersSkill}
              </Badge>
              <span className="text-muted-foreground">↔</span>
              <Badge variant="secondary">{swap.senderWantsSkill}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Sent {new Date(swap.createdAt).toLocaleDateString()}
              {swap.status === "pending" && " • Awaiting response"}
            </p>
          </div>
          <div className="shrink-0">{config.action}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-6">
        <Search className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Browse matches and send your first swap request!
      </p>
      <Link href="/dashboard/browse">
        <Button className="bg-primary hover:bg-primary/90">Browse Matches →</Button>
      </Link>
    </div>
  )
}

export default function RequestsPage() {
  const [swaps, setSwaps] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
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
        setCurrentUser(userData)
        setSwaps(swapsData)
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const handleAccept = async (swapId: string) => {
    const token = getToken()
    if (!token) return
    try {
      await api.acceptSwap(token, swapId)
      setSwaps(prev => prev.map(s =>
        s._id === swapId ? { ...s, status: "accepted" } : s
      ))
    } catch (error) {
      console.error("Error accepting swap:", error)
    }
  }

  const handleDecline = async (swapId: string) => {
    const token = getToken()
    if (!token) return
    try {
      await api.declineSwap(token, swapId)
      setSwaps(prev => prev.map(s =>
        s._id === swapId ? { ...s, status: "declined" } : s
      ))
    } catch (error) {
      console.error("Error declining swap:", error)
    }
  }

  const handleCancel = async (swapId: string) => {
    const token = getToken()
    if (!token) return
    try {
      await api.declineSwap(token, swapId)
      setSwaps(prev => prev.filter(s => s._id !== swapId))
    } catch (error) {
      console.error("Error cancelling swap:", error)
    }
  }

  const receivedRequests = swaps.filter(
    s => s.receiver?._id === currentUser?._id && s.status === "pending"
  )

  const sentRequests = swaps.filter(
    s => s.sender?._id === currentUser?._id
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Swap Requests</h1>
        <p className="text-muted-foreground">Manage your incoming and sent swap requests</p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex mb-6">
          <TabsTrigger value="received" className="gap-2">
            📨 Received
            {receivedRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {receivedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            📤 Sent
            {sentRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {sentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-0">
          {receivedRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((swap) => (
                <ReceivedRequestCard
                  key={swap._id}
                  swap={swap}
                  currentUserId={currentUser?._id}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-0">
          {sentRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {sentRequests.map((swap) => (
                <SentRequestCard
                  key={swap._id}
                  swap={swap}
                  currentUserId={currentUser?._id}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}