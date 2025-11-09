import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface PokemonCardProps {
  pokemon: {
    pokemon_name: string
    pokemon_id: string
    form: string
    type_1: string
    type_2?: string
    base_attack: number
    base_defense: number
    base_stamina: number
  }
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

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryColor = pokemon.type_1 ? typeColors[pokemon.type_1.toLowerCase()] || "#A8A878" : "#A8A878"
  const secondaryColor = pokemon.type_2 ? typeColors[pokemon.type_2.toLowerCase()] : null

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokemon_id}.png`

  const isShadow = pokemon.form === "Shadow"
  const isMega = pokemon.form === "Mega" || pokemon.form?.includes("Mega")
  const isSpecialForm = isShadow || isMega

  return (
    <Link href={`/pokemon/${pokemon.pokemon_id}`} className="block">
      <Card
        className={`group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 glow-type cursor-pointer ${
          isShadow ? "shadow-[0_0_20px_rgba(139,69,255,0.3)]" : ""
        } ${isMega ? "shadow-[0_0_20px_rgba(255,215,0,0.3)]" : ""}`}
        style={{
          borderColor: isShadow ? "#8B45FF80" : isMega ? "#FFD70080" : `${primaryColor}40`,
        }}
      >
        <div className="p-4 space-y-3">
          {isSpecialForm && (
            <div className="absolute top-2 right-2 z-10">
              {isShadow && (
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-purple-600/90 text-white shadow-lg">
                  Shadow
                </span>
              )}
              {isMega && (
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                  Mega
                </span>
              )}
            </div>
          )}

          <div
            className={`relative w-full aspect-square mb-2 flex items-center justify-center ${
              isShadow ? "brightness-75 contrast-125" : ""
            }`}
          >
            {isShadow && <div className="absolute inset-0 bg-purple-900/20 rounded-lg pointer-events-none" />}
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={pokemon.pokemon_name}
              width={120}
              height={120}
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
          </div>

          {/* Pokemon Name */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-balance">
              {pokemon.pokemon_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              #{String(pokemon.pokemon_id).padStart(4, "0")}
            </span>
          </div>

          {/* Form */}
          {pokemon.form && pokemon.form !== "Normal" && (
            <p
              className={`text-xs font-semibold italic ${
                isShadow ? "text-purple-400" : isMega ? "text-yellow-400" : "text-muted-foreground"
              }`}
            >
              {pokemon.form}
            </p>
          )}

          {/* Types */}
          <div className="flex gap-2 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 0 15px ${primaryColor}60`,
              }}
            >
              {pokemon.type_1}
            </span>
            {pokemon.type_2 && secondaryColor && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                style={{
                  backgroundColor: secondaryColor,
                  boxShadow: `0 0 15px ${secondaryColor}60`,
                }}
              >
                {pokemon.type_2}
              </span>
            )}
          </div>

          {/* Base Stats */}
          <div className="pt-3 border-t border-border/50 space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">ATK</p>
                <p className="text-sm font-bold text-primary">{pokemon.base_attack}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">DEF</p>
                <p className="text-sm font-bold text-secondary">{pokemon.base_defense}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">STA</p>
                <p className="text-sm font-bold text-foreground">{pokemon.base_stamina}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${
              isShadow ? "#8B45FF" : isMega ? "#FFD700" : primaryColor
            }, transparent 70%)`,
          }}
        />
      </Card>
    </Link>
  )
}
