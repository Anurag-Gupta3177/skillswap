import { FileText, Users, Video, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: FileText,
    emoji: "📝",
    title: "Define Your Skills",
    description: "Add what you teach and build a structured roadmap",
  },
  {
    icon: Users,
    emoji: "🤝",
    title: "Get Matched",
    description: "Our algorithm finds your perfect skill swap partner",
  },
  {
    icon: Video,
    emoji: "🎥",
    title: "Learn Together",
    description: "Schedule sessions and teach each other via video call",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            How SkillSwap Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector Arrow (Desktop Only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-6 lg:-right-8 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              )}

              {/* Step Card */}
              <div className="bg-background rounded-2xl p-8 shadow-sm border border-border text-center h-full transition-all hover:shadow-md hover:-translate-y-1">
                {/* Emoji Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-3xl mb-6">
                  {step.emoji}
                </div>

                {/* Step Number */}
                <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Step {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-pretty">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
