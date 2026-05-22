"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageCircle,
  PhoneOff,
  Send,
  X,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

// Dummy session data
const sessionData = {
  id: "session-1",
  title: "Guitar <-> Python Session",
  partner: {
    name: "Priya Singh",
    avatar: "PS",
    skill: "Guitar",
    emoji: "guitar",
  },
  yourSkill: "Python",
  yourEmoji: "snake",
  topic: {
    sessionNumber: 2,
    title: "Chords & Rhythm Patterns",
    checklist: [
      { id: 1, text: "Basic chord shapes (C, G, D)", completed: true },
      { id: 2, text: "Strumming patterns", completed: false },
      { id: 3, text: "Chord transitions", completed: false },
    ],
  },
  turnDuration: 30, // minutes per turn
  totalDuration: 60, // total session in minutes
}

export default function SessionRoomPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isEndModalOpen, setIsEndModalOpen] = useState(false)
  const [checklist, setChecklist] = useState(sessionData.topic.checklist)
  const [notes, setNotes] = useState("C chord = fingers on 2nd fret of A string, 2nd fret of D string...")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "partner", text: "Ready when you are!", time: "6:02 PM" },
    { id: 2, sender: "you", text: "Let's start with the C chord!", time: "6:03 PM" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(24 * 60 + 35) // 24:35 in seconds
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(48 * 60 + 20) // 48:20 in seconds
  const [isPartnerTurn, setIsPartnerTurn] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTurnTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
      setTotalTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Browser leave warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Leaving will end your session. Your partner will be notified."
      return e.returnValue
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setChatMessages([
      ...chatMessages,
      {
        id: chatMessages.length + 1,
        sender: "you",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
    setNewMessage("")
  }

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleSwitchTurn = () => {
    setIsPartnerTurn(!isPartnerTurn)
    setTurnTimeRemaining(30 * 60) // Reset to 30 minutes
  }

  // Calculate progress arc
  const progress = ((30 * 60 - turnTimeRemaining) / (30 * 60)) * 100

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-[#0F0F0F]">
      {/* Left Side - Video Area */}
      <div className="relative flex-1 lg:w-[65%] flex flex-col">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    <span role="img" aria-label="guitar">🎸</span> Guitar <span role="img" aria-label="swap">↔</span> <span role="img" aria-label="python">🐍</span> Python Session
                  </span>
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-white/70 text-sm">With {sessionData.partner.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Video Feed */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Partner's Video (Placeholder) */}
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl font-semibold text-primary">
                  {sessionData.partner.avatar}
                </span>
              </div>
              <p className="text-white/50 text-sm">
                {sessionData.partner.name}&apos;s camera
              </p>
            </div>
          </div>

          {/* Your Video (Picture-in-Picture) */}
          <div className="absolute bottom-24 right-4 w-40 h-28 md:w-48 md:h-32 bg-[#2a2a2a] rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              {isCameraOn ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mx-auto">
                    <span className="text-lg font-semibold text-primary">RM</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">You</p>
                </div>
              ) : (
                <div className="text-white/40 text-sm">Camera Off</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isMuted ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                !isCameraOn ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
              aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isScreenSharing ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
              aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              <Monitor className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors relative",
                isChatOpen ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
              aria-label="Toggle chat"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsEndModalOpen(true)}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
              aria-label="End session"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Tools Panel */}
      <div className={cn(
        "w-full lg:w-[35%] bg-background flex flex-col overflow-hidden transition-all duration-300",
        "h-[45vh] lg:h-full"
      )}>
        {/* Chat Sidebar Overlay */}
        <div className={cn(
          "absolute inset-0 lg:relative lg:inset-auto bg-background z-20 flex flex-col transition-transform duration-300",
          isChatOpen ? "translate-x-0" : "translate-x-full lg:hidden"
        )}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  msg.sender === "you"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={cn(
                  "text-xs mt-1",
                  msg.sender === "you" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {msg.time}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tools Content (hidden when chat is open on mobile) */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          isChatOpen && "lg:flex hidden"
        )}>
          {/* Turn Timer Section */}
          <div className="p-4 border-b border-border">
            <div className={cn(
              "text-center py-2 px-4 rounded-lg mb-4",
              isPartnerTurn ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"
            )}>
              <span className="font-medium">
                {isPartnerTurn ? (
                  <><span role="img" aria-label="guitar">🎸</span> Priya is Teaching</>
                ) : (
                  <><span role="img" aria-label="python">🐍</span> Your Turn to Teach</>
                )}
              </span>
            </div>

            {/* Timer with Progress Arc */}
            <div className="relative w-32 h-32 mx-auto mb-3">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} 283`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              {/* Timer text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{formatTime(turnTimeRemaining)}</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-3">
              {isPartnerTurn ? "Your turn starts in" : "Priya's turn starts in"} {Math.ceil(turnTimeRemaining / 60)} minutes
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleSwitchTurn}
            >
              Switch Turn
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              Total: {formatTime(totalTimeRemaining)} remaining
            </p>
          </div>

          {/* Current Topic Section */}
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span role="img" aria-label="book">📖</span> Today&apos;s Topic
            </h3>
            <div className="bg-card rounded-lg p-4">
              <p className="font-medium mb-3">
                Session {sessionData.topic.sessionNumber} - {sessionData.topic.title}
              </p>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded -mx-2"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className={cn(
                      "text-sm",
                      item.completed && "line-through text-muted-foreground"
                    )}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Notes Section */}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span role="img" aria-label="notes">📝</span> Shared Notes
              <span className="text-xs text-muted-foreground font-normal">(both can edit)</span>
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes here — both of you can see and edit these..."
              className="flex-1 resize-none min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {notes.length}/1000
            </p>
          </div>
        </div>
      </div>

      {/* End Session Modal */}
      <Dialog open={isEndModalOpen} onOpenChange={setIsEndModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End this session?</DialogTitle>
            <DialogDescription>
              Both you and Priya will be redirected to leave reviews for each other.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEndModalOpen(false)}
            >
              Keep Going
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Navigate to review page
                window.location.href = "/dashboard"
              }}
            >
              Yes, End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
