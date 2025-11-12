"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Swords } from "lucide-react"
import { POKEMON_TYPES, TYPE_COLORS } from "@/lib/type-colors"

export default function BestAttackersPerTypePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <section className="border-b border-border bg-gradient-to-b from-card/50 to-background py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 flex justify-center items-center gap-2">
            <Swords className="text-primary" size={32} />
            Best Attackers per Type
          </h1>

          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Explore the best Pokémon attackers of each type, optimized for DPS and TDO balance.
            Click any type below to view the top-performing Pokémon in that category.
          </p>

          {/* Pokémon Type Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center">
            {POKEMON_TYPES.map((type) => {
              const colors = TYPE_COLORS[type]
              return (
                <Link key={type} href={`/best-attackers-per-type/${type}`}>
                  <Card
                    className={`group transition-all duration-300 cursor-pointer ${colors.bg} ${colors.border} border hover:shadow-[0_0_20px_${colors.glow}]`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`font-bold capitalize text-sm md:text-base ${colors.text}`}>
                        {type}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-border bg-card/30">
        <div className="max-w-screen-xl mx-auto px-6 py-10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg" />
          <h2 className="text-2xl font-bold">About Pokémon GO Database</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your go-to resource for Pokémon GO battle optimization. 
            Browse tier lists, find the strongest attackers by type, and stay ahead in raids and PvP.
          </p>
          <p className="text-sm text-muted-foreground pt-4">
            Powered by <span className="font-semibold text-primary">PogoAPI</span> • Built with ❤️ for Trainers
          </p>
        </div>
      </footer>
    </div>
  )
}
