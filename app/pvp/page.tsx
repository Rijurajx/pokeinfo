export const metadata = {
  title: "PvP | Pokémon GO Database",
  description: "GO Battle League rankings and team building",
}

export default function PvPPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PvP
          </h1>
          <p className="text-muted-foreground text-lg">
            Coming soon: GO Battle League rankings and team building tools
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">This feature is under development</p>
        </div>
      </div>
    </div>
  )
}
