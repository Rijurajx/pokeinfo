import { fetchPokemonStats, fetchPokemonBuddyDistances, fetchPokemonTypes, fetchMegaPokemon } from "@/lib/fetchers"
import { BuddyDistanceClient } from "./buddy-distance-client"

export const metadata = {
  title: "Buddy Distance - Pokémon GO Database",
  description: "Complete list of Pokémon organized by buddy distance requirements in Pokémon GO",
}

export default async function BuddyDistancePage() {
  const [allPokemon, buddyDistances, pokemonTypes, megaPokemon] = await Promise.all([
    fetchPokemonStats(),
    fetchPokemonBuddyDistances(),
    fetchPokemonTypes(),
    fetchMegaPokemon(),
  ])

  console.log("[v0] Total Mega Pokemon fetched:", megaPokemon.length)
  console.log("[v0] Sample Mega Pokemon:", megaPokemon.slice(0, 3))
  console.log("[v0] Total buddy distances:", buddyDistances.length)

  // Create type map
  const typeMap = new Map<string, { type_1: string; type_2?: string }>()
  for (const typeData of pokemonTypes) {
    if (typeData.pokemon_id && typeData.type && Array.isArray(typeData.type)) {
      const types = typeData.type
      const form = typeData.form || "Normal"
      const key = `${typeData.pokemon_id}-${form}`
      typeMap.set(key, {
        type_1: types[0] || "Normal",
        type_2: types[1],
      })
    }
  }

  // Merge buddy distance data with Pokemon stats and types
  const pokemonWithDistance = buddyDistances
    .map((bd) => {
      const pokemon = allPokemon.find(
        (p) => Number(p.pokemon_id) === bd.pokemon_id && (p.form === bd.form || (!bd.form && p.form === "Normal")),
      )
      if (!pokemon) return null

      const form = bd.form || "Normal"
      const key = `${bd.pokemon_id}-${form}`
      const types = typeMap.get(key) || typeMap.get(`${bd.pokemon_id}-Normal`) || { type_1: "Normal" }

      // Calculate max CP
      const cpMultiplier = 0.84029999
      const attack = pokemon.base_attack + 15
      const defense = pokemon.base_defense + 15
      const stamina = pokemon.base_stamina + 15
      const maxCP = Math.max(
        10,
        Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpMultiplier, 2)) / 10),
      )

      return {
        pokemon_id: bd.pokemon_id,
        pokemon_name: bd.pokemon_name,
        form: bd.form || "Normal",
        distance: bd.distance,
        type_1: types.type_1,
        type_2: types.type_2,
        base_attack: pokemon.base_attack,
        base_defense: pokemon.base_defense,
        base_stamina: pokemon.base_stamina,
        maxCP,
      }
    })
    .filter((p) => p !== null)

  let megaAdded = 0
  for (const mega of megaPokemon) {
    // Find the base form's buddy distance (form is "Normal" or undefined)
    const baseDistance = buddyDistances.find(
      (bd) => bd.pokemon_id === mega.pokemon_id && (bd.form === "Normal" || !bd.form),
    )

    if (baseDistance) {
      // Calculate max CP for Mega
      const cpMultiplier = 0.84029999
      const attack = mega.stats.base_attack + 15
      const defense = mega.stats.base_defense + 15
      const stamina = mega.stats.base_stamina + 15
      const maxCP = Math.max(
        10,
        Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpMultiplier, 2)) / 10),
      )

      // Use the mega_name which includes the full form (e.g., "Mega Charizard X")
      const formName = mega.mega_name.replace(mega.pokemon_name, "").trim() || "Mega"

      pokemonWithDistance.push({
        pokemon_id: mega.pokemon_id,
        pokemon_name: mega.pokemon_name,
        form: formName,
        distance: baseDistance.distance,
        type_1: mega.type_1,
        type_2: mega.type_2,
        base_attack: mega.stats.base_attack,
        base_defense: mega.stats.base_defense,
        base_stamina: mega.stats.base_stamina,
        maxCP,
      })
      megaAdded++
    } else {
      console.log("[v0] No buddy distance found for Mega:", mega.pokemon_name, "ID:", mega.pokemon_id)
    }
  }

  console.log("[v0] Total Mega Pokemon added:", megaAdded)
  console.log("[v0] Total Pokemon with distance:", pokemonWithDistance.length)

  return <BuddyDistanceClient pokemonData={pokemonWithDistance} />
}
