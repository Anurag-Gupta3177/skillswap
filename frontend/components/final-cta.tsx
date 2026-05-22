import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-primary to-[#5429cc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Ready to Start Swapping?
        </h2>

        {/* Subtext */}
        <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-pretty">
          Join hundreds of people learning and teaching every day
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-xl shadow-black/20"
        >
          Create Your Free Profile
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
