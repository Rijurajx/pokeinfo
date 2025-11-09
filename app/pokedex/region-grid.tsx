import Link from "next/link"
import RegionCard from "@/components/RegionCard"

export const regions = [
  {
    name: "Kanto",
    slug: "kanto",
    generation: 1,
    pokemonRange: "001-151",
    description: "The original 151 Pokémon",
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Johto",
    slug: "johto",
    generation: 2,
    pokemonRange: "152-251",
    description: "Generation II Pokémon",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "Hoenn",
    slug: "hoenn",
    generation: 3,
    pokemonRange: "252-386",
    description: "Generation III Pokémon",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Sinnoh",
    slug: "sinnoh",
    generation: 4,
    pokemonRange: "387-493",
    description: "Generation IV Pokémon",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Unova",
    slug: "unova",
    generation: 5,
    pokemonRange: "494-649",
    description: "Generation V Pokémon",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Kalos",
    slug: "kalos",
    generation: 6,
    pokemonRange: "650-721",
    description: "Generation VI Pokémon",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Alola",
    slug: "alola",
    generation: 7,
    pokemonRange: "722-809",
    description: "Generation VII Pokémon",
    color: "from-orange-500 to-yellow-500",
  },
  {
    name: "Galar",
    slug: "galar",
    generation: 8,
    pokemonRange: "810-905",
    description: "Generation VIII Pokémon",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Paldea",
    slug: "paldea",
    generation: 9,
    pokemonRange: "906-1025",
    description: "Generation IX Pokémon",
    color: "from-red-500 to-pink-500",
  },
]

export default function RegionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {regions.map((region) => (
        <Link key={region.slug} href={`/pokedex/${region.slug}`}>
          <RegionCard region={region} />
        </Link>
      ))}
    </div>
  )
}
