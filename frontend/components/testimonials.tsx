import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "I learned Python in 3 sessions while teaching guitar. Best learning experience ever!",
    name: "Rahul M.",
    swap: "Guitar ↔ Python",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
  {
    quote:
      "Finally a platform that values what I know. My Spanish improved dramatically!",
    name: "Priya S.",
    swap: "Spanish ↔ Graphic Design",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    quote:
      "The structured roadmap feature is genius. We knew exactly what to teach each day.",
    name: "Arjun K.",
    swap: "Fitness ↔ Video Editing",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
]

export function Testimonials() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            What Our Swappers Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-background rounded-2xl p-6 sm:p-8 shadow-sm border border-border"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-lg mb-6 text-pretty">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mt-1">
                    {testimonial.swap}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
