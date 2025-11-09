"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, ArrowUp, ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Pokemon, PokemonMoves, FastMove, ChargedMove, PokemonType } from "@/lib/fetchers"
import { getCPMultiplier } from "@/lib/cpm-table"

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

const WEATHER_TYPES: Record<string, string[]> = {
  Sunny: ["fire", "grass", "ground"],
  Rainy: ["water", "electric", "bug"],
  Snow: ["ice", "steel"],
  Fog: ["dark", "ghost"],
  "Partly Cloudy": ["normal", "rock"],
  Windy: ["dragon", "flying", "psychic"],
  Cloudy: ["fairy", "fighting", "poison"],
  Clear: [],
}

interface ComparisonEntry {
  id: string
  pokemon: Pokemon
  fastMove: FastMove
  chargedMove: ChargedMove
  dps: number
  tdo: number
  score: number
  weather: string
  level: number
}

type SortColumn = "dps" | "tdo" | "score" | null
type SortOrder = "asc" | "desc" | null

interface DpsTdoComparerClientProps {
  pokemonStats: Pokemon[]
  pokemonMoves: PokemonMoves[]
  fastMoves: FastMove[]
  chargedMoves: ChargedMove[]
  pokemonTypes: PokemonType[]
}

export default function DpsTdoComparerClient({
  pokemonStats,
  pokemonMoves,
  fastMoves,
  chargedMoves,
  pokemonTypes,
}: DpsTdoComparerClientProps) {
  const [comparisons, setComparisons] = useState<ComparisonEntry[]>([])
  const [weather, setWeather] = useState("Clear")
  const [level, setLevel] = useState(40)

  // Bulk add state
  const [bulkSearchQuery, setBulkSearchQuery] = useState("")
  const [bulkSelectedPokemon, setBulkSelectedPokemon] = useState<Pokemon | null>(null)

  // Manual entry state
  const [manualSearchQuery, setManualSearchQuery] = useState("")
  const [manualSelectedPokemon, setManualSelectedPokemon] = useState<Pokemon | null>(null)
  const [selectedFastMove, setSelectedFastMove] = useState<string>("")
  const [selectedChargedMove, setSelectedChargedMove] = useState<string>("")

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  // Create type map for STAB calculation
  const typeMap = useMemo(() => {
    const map = new Map<string, { type_1: string; type_2?: string }>()
    for (const typeData of pokemonTypes) {
      if (typeData.pokemon_id && typeData.type && Array.isArray(typeData.type)) {
        const types = typeData.type
        const form = typeData.form || "Normal"
        const key = `${typeData.pokemon_id}-${form}`
        map.set(key, {
          type_1: types[0] || "Normal",
          type_2: types[1],
        })
      }
    }
    return map
  }, [pokemonTypes])

  // Calculate DPS and TDO
  const calculateStats = (
    pokemon: Pokemon,
    fastMove: FastMove,
    chargedMove: ChargedMove,
    weather: string,
    level: number,
  ) => {
    const form = pokemon.form || "Normal"
    const key = `${pokemon.pokemon_id}-${form}`
    const types = typeMap.get(key) || typeMap.get(`${pokemon.pokemon_id}-Normal`) || { type_1: "Normal" }

    // Get CPM for the level
    const cpm = getCPMultiplier(level)

    // Use base stats for attack (no IVs)
    const attackScaled = pokemon.base_attack * cpm

    // Use fixed defender defense baseline (150)
    const defenderDefense = 150

    // STAB calculation (1.2 if move type matches Pokémon type)
    const fastStab =
      fastMove.type.toLowerCase() === types.type_1.toLowerCase() ||
      fastMove.type.toLowerCase() === types.type_2?.toLowerCase()
        ? 1.2
        : 1.0
    const chargedStab =
      chargedMove.type.toLowerCase() === types.type_1.toLowerCase() ||
      chargedMove.type.toLowerCase() === types.type_2?.toLowerCase()
        ? 1.2
        : 1.0

    // Weather bonus (1.2 if weather boosts that move type)
    const weatherBoostedTypes = WEATHER_TYPES[weather] || []
    const fastWeatherBonus = weatherBoostedTypes.includes(fastMove.type.toLowerCase()) ? 1.2 : 1.0
    const chargedWeatherBonus = weatherBoostedTypes.includes(chargedMove.type.toLowerCase()) ? 1.2 : 1.0

    // Damage formula: 0.5 * Power * (Attack / DefenderDefense) * STAB * Weather
    const fastMoveDamage = 0.5 * fastMove.power * (attackScaled / defenderDefense) * fastStab * fastWeatherBonus

    const chargedMoveDamage =
      0.5 * chargedMove.power * (attackScaled / defenderDefense) * chargedStab * chargedWeatherBonus

    // Convert move durations from milliseconds to seconds
    const fastDuration = fastMove.duration / 1000
    const chargedDuration = chargedMove.duration / 1000

    // Calculate how many fast moves needed to charge the charged move
    const energyNeeded = Math.abs(chargedMove.energy_delta)
    const fastMoveEnergyGain = fastMove.energy_delta
    const nFast = Math.ceil(energyNeeded / fastMoveEnergyGain)

    // Cycle damage and time
    const cycleDamage = fastMoveDamage * nFast + chargedMoveDamage
    const cycleTime = fastDuration * nFast + chargedDuration

    // DPS = total damage per cycle / time per cycle
    const dps = cycleDamage / cycleTime

    // TDO formula: DPS * base_stamina * CPM / defender_factor
    // Using defender_factor = 14 based on validation cases
    const tdo = (dps * pokemon.base_stamina * cpm) / 14

    // Score calculation
    const score = (dps * tdo) / 100

    console.log("[v0] Calculation for", pokemon.pokemon_name, {
      level,
      weather,
      cpm,
      baseAttack: pokemon.base_attack,
      attackScaled,
      defenderDefense,
      fastMove: fastMove.name,
      fastPower: fastMove.power,
      fastDuration,
      fastEnergy: fastMove.energy_delta,
      fastStab,
      fastWeatherBonus,
      fastMoveDamage,
      chargedMove: chargedMove.name,
      chargedPower: chargedMove.power,
      chargedDuration,
      chargedEnergy: chargedMove.energy_delta,
      chargedStab,
      chargedWeatherBonus,
      chargedMoveDamage,
      nFast,
      cycleDamage,
      cycleTime,
      dps,
      baseStamina: pokemon.base_stamina,
      tdo,
      score,
    })

    return {
      dps: Number(dps.toFixed(2)),
      tdo: Number(tdo.toFixed(2)),
      score: Number(score.toFixed(2)),
    }
  }

  // Filter Pokémon for bulk search
  const filteredBulkPokemon = useMemo(() => {
    if (!bulkSearchQuery) return []
    const query = bulkSearchQuery.toLowerCase()
    return pokemonStats
      .filter((p) => p.pokemon_name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aName = a.pokemon_name.toLowerCase()
        const bName = b.pokemon_name.toLowerCase()
        const aStarts = aName.startsWith(query)
        const bStarts = bName.startsWith(query)

        // Prioritize names that start with the query
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1

        // If both start or both don't start, sort alphabetically
        return aName.localeCompare(bName)
      })
      .slice(0, 10)
  }, [bulkSearchQuery, pokemonStats])

  // Filter Pokémon for manual search
  const filteredManualPokemon = useMemo(() => {
    if (!manualSearchQuery) return []
    const query = manualSearchQuery.toLowerCase()
    return pokemonStats
      .filter((p) => p.pokemon_name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aName = a.pokemon_name.toLowerCase()
        const bName = b.pokemon_name.toLowerCase()
        const aStarts = aName.startsWith(query)
        const bStarts = bName.startsWith(query)

        // Prioritize names that start with the query
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1

        // If both start or both don't start, sort alphabetically
        return aName.localeCompare(bName)
      })
      .slice(0, 10)
  }, [manualSearchQuery, pokemonStats])

  // Get available moves for selected Pokémon
  const availableMoves = useMemo(() => {
    if (!manualSelectedPokemon) return { fast: [], charged: [] }

    const moves = pokemonMoves.find((m) => m.pokemon_id === manualSelectedPokemon.pokemon_id)
    if (!moves) return { fast: [], charged: [] }

    const fast = fastMoves.filter((fm) => moves.fast_moves.includes(fm.name))
    const charged = chargedMoves.filter((cm) => moves.charged_moves.includes(cm.name))

    return { fast, charged }
  }, [manualSelectedPokemon, pokemonMoves, fastMoves, chargedMoves])

  // Handle bulk add
  const handleBulkAdd = () => {
    if (!bulkSelectedPokemon) return

    const moves = pokemonMoves.find((m) => m.pokemon_id === bulkSelectedPokemon.pokemon_id)
    if (!moves) return

    const newEntries: ComparisonEntry[] = []

    for (const fastMoveName of moves.fast_moves) {
      for (const chargedMoveName of moves.charged_moves) {
        const fastMove = fastMoves.find((fm) => fm.name === fastMoveName)
        const chargedMove = chargedMoves.find((cm) => cm.name === chargedMoveName)

        if (fastMove && chargedMove) {
          const stats = calculateStats(bulkSelectedPokemon, fastMove, chargedMove, weather, level)
          newEntries.push({
            id: `${bulkSelectedPokemon.pokemon_id}-${fastMoveName}-${chargedMoveName}-${Date.now()}`,
            pokemon: bulkSelectedPokemon,
            fastMove,
            chargedMove,
            ...stats,
            weather,
            level,
          })
        }
      }
    }

    setComparisons([...comparisons, ...newEntries])
    setBulkSearchQuery("")
    setBulkSelectedPokemon(null)
  }

  // Handle manual add
  const handleManualAdd = () => {
    if (!manualSelectedPokemon || !selectedFastMove || !selectedChargedMove) return

    const fastMove = fastMoves.find((fm) => fm.name === selectedFastMove)
    const chargedMove = chargedMoves.find((cm) => cm.name === selectedChargedMove)

    if (!fastMove || !chargedMove) return

    const stats = calculateStats(manualSelectedPokemon, fastMove, chargedMove, weather, level)

    setComparisons([
      ...comparisons,
      {
        id: `${manualSelectedPokemon.pokemon_id}-${selectedFastMove}-${selectedChargedMove}-${Date.now()}`,
        pokemon: manualSelectedPokemon,
        fastMove,
        chargedMove,
        ...stats,
        weather,
        level,
      },
    ])

    setManualSearchQuery("")
    setManualSelectedPokemon(null)
    setSelectedFastMove("")
    setSelectedChargedMove("")
  }

  // Handle sorting
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortOrder === "desc") {
        setSortOrder("asc")
      } else if (sortOrder === "asc") {
        setSortColumn(null)
        setSortOrder(null)
      } else {
        setSortOrder("desc")
      }
    } else {
      setSortColumn(column)
      setSortOrder("desc")
    }
  }

  // Sort comparisons
  const sortedComparisons = useMemo(() => {
    if (!sortColumn || !sortOrder) return comparisons

    return [...comparisons].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal
    })
  }, [comparisons, sortColumn, sortOrder])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Pokémon DPS and TDO Comparer</h1>
              <p className="text-muted-foreground">
                Compare side-by-side any number of Pokémon in Pokémon GO to evaluate their DPS, TDO and overall score
                with any imaginable move set. A perfect resource for players looking to understand the best movesets for
                their Pokémon and make informed decisions for gameplay and strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Add to comparison section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Add to comparison</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel - Bulk add / Manual entry */}
            <div className="space-y-4">
              <Tabs defaultValue="bulk" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="bulk">Bulk add</TabsTrigger>
                  <TabsTrigger value="manual">Manual entry</TabsTrigger>
                </TabsList>

                <TabsContent value="bulk" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Add a Pokémon with all moves
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Search Pokémon"
                        value={bulkSearchQuery}
                        onChange={(e) => {
                          setBulkSearchQuery(e.target.value)
                          setBulkSelectedPokemon(null)
                        }}
                        className="bg-muted border-border"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      {bulkSearchQuery && filteredBulkPokemon.length > 0 && !bulkSelectedPokemon && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredBulkPokemon.map((pokemon) => (
                            <button
                              key={pokemon.pokemon_id}
                              onClick={() => {
                                setBulkSelectedPokemon(pokemon)
                                setBulkSearchQuery(pokemon.pokemon_name)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                            >
                              <Image
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
                                alt={pokemon.pokemon_name}
                                width={32}
                                height={32}
                              />
                              <span className="text-foreground">{pokemon.pokemon_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleBulkAdd}
                    disabled={!bulkSelectedPokemon}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground"
                  >
                    Add to comparison
                  </Button>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select a Pokémon for comparison
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Search Pokémon"
                        value={manualSearchQuery}
                        onChange={(e) => {
                          setManualSearchQuery(e.target.value)
                          setManualSelectedPokemon(null)
                          setSelectedFastMove("")
                          setSelectedChargedMove("")
                        }}
                        className="bg-muted border-border"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      {manualSearchQuery && filteredManualPokemon.length > 0 && !manualSelectedPokemon && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredManualPokemon.map((pokemon) => (
                            <button
                              key={pokemon.pokemon_id}
                              onClick={() => {
                                setManualSelectedPokemon(pokemon)
                                setManualSearchQuery(pokemon.pokemon_name)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                            >
                              <Image
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
                                alt={pokemon.pokemon_name}
                                width={32}
                                height={32}
                              />
                              <span className="text-foreground">{pokemon.pokemon_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Fast Move</label>
                    <Select
                      value={selectedFastMove}
                      onValueChange={setSelectedFastMove}
                      disabled={!manualSelectedPokemon}
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select fast move" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMoves.fast.map((move) => (
                          <SelectItem key={move.move_id} value={move.name}>
                            {move.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Charge Move</label>
                    <Select
                      value={selectedChargedMove}
                      onValueChange={setSelectedChargedMove}
                      disabled={!manualSelectedPokemon}
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select charge move" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMoves.charged.map((move) => (
                          <SelectItem key={move.move_id} value={move.name}>
                            {move.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleManualAdd}
                    disabled={!manualSelectedPokemon || !selectedFastMove || !selectedChargedMove}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Add to comparison
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right panel - General settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">General settings</h3>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Weather</label>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Sunny">Sunny</SelectItem>
                    <SelectItem value="Rainy">Rainy</SelectItem>
                    <SelectItem value="Snow">Snow</SelectItem>
                    <SelectItem value="Fog">Fog</SelectItem>
                    <SelectItem value="Partly Cloudy">Partly Cloudy</SelectItem>
                    <SelectItem value="Windy">Windy</SelectItem>
                    <SelectItem value="Cloudy">Cloudy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Attacker level</label>
                <Select value={String(level)} onValueChange={(v) => setLevel(Number(v))}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((lvl) => (
                      <SelectItem key={lvl} value={String(lvl)}>
                        Level {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison results */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Comparison results</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Pokémon</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Fast Attack</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Charged Attack</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    <button onClick={() => handleSort("dps")} className="flex items-center gap-1 hover:text-primary">
                      DPS
                      {sortColumn === "dps" &&
                        (sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    <button onClick={() => handleSort("tdo")} className="flex items-center gap-1 hover:text-primary">
                      TDO
                      {sortColumn === "tdo" &&
                        (sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    <button onClick={() => handleSort("score")} className="flex items-center gap-1 hover:text-primary">
                      Score
                      {sortColumn === "score" &&
                        (sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Weather</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">LVL</th>
                </tr>
              </thead>
              <tbody>
                {sortedComparisons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      No comparisons yet. Add Pokémon to start comparing.
                    </td>
                  </tr>
                ) : (
                  sortedComparisons.map((entry) => (
                    <tr key={entry.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.pokemon.pokemon_id}.png`}
                            alt={entry.pokemon.pokemon_name}
                            width={40}
                            height={40}
                            className="flex-shrink-0"
                          />
                          <span className="text-foreground font-medium truncate">{entry.pokemon.pokemon_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${TYPE_COLORS[entry.fastMove.type.toLowerCase()]} flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-xs text-white font-bold">{entry.fastMove.type[0]}</span>
                          </div>
                          <span className="text-foreground text-sm">{entry.fastMove.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${TYPE_COLORS[entry.chargedMove.type.toLowerCase()]} flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-xs text-white font-bold">{entry.chargedMove.type[0]}</span>
                          </div>
                          <span className="text-foreground text-sm">{entry.chargedMove.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground font-semibold">{entry.dps}</td>
                      <td className="p-4 text-foreground font-semibold">{entry.tdo}</td>
                      <td className="p-4 text-foreground font-semibold">{entry.score}</td>
                      <td className="p-4 text-foreground">{entry.weather}</td>
                      <td className="p-4 text-foreground">{entry.level}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
