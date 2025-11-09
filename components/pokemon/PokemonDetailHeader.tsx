import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { Pokemon } from "@/lib/fetchers"

interface PokemonDetailHeaderProps {
  pokemon: Pokemon
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

export default function PokemonDetailHeader({ pokemon }: PokemonDetailHeaderProps) {
  const primaryColor = pokemon.type_1 ? typeColors[pokemon.type_1.toLowerCase()] || "#A8A878" : "#A8A878"
  const secondaryColor = pokemon.type_2 ? typeColors[pokemon.type_2.toLowerCase()] : null

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokemon_id}.png`

  return (
    <Card className="relative overflow-hidden border-border">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${primaryColor}, transparent 70%)`,
        }}
      />

      <div className="relative p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Pokemon Image */}
          <div className="relative w-64 h-64 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-3xl"
              style={{
                background: `radial-gradient(circle, ${primaryColor}, transparent)`,
              }}
            />
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={pokemon.pokemon_name}
              width={256}
              height={256}
              className="relative object-contain drop-shadow-2xl"
              unoptimized
              priority
            />
          </div>

          {/* Pokemon Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-5xl font-bold text-foreground text-balance">{pokemon.pokemon_name}</h1>
                <span className="text-lg text-muted-foreground font-mono">
                  #{String(pokemon.pokemon_id).padStart(4, "0")}
                </span>
              </div>

              {pokemon.form && pokemon.form !== "Normal" && (
                <p className="text-xl text-muted-foreground italic">{pokemon.form}</p>
              )}
            </div>

            {/* Types */}
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              <span
                className="px-6 py-2 rounded-full text-base font-semibold text-white shadow-lg"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 20px ${primaryColor}60`,
                }}
              >
                {pokemon.type_1}
              </span>
              {pokemon.type_2 && secondaryColor && (
                <span
                  className="px-6 py-2 rounded-full text-base font-semibold text-white shadow-lg"
                  style={{
                    backgroundColor: secondaryColor,
                    boxShadow: `0 0 20px ${secondaryColor}60`,
                  }}
                >
                  {pokemon.type_2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
