"use client"
import Image from "next/image"
import Link from "next/link"
import { TIER_DATA, type TierPokemon } from "./tier-data"

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

export default function TierListClient() {
  const getImageUrl = (pokemon: TierPokemon) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }

  const scrollToTier = (tierKey: string) => {
    const element = document.getElementById(`tier-${tierKey}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <h1 className="text-4xl font-bold text-foreground mb-4">Best Attackers Tier List</h1>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Explore our complete tier list of the best and most effective raid Pokémon. This guide will help you
                understand which Pokémon reign supreme, which are the best investments, and which Pokémon offer the best
                return on investment. Whether you're a seasoned Trainer or just starting out, learn which Pokémon offer
                the best return on your Stardust and Candy.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Note: Pokémon inside every tier are sorted by their Max CP.
              </p>
            </div>
            <div className="w-full md:w-64 flex-shrink-0">
              <Image
                src="/pokemon-go-community-day-colorful-banner.jpg"
                alt="Best Attackers Tier List"
                width={256}
                height={256}
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Jump to Tier:</h2>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {Object.entries(TIER_DATA).map(([tierKey, tierData]) => (
              <button
                key={tierKey}
                onClick={() => scrollToTier(tierKey)}
                className={`${tierData.color} px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg`}
              >
                {tierData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Sections */}
        {Object.entries(TIER_DATA).map(([tierKey, tierData]) => (
          <div key={tierKey} id={`tier-${tierKey}`} className="mb-8 scroll-mt-4">
            <div className={`${tierData.color} rounded-t-lg p-4`}>
              <h2 className="text-3xl font-bold text-white">{tierData.name}</h2>
            </div>
            <div className="bg-card rounded-b-lg p-6 border border-t-0 border-border">
              <p className="text-muted-foreground mb-6">{tierData.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tierData.pokemon.map((pokemon, index) => (
                  <Link
                    key={`${pokemon.id}-${index}`}
                    href={`/pokemon/${pokemon.id}`}
                    className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors border border-border"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image
                        src={getImageUrl(pokemon) || "/placeholder.svg"}
                        alt={pokemon.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <p className="text-foreground text-sm font-medium text-center mb-2 line-clamp-2 min-h-[2.5rem]">
                      {pokemon.name}
                    </p>
                    <div className="flex justify-center gap-1">
                      {pokemon.types.map((type) => (
                        <div
                          key={type}
                          className={`w-6 h-6 rounded-full ${TYPE_COLORS[type]} flex items-center justify-center`}
                          title={type}
                        >
                          <span className="text-xs text-white font-bold uppercase">{type[0]}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
