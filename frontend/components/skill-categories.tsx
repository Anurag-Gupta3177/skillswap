const categories = [
  { emoji: "💻", name: "Technology", count: 1 },
  { emoji: "🎵", name: "Music", count: 189 },
  { emoji: "🌍", name: "Languages", count: 156 },
  { emoji: "🎨", name: "Art & Design", count: 98 },
  { emoji: "💪", name: "Fitness", count: 76 },
  { emoji: "🍳", name: "Cooking", count: 54 },
]

export function SkillCategories() {
  return (
    <section id="skills" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Skills Being Swapped Right Now
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-card rounded-2xl p-6 sm:p-8 border border-border cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4">{category.emoji}</div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Count */}
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{category.count}</span>{" "}
                users
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
