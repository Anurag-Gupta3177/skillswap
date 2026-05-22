"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, Clock, RefreshCw, Trophy, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Dummy user data
const userData = {
  id: "priya-singh",
  name: "Priya Singh",
  location: "Mumbai, India",
  isRemote: true,
  memberSince: "March 2025",
  avatar: "/avatars/priya.jpg",
  initials: "PS",
  rating: 4.9,
  totalSwaps: 8,
  hoursTaught: 24,
  matchPercent: 94,
  teaches: {
    skill: "Guitar",
    emoji: "🎸",
    level: "Intermediate",
    roadmap: [
      {
        session: 1,
        status: "completed",
        title: "Basic Chords & Strumming",
        description: "Learn the fundamental chords (C, G, D, Em, Am) and basic strumming patterns",
      },
      {
        session: 2,
        status: "current",
        title: "Songs & Rhythm Patterns",
        description: "Apply chords to popular songs and develop rhythm sense",
      },
      {
        session: 3,
        status: "locked",
        title: "Improvisation & Music Theory",
        description: "Understanding scales, modes, and creative improvisation techniques",
      },
    ],
  },
  wants: {
    skill: "Python",
    emoji: "🐍",
    level: "Beginner",
    reason: "I want to automate my music practice schedule and build a simple app to track my progress.",
  },
  availability: {
    // true means available
    morning: [false, false, false, false, false, true, false], // Sat morning
    afternoon: [false, false, false, false, false, false, false],
    evening: [true, false, true, false, true, false, false], // Mon, Wed, Fri evenings
  },
  reviews: {
    average: 4.9,
    total: 8,
    distribution: {
      5: 7,
      4: 1,
      3: 0,
      2: 0,
      1: 0,
    },
    items: [
      {
        id: 1,
        name: "Rahul M.",
        initials: "RM",
        rating: 5,
        tags: ["Knowledgeable", "Patient", "Fun"],
        text: "Priya is an amazing teacher! Learned 3 chords in our first session.",
        timeAgo: "2 weeks ago",
      },
      {
        id: 2,
        name: "Arjun K.",
        initials: "AK",
        rating: 5,
        tags: ["Punctual", "Clear Explanation"],
        text: "Very structured teaching. The roadmap she prepared was perfect.",
        timeAgo: "1 month ago",
      },
      {
        id: 3,
        name: "Sneha P.",
        initials: "SP",
        rating: 4,
        tags: ["Engaging", "Patient"],
        text: "Great experience overall. Would swap again!",
        timeAgo: "2 months ago",
      },
    ],
  },
  badges: [
    { emoji: "🌟", name: "First Swap" },
    { emoji: "🔥", name: "5 Swaps" },
    { emoji: "💎", name: "Top Teacher" },
    { emoji: "⚡", name: "Quick Responder" },
  ],
}

// Current user data (for swap request)
const currentUser = {
  skill: "Python",
  emoji: "🐍",
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = [
  { label: "Morning", key: "morning", time: "6am-12pm" },
  { label: "Afternoon", key: "afternoon", time: "12pm-6pm" },
  { label: "Evening", key: "evening", time: "6pm-10pm" },
]

export default function ProfilePage() {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [swapMessage, setSwapMessage] = useState("")
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendRequest = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSwapModalOpen(false)
    setSwapMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="p-4 md:p-6">
        <Link href="/dashboard/browse">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <section className="relative">
        {/* Cover Photo */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-primary/70" />

        {/* Profile Info */}
        <div className="px-4 md:px-6 lg:px-8 pb-6">
          <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-lg">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl md:text-4xl">
                {userData.initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{userData.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                    {userData.isRemote && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Remote friendly
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {userData.memberSince}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{userData.rating}</span>
                      <span className="text-muted-foreground">Rating</span>
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1 text-sm">
                      <RefreshCw className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{userData.totalSwaps}</span>
                      <span className="text-muted-foreground">Swaps</span>
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{userData.hoursTaught}hrs</span>
                      <span className="text-muted-foreground">Taught</span>
                    </span>
                  </div>

                  {/* Match Badge */}
                  <Badge className="mt-3 bg-green-500 hover:bg-green-500 text-white">
                    {userData.matchPercent}% Match with you
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsSwapModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    Send Swap Request 🤝
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - What Priya Teaches */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg">What {userData.name.split(" ")[0]} Teaches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skill Badge */}
              <div className="flex items-center gap-3">
                <span className="text-4xl">{userData.teaches.emoji}</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{userData.teaches.skill}</h3>
                  <Badge variant="secondary">{userData.teaches.level} Level</Badge>
                </div>
              </div>

              {/* Teaching Roadmap */}
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-3">Teaching Roadmap:</h4>
                <div className="space-y-3">
                  {userData.teaches.roadmap.map((session) => (
                    <div
                      key={session.session}
                      className={cn(
                        "p-4 rounded-lg border",
                        session.status === "completed" && "bg-green-50 border-green-200",
                        session.status === "current" && "bg-primary/5 border-primary",
                        session.status === "locked" && "bg-muted/50 border-border opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {session.status === "completed" && "✅"}
                          {session.status === "current" && "📍"}
                          {session.status === "locked" && "🔒"}
                        </span>
                        <span className="font-medium text-foreground">
                          Session {session.session}: {session.title}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        {session.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - What Priya Wants */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg">What {userData.name.split(" ")[0]} Wants to Learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skill Badge */}
              <div className="flex items-center gap-3">
                <span className="text-4xl">{userData.wants.emoji}</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{userData.wants.skill}</h3>
                  <Badge variant="secondary">Wants {userData.wants.level} level</Badge>
                </div>
              </div>

              {/* Why They Want to Learn */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Why I want to learn this:</h4>
                <p className="text-muted-foreground">{userData.wants.reason}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Section */}
        <Card className="bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">{userData.name.split(" ")[0]}&apos;s Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground"></th>
                    {days.map((day) => (
                      <th key={day} className="py-2 px-3 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.key}>
                      <td className="py-2 px-3 text-sm font-medium text-foreground">
                        <div>{slot.label}</div>
                        <div className="text-xs text-muted-foreground">{slot.time}</div>
                      </td>
                      {userData.availability[slot.key as keyof typeof userData.availability].map((isAvailable, idx) => (
                        <td key={idx} className="py-2 px-3 text-center">
                          <div
                            className={cn(
                              "h-10 w-full rounded-md",
                              isAvailable ? "bg-primary/80" : "bg-muted"
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Times shown in your local timezone
            </p>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Reviews ({userData.reviews.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left - Average & Distribution */}
              <div className="md:w-64 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(userData.reviews.average)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted fill-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-lg">{userData.reviews.average}/5</span>
                </div>

                {/* Star Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = userData.reviews.distribution[stars as keyof typeof userData.reviews.distribution]
                    const percentage = (count / userData.reviews.total) * 100
                    return (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{stars}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-4 text-muted-foreground">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right - Review Cards */}
              <div className="flex-1 space-y-4">
                {userData.reviews.items.map((review) => (
                  <div key={review.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{review.name}</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted fill-muted"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.timeAgo}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {userData.name.split(" ")[0]}&apos;s Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {userData.badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center p-4 bg-muted/30 rounded-lg text-center"
                >
                  <span className="text-3xl mb-2">{badge.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{badge.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swap Request Modal */}
      <Dialog open={isSwapModalOpen} onOpenChange={setIsSwapModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request a Skill Swap</DialogTitle>
            <DialogDescription>
              Send a swap request to {userData.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Skill Exchange Visual */}
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <span className="text-3xl">{currentUser.emoji}</span>
                <p className="text-sm font-medium mt-1">Your skill</p>
                <p className="text-xs text-muted-foreground">{currentUser.skill}</p>
              </div>
              <div className="text-2xl">↔</div>
              <div className="text-center">
                <span className="text-3xl">{userData.teaches.emoji}</span>
                <p className="text-sm font-medium mt-1">Her skill</p>
                <p className="text-xs text-muted-foreground">{userData.teaches.skill}</p>
              </div>
            </div>

            {/* Roadmap Preview (Collapsible) */}
            <div className="border rounded-lg">
              <button
                onClick={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-foreground hover:bg-muted/30"
              >
                <span>View Teaching Roadmap</span>
                {isRoadmapExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {isRoadmapExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {userData.teaches.roadmap.map((session) => (
                    <div key={session.session} className="text-sm">
                      <span className="font-medium">Session {session.session}:</span>{" "}
                      <span className="text-muted-foreground">{session.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Your message
              </label>
              <Textarea
                placeholder="Introduce yourself and explain why you'd be a great swap partner..."
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsSwapModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isSubmitting || !swapMessage.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request 🚀"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
