import { Card } from "@/components/ui/card"
import type { Pokemon } from "@/lib/fetchers"
import { Swords, Shield, Heart } from "lucide-react"

interface PokemonStatsCardProps {
  pokemon: Pokemon
}

export default function PokemonStatsCard({ pokemon }: PokemonStatsCardProps) {
  const maxStat = 300 // Approximate max base stat in Pokemon GO

  return (
    <Card className="p-6 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Base Stats</h2>

      <div className="space-y-6">
        {/* Attack */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Attack</span>
            </div>
            <span className="text-lg font-bold text-foreground">{pokemon.base_attack}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${(pokemon.base_attack / maxStat) * 100}%` }}
            />
          </div>
        </div>

        {/* Defense */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Defense</span>
            </div>
            <span className="text-lg font-bold text-foreground">{pokemon.base_defense}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(pokemon.base_defense / maxStat) * 100}%` }}
            />
          </div>
        </div>

        {/* Stamina */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Stamina (HP)</span>
            </div>
            <span className="text-lg font-bold text-foreground">{pokemon.base_stamina}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${(pokemon.base_stamina / maxStat) * 100}%` }}
            />
          </div>
        </div>

        {/* Total Stats */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">Total Base Stats</span>
            <span className="text-2xl font-bold text-primary">
              {pokemon.base_attack + pokemon.base_defense + pokemon.base_stamina}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
