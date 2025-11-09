interface RegionCardProps {
  region: {
    name: string
    generation: number
    pokemonRange: string
    description: string
    color: string
  }
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{region.name}</h2>
          <span className="text-sm font-medium text-muted-foreground">Gen {region.generation}</span>
        </div>

        <p className="text-muted-foreground">{region.description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-mono text-primary">#{region.pokemonRange}</span>
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Explore →</span>
        </div>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${region.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}
      />
    </div>
  )
}
