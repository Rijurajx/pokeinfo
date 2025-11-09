import RegionGrid from "./region-grid"

export const metadata = {
  title: "Pokédex | Pokémon GO Database",
  description: "Browse all Pokémon available in Pokémon GO by region",
}

export default function PokedexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-balance">
            Pokédex
          </h1>
          <p className="text-muted-foreground text-lg">Select a region to explore Pokémon</p>
        </div>

        {/* Region Grid */}
        <RegionGrid />
      </div>
    </div>
  )
}
