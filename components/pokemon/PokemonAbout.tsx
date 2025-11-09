import { Card } from "@/components/ui/card"
import type { PokeAPIPokemon, PokeAPISpecies, PokemonGoStats, PokemonMoves } from "@/lib/fetchers"
import { getWeatherBoost } from "@/lib/utils"
import { typeEffectiveness } from "@/lib/fetchers"

interface PokemonAboutProps {
  pokemon: PokeAPIPokemon
  species: PokeAPISpecies
  goStats?: PokemonGoStats
  moves?: PokemonMoves
}

export default function PokemonAbout({ pokemon, species, goStats, moves }: PokemonAboutProps) {
  const genus = species.genera.find((g) => g.language.name === "en")?.genus || "Unknown"
  const heightInMeters = (pokemon.height / 10).toFixed(1)
  const weightInKg = (pokemon.weight / 10).toFixed(1)

  const abilities = pokemon.abilities
    .map((a) => {
      const name = a.ability.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return a.is_hidden ? `${name} (Hidden)` : name
    })
    .join(", ")

  const generatePokeGoDescription = () => {
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    const types = pokemon.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
    const typeString = types.length === 2 ? `${types[0]} and ${types[1]}` : types[0]

    // Get weaknesses
    const weaknesses = new Set<string>()
    pokemon.types.forEach((type) => {
      const effectiveness = typeEffectiveness[type.type.name.toLowerCase()]
      if (effectiveness) {
        effectiveness.weaknesses.forEach((w) => weaknesses.add(w.charAt(0).toUpperCase() + w.slice(1)))
      }
    })
    const weaknessString = Array.from(weaknesses).join(", ")

    // Get best moves (first fast and first charged move)
    const bestFastMove = moves?.fast_moves?.[0] || "Unknown"
    const bestChargedMove = moves?.charged_moves?.[0] || "Unknown"

    // Get weather boost
    const weatherBoost = getWeatherBoost(pokemon.types.map((t) => t.type.name))
    const weatherString = weatherBoost.join(" and ")

    // Build description
    let description = `${pokemonName} is a ${typeString}-type Pokémon in Pokémon GO. `

    if (weaknesses.size > 0) {
      description += `As a ${typeString}-type Pokémon, ${pokemonName} is weak to ${weaknessString}-type moves. `
    }

    if (goStats) {
      description += `${pokemonName}'s maximum Combat Power stat is ${goStats.maxCP} CP, `
      description += `and its best Pokémon GO moves are ${bestFastMove} and ${bestChargedMove}. `
    }

    if (weatherBoost.length > 0) {
      description += `${pokemonName} encounters are boosted during ${weatherString} weather. `
    }

    if (goStats?.shinyReleased) {
      description += `Shiny ${pokemonName} is available! ✨`
    }

    return description
  }

  const description =
    goStats && moves
      ? generatePokeGoDescription()
      : species.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/\f/g, " ")
          .replace(/\n/g, " ") || "No description available."

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-2xl font-bold mb-4 text-foreground">About</h2>

      <div className="mb-6 p-4 rounded-lg bg-background/50 border border-border/50">
        <p className="text-sm leading-relaxed text-muted-foreground italic">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Species</p>
          <p className="text-base font-medium text-foreground">{genus}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Height</p>
          <p className="text-base font-medium text-foreground">{heightInMeters} m</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Weight</p>
          <p className="text-base font-medium text-foreground">{weightInKg} kg</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground mb-1">Abilities</p>
          <p className="text-base font-medium text-foreground">{abilities}</p>
        </div>
      </div>
    </Card>
  )
}
