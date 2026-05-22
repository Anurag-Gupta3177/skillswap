"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Video,
  Check,
  RefreshCw,
  Info,
  Plus,
  Bell,
  Edit,
  Save,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { api, getToken } from "@/lib/api"

const TIME_SLOTS = [
  "Morning",
  "Afternoon",
  "Evening",
]

const TIME_LABELS = [
  "6:00 AM - 12:00 PM",
  "12:00 PM - 6:00 PM",
  "6:00 PM - 10:00 PM",
]

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const SLOT_IDS = [
  "morning",
  "afternoon",
  "evening",
]

const DURATIONS = [
  "30 mins",
  "1 hour",
  "1.5 hours",
  "2 hours",
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

function getOverlapGrid(
  myAvailability: any[],
  partnerAvailability: any[]
) {
  const grid: number[][] = TIME_SLOTS.map(() =>
    DAYS.map(() => 0)
  )

  const parseAvailability = (
    availability: any[]
  ) => {
    const set = new Set<string>()

    availability?.forEach((a: any) => {
      a.slots?.forEach((slot: string) =>
        set.add(`${a.day}-${slot}`)
      )
    })

    return set
  }

  const mySet = parseAvailability(
    myAvailability
  )

  const partnerSet = parseAvailability(
    partnerAvailability
  )

  DAYS.forEach((day, dayIdx) => {
    SLOT_IDS.forEach((slot, slotIdx) => {
      const key = `${day}-${slot}`

      const iHave = mySet.has(key)
      const theyHave =
        partnerSet.has(key)

      if (iHave && theyHave)
        grid[slotIdx][dayIdx] = 3
      else if (iHave)
        grid[slotIdx][dayIdx] = 1
      else if (theyHave)
        grid[slotIdx][dayIdx] = 2
      else
        grid[slotIdx][dayIdx] = 0
    })
  })

  return grid
}

export default function SchedulePage() {
  const [currentUser, setCurrentUser] =
    useState<any>(null)

  const [swaps, setSwaps] = useState<
    any[]
  >([])

  const [sessions, setSessions] =
    useState<any[]>([])

  const [
    activeSwapIndex,
    setActiveSwapIndex,
  ] = useState(0)

  const [partnerData, setPartnerData] =
    useState<any>(null)

  const [selectedSlot, setSelectedSlot] =
    useState<{
      day: number
      time: number
    } | null>(null)

  const [showModal, setShowModal] =
    useState(false)

  const [
    showAvailabilityEditor,
    setShowAvailabilityEditor,
  ] = useState(false)

  const [isLoading, setIsLoading] =
    useState(true)

  const [
    isScheduling,
    setIsScheduling,
  ] = useState(false)

  const [
    isSavingAvailability,
    setIsSavingAvailability,
  ] = useState(false)

  const [grid, setGrid] = useState<
    number[][]
  >([])

  const [sessionTopic, setSessionTopic] =
    useState("")

  const [
    sessionDuration,
    setSessionDuration,
  ] = useState("1 hour")

  const [
    notificationSent,
    setNotificationSent,
  ] = useState(false)

  const [
    myAvailability,
    setMyAvailability,
  ] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    const token = getToken()

    if (!token) {
      window.location.href = "/login"
      return
    }

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

        const availMap: Record<
          string,
          boolean
        > = {}

        userData.availability?.forEach(
          (a: any) => {
            a.slots?.forEach(
              (slot: string) => {
                availMap[
                  `${a.day}-${slot}`
                ] = true
              }
            )
          }
        )

        setMyAvailability(availMap)

        const activeSwaps =
          swapsData.filter(
            (s: any) =>
              s.status ===
                "accepted" ||
              s.status === "active"
          )

        const seen = new Set()

        const uniqueSwaps =
          activeSwaps.filter(
            (s: any) => {
              const partnerId =
                s.sender?._id ===
                userData._id
                  ? s.receiver?._id
                  : s.sender?._id

              if (seen.has(partnerId))
                return false

              seen.add(partnerId)

              return true
            }
          )

        setSwaps(uniqueSwaps)
      } catch (error) {
        console.error(
          "Error:",
          error
        )
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (
      swaps.length === 0 ||
      !currentUser
    )
      return

    const token = getToken()

    if (!token) return

    const swap =
      swaps[activeSwapIndex]

    if (!swap) return

    const partnerId =
      swap.sender?._id ===
      currentUser._id
        ? swap.receiver?._id
        : swap.sender?._id

    if (!partnerId) return

    api
      .getUserById(
        token,
        partnerId
      )
      .then((partner) => {
        setPartnerData(partner)

        const overlap =
          getOverlapGrid(
            currentUser.availability ||
              [],
            partner.availability ||
              []
          )

        setGrid(overlap)
      })
      .catch(console.error)
  }, [
    swaps,
    activeSwapIndex,
    currentUser,
  ])

  const toggleMySlot = (
    day: string,
    slot: string
  ) => {
    const key = `${day}-${slot}`

    setMyAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const saveMyAvailability =
    async () => {
      const token = getToken()

      if (!token) return

      setIsSavingAvailability(true)

      const availabilityFormatted =
        DAYS.map((day) => ({
          day,
          slots: SLOT_IDS.filter(
            (slot) =>
              myAvailability[
                `${day}-${slot}`
              ]
          ),
        })).filter(
          (a) => a.slots.length > 0
        )

      try {
        const updatedUser =
          await api.updateMe(
            token,
            {
              availability:
                availabilityFormatted,
            }
          )

        setCurrentUser(updatedUser)

        if (partnerData) {
          const overlap =
            getOverlapGrid(
              availabilityFormatted,
              partnerData.availability ||
                []
            )

          setGrid(overlap)
        }

        setShowAvailabilityEditor(
          false
        )
      } catch (error) {
        console.error(
          "Error saving availability:",
          error
        )
      }

      setIsSavingAvailability(false)
    }

  const handleSlotClick = (
    dayIndex: number,
    timeIndex: number
  ) => {
    if (
      grid[timeIndex]?.[
        dayIndex
      ] === 3
    ) {
      setSelectedSlot({
        day: dayIndex,
        time: timeIndex,
      })

      setSessionTopic("")
      setNotificationSent(false)
      setShowModal(true)
    }
  }

  const handleScheduleSession =
    async () => {
      if (
        !selectedSlot ||
        !swaps[activeSwapIndex]
      )
        return

      const token = getToken()

      if (!token) return

      setIsScheduling(true)

      try {
        const swap =
          swaps[activeSwapIndex]

        const today = new Date()

        const daysUntil =
          (selectedSlot.day -
            today.getDay() +
            7) %
            7 || 7

        const sessionDate =
          new Date(today)

        sessionDate.setDate(
          today.getDate() +
            daysUntil
        )

        if (
          selectedSlot.time === 0
        ) {
          sessionDate.setHours(
            9,
            0,
            0
          )
        } else if (
          selectedSlot.time === 1
        ) {
          sessionDate.setHours(
            14,
            0,
            0
          )
        } else {
          sessionDate.setHours(
            19,
            0,
            0
          )
        }

        const sessionRes =
          await fetch(
            `${
              process.env
                .NEXT_PUBLIC_API_URL ||
              "http://localhost:5000/api"
            }/sessions`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                swapId: swap._id,
                participants: [
                  swap.sender?._id,
                  swap.receiver?._id,
                ],
                scheduledAt:
                  sessionDate.toISOString(),
                duration:
                  sessionDuration ===
                  "30 mins"
                    ? 30
                    : sessionDuration ===
                      "1 hour"
                    ? 60
                    : sessionDuration ===
                      "1.5 hours"
                    ? 90
                    : 120,
                topicCovered:
                  sessionTopic ||
                  `Session with ${partnerData?.name}`,
              }),
            }
          )

        const newSession =
          await sessionRes.json()

        setSessions((prev) => [
          ...prev,
          {
            ...newSession,
            partnerName:
              partnerData?.name,
          },
        ])

        const partnerId =
          swap.sender?._id ===
          currentUser._id
            ? swap.receiver?._id
            : swap.sender?._id

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
              userId: partnerId,
              type:
                "session_reminder",
              title:
                "📅 New Session Scheduled!",
              body: `${
                currentUser.name
              } scheduled a session with you for ${
                DAY_NAMES[
                  selectedSlot.day
                ]
              } ${
                TIME_LABELS[
                  selectedSlot.time
                ]
              }${
                sessionTopic
                  ? ` — Topic: ${sessionTopic}`
                  : ""
              }`,
            }),
          }
        )

        setNotificationSent(true)

        setTimeout(() => {
          setShowModal(false)
          setNotificationSent(false)
        }, 2000)
      } catch (error) {
        console.error(
          "Error scheduling:",
          error
        )
      }

      setIsScheduling(false)
    }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Your remaining JSX stays SAME */}
    </div>
  )
}