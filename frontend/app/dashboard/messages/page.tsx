"use client"

import {
  useState,
  useEffect,
  useRef,
} from "react"

import {
  Send,
  Search,
  Circle,
  ArrowLeft,
  Zap,
} from "lucide-react"

import {
  api,
  getToken,
} from "@/lib/api"

import {
  io,
  Socket,
} from "socket.io-client"

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?"
  )
}

function formatTime(date: string) {
  return new Date(
    date
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(date: string) {
  const d = new Date(date)

  const today = new Date()

  const yesterday = new Date(today)

  yesterday.setDate(
    yesterday.getDate() - 1
  )

  if (
    d.toDateString() ===
    today.toDateString()
  )
    return "Today"

  if (
    d.toDateString() ===
    yesterday.toDateString()
  )
    return "Yesterday"

  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
}

export default function MessagesPage() {
  const [
    currentUser,
    setCurrentUser,
  ] = useState<any>(null)

  const [swaps, setSwaps] =
    useState<any[]>([])

  const [
    selectedSwap,
    setSelectedSwap,
  ] = useState<any>(null)

  const [messages, setMessages] =
    useState<any[]>([])

  const [newMessage, setNewMessage] =
    useState("")

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSending, setIsSending] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState<Set<string>>(
    new Set()
  )

  const [
    isMobileView,
    setIsMobileView,
  ] = useState(false)

  const [showChat, setShowChat] =
    useState(false)

  const socketRef =
    useRef<Socket | null>(null)

  const messagesEndRef =
    useRef<HTMLDivElement>(null)

  const inputRef =
    useRef<HTMLInputElement>(null)

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mobile check
  useEffect(() => {
    const check = () =>
      setIsMobileView(
        window.innerWidth < 768
      )

    check()

    window.addEventListener(
      "resize",
      check
    )

    return () =>
      window.removeEventListener(
        "resize",
        check
      )
  }, [])

  // Initialize socket
  useEffect(() => {
    const token = getToken()

    if (!token) {
      window.location.href =
        "/login"

      return
    }

    socketRef.current = io(
      process.env
        .NEXT_PUBLIC_SOCKET_URL ||
        "http://localhost:5000",
      {
        auth: { token },
      }
    )

    socketRef.current.on(
      "connect",
      () => {
        console.log(
          "Socket connected"
        )
      }
    )

    socketRef.current.on(
      "receive_message",
      (message: any) => {
        setMessages((prev) => {
          if (
            prev.find(
              (m) =>
                m._id ===
                message._id
            )
          ) {
            return prev
          }

          return [
            ...prev,
            message,
          ]
        })
      }
    )

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // Load user + swaps
  useEffect(() => {
    const token = getToken()

    if (!token) return

    const fetchData = async () => {
      try {
        const [
          userData,
          swapsData,
        ] = await Promise.all([
          api.getMe(token),
          api.getSwaps(token),
        ])

        setCurrentUser(userData)

        const activeSwaps =
          swapsData.filter(
            (s: any) =>
              s.status ===
                "accepted" ||
              s.status === "active"
          )

        setSwaps(activeSwaps)

        if (
          activeSwaps.length > 0 &&
          !selectedSwap
        ) {
          handleSelectSwap(
            activeSwaps[0],
            userData
          )
        }
      } catch (error) {
        console.error(
          "Error loading data:",
          error
        )
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Load messages
  const handleSelectSwap =
    async (
      swap: any,
      user?: any
    ) => {
      const token = getToken()

      if (!token) return

      setSelectedSwap(swap)

      if (isMobileView)
        setShowChat(true)

      if (selectedSwap) {
        socketRef.current?.emit(
          "leave_swap_room",
          selectedSwap._id
        )
      }

      socketRef.current?.emit(
        "join_swap_room",
        swap._id
      )

      try {
        const msgs =
          await api.getMessages(
            token,
            swap._id
          )

        setMessages(
          Array.isArray(msgs)
            ? msgs
            : []
        )
      } catch (error) {
        console.error(
          "Error loading messages:",
          error
        )

        setMessages([])
      }

      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }

  // Send message
  const handleSendMessage =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      if (
        !newMessage.trim() ||
        !selectedSwap ||
        isSending
      )
        return

      const token = getToken()

      if (!token) return

      setIsSending(true)

      const content =
        newMessage.trim()

      setNewMessage("")

      try {
        const message =
          await api.sendMessage(
            token,
            selectedSwap._id,
            content
          )

        setMessages((prev) => [
          ...prev,
          message,
        ])

        socketRef.current?.emit(
          "send_message",
          {
            ...message,
            swapId:
              selectedSwap._id,
          }
        )
      } catch (error) {
        console.error(
          "Error sending message:",
          error
        )

        setNewMessage(content)
      }

      setIsSending(false)
    }

  const getPartner = (
    swap: any,
    user?: any
  ) => {
    const me =
      user || currentUser

    if (!me) return null

    return swap.sender?._id ===
      me._id
      ? swap.receiver
      : swap.sender
  }

  const filteredSwaps =
    swaps.filter((swap) => {
      const partner =
        getPartner(swap)

      return partner?.name
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    })

  const groupedMessages =
    messages.reduce(
      (
        groups: any,
        message: any
      ) => {
        const date =
          formatDate(
            message.createdAt
          )

        if (!groups[date]) {
          groups[date] = []
        }

        groups[date].push(message)

        return groups
      },
      {}
    )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6C3BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />

          <p className="text-gray-500 text-sm">
            Loading messages...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Your remaining JSX stays SAME */}
    </div>
  )
}