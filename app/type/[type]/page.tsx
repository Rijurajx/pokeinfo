import { fetchAllPokemonWithForms, typeEffectiveness } from "@/lib/fetchers"
import { TYPE_COLORS } from "@/lib/type-colors"
import { notFound } from "next/navigation"
import TypePokemonTable from "./type-pokemon-table"

interface TypePageProps {
  params: {
    type: string
  }
}

export async function generateStaticParams() {
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  return types.map((type) => ({
    type: type,
  }))
}

function calculateMaxCP(baseAttack: number, baseDefense: number, baseStamina: number): number {
  const cpMultiplier = 0.84029999 // Level 50 CP multiplier
  const attack = baseAttack + 15
  const defense = baseDefense + 15
  const stamina = baseStamina + 15

  const cp = Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpMultiplier, 2)) / 10)
  return Math.max(10, cp)
}

function getRegionFromId(id: string): string {
  const numId = Number.parseInt(id)
  if (numId <= 151) return "Kanto"
  if (numId <= 251) return "Johto"
  if (numId <= 386) return "Hoenn"
  if (numId <= 493) return "Sinnoh"
  if (numId <= 649) return "Unova"
  if (numId <= 721) return "Kalos"
  if (numId <= 809) return "Alola"
  if (numId <= 905) return "Galar"
  return "Paldea"
}

function getGenerationFromId(id: string): number {
  const numId = Number.parseInt(id)
  if (numId <= 151) return 1
  if (numId <= 251) return 2
  if (numId <= 386) return 3
  if (numId <= 493) return 4
  if (numId <= 649) return 5
  if (numId <= 721) return 6
  if (numId <= 809) return 7
  if (numId <= 905) return 8
  return 9
}

export default async function TypePage({ params }: TypePageProps) {
  const type = params.type.toLowerCase()

  // Validate type
  const validTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  if (!validTypes.includes(type)) {
    notFound()
  }

  // Fetch all Pokémon
  const allPokemon = await fetchAllPokemonWithForms()

  console.log("[v0] Total Pokemon fetched:", allPokemon.length)
  console.log("[v0] Looking for type:", type)
  console.log("[v0] First Pokemon full structure:", JSON.stringify(allPokemon[0], null, 2))
  console.log(
    "[v0] Sample Pokemon with all fields:",
    allPokemon.slice(0, 3).map((p) => ({
      id: p.pokemon_id,
      name: p.pokemon_name,
      form: p.form,
      type_1: p.type_1,
      type_2: p.type_2,
      attack: p.base_attack,
      defense: p.base_defense,
      stamina: p.base_stamina,
    })),
  )

  // Filter by type - handle both lowercase and capitalized type names
  const typePokemon = allPokemon
    .filter((p) => {
      const type1Match = p.type_1?.toLowerCase() === type
      const type2Match = p.type_2?.toLowerCase() === type
      return type1Match || type2Match
    })
    .map((p) => ({
      ...p,
      maxCP: calculateMaxCP(p.base_attack, p.base_defense, p.base_stamina),
      region: getRegionFromId(p.pokemon_id),
      generation: getGenerationFromId(p.pokemon_id),
    }))
    .sort((a, b) => Number.parseInt(a.pokemon_id) - Number.parseInt(b.pokemon_id))

  console.log("[v0] Filtered Pokemon count:", typePokemon.length)
  if (typePokemon.length > 0) {
    console.log(
      "[v0] First 3 filtered Pokemon:",
      typePokemon.slice(0, 3).map((p) => ({
        name: p.pokemon_name,
        type_1: p.type_1,
        type_2: p.type_2,
      })),
    )
  }

  // Get type effectiveness
  const effectiveness = typeEffectiveness[type]
  const typeColors = TYPE_COLORS[type as keyof typeof TYPE_COLORS]

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div
          className={`rounded-lg p-8 mb-8 ${typeColors.bg} ${typeColors.border} border-2`}
          style={{
            boxShadow: `0 0 30px ${typeColors.glow}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-4xl font-bold capitalize ${typeColors.text}`}>{type}-type Pokémon in Pokémon GO</h1>
            <div
              className={`w-16 h-16 rounded-full ${typeColors.bg} ${typeColors.border} border-2 flex items-center justify-center`}
            >
              <span className={`text-2xl font-bold ${typeColors.text}`}>{type[0].toUpperCase()}</span>
            </div>
          </div>

          <p className="text-foreground/90 mb-4">
            Explore our extensive list of all {type}-type Pokémon in Pokémon GO. Uncover their unique abilities, stats,
            and movesets to build a powerful team. Master the world of Pokémon with this comprehensive {type}-type guide
            and enhance your gameplay today!
          </p>

          {effectiveness && (
            <p className="text-foreground/80">
              {type.charAt(0).toUpperCase() + type.slice(1)}-type Pokémon are weak to{" "}
              {effectiveness.weaknesses.map((w, i) => (
                <span key={w}>
                  <span className="font-semibold capitalize">{w}</span>
                  {i < effectiveness.weaknesses.length - 1 && ", "}
                </span>
              ))}{" "}
              moves.
              {effectiveness.resistances.length > 0 && (
                <>
                  {" "}
                  They take reduced damage from{" "}
                  {effectiveness.resistances.map((r, i) => (
                    <span key={r}>
                      <span className="font-semibold capitalize">{r}</span>
                      {i < effectiveness.resistances.length - 1 && ", "}
                    </span>
                  ))}{" "}
                  moves.
                </>
              )}
            </p>
          )}
        </div>

        {/* Table */}
        <TypePokemonTable pokemon={typePokemon} type={type} />
      </div>
    </div>
  )
}
