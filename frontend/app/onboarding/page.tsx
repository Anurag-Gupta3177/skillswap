"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Check, 
  GripVertical, 
  Camera, 
  MapPin,
  ArrowRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { api, getToken } from "@/lib/api"

const STEPS = [
  { number: 1, name: "What skill do you offer?" },
  { number: 2, name: "Your experience level" },
  { number: 3, name: "Build your teaching roadmap" },
  { number: 4, name: "What do you want to learn?" },
  { number: 5, name: "Set your availability" },
  { number: 6, name: "Complete your profile" },
]

const CATEGORIES = [
  { id: "all", label: "All", emoji: "" },
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "language", label: "Language", emoji: "🌍" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "cooking", label: "Cooking", emoji: "🍳" },
]

const SKILLS = [
  { id: "python", name: "Python", emoji: "🐍", category: "tech" },
  { id: "javascript", name: "JavaScript", emoji: "💛", category: "tech" },
  { id: "guitar", name: "Guitar", emoji: "🎸", category: "music" },
  { id: "spanish", name: "Spanish", emoji: "🇪🇸", category: "language" },
  { id: "yoga", name: "Yoga", emoji: "🧘", category: "fitness" },
  { id: "photography", name: "Photography", emoji: "📷", category: "art" },
  { id: "graphic-design", name: "Graphic Design", emoji: "🎨", category: "art" },
  { id: "excel", name: "Excel", emoji: "📊", category: "tech" },
  { id: "french", name: "French", emoji: "🇫🇷", category: "language" },
  { id: "piano", name: "Piano", emoji: "🎹", category: "music" },
  { id: "drawing", name: "Drawing", emoji: "✏️", category: "art" },
  { id: "public-speaking", name: "Public Speaking", emoji: "🎤", category: "tech" },
]

const EXPERIENCE_LEVELS = [
  { 
    id: "beginner", 
    emoji: "🌱", 
    title: "Beginner", 
    description: "Just started, know the basics" 
  },
  { 
    id: "intermediate", 
    emoji: "📚", 
    title: "Intermediate", 
    description: "Comfortable, built some projects" 
  },
  { 
    id: "expert", 
    emoji: "🏆", 
    title: "Expert", 
    description: "Years of experience, taught others" 
  },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "6am-12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm-6pm" },
  { id: "evening", label: "Evening", time: "6pm-10pm" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<"next" | "back">("next")
  
  // Step 1 state
  const [selectedOfferSkill, setSelectedOfferSkill] = useState<string | null>(null)
  const [offerSearchQuery, setOfferSearchQuery] = useState("")
  const [offerCategory, setOfferCategory] = useState("all")
  
  // Step 2 state
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null)
  
  // Step 3 state
  const [roadmapTopics, setRoadmapTopics] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ])
  
  // Step 4 state
  const [selectedLearnSkill, setSelectedLearnSkill] = useState<string | null>(null)
  const [learnSearchQuery, setLearnSearchQuery] = useState("")
  const [learnCategory, setLearnCategory] = useState("all")
  const [showSameSkillError, setShowSameSkillError] = useState(false)
  
  // Step 5 state
  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  
  // Step 6 state
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [location, setLocation] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [bio, setBio] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const progress = (currentStep / STEPS.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedOfferSkill !== null
      case 2:
        return experienceLevel !== null
      case 3:
        return roadmapTopics.every(t => t.title.trim() !== "")
      case 4:
        return selectedLearnSkill !== null
      case 5:
        return Object.values(availability).some(v => v)
      case 6:
        return fullName.trim() !== "" && location.trim() !== ""
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setDirection("next")
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection("back")
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleLearnSkillSelect = (skillId: string) => {
    if (skillId === selectedOfferSkill) {
      setShowSameSkillError(true)
      setTimeout(() => setShowSameSkillError(false), 3000)
      return
    }
    setSelectedLearnSkill(skillId)
  }

  const toggleAvailability = (day: string, slot: string) => {
    const key = `${day}-${slot}`
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const selectAllWeekdays = () => {
    const newAvailability: Record<string, boolean> = { ...availability }
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    weekdays.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        newAvailability[`${day}-${slot.id}`] = true
      })
    })
    setAvailability(newAvailability)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredOfferSkills = SKILLS.filter(skill => {
    const matchesCategory = offerCategory === "all" || skill.category === offerCategory
    const matchesSearch = skill.name.toLowerCase().includes(offerSearchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredLearnSkills = SKILLS.filter(skill => {
    const matchesCategory = learnCategory === "all" || skill.category === learnCategory
    const matchesSearch = skill.name.toLowerCase().includes(learnSearchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const renderStepContent = () => {
    const animationClass = direction === "next" 
      ? "animate-in slide-in-from-right-8 duration-300" 
      : "animate-in slide-in-from-left-8 duration-300"

    switch (currentStep) {
      case 1:
        return (
          <div key="step1" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What can you teach?</h2>
              <p className="text-muted-foreground">Choose the skill you&apos;ll offer to your swap partner</p>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search a skill..."
                value={offerSearchQuery}
                onChange={(e) => setOfferSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setOfferCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    offerCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {filteredOfferSkills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedOfferSkill(skill.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedOfferSkill === skill.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{skill.emoji}</div>
                  <div className="text-sm font-medium text-foreground">{skill.name}</div>
                  {selectedOfferSkill === skill.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Don&apos;t see your skill? Add custom <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )

      case 2:
        return (
          <div key="step2" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How experienced are you?</h2>
            </div>

            <div className="space-y-4">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.id}
                  onClick={() => setExperienceLevel(level.id)}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                    experienceLevel === level.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl">{level.emoji}</div>
                  <div>
                    <div className="font-semibold text-foreground">{level.title}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </div>
                  {experienceLevel === level.id && (
                    <div className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div key="step3" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Plan what you&apos;ll teach</h2>
              <p className="text-muted-foreground">Add 3 topics you&apos;ll cover across your sessions</p>
            </div>

            <div className="space-y-4 mb-6">
              {roadmapTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <Input
                      placeholder={
                        index === 0 ? "e.g., Variables, Loops and Functions" :
                        index === 1 ? "e.g., OOP and File Handling" :
                        "e.g., Real Projects and APIs"
                      }
                      value={topic.title}
                      onChange={(e) => {
                        const newTopics = [...roadmapTopics]
                        newTopics[index].title = e.target.value
                        setRoadmapTopics(newTopics)
                      }}
                      className="flex-1"
                    />
                  </div>
                  <textarea
                    placeholder="Short description (optional)"
                    value={topic.description}
                    onChange={(e) => {
                      const newTopics = [...roadmapTopics]
                      newTopics[index].description = e.target.value
                      setRoadmapTopics(newTopics)
                    }}
                    className="w-full p-2 text-sm bg-background border border-border rounded-lg resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-primary text-lg">💡</div>
                <div>
                  <div className="font-medium text-primary text-sm">Why this matters?</div>
                  <p className="text-sm text-primary/80">
                    Your roadmap helps your partner know exactly what they&apos;ll learn before accepting your swap
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div key="step4" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What skill do you want?</h2>
            </div>

            {showSameSkillError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                You can&apos;t swap a skill with itself!
              </div>
            )}

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search a skill..."
                value={learnSearchQuery}
                onChange={(e) => setLearnSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setLearnCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    learnCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {filteredLearnSkills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => handleLearnSkillSelect(skill.id)}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                    selectedLearnSkill === skill.id
                      ? "border-primary bg-primary/5"
                      : skill.id === selectedOfferSkill
                      ? "border-border opacity-50 cursor-not-allowed"
                      : "border-border hover:border-primary/50"
                  }`}
                  disabled={skill.id === selectedOfferSkill}
                >
                  <div className="text-2xl mb-1">{skill.emoji}</div>
                  <div className="text-sm font-medium text-foreground">{skill.name}</div>
                  {selectedLearnSkill === skill.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Don&apos;t see your skill? Add custom <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )

      case 5:
        return (
          <div key="step5" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">When are you free?</h2>
              <p className="text-muted-foreground">Click to toggle your available time slots</p>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-xs text-muted-foreground font-medium"></th>
                    {DAYS.map(day => (
                      <th key={day} className="p-2 text-xs text-muted-foreground font-medium">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(slot => (
                    <tr key={slot.id}>
                      <td className="p-2 text-xs text-muted-foreground">
                        <div>{slot.label}</div>
                        <div className="text-[10px]">{slot.time}</div>
                      </td>
                      {DAYS.map(day => {
                        const key = `${day}-${slot.id}`
                        const isSelected = availability[key]
                        return (
                          <td key={day} className="p-1">
                            <button
                              onClick={() => toggleAvailability(day, slot.id)}
                              className={`w-full h-10 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "bg-card border-border hover:border-primary/50"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-4 h-4 text-primary-foreground mx-auto" />
                              )}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">All times are in your local timezone</p>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllWeekdays}
                className="text-xs"
              >
                Select All Weekdays
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <div key="step6" className={animationClass}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🙌</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Almost there!</h2>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden group"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-card">
                    <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-xl">
                <div>
                  <div className="font-medium text-foreground">Remote Only</div>
                  <div className="text-sm text-muted-foreground">Only available for online sessions</div>
                </div>
                <Switch
                  checked={remoteOnly}
                  onCheckedChange={setRemoteOnly}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">Bio</Label>
                  <span className="text-xs text-muted-foreground">{bio.length}/200</span>
                </div>
                <textarea
                  id="bio"
                  placeholder="Tell others a bit about yourself..."
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setBio(e.target.value)
                    }
                  }}
                  className="w-full p-3 text-sm bg-background border border-border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleComplete = async () => {
  const token = getToken()
  if (!token) {
    window.location.href = "/login"
    return
  }

  const offeredSkill = SKILLS.find(s => s.id === selectedOfferSkill)
  const learnedSkill = SKILLS.find(s => s.id === selectedLearnSkill)
  const levelMap: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate", 
    expert: "Expert"
  }

  const availabilityFormatted = Object.entries(availability)
    .filter(([_, v]) => v)
    .map(([key]) => {
      const [day, slot] = key.split("-")
      return { day, slots: [slot] }
    })

  try {
    await api.updateMe(token, {
      name: fullName,
      bio,
      location,
      isRemote: remoteOnly,
      skillOffered: {
        name: offeredSkill?.name || "",
        category: offeredSkill?.category || "",
        level: levelMap[experienceLevel || "beginner"],
        roadmap: roadmapTopics.map((t, i) => ({
          topic: t.title,
          description: t.description,
          order: i + 1
        }))
      },
      skillWanted: learnedSkill?.name || "",
      availability: availabilityFormatted,
      onboardingComplete: true
    })

    window.location.href = "/dashboard"
  } catch (error) {
    console.error("Error saving profile:", error)
    window.location.href = "/dashboard"
  }
}

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[640px] mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary fill-primary" />
            <span className="text-xl font-bold text-primary">SkillSwap</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {STEPS.length}</span>
            <h3 className="font-semibold text-foreground">{STEPS[currentStep - 1].name}</h3>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-background rounded-2xl mb-8 min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep === STEPS.length ? (
        <Button
           className="bg-primary hover:bg-primary/90 gap-2 px-8"
           disabled={!canProceed()}
           onClick={handleComplete}
         > 
           Start Swapping! 🚀
           </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Step Thumbnails */}
        <div className="mt-8 flex justify-center gap-2">
          {STEPS.map((step) => (
            <button
              key={step.number}
              onClick={() => {
                if (step.number < currentStep) {
                  setDirection("back")
                  setCurrentStep(step.number)
                }
              }}
              disabled={step.number > currentStep}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                step.number === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.number < currentStep
                  ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                  : "bg-card text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step.number}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
