export const metadata = {
  title: "Events | Pokémon GO Database",
  description: "Current and upcoming Pokémon GO events",
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-muted-foreground text-lg">Coming soon: Current and upcoming in-game events</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">This feature is under development</p>
        </div>
      </div>
    </div>
  )
}
