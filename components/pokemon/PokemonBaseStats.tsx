import { Card } from "@/components/ui/card"
import type { PokemonGoStats } from "@/lib/fetchers"

interface PokemonBaseStatsProps {
  stats: PokemonGoStats
}

const statColors: Record<string, string> = {
  attack: "#ef4444", // Bright red
  defense: "#3b82f6", // Bright blue
  stamina: "#22c55e", // Bright green
}

export default function PokemonBaseStats({ stats }: PokemonBaseStatsProps) {
  const maxStat = 300 // Max possible stat value in Pokemon GO

  const statData = [
    { name: "Attack", value: stats.attack, color: statColors.attack },
    { name: "Defense", value: stats.defense, color: statColors.defense },
    { name: "Stamina", value: stats.stamina, color: statColors.stamina },
  ]

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Base Stats</h2>

      <div className="space-y-4 mb-6">
        {statData.map((stat) => {
          const percentage = (stat.value / maxStat) * 100

          return (
            <div key={stat.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: stat.color,
                    boxShadow: `0 0 8px ${stat.color}, 0 0 12px ${stat.color}80, 0 0 16px ${stat.color}40`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Base Stats</p>
          <p className="text-lg font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Max CP</p>
          <p className="text-lg font-bold text-cyan-400">{stats.maxCP}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Buddy Distance</p>
          <p className="text-lg font-bold text-purple-400">{stats.buddyDistance} km</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Released</p>
          <p className="text-lg font-bold">
            {stats.released ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Shiny Released</p>
          <p className="text-lg font-bold">
            {stats.shinyReleased ? (
              <span className="text-yellow-400">Yes ✨</span>
            ) : (
              <span className="text-gray-400">No</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  )
}
