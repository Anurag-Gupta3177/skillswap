"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary fill-primary" />
            <span className="text-xl font-bold text-primary">SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#skills"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Skills
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4 bg-background border-t border-border">
          <Link
            href="#how-it-works"
            className="block text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link
            href="#skills"
            className="block text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Skills
          </Link>
          <Link
            href="#about"
            className="block text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-center text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
