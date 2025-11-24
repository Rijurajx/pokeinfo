"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Pokédex", href: "/pokedex" },
  { name: "Events", href: "/events" },
]

const movesMenu = [
  {
    name: "Fast Attacks",
    subtitle: "Gym & Raid moves",
    href: "/moves/fast",
  },
  {
    name: "Charge Attacks",
    subtitle: "Gym & Raid moves",
    href: "/moves/charged",
  },
  {
    name: "Fast Attacks",
    subtitle: "Trainer Battles",
    href: "/moves/fast-attacks-trainer",
  },
  {
    name: "Charge Attacks",
    subtitle: "Trainer Battles",
    href: "/moves/charge-attacks-trainer",
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [movesOpen, setMovesOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary glow-blue group-hover:glow-purple transition-all duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pokémon GO Database
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">

            {/* Moves Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-1"
              >
                Moves
                <ChevronDown
                  size={16}
                  className="transition-transform group-hover:rotate-180"
                />
              </Button>

              {/* Dropdown panel */}
              <div className="
                absolute left-0 mt-2 w-56 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300
              ">
                <div className="py-2">
                  {movesMenu.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="px-4 py-2 hover:bg-primary/10 cursor-pointer transition-all">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Other nav items */}
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-2">

              {/* Moves dropdown (mobile) */}
              <div>
                <button
                  className="w-full flex justify-between  items-center px-4 py-2 rounded-md hover:bg-primary/10 text-left"
                  onClick={() => setMovesOpen(!movesOpen)}
                >
                  <span className="font-medium">Moves</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform",
                      movesOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {movesOpen && (
                  <div className="pl-4 mt-2 border-l border-border flex flex-col gap-2 animate-in fade-in duration-200">
                    {movesMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="px-2 py-2 hover:bg-primary/10 rounded-md">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
