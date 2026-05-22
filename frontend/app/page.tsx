"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, ArrowRight, Star } from "lucide-react"

const categories = [
  { emoji: "💻", name: "Technology", id: "Tech" },
  { emoji: "🎵", name: "Music", id: "Music" },
  { emoji: "🌍", name: "Languages", id: "Language" },
  { emoji: "🎨", name: "Art & Design", id: "Art" },
  { emoji: "💪", name: "Fitness", id: "Fitness" },
  { emoji: "🍳", name: "Cooking", id: "Cooking" },
]

const steps = [
  {
    number: "01",
    emoji: "📝",
    title: "Define Your Skills",
    description:
      "Add what you teach and build a structured teaching roadmap for your swap partner.",
  },
  {
    number: "02",
    emoji: "🤝",
    title: "Get Matched",
    description:
      "Our algorithm finds your perfect skill swap partner based on skills and availability.",
  },
  {
    number: "03",
    emoji: "🎥",
    title: "Learn Together",
    description:
      "Schedule sessions, chat, and teach each other — all within the platform.",
  },
]

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSwaps: 0,
    categoryCounts: {} as Record<string, number>,
  })

  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ||
            "http://localhost:5000/api"
          }/stats`
        )

        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        // Backend not available, use defaults
        console.log("Stats not available")
      }

      setIsLoadingStats(false)
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6C3BFF] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-[#6C3BFF]">
              SkillSwap
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-[#6C3BFF] transition-colors"
            >
              How it Works
            </a>

            <a
              href="#skills"
              className="text-sm text-gray-600 hover:text-[#6C3BFF] transition-colors"
            >
              Browse Skills
            </a>

            <a
              href="#testimonials"
              className="text-sm text-gray-600 hover:text-[#6C3BFF] transition-colors"
            >
              Reviews
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-[#6C3BFF] font-medium transition-colors px-3 py-2"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="text-sm bg-[#6C3BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5B2FE0] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#6C3BFF]/10 text-[#6C3BFF] text-sm font-medium px-4 py-2 rounded-full mb-6">
              🔄 Skill Exchange Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Exchange Skills,{" "}
              <span className="text-[#6C3BFF]">Not Money</span>
            </h1>

            <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
              Teach what you know. Learn what you want. Connect with people who
              have the skills you need — and need the skills you have.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link
                href="/register"
                className="bg-[#6C3BFF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5B2FE0] transition-colors flex items-center justify-center gap-2"
              >
                Start Swapping <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="border border-[#6C3BFF] text-[#6C3BFF] px-6 py-3 rounded-xl font-semibold hover:bg-[#6C3BFF]/5 transition-colors flex items-center justify-center"
              >
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["AG", "PS", "RK", "MN", "AS"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      backgroundColor: [
                        "#6C3BFF",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#3B82F6",
                      ][i],
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>

              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  {isLoadingStats ? "..." : `${stats.totalUsers || 500}+`}
                </span>{" "}
                people already swapping
              </span>
            </div>
          </div>

          {/* Right — Match Card */}
          <div className="flex-1 relative flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-72 relative z-10">
              <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                94% Match
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#6C3BFF] flex items-center justify-center text-white font-bold mb-2">
                    A
                  </div>

                  <p className="text-xs font-semibold text-gray-900">
                    Anurag
                  </p>

                  <p className="text-xs text-gray-500">Python Dev</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#6C3BFF]/10 flex items-center justify-center">
                  <span className="text-lg">🔄</span>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mb-2">
                    P
                  </div>

                  <p className="text-xs font-semibold text-gray-900">
                    Priya
                  </p>

                  <p className="text-xs text-gray-500">Guitar Teacher</p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 py-2 border-t border-gray-100">
                ✨ Perfect match found!
              </div>
            </div>

            {/* Floating skill tags */}
            {[
              { label: "🎸 Guitar", top: "0%", left: "-10%" },
              { label: "🐍 Python", top: "10%", right: "-10%" },
              { label: "🌍 Spanish", bottom: "20%", left: "-15%" },
              { label: "🎨 Design", bottom: "10%", right: "-5%" },
            ].map((tag, i) => (
              <div
                key={i}
                className="absolute bg-white shadow-lg rounded-full px-3 py-1.5 text-sm font-medium border border-gray-100"
                style={{
                  top: tag.top,
                  bottom: tag.bottom,
                  left: tag.left,
                  right: tag.right,
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How SkillSwap Works
            </h2>

            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to start exchanging skills with amazing people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#6C3BFF] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {step.number}
                </div>

                <div className="text-4xl mb-4">{step.emoji}</div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILL CATEGORIES */}
      <section id="skills" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Skills Being Swapped Right Now
            </h2>

            <p className="text-gray-500">
              Browse categories and find your perfect swap partner
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = stats.categoryCounts?.[cat.id] || 0

              return (
                <Link
                  href="/register"
                  key={cat.id}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#6C3BFF] hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="text-4xl mb-3">{cat.emoji}</div>

                  <h3 className="font-bold text-gray-900 group-hover:text-[#6C3BFF] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {count > 0 ? `${count} users` : "Be the first!"}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#6C3BFF] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {[
              {
                value: isLoadingStats
                  ? "..."
                  : `${stats.totalUsers || 0}+`,
                label: "Skills Listed",
              },
              {
                value: isLoadingStats
                  ? "..."
                  : `${stats.totalSwaps || 0}+`,
                label: "Swaps Completed",
              },
              { value: "Free", label: "Always Free" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-1">{stat.value}</p>

                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#6C3BFF] to-[#4F46E5] py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Swapping?
          </h2>

          <p className="text-white/80 mb-8">
            Join people learning and teaching every day. It's completely free.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-[#6C3BFF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
          >
            Create Your Free Profile{" "}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#6C3BFF] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>

              <span className="text-white font-bold">SkillSwap</span>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              {["About", "How it Works", "Browse", "Privacy", "Terms"].map(
                (link) => (
                  <Link
                    key={link}
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                )
              )}
            </div>

            <p className="text-gray-500 text-sm">© 2025 SkillSwap</p>
          </div>
        </div>
      </footer>
    </div>
  )
}