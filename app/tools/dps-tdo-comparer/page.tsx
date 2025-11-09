import {
  fetchPokemonStats,
  fetchPokemonMoves,
  fetchFastMoves,
  fetchChargedMoves,
  fetchPokemonTypes,
} from "@/lib/fetchers"
import DpsTdoComparerClient from "./dps-tdo-comparer-client"

export const metadata = {
  title: "Pokémon DPS and TDO Comparer | Pokémon GO Database",
  description:
    "Compare side-by-side any number of Pokémon in Pokémon GO to evaluate their DPS, TDO and overall score with any imaginable move set.",
}

export default async function DpsTdoComparerPage() {
  const [pokemonStats, pokemonMoves, fastMoves, chargedMoves, pokemonTypes] = await Promise.all([
    fetchPokemonStats(),
    fetchPokemonMoves(),
    fetchFastMoves(),
    fetchChargedMoves(),
    fetchPokemonTypes(),
  ])

  return (
    <DpsTdoComparerClient
      pokemonStats={pokemonStats}
      pokemonMoves={pokemonMoves}
      fastMoves={fastMoves}
      chargedMoves={chargedMoves}
      pokemonTypes={pokemonTypes}
    />
  )
}
