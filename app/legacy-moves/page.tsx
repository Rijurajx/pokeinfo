import type { Metadata } from "next"
import LegacyMovesClient from "./legacy-moves-client"
import { fetchLegacyMoves } from "@/lib/fetchers"

export const metadata: Metadata = {
  title: "Legacy Moves in Pokémon GO | Pokémon GO Database",
  description:
    "Complete list of Legacy Moves in Pokémon GO. Find out which Pokémon have legacy moves and how to obtain them with Elite TMs.",
}

export default async function LegacyMovesPage() {
  const legacyMoves = await fetchLegacyMoves()

  return <LegacyMovesClient legacyMoves={legacyMoves} />
}
