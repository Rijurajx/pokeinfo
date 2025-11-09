import { fetchShinyPokemon, fetchPokemonStats } from "@/lib/fetchers"
import ShinyChecklistClient from "./shiny-checklist-client"

export const metadata = {
  title: "Shiny Pokémon Checklist | Pokémon GO Database",
  description: "Complete list of all shiny Pokémon available in Pokémon GO with release dates and special variants",
}

export default async function ShinyChecklistPage() {
  const [shinyPokemon, allPokemon] = await Promise.all([fetchShinyPokemon(), fetchPokemonStats()])

  return <ShinyChecklistClient shinyPokemon={shinyPokemon} allPokemon={allPokemon} />
}
