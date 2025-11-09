import { Card } from "@/components/ui/card"
import { typeEffectiveness } from "@/lib/fetchers"

interface PokemonTypeEffectivenessProps {
  types: string[]
}

const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
}

export default function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const weaknesses = new Set<string>()
  const resistances = new Set<string>()

  types.forEach((type) => {
    const effectiveness = typeEffectiveness[type.toLowerCase()]
    if (effectiveness) {
      effectiveness.weaknesses.forEach((w) => weaknesses.add(w))
      effectiveness.resistances.forEach((r) => resistances.add(r))
    }
  })

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Type Effectiveness</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Weak Against</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(weaknesses).map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-sm font-medium text-white capitalize"
                style={{
                  backgroundColor: typeColors[type] || "#A8A878",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Resistant To</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(resistances).map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-sm font-medium text-white capitalize"
                style={{
                  backgroundColor: typeColors[type] || "#A8A878",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
