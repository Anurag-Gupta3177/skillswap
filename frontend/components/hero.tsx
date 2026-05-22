import { Button } from "@/components/ui/button"
import { ArrowRight, RefreshCw } from "lucide-react"

const avatars = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=4",
  "https://i.pravatar.cc/40?img=5",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <RefreshCw className="h-4 w-4" />
              Skill Exchange Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Exchange Skills,{" "}
              <span className="text-primary">Not Money</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
              Teach what you know. Learn what you want. Connect with people who
              have the skills you need — and need the skills you have.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Start Swapping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                See How It Works
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt={`User ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">500+</span> people
                already swapping
              </p>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[550px]">
            {/* Main Match Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] bg-background rounded-2xl shadow-xl border border-border p-6 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                94% Match
              </div>
              
              <div className="flex items-center justify-between">
                {/* User A */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    A
                  </div>
                  <p className="font-semibold text-foreground text-sm">Alex</p>
                  <p className="text-xs text-muted-foreground">Python Developer</p>
                </div>

                {/* Swap Icon */}
                <div className="flex items-center justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* User B */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    B
                  </div>
                  <p className="font-semibold text-foreground text-sm">Maya</p>
                  <p className="text-xs text-muted-foreground">Guitar Teacher</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Perfect match found!
                </p>
              </div>
            </div>

            {/* Floating Skill Tags */}
            <div className="absolute top-8 left-4 sm:left-8 bg-background rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 animate-bounce-slow">
              <span className="text-xl">🎸</span>
              <span className="text-sm font-medium text-foreground">Guitar</span>
            </div>

            <div className="absolute top-16 right-4 sm:right-8 bg-background rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 animate-bounce-slow animation-delay-200">
              <span className="text-xl">🐍</span>
              <span className="text-sm font-medium text-foreground">Python</span>
            </div>

            <div className="absolute bottom-24 left-0 sm:left-4 bg-background rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 animate-bounce-slow animation-delay-400">
              <span className="text-xl">🌍</span>
              <span className="text-sm font-medium text-foreground">Spanish</span>
            </div>

            <div className="absolute bottom-16 right-0 sm:right-4 bg-background rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 animate-bounce-slow animation-delay-600">
              <span className="text-xl">🎨</span>
              <span className="text-sm font-medium text-foreground">Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
    </section>
  )
}
