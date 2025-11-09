"use client"

import { useState, useMemo } from "react"
import PokemonCard from "@/components/PokemonCard"
import SearchBar from "@/components/SearchBar"
import type { Pokemon } from "@/lib/fetchers"

interface RegionPokedexClientProps {
  pokemon: Pokemon[]
  totalCount: number
}

export default function RegionPokedexClient({ pokemon, totalCount }: RegionPokedexClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) return pokemon

    const query = searchQuery.toLowerCase()
    return pokemon.filter(
      (p) =>
        p.pokemon_name.toLowerCase().includes(query) ||
        String(p.pokemon_id).includes(query) ||
        p.type_1?.toLowerCase().includes(query) ||
        p.type_2?.toLowerCase().includes(query),
    )
  }, [pokemon, searchQuery])

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name, ID, or type..." />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPokemon.length} of {totalCount} Pokémon
      </div>

      {/* Pokemon Grid */}
      {filteredPokemon.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredPokemon.map((p) => (
            <PokemonCard key={`${p.pokemon_id}-${p.form}`} pokemon={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No Pokémon found matching "{searchQuery}"</p>
        </div>
      )}
    </>
  )
}
