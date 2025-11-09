"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, Swords } from "lucide-react"

const POKEMON_TYPES = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
] as const

type PokemonType = (typeof POKEMON_TYPES)[number]

// Type effectiveness multipliers (attacker -> defender)
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  Normal: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 1,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 0.625,
    Ghost: 0.391,
    Dragon: 1,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1,
  },
  Fire: {
    Normal: 1,
    Fire: 0.625,
    Water: 0.625,
    Electric: 1,
    Grass: 1.6,
    Ice: 1.6,
    Fighting: 1,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1.6,
    Rock: 0.625,
    Ghost: 1,
    Dragon: 0.625,
    Dark: 1,
    Steel: 1.6,
    Fairy: 1,
  },
  Water: {
    Normal: 1,
    Fire: 1.6,
    Water: 0.625,
    Electric: 1,
    Grass: 0.625,
    Ice: 1,
    Fighting: 1,
    Poison: 1,
    Ground: 1.6,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 1.6,
    Ghost: 1,
    Dragon: 0.625,
    Dark: 1,
    Steel: 1,
    Fairy: 1,
  },
  Electric: {
    Normal: 1,
    Fire: 1,
    Water: 1.6,
    Electric: 0.625,
    Grass: 0.625,
    Ice: 1,
    Fighting: 1,
    Poison: 1,
    Ground: 0.391,
    Flying: 1.6,
    Psychic: 1,
    Bug: 1,
    Rock: 1,
    Ghost: 1,
    Dragon: 0.625,
    Dark: 1,
    Steel: 1,
    Fairy: 1,
  },
  Grass: {
    Normal: 1,
    Fire: 0.625,
    Water: 1.6,
    Electric: 1,
    Grass: 0.625,
    Ice: 1,
    Fighting: 1,
    Poison: 0.625,
    Ground: 1.6,
    Flying: 0.625,
    Psychic: 1,
    Bug: 0.625,
    Rock: 1.6,
    Ghost: 1,
    Dragon: 0.625,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1,
  },
  Ice: {
    Normal: 1,
    Fire: 0.625,
    Water: 0.625,
    Electric: 1,
    Grass: 1.6,
    Ice: 0.625,
    Fighting: 1,
    Poison: 1,
    Ground: 1.6,
    Flying: 1.6,
    Psychic: 1,
    Bug: 1,
    Rock: 1,
    Ghost: 1,
    Dragon: 1.6,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1,
  },
  Fighting: {
    Normal: 1.6,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1.6,
    Fighting: 1,
    Poison: 0.625,
    Ground: 1,
    Flying: 0.625,
    Psychic: 0.625,
    Bug: 0.625,
    Rock: 1.6,
    Ghost: 0.391,
    Dragon: 1,
    Dark: 1.6,
    Steel: 1.6,
    Fairy: 0.625,
  },
  Poison: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1.6,
    Ice: 1,
    Fighting: 1,
    Poison: 0.625,
    Ground: 1.6,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 0.625,
    Ghost: 0.625,
    Dragon: 1,
    Dark: 1,
    Steel: 0.391,
    Fairy: 1.6,
  },
  Ground: {
    Normal: 1,
    Fire: 1.6,
    Water: 1,
    Electric: 1.6,
    Grass: 0.625,
    Ice: 1,
    Fighting: 1,
    Poison: 1.6,
    Ground: 1,
    Flying: 0.391,
    Psychic: 1,
    Bug: 0.625,
    Rock: 1.6,
    Ghost: 1,
    Dragon: 1,
    Dark: 1,
    Steel: 1.6,
    Fairy: 1,
  },
  Flying: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 0.625,
    Grass: 1.6,
    Ice: 1,
    Fighting: 1.6,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1.6,
    Rock: 0.625,
    Ghost: 1,
    Dragon: 1,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1,
  },
  Psychic: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 1.6,
    Poison: 1.6,
    Ground: 1,
    Flying: 1,
    Psychic: 0.625,
    Bug: 1,
    Rock: 1,
    Ghost: 1,
    Dragon: 1,
    Dark: 0.391,
    Steel: 0.625,
    Fairy: 1,
  },
  Bug: {
    Normal: 1,
    Fire: 0.625,
    Water: 1,
    Electric: 1,
    Grass: 1.6,
    Ice: 1,
    Fighting: 0.625,
    Poison: 0.625,
    Ground: 1,
    Flying: 0.625,
    Psychic: 1.6,
    Bug: 1,
    Rock: 1,
    Ghost: 0.625,
    Dragon: 1,
    Dark: 1.6,
    Steel: 0.625,
    Fairy: 0.625,
  },
  Rock: {
    Normal: 1,
    Fire: 1.6,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1.6,
    Fighting: 0.625,
    Poison: 1,
    Ground: 0.625,
    Flying: 1.6,
    Psychic: 1,
    Bug: 1.6,
    Rock: 1,
    Ghost: 1,
    Dragon: 1,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1,
  },
  Ghost: {
    Normal: 0.391,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 1,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1.6,
    Bug: 1,
    Rock: 1,
    Ghost: 1.6,
    Dragon: 1,
    Dark: 0.625,
    Steel: 1,
    Fairy: 1,
  },
  Dragon: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 1,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 1,
    Ghost: 1,
    Dragon: 1.6,
    Dark: 1,
    Steel: 0.625,
    Fairy: 0.391,
  },
  Dark: {
    Normal: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 0.625,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1.6,
    Bug: 1,
    Rock: 1,
    Ghost: 1.6,
    Dragon: 1,
    Dark: 0.625,
    Steel: 1,
    Fairy: 0.625,
  },
  Steel: {
    Normal: 1,
    Fire: 0.625,
    Water: 0.625,
    Electric: 0.625,
    Grass: 1,
    Ice: 1.6,
    Fighting: 1,
    Poison: 1,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 1.6,
    Ghost: 1,
    Dragon: 1,
    Dark: 1,
    Steel: 0.625,
    Fairy: 1.6,
  },
  Fairy: {
    Normal: 1,
    Fire: 0.625,
    Water: 1,
    Electric: 1,
    Grass: 1,
    Ice: 1,
    Fighting: 1.6,
    Poison: 0.625,
    Ground: 1,
    Flying: 1,
    Psychic: 1,
    Bug: 1,
    Rock: 1,
    Ghost: 1,
    Dragon: 1.6,
    Dark: 1.6,
    Steel: 0.625,
    Fairy: 1,
  },
}

const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-orange-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-cyan-400",
  Fighting: "bg-red-600",
  Poison: "bg-purple-500",
  Ground: "bg-amber-600",
  Flying: "bg-indigo-400",
  Psychic: "bg-pink-500",
  Bug: "bg-lime-500",
  Rock: "bg-yellow-700",
  Ghost: "bg-purple-700",
  Dragon: "bg-indigo-600",
  Dark: "bg-gray-700",
  Steel: "bg-gray-500",
  Fairy: "bg-pink-400",
}

function getEffectivenessColor(multiplier: number): string {
  if (multiplier >= 1.6) return "bg-red-500/90 text-white shadow-[0_0_10px_rgba(239,68,68,0.6)]"
  if (multiplier <= 0.391) return "bg-emerald-600/90 text-white shadow-[0_0_10px_rgba(5,150,105,0.6)]"
  if (multiplier < 1) return "bg-green-600/90 text-white shadow-[0_0_8px_rgba(22,163,74,0.6)]"
  return "bg-gray-600/90 text-white shadow-[0_0_8px_rgba(75,85,99,0.5)]"
}

function calculateCombinedEffectiveness(primaryType: PokemonType, secondaryType: PokemonType | null) {
  const results: { type: PokemonType; multiplier: number }[] = []

  POKEMON_TYPES.forEach((attackerType) => {
    let multiplier = TYPE_CHART[attackerType][primaryType]
    if (secondaryType) {
      multiplier *= TYPE_CHART[attackerType][secondaryType]
    }
    results.push({ type: attackerType, multiplier })
  })

  return results
}

export default function TypeChartPage() {
  const [primaryType, setPrimaryType] = useState<PokemonType | null>(null)
  const [secondaryType, setSecondaryType] = useState<PokemonType | null>(null)

  const effectiveness = primaryType ? calculateCombinedEffectiveness(primaryType, secondaryType) : []
  const weaknesses = effectiveness.filter((e) => e.multiplier > 1).sort((a, b) => b.multiplier - a.multiplier)
  const resistances = effectiveness.filter((e) => e.multiplier < 1).sort((a, b) => a.multiplier - b.multiplier)

  const groupedWeaknesses = weaknesses.reduce(
    (acc, { type, multiplier }) => {
      const key = multiplier.toFixed(3)
      if (!acc[key]) {
        acc[key] = { multiplier, types: [] }
      }
      acc[key].types.push(type)
      return acc
    },
    {} as Record<string, { multiplier: number; types: PokemonType[] }>,
  )

  const groupedResistances = resistances.reduce(
    (acc, { type, multiplier }) => {
      const key = multiplier.toFixed(3)
      if (!acc[key]) {
        acc[key] = { multiplier, types: [] }
      }
      acc[key].types.push(type)
      return acc
    },
    {} as Record<string, { multiplier: number; types: PokemonType[] }>,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokémon GO Type Chart</h1>
        <p className="text-muted-foreground">
          A complete Pokémon GO type chart, showing how each Pokémon type stacks against all of the other types. Dive
          into our comprehensive Pokémon GO Type Chart to master battles! Discover type strengths, weaknesses, and the
          best counters to gain an edge in every encounter.
        </p>
      </div>

      {/* Type Chart Grid */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid" style={{ gridTemplateColumns: `60px repeat(${POKEMON_TYPES.length}, 60px)` }}>
                {/* Header row */}
                <div className="bg-muted sticky left-0 z-20" />
                {POKEMON_TYPES.map((type) => (
                  <div key={type} className="p-2 flex items-center justify-center bg-muted border-l border-border">
                    <div
                      className={`w-10 h-10 rounded-full ${TYPE_COLORS[type]} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                    >
                      {type.slice(0, 3).toUpperCase()}
                    </div>
                  </div>
                ))}

                {/* Data rows */}
                {POKEMON_TYPES.map((attackerType) => (
                  <>
                    <div
                      key={`${attackerType}-label`}
                      className="p-2 flex items-center justify-center bg-muted sticky left-0 z-10 border-t border-border"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${TYPE_COLORS[attackerType]} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                      >
                        {attackerType.slice(0, 3).toUpperCase()}
                      </div>
                    </div>
                    {POKEMON_TYPES.map((defenderType) => {
                      const multiplier = TYPE_CHART[attackerType][defenderType]
                      const percentage = Math.round(multiplier * 100)
                      return (
                        <div
                          key={`${attackerType}-${defenderType}`}
                          className="p-2 flex items-center justify-center border-l border-t border-border"
                        >
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${getEffectivenessColor(multiplier)}`}
                          >
                            {percentage}%
                          </div>
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate type chart</CardTitle>
          <CardDescription>
            Select two Pokémon types using the dropdowns below. The calculator will show the entire type chart for the
            selected typing combination.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary type</label>
              <Select value={primaryType || undefined} onValueChange={(value) => setPrimaryType(value as PokemonType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary type" />
                </SelectTrigger>
                <SelectContent>
                  {POKEMON_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${TYPE_COLORS[type]}`} />
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary type</label>
              <Select
                value={secondaryType || "none"}
                onValueChange={(value) => setSecondaryType(value === "none" ? null : (value as PokemonType))}
                disabled={!primaryType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {POKEMON_TYPES.filter((t) => t !== primaryType).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${TYPE_COLORS[type]}`} />
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {primaryType && secondaryType && primaryType === secondaryType && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Primary and secondary type have to be different. You can't select the same type twice.
            </p>
          )}

          {primaryType && (
            <div className="space-y-4 pt-4">
              {/* Weaknesses */}
              {weaknesses.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 text-sm font-medium bg-muted/50 px-4 py-3 border-b border-border">
                    <Swords className="w-4 h-4 text-red-500" />
                    <span>takes increased damage from:</span>
                  </div>
                  <div className="divide-y divide-border">
                    {Object.values(groupedWeaknesses).map(({ multiplier, types }, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4 p-4">
                        <Badge variant="destructive" className="text-sm px-3 py-1.5 font-semibold">
                          +{((multiplier - 1) * 100).toFixed(1)}%
                        </Badge>
                        <div className="flex flex-wrap items-center gap-2">
                          {types.map((type) => (
                            <Badge key={type} className={`${TYPE_COLORS[type]} text-white text-sm px-3 py-1.5`}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resistances */}
              {resistances.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 text-sm font-medium bg-muted/50 px-4 py-3 border-b border-border">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>takes reduced damage from:</span>
                  </div>
                  <div className="divide-y divide-border">
                    {Object.values(groupedResistances).map(({ multiplier, types }, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4 p-4">
                        <Badge className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 font-semibold">
                          -{((1 - multiplier) * 100).toFixed(1)}%
                        </Badge>
                        <div className="flex flex-wrap items-center gap-2">
                          {types.map((type) => (
                            <Badge key={type} className={`${TYPE_COLORS[type]} text-white text-sm px-3 py-1.5`}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
