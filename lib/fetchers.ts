export interface Pokemon {
  pokemon_name: string
  pokemon_id: string
  form: string
  type_1: string
  type_2?: string
  base_attack: number
  base_defense: number
  base_stamina: number
}

export interface PokemonMoves {
  pokemon_id: string
  pokemon_name: string
  form?: string
  fast_moves: string[]
  charged_moves: string[]
  elite_fast_moves?: string[]
  elite_charged_moves?: string[]
}

export interface PokeAPISpecies {
  id: number
  name: string
  genera: Array<{ genus: string; language: { name: string } }>
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>
  evolution_chain: { url: string }
}

export interface PokeAPIPokemon {
  id: number
  name: string
  height: number
  weight: number
  abilities: Array<{
    ability: { name: string; url: string }
    is_hidden: boolean
  }>
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  types: Array<{
    type: { name: string }
  }>
  sprites: {
    other: {
      "official-artwork": {
        front_default: string
        front_shiny: string
      }
    }
  }
}

export interface PokeAPIEvolutionChain {
  chain: {
    species: { name: string; url: string }
    evolves_to: Array<{
      species: { name: string; url: string }
      evolution_details: Array<{
        min_level?: number
        trigger: { name: string }
        item?: { name: string }
      }>
      evolves_to: Array<{
        species: { name: string; url: string }
        evolution_details: Array<{
          min_level?: number
          trigger: { name: string }
          item?: { name: string }
        }>
      }>
    }>
  }
}

export interface ReleasedPokemon {
  id: number
  name: string
}

export interface ShinyPokemon {
  id: number
  name: string
  found_wild?: boolean
  found_egg?: boolean
  found_raid?: boolean
  found_evolution?: boolean
  found_research?: boolean
  found_photobomb?: boolean
}

export interface PokemonGoStats {
  attack: number
  defense: number
  stamina: number
  total: number
  maxCP: number
  buddyDistance: number
  released: boolean
  shinyReleased: boolean
}

export interface FastMove {
  move_id: number
  name: string
  type: string
  power: number
  energy_delta: number
  duration: number
}

export interface ChargedMove {
  move_id: number
  name: string
  type: string
  power: number
  energy_delta: number
  duration: number
}

export interface PvPFastMove {
  move_id: number
  name: string
  type: string
  power: number
  energy_delta: number
  turns: number
}

export interface PvPChargedMove {
  move_id: number
  name: string
  type: string
  power: number
  energy_delta: number
}

export interface MegaPokemon {
  mega_id: number
  mega_name: string
  pokemon_id: number
  pokemon_name: string
  type_1: string
  type_2?: string
  stats: {
    base_attack: number
    base_defense: number
    base_stamina: number
  }
}

export interface ShadowPokemon {
  pokemon_id: number
  pokemon_name: string
  form: string
  released: boolean
}

export interface PokemonType {
  pokemon_id: number // Changed from 'id' to 'pokemon_id' to match API response
  pokemon_name: string // Added pokemon_name field
  type: string[]
  form?: string
}

export interface PokemonForm {
  form_id: number
  form: string
  pokemon_id: number
  pokemon_name: string
}

export interface PokemonBuddyDistance {
  distance: number
  pokemon_id: number
  pokemon_name: string
  form?: string
}

export interface LegacyMoveData {
  pokemon_id: number
  pokemon_name: string
  fast_attack?: string
  fast_attack_type?: string
  charged_attack?: string
  charged_attack_type?: string
  obtainable_via_tm: boolean
}

export interface CommunityDayMove {
  move: string
  move_type: string
  pokemon: string
}

export interface CommunityDay {
  bonuses: string[]
  boosted_pokemon: string[]
  community_day_number: number
  end_date: string
  event_moves: CommunityDayMove[]
  start_date: string
}

export async function fetchPokemonStats(): Promise<Pokemon[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pokemon_stats.json", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon data")
    }

    const data = await response.json()
    return data as Pokemon[]
  } catch (error) {
    console.error("Error fetching Pokémon stats:", error)
    return []
  }
}

export async function fetchPokemonMoves(): Promise<PokemonMoves[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/current_pokemon_moves.json", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon moves data")
    }

    const data = await response.json()
    return data as PokemonMoves[]
  } catch (error) {
    console.error("Error fetching Pokémon moves:", error)
    return []
  }
}

export async function fetchPokemonById(id: string): Promise<Pokemon | null> {
  const allPokemon = await fetchPokemonStats()

  const normalizedId = id.padStart(4, "0")
  const pokemon = allPokemon.find((p) => {
    const pokemonIdNormalized = String(p.pokemon_id).padStart(4, "0")
    return pokemonIdNormalized === normalizedId || String(p.pokemon_id) === id
  })

  return pokemon || null
}

export async function fetchMovesForPokemon(id: string): Promise<PokemonMoves | null> {
  const allMoves = await fetchPokemonMoves()

  const normalizedId = id.padStart(4, "0")
  const moves = allMoves.find((m) => {
    const moveIdNormalized = String(m.pokemon_id).padStart(4, "0")
    return moveIdNormalized === normalizedId || String(m.pokemon_id) === id
  })

  return moves || null
}

export async function fetchPokeAPIDetails(id: string): Promise<PokeAPIPokemon | null> {
  try {
    const numericId = Number.parseInt(id)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${numericId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data as PokeAPIPokemon
  } catch (error) {
    console.error("Error fetching PokeAPI details:", error)
    return null
  }
}

export async function fetchPokeAPISpecies(id: string): Promise<PokeAPISpecies | null> {
  try {
    const numericId = Number.parseInt(id)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${numericId}`, {
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data as PokeAPISpecies
  } catch (error) {
    console.error("Error fetching PokeAPI species:", error)
    return null
  }
}

export async function fetchPokeAPIEvolutionChain(url: string): Promise<PokeAPIEvolutionChain | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data as PokeAPIEvolutionChain
  } catch (error) {
    console.error("Error fetching evolution chain:", error)
    return null
  }
}

// Type effectiveness data
export const typeEffectiveness: Record<string, { weaknesses: string[]; resistances: string[] }> = {
  normal: { weaknesses: ["fighting"], resistances: ["ghost"] },
  fire: { weaknesses: ["water", "ground", "rock"], resistances: ["fire", "grass", "ice", "bug", "steel", "fairy"] },
  water: { weaknesses: ["electric", "grass"], resistances: ["fire", "water", "ice", "steel"] },
  electric: { weaknesses: ["ground"], resistances: ["electric", "flying", "steel"] },
  grass: {
    weaknesses: ["fire", "ice", "poison", "flying", "bug"],
    resistances: ["water", "electric", "grass", "ground"],
  },
  ice: { weaknesses: ["fire", "fighting", "rock", "steel"], resistances: ["ice"] },
  fighting: { weaknesses: ["flying", "psychic", "fairy"], resistances: ["bug", "rock", "dark"] },
  poison: { weaknesses: ["ground", "psychic"], resistances: ["grass", "fighting", "poison", "bug", "fairy"] },
  ground: { weaknesses: ["water", "grass", "ice"], resistances: ["poison", "rock", "electric"] },
  flying: { weaknesses: ["electric", "ice", "rock"], resistances: ["grass", "fighting", "bug", "ground"] },
  psychic: { weaknesses: ["bug", "ghost", "dark"], resistances: ["fighting", "psychic"] },
  bug: { weaknesses: ["fire", "flying", "rock"], resistances: ["grass", "fighting", "ground"] },
  rock: {
    weaknesses: ["water", "grass", "fighting", "ground", "steel"],
    resistances: ["normal", "fire", "poison", "flying"],
  },
  ghost: { weaknesses: ["ghost", "dark"], resistances: ["poison", "bug", "normal", "fighting"] },
  dragon: { weaknesses: ["ice", "dragon", "fairy"], resistances: ["fire", "water", "electric", "grass"] },
  dark: { weaknesses: ["fighting", "bug", "fairy"], resistances: ["ghost", "dark", "psychic"] },
  steel: {
    weaknesses: ["fire", "fighting", "ground"],
    resistances: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy", "poison"],
  },
  fairy: { weaknesses: ["poison", "steel"], resistances: ["fighting", "bug", "dark", "dragon"] },
}

export async function fetchReleasedPokemon(): Promise<ReleasedPokemon[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/released_pokemon.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      if (typeof data === "object" && data !== null) {
        const entries = Object.values(data)
        if (entries.length > 0 && typeof entries[0] === "object") {
          return entries as ReleasedPokemon[]
        }
      }
      return []
    }
    return data as ReleasedPokemon[]
  } catch (error) {
    console.error("Error fetching released Pokemon:", error)
    return []
  }
}

export async function fetchShinyPokemon(): Promise<ShinyPokemon[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/shiny_pokemon.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      if (typeof data === "object" && data !== null) {
        const entries = Object.values(data)
        if (entries.length > 0 && typeof entries[0] === "object") {
          return entries as ShinyPokemon[]
        }
      }
      return []
    }
    return data as ShinyPokemon[]
  } catch (error) {
    console.error("Error fetching shiny Pokemon:", error)
    return []
  }
}

function calculateMaxCP(baseAttack: number, baseDefense: number, baseStamina: number): number {
  // Max CP formula for level 50 Pokemon with 15/15/15 IVs
  const cpMultiplier = 0.84029999 // Level 50 CP multiplier
  const attack = baseAttack + 15
  const defense = baseDefense + 15
  const stamina = baseStamina + 15

  const cp = Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpMultiplier, 2)) / 10)
  return Math.max(10, cp)
}

function getBuddyDistance(pokemonId: number): number {
  // Simplified buddy distance logic based on common patterns
  // 1km: Common Pokemon (starters, common spawns)
  // 3km: Uncommon Pokemon
  // 5km: Rare Pokemon
  // 20km: Legendary/Mythical

  if (pokemonId >= 144 && pokemonId <= 151) return 20 // Legendary birds + Mewtwo + Mew
  if (pokemonId >= 243 && pokemonId <= 251) return 20 // Legendary beasts + Lugia/Ho-Oh + Celebi
  if (pokemonId >= 377 && pokemonId <= 386) return 20 // Hoenn legendaries
  if (pokemonId >= 480 && pokemonId <= 493) return 20 // Sinnoh legendaries
  if (pokemonId >= 638 && pokemonId <= 649) return 20 // Unova legendaries
  if (pokemonId >= 716 && pokemonId <= 721) return 20 // Kalos legendaries
  if (pokemonId >= 785 && pokemonId <= 809) return 20 // Alola legendaries
  if (pokemonId >= 888 && pokemonId <= 898) return 20 // Galar legendaries

  // Starters and common Pokemon
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 152, 153, 154, 155, 156, 157, 158, 159, 160].includes(pokemonId)) return 3

  // Most other Pokemon
  if (pokemonId <= 151) return 3 // Kanto
  if (pokemonId <= 251) return 5 // Johto
  if (pokemonId <= 386) return 5 // Hoenn
  if (pokemonId <= 493) return 5 // Sinnoh

  return 5 // Default
}

export async function fetchPokemonGoStats(id: string): Promise<PokemonGoStats | null> {
  const pokemon = await fetchPokemonById(id)
  if (!pokemon) return null

  const [releasedList, shinyList] = await Promise.all([fetchReleasedPokemon(), fetchShinyPokemon()])

  const pokemonIdNum = Number.parseInt(String(pokemon.pokemon_id))

  const isReleased = Array.isArray(releasedList) ? releasedList.some((p) => p.id === pokemonIdNum) : false

  const isShiny = Array.isArray(shinyList) ? shinyList.some((p) => p.id === pokemonIdNum) : false

  const total = pokemon.base_attack + pokemon.base_defense + pokemon.base_stamina
  const maxCP = calculateMaxCP(pokemon.base_attack, pokemon.base_defense, pokemon.base_stamina)
  const buddyDistance = getBuddyDistance(pokemonIdNum)

  return {
    attack: pokemon.base_attack,
    defense: pokemon.base_defense,
    stamina: pokemon.base_stamina,
    total,
    maxCP,
    buddyDistance,
    released: isReleased,
    shinyReleased: isShiny,
  }
}

export async function fetchFastMoves(): Promise<FastMove[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/fast_moves.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch fast moves")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching fast moves:", error)
    return []
  }
}

export async function fetchChargedMoves(): Promise<ChargedMove[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/charged_moves.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch charged moves")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching charged moves:", error)
    return []
  }
}

export async function fetchPvPFastMoves(): Promise<PvPFastMove[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pvp_fast_moves.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch PvP fast moves")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching PvP fast moves:", error)
    return []
  }
}

export async function fetchPvPChargedMoves(): Promise<PvPChargedMove[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pvp_charged_moves.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch PvP charged moves")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching PvP charged moves:", error)
    return []
  }
}

export async function fetchMegaPokemon(): Promise<MegaPokemon[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/mega_pokemon.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching Mega Pokemon:", error)
    return []
  }
}

export async function fetchShadowPokemon(): Promise<ShadowPokemon[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/shadow_pokemon.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("Failed to fetch Shadow Pokémon:", response.status)
      return []
    }

    const data = await response.json()

    // The data is an object, not an array
    if (data && typeof data === "object") {
      // Convert the object values to an array
      return Object.values(data) as ShadowPokemon[]
    }

    return []
  } catch (error) {
    console.error("Error fetching Shadow Pokémon:", error)
    return []
  }
}

export async function fetchPokemonForms(): Promise<PokemonForm[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pokemon_forms.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching Pokemon forms:", error)
    return []
  }
}

export async function fetchPokemonTypes(): Promise<PokemonType[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pokemon_types.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("Failed to fetch Pokemon types:", response.status)
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching Pokemon types:", error)
    return []
  }
}

export async function fetchAllPokemonWithForms(): Promise<Pokemon[]> {
  try {
    const [basePokemon, megaPokemon, shadowPokemon, pokemonTypes] = await Promise.all([
      fetchPokemonStats(),
      fetchMegaPokemon(),
      fetchShadowPokemon(),
      fetchPokemonTypes(),
    ])

    console.log("[v0] Pokemon types fetched:", pokemonTypes.length)
    console.log("[v0] First 3 type entries:", JSON.stringify(pokemonTypes.slice(0, 3)))
    console.log("[v0] Shadow Pokemon fetched:", shadowPokemon.length)

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

    console.log("[v0] Type map created with", typeMap.size, "entries")
    console.log("[v0] Sample type data:", Array.from(typeMap.entries()).slice(0, 5))

    const meaningfulForms = basePokemon.filter((p) => {
      const form = p.form?.toLowerCase() || "normal"

      const costumeKeywords = [
        "costume",
        "hat",
        "flower",
        "sunglasses",
        "bow",
        "party",
        "santa",
        "witch",
        "summer",
        "winter",
        "spring",
        "fall",
        "autumn",
        "explorer",
        "fragment",
        "copy",
        "clone",
        "anniversary",
        "flying",
        "5th",
        "straw",
        "lucario",
        "world cap",
        "sinnoh cap",
        "unova cap",
        "kalos cap",
        "alola cap",
        "original cap",
        "hoenn cap",
        "partner cap",
      ]

      const isCostume = costumeKeywords.some((keyword) => form.includes(keyword))

      const isRegionalOrBase =
        form === "normal" ||
        form.includes("alola") ||
        form.includes("galar") ||
        form.includes("hisui") ||
        form.includes("paldea") ||
        form === "plant" ||
        form === "sandy" ||
        form === "trash" ||
        form === "origin" ||
        form === "altered" ||
        form === "land" ||
        form === "incarnate" ||
        form === "aria" ||
        form === "standard" ||
        form === "red striped" ||
        form === "midday" ||
        form === "solo" ||
        form === "disguised" ||
        form === "amped" ||
        form === "full belly" ||
        form === "male" ||
        form === "average" ||
        form === "shield"

      return !isCostume && isRegionalOrBase
    })

    const allPokemon: Pokemon[] = meaningfulForms.map((p) => {
      const pokemonId = Number(p.pokemon_id)
      const form = p.form || "Normal"
      const key = `${pokemonId}-${form}`
      const types = typeMap.get(key) || typeMap.get(`${pokemonId}-Normal`) || { type_1: "Normal" }
      return {
        ...p,
        type_1: types.type_1,
        type_2: types.type_2,
      }
    })

    for (const mega of megaPokemon) {
      allPokemon.push({
        pokemon_id: String(mega.pokemon_id),
        pokemon_name: mega.mega_name,
        form: "Mega",
        type_1: mega.type_1,
        type_2: mega.type_2,
        base_attack: mega.stats.base_attack,
        base_defense: mega.stats.base_defense,
        base_stamina: mega.stats.base_stamina,
      })
    }

    let shadowCount = 0
    for (const shadow of shadowPokemon) {
      const basePoke = allPokemon.find(
        (p) => Number(p.pokemon_id) === shadow.pokemon_id && (p.form === "Normal" || !p.form),
      )

      if (basePoke) {
        allPokemon.push({
          ...basePoke,
          pokemon_name: basePoke.pokemon_name,
          form: "Shadow",
        })
        shadowCount++
      }
    }

    console.log("[v0] Total Shadow Pokemon added:", shadowCount)
    console.log("[v0] Total Pokemon with types:", allPokemon.length)
    console.log(
      "[v0] Sample Pokemon with types:",
      allPokemon.slice(0, 3).map((p) => ({ name: p.pokemon_name, type_1: p.type_1, type_2: p.type_2 })),
    )

    return allPokemon
  } catch (error) {
    console.error("Error fetching all Pokemon with forms:", error)
    return []
  }
}

export async function fetchPokemonBuddyDistances(): Promise<PokemonBuddyDistance[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/pokemon_buddy_distances.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("Failed to fetch buddy distances:", response.status)
      return []
    }

    const data = await response.json()

    // The API returns an object where keys are distances and values are arrays
    const allDistances: PokemonBuddyDistance[] = []

    if (data && typeof data === "object") {
      for (const [distance, pokemonList] of Object.entries(data)) {
        if (Array.isArray(pokemonList)) {
          for (const pokemon of pokemonList) {
            allDistances.push({
              distance: Number(distance),
              pokemon_id: pokemon.pokemon_id,
              pokemon_name: pokemon.pokemon_name,
              form: pokemon.form,
            })
          }
        }
      }
    }

    return allDistances
  } catch (error) {
    console.error("Error fetching buddy distances:", error)
    return []
  }
}

export async function fetchLegacyMoves(): Promise<LegacyMoveData[]> {
  try {
    const [pokemonMoves, fastMoves, chargedMoves] = await Promise.all([
      fetchPokemonMoves(),
      fetchFastMoves(),
      fetchChargedMoves(),
    ])

    // Create maps for move types
    const fastMoveTypeMap = new Map<string, string>()
    for (const move of fastMoves) {
      fastMoveTypeMap.set(move.name, move.type)
    }

    const chargedMoveTypeMap = new Map<string, string>()
    for (const move of chargedMoves) {
      chargedMoveTypeMap.set(move.name, move.type)
    }

    const legacyMovesMap = new Map<string, LegacyMoveData>()

    // Parse each pokemon's elite moves
    for (const pokemon of pokemonMoves) {
      const pokemonId = Number(pokemon.pokemon_id)
      const eliteFastMoves = pokemon.elite_fast_moves || []
      const eliteChargedMoves = pokemon.elite_charged_moves || []

      // Create entries for each elite fast move
      for (const fastMove of eliteFastMoves) {
        const key = `${pokemonId}-${fastMove}-`
        if (!legacyMovesMap.has(key)) {
          legacyMovesMap.set(key, {
            pokemon_id: pokemonId,
            pokemon_name: pokemon.pokemon_name,
            fast_attack: fastMove,
            fast_attack_type: fastMoveTypeMap.get(fastMove) || "Normal",
            obtainable_via_tm: true,
          })
        }
      }

      // Create entries for each elite charged move
      for (const chargedMove of eliteChargedMoves) {
        const key = `${pokemonId}--${chargedMove}`
        if (!legacyMovesMap.has(key)) {
          legacyMovesMap.set(key, {
            pokemon_id: pokemonId,
            pokemon_name: pokemon.pokemon_name,
            charged_attack: chargedMove,
            charged_attack_type: chargedMoveTypeMap.get(chargedMove) || "Normal",
            obtainable_via_tm: true,
          })
        }
      }
    }

    const legacyMoves = Array.from(legacyMovesMap.values())
    console.log("[v0] Total unique legacy moves:", legacyMoves.length)
    return legacyMoves
  } catch (error) {
    console.error("Error fetching legacy moves:", error)
    return []
  }
}

export async function fetchCommunityDays(): Promise<CommunityDay[]> {
  try {
    const response = await fetch("https://pogoapi.net/api/v1/community_days.json", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("Failed to fetch Community Days:", response.status)
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching Community Days:", error)
    return []
  }
}
