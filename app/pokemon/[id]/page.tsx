import {
  fetchPokemonById,
  fetchMovesForPokemon,
  fetchPokeAPIDetails,
  fetchPokeAPISpecies,
  fetchPokeAPIEvolutionChain,
  fetchPokemonGoStats,
} from "@/lib/fetchers"
import { notFound } from "next/navigation"
import PokemonDetailHeader from "@/components/pokemon/PokemonDetailHeader"
import PokemonMovesCard from "@/components/pokemon/PokemonMovesCard"
import PokemonAbout from "@/components/pokemon/PokemonAbout"
import PokemonBaseStats from "@/components/pokemon/PokemonBaseStats"
import PokemonTypeEffectiveness from "@/components/pokemon/PokemonTypeEffectiveness"
import PokemonEvolution from "@/components/pokemon/PokemonEvolution"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PokemonDetailPageProps) {
  const { id } = await params
  const pokemon = await fetchPokemonById(id)

  if (!pokemon) {
    return {
      title: "Pokémon Not Found",
    }
  }

  return {
    title: `${pokemon.pokemon_name} | Pokémon GO Database`,
    description: `View detailed stats, moves, and information for ${pokemon.pokemon_name} in Pokémon GO`,
  }
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params
  const pokemon = await fetchPokemonById(id)
  const moves = await fetchMovesForPokemon(id)
  const goStats = await fetchPokemonGoStats(id)

  const pokeAPIDetails = await fetchPokeAPIDetails(id)
  const pokeAPISpecies = await fetchPokeAPISpecies(id)
  let evolutionChain = null

  if (pokeAPISpecies?.evolution_chain?.url) {
    evolutionChain = await fetchPokeAPIEvolutionChain(pokeAPISpecies.evolution_chain.url)
  }

  if (!pokemon) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/pokedex"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Pokédex
        </Link>

        {/* Pokemon Header */}
        <PokemonDetailHeader pokemon={pokemon} />

        <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
          {/* Left Column: About and Moves */}
          <div className="space-y-6">
            {pokeAPIDetails && pokeAPISpecies && (
              <PokemonAbout
                pokemon={pokeAPIDetails}
                species={pokeAPISpecies}
                goStats={goStats || undefined}
                moves={moves || undefined}
              />
            )}
            {moves && <PokemonMovesCard moves={moves} />}
          </div>

          {/* Right Column: Base Stats */}
          <div>{goStats && <PokemonBaseStats stats={goStats} />}</div>
        </div>

        {/* Type Effectiveness */}
        {pokeAPIDetails && <PokemonTypeEffectiveness types={pokeAPIDetails.types.map((t) => t.type.name)} />}

        {/* Evolution Chain */}
        {evolutionChain && <PokemonEvolution evolutionChain={evolutionChain} />}
      </div>
    </div>
  )
}
