import { fetchAllPokemonWithForms } from "@/lib/fetchers"
import { regions } from "../region-grid"
import { notFound } from "next/navigation"
import RegionPokedexClient from "./region-pokedex-client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface RegionPageProps {
  params: Promise<{ region: string }>
}

export async function generateStaticParams() {
  return regions.map((region) => ({
    region: region.slug,
  }))
}

export async function generateMetadata({ params }: RegionPageProps) {
  const { region: regionSlug } = await params
  const region = regions.find((r) => r.slug === regionSlug)

  if (!region) return {}

  return {
    title: `${region.name} Pokédex | Pokémon GO Database`,
    description: `Browse all ${region.name} region Pokémon (${region.pokemonRange})`,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionSlug } = await params
  const region = regions.find((r) => r.slug === regionSlug)

  if (!region) {
    notFound()
  }

  const allPokemon = await fetchAllPokemonWithForms()
  const [minId, maxId] = region.pokemonRange.split("-").map(Number)

  const regionPokemon = allPokemon.filter((p) => {
    const pokemonId = Number.parseInt(p.pokemon_id)
    return pokemonId >= minId && pokemonId <= maxId
  })

  const uniquePokemon = Array.from(
    regionPokemon
      .reduce((map, pokemon) => {
        const key = `${pokemon.pokemon_id}-${pokemon.form || "Normal"}`
        if (!map.has(key)) {
          map.set(key, pokemon)
        }
        return map
      }, new Map())
      .values(),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/pokedex"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Regions
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${region.color} bg-clip-text text-transparent text-balance`}
            >
              {region.name}
            </h1>
            <span className="text-sm font-medium text-muted-foreground px-3 py-1 rounded-full border border-border">
              Gen {region.generation}
            </span>
          </div>
          <p className="text-muted-foreground text-lg">
            {region.description} • #{region.pokemonRange}
          </p>
        </div>

        {/* Client Component with Search and Grid */}
        <RegionPokedexClient pokemon={uniquePokemon} totalCount={uniquePokemon.length} />
      </div>
    </div>
  )
}
