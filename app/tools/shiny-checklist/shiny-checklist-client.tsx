"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { ShinyPokemon, Pokemon } from "@/lib/fetchers"

interface ShinyChecklistClientProps {
  shinyPokemon: ShinyPokemon[]
  allPokemon: Pokemon[]
}

export default function ShinyChecklistClient({ shinyPokemon, allPokemon }: ShinyChecklistClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Create a map of pokemon data for quick lookup
  const pokemonMap = useMemo(() => {
    const map = new Map<number, Pokemon>()
    for (const pokemon of allPokemon) {
      const id = Number(pokemon.pokemon_id)
      if (!map.has(id)) {
        map.set(id, pokemon)
      }
    }
    return map
  }, [allPokemon])

  // Filter shiny pokemon based on search
  const filteredShiny = useMemo(() => {
    if (!searchQuery) return shinyPokemon

    const query = searchQuery.toLowerCase()
    return shinyPokemon.filter((shiny) => {
      const pokemon = pokemonMap.get(shiny.id)
      return pokemon?.pokemon_name.toLowerCase().includes(query) || shiny.id.toString().includes(query)
    })
  }, [shinyPokemon, searchQuery, pokemonMap])

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">List of Shiny Pokémon in Pokémon GO</h1>
          <p className="text-muted-foreground text-pretty max-w-4xl">
            Shiny Pokémon, with their alternative colors and rare occurrence, have always brought an extra layer of
            excitement and surprise to the journeys of trainers across the world. This page shows all Shiny Pokémon that
            are currently available in Pokémon GO. ✨✨
          </p>
        </div>

        {/* Collapsible Info Section */}
        <Card className="bg-card/50">
          <CardContent className="p-6 space-y-6">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-lg list-none flex items-center gap-2">
                <span className="text-primary">▼</span> More about Shiny Pokémon
              </summary>
              <div className="mt-4 space-y-6 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-bold text-foreground text-base mb-2">
                    All That Glitters - Understanding Shiny Pokémon
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">1.1 What Are Shiny Pokémon?</h4>
                      <p>
                        Shiny Pokémon are rare variants that feature different coloration than their non-shiny
                        counterparts. These sparkling creatures are not only a visual treat but are also celebrated for
                        their rarity, categorized for their scarceness and the prestige associated with finding and
                        catching them.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">1.2 Shiny Mechanics: Distinct Yet Similar</h4>
                      <p>
                        Despite their distinct appearances, Shiny Pokémon retain the same moves, stats, and abilities as
                        their standard versions. Their principal value lies in their rarity and the prestige associated
                        with finding and catching them.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground text-base mb-2">Shiny odds in Pokémon GO</h3>
                  <p className="mb-3">
                    Shiny Pokémon have different odds depending on which scenario you encounter them in. During events,
                    such as Community Day or 1-day limited events like Pokémon GO Fest, your chance to find a Shiny
                    Pokémon are greatly increased. 1 in 500 (base rate) is the most common Shiny rate. 1 in 25 should be
                    fairly. A similar rate is used for Legendary Pokémon in raids (around 1 in 20), but base Shiny odds
                    shows shiny odds in %.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 font-semibold text-foreground">Scenario</th>
                          <th className="text-left p-3 font-semibold text-foreground">Shiny odds</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Base chance</td>
                          <td className="p-3">1 in 500 (0.2%)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Medium chance</td>
                          <td className="p-3">1 in 125 (0.8%)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Permaboosted</td>
                          <td className="p-3">1 in 64 (1.6%)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Community Day</td>
                          <td className="p-3">1 in 25 (4.0%)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Legendary</td>
                          <td className="p-3">1 in 20 (5.0%)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3">Day event</td>
                          <td className="p-3">1 in 10 (10.0%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground text-base mb-2">Mechanics of Shiny Pokémon in Pokémon GO</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">2.1 Shiny Encounter Rates</h4>
                      <p>
                        Shiny Pokémon have lower encounter rates compared to their non-shiny counterparts. General wild
                        encounters have a baseline shiny rate of approximately 1 in 450. However, during certain events
                        or with particular Pokémon, this rate can be significantly boosted.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">2.2 Shiny Pokémon in Raids and Eggs</h4>
                      <p>
                        Special events, such as Community Days and Pokémon GO Fest, often feature increased Shiny
                        encounter rates. Trainers can leverage these events to maximize their chances of acquiring these
                        dazzling creatures.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground text-base mb-2">Strategies to Find Shiny Pokémon</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">3.1 Regular and Event Checks</h4>
                      <p>
                        Regularly check for Pokémon in the wild, and particularly be attentive during events where Shiny
                        rates are boosted. Always engage with Pokémon that have Shiny variants to maximize your Shiny
                        hunting success.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">3.2 Raid Battles and Shiny Odds</h4>
                      <p>
                        Participating in raid battles can also be lucrative for Shiny hunters, as certain raid-exclusive
                        Pokémon may have higher Shiny encounter rates.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        3.3 Utilize Special Research and Field Research
                      </h4>
                      <p>
                        Engaging in Special Research and Field Research tasks may reward encounters with specific
                        Pokémon, occasionally featuring increased Shiny encounter rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by Pokémon name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-card border-border"
          />
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            Found {filteredShiny.length} shiny Pokémon matching &quot;{searchQuery}&quot;
          </p>
        )}

        {/* Shiny Pokemon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {filteredShiny.map((shiny) => {
            const pokemon = pokemonMap.get(shiny.id)
            if (!pokemon) return null

            const paddedId = String(shiny.id).padStart(3, "0")

            return (
              <Link key={`${shiny.id}-${pokemon.form || "normal"}`} href={`/pokemon/${paddedId}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full bg-card/80">
                  <CardContent className="p-4 flex flex-col items-center gap-3">
                    {/* Pokemon Number */}
                    <div className="text-xs text-muted-foreground font-mono">#{paddedId}</div>

                    {/* Pokemon Image */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${shiny.id}.png`}
                        alt={`Shiny ${pokemon.pokemon_name}`}
                        width={96}
                        height={96}
                        className="pixelated group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Pokemon Name */}
                    <div className="text-center">
                      <div className="font-semibold text-sm">Shiny {pokemon.pokemon_name}</div>
                      {pokemon.form && pokemon.form !== "Normal" && (
                        <div className="text-xs text-muted-foreground">{pokemon.form}</div>
                      )}
                    </div>

                    {/* Availability Info */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {shiny.found_wild && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Wild</span>
                      )}
                      {shiny.found_raid && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Raid</span>
                      )}
                      {shiny.found_egg && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Egg</span>
                      )}
                      {shiny.found_evolution && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          Evolution
                        </span>
                      )}
                      {shiny.found_research && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Research</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* No Results */}
        {filteredShiny.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No shiny Pokémon found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
