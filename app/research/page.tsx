export const metadata = {
  title: "Research | Pokémon GO Database",
  description: "Field and special research tasks and rewards",
}

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Research
          </h1>
          <p className="text-muted-foreground text-lg">Coming soon: Field and special research tasks with rewards</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">This feature is under development</p>
        </div>
      </div>
    </div>
  )
}
