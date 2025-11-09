import { fetchCommunityDays, fetchPokemonStats, fetchFastMoves, fetchChargedMoves } from "@/lib/fetchers"
import CommunityDayClient from "./community-day-client"

export const metadata = {
  title: "Community Day Moves | Pokémon GO Database",
  description: "Complete list of all Community Day exclusive moves in Pokémon GO",
}

export default async function CommunityDayMovesPage() {
  const [communityDays, allPokemon, fastMoves, chargedMoves] = await Promise.all([
    fetchCommunityDays(),
    fetchPokemonStats(),
    fetchFastMoves(),
    fetchChargedMoves(),
  ])

  return (
    <CommunityDayClient
      communityDays={communityDays}
      allPokemon={allPokemon}
      fastMoves={fastMoves}
      chargedMoves={chargedMoves}
    />
  )
}
