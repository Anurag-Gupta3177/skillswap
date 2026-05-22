"use client"

import { useState, useEffect } from "react"

import {
  Search,
  Star,
  MapPin,
  Filter,
  X,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { api, getToken } from "@/lib/api"

const categories = [
  { id: "all", label: "All", emoji: "" },
  { id: "Tech", label: "Tech", emoji: "💻" },
  { id: "Music", label: "Music", emoji: "🎵" },
  {
    id: "Language",
    label: "Languages",
    emoji: "🌍",
  },
  { id: "Art", label: "Art", emoji: "🎨" },
  {
    id: "Fitness",
    label: "Fitness",
    emoji: "💪",
  },
  {
    id: "Cooking",
    label: "Cooking",
    emoji: "🍳",
  },
]

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?"
  )
}

function getSkillEmoji(skill: string) {
  const map: Record<string, string> = {
    Python: "🐍",
    JavaScript: "💻",
    Guitar: "🎸",
    Spanish: "🌍",
    French: "🇫🇷",
    Piano: "🎹",
    Yoga: "🧘",
    Photography: "📷",
    "Graphic Design": "🎨",
    Excel: "📊",
    Drawing: "✏️",
    "Public Speaking": "🎤",
    Fitness: "💪",
    Cooking: "🍳",
  }

  return map[skill] || "⭐"
}

/* ───────────────────────────────────────────────────────────── */

function UserProfileModal({
  user,
  onClose,
  onSendRequest,
}: {
  user: any
  onClose: () => void
  onSendRequest: (user: any) => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(user.name)}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {user.name}
              </h2>

              <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {user.location ||
                  "Remote"}
              </p>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
                  {user.rating ||
                    "New"}
                </span>

                <span className="text-white/70 text-sm">
                  {user.totalSwaps ||
                    0}{" "}
                  swaps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {user.bio && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 italic">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                🎯 Offers
              </p>

              <p className="font-semibold text-primary text-sm">
                {getSkillEmoji(
                  user.skillOffered
                    ?.name
                )}{" "}
                {user.skillOffered
                  ?.name || "N/A"}
              </p>

              {user.skillOffered
                ?.level && (
                <Badge className="mt-1 text-xs bg-primary/10 text-primary border-0 h-5">
                  {
                    user
                      .skillOffered
                      .level
                  }
                </Badge>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                🎓 Wants to learn
              </p>

              <p className="font-semibold text-gray-700 text-sm">
                {getSkillEmoji(
                  user.skillWanted
                )}{" "}
                {user.skillWanted ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Request Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 gap-2 py-5"
            onClick={() =>
              onSendRequest(user)
            }
          >
            Send Swap Request 🤝
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────── */

function UserCard({
  user,
  matchScore,
  onViewProfile,
}: {
  user: any
  matchScore?: number
  onViewProfile: (
    user: any
  ) => void
}) {
  return (
    <Card className="group bg-card border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-4">
        {matchScore !==
          undefined && (
          <div className="flex justify-end mb-2">
            <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs">
              {matchScore}% Match
            </Badge>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {getInitials(
                user.name
              )}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-semibold text-foreground">
            {user.name}
          </h3>

          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3" />
            {user.location ||
              "Remote"}
          </p>

          <div className="flex flex-col gap-2 w-full mb-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">
                Offers:
              </span>

              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {getSkillEmoji(
                  user.skillOffered
                    ?.name
                )}{" "}
                {user
                  .skillOffered
                  ?.name || "N/A"}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">
                Wants:
              </span>

              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {getSkillEmoji(
                  user.skillWanted
                )}{" "}
                {user.skillWanted ||
                  "N/A"}
              </Badge>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() =>
              onViewProfile(user)
            }
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ───────────────────────────────────────────────────────────── */

export default function BrowsePage() {
  const [matches, setMatches] =
    useState<any[]>([])

  const [allUsers, setAllUsers] =
    useState<any[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all")

  const [level, setLevel] =
    useState("all")

  const [isRemote, setIsRemote] =
    useState(false)

  const [selectedUser, setSelectedUser] =
    useState<any>(null)

  const [
    isSendingRequest,
    setIsSendingRequest,
  ] = useState(false)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      window.location.href = "/login"
      return
    }

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const [
          matchData,
          userData,
        ] = await Promise.all([
          api.getMatches(token),
          api.searchUsers(
            token,
            ""
          ),
        ])

        setMatches(matchData)
        setAllUsers(userData)
      } catch (error) {
        console.error(
          "Error fetching users:",
          error
        )
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const token = getToken()

    if (!token) return

    const searchTimeout =
      setTimeout(async () => {
        try {
          const category =
            selectedCategory ===
            "all"
              ? ""
              : selectedCategory

          const lvl =
            level === "all"
              ? ""
              : level

          const res = await fetch(
            `${
              process.env
                .NEXT_PUBLIC_API_URL ||
              "http://localhost:5000/api"
            }/users/search?skill=${searchQuery}&category=${category}&level=${lvl}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const data =
            await res.json()

          setAllUsers(data)
        } catch (error) {
          console.error(
            "Search error:",
            error
          )
        }
      }, 400)

    return () =>
      clearTimeout(searchTimeout)
  }, [
    searchQuery,
    selectedCategory,
    level,
  ])

  const handleSendRequest =
    async (user: any) => {
      const token = getToken()

      if (
        !token ||
        isSendingRequest
      )
        return

      setIsSendingRequest(true)

      try {
        const me =
          await api.getMe(token)

        await api.sendSwapRequest(
          token,
          {
            receiver: user._id,
            senderOffersSkill:
              me.skillOffered
                ?.name ||
              "My Skill",
            senderWantsSkill:
              user.skillOffered
                ?.name ||
              "Their Skill",
            message: `Hi ${user.name}! I'd love to swap skills with you! 🤝`,
          }
        )

        await fetch(
          `${
            process.env
              .NEXT_PUBLIC_API_URL ||
            "http://localhost:5000/api"
          }/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: user._id,
              type:
                "swap_request",
              title:
                "🤝 New Swap Request!",
              body: `${me.name} wants to swap ${
                me.skillOffered
                  ?.name ||
                "skills"
              } with you for ${
                user.skillOffered
                  ?.name ||
                "your skill"
              }!`,
            }),
          }
        )

        alert(
          `Swap request sent to ${user.name}! They've been notified. 🎉`
        )

        setSelectedUser(null)
      } catch (error) {
        console.error(
          "Error sending request:",
          error
        )

        alert(
          "Something went wrong. Try again!"
        )
      }

      setIsSendingRequest(false)
    }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Your remaining JSX stays SAME */}
    </div>
  )
}