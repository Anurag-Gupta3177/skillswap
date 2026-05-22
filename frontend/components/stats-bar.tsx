const stats = [
  { value: "500+", label: "Skills Listed" },
  { value: "200+", label: "Swaps Completed" },
  { value: "50+", label: "Cities Worldwide" },
]

export function StatsBar() {
  return (
    <section className="bg-[#1a1145] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                index < stats.length - 1
                  ? "sm:border-r sm:border-white/20"
                  : ""
              }`}
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
