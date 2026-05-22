import Link from "next/link"
import { Zap } from "lucide-react"

const links = [
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Browse", href: "#skills" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-foreground py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary fill-primary" />
              <span className="text-lg font-bold text-white">SkillSwap</span>
            </Link>
            <p className="text-white/60 text-sm">
              Exchange skills, not money.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <p className="text-center text-white/40 text-sm">
            © 2025 SkillSwap. Made with ❤️ for learners.
          </p>
        </div>
      </div>
    </footer>
  )
}
