"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"

const TYPE_COLORS: Record<string, string> = {
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

interface PokemonWithDistance {
  pokemon_id: number
  pokemon_name: string
  form: string
  distance: number
  type_1: string
  type_2?: string
  base_attack: number
  base_defense: number
  base_stamina: number
  maxCP: number
}

interface BuddyDistanceClientProps {
  pokemonData: PokemonWithDistance[]
}

type SortOrder = "none" | "desc" | "asc"
type SortColumn = "maxCP" | "attack" | "defense" | "stamina" | null

function BuddyDistanceTable({ pokemon, distance }: { pokemon: PokemonWithDistance[]; distance: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("none")

  const sortedPokemon = useMemo(() => {
    if (sortColumn === null || sortOrder === "none") {
      return pokemon
    }

    const sorted = [...pokemon].sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortColumn) {
        case "maxCP":
          aValue = a.maxCP
          bValue = b.maxCP
          break
        case "attack":
          aValue = a.base_attack
          bValue = b.base_attack
          break
        case "defense":
          aValue = a.base_defense
          bValue = b.base_defense
          break
        case "stamina":
          aValue = a.base_stamina
          bValue = b.base_stamina
          break
        default:
          return 0
      }

      if (sortOrder === "desc") {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })

    return sorted
  }, [pokemon, sortColumn, sortOrder])

  const totalPages = Math.ceil(sortedPokemon.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPokemon = sortedPokemon.slice(startIndex, endIndex)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: desc -> asc -> none
      if (sortOrder === "desc") {
        setSortOrder("asc")
      } else if (sortOrder === "asc") {
        setSortOrder("none")
        setSortColumn(null)
      }
    } else {
      // New column, start with desc
      setSortColumn(column)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline" />
    }
    if (sortOrder === "desc") {
      return <ArrowDown className="h-4 w-4 ml-1 inline" />
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1 inline" />
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 inline" />
  }

  const maxStats = useMemo(() => {
    return {
      maxCP: Math.max(...pokemon.map((p) => p.maxCP)),
      attack: Math.max(...pokemon.map((p) => p.base_attack)),
      defense: Math.max(...pokemon.map((p) => p.base_defense)),
      stamina: Math.max(...pokemon.map((p) => p.base_stamina)),
    }
  }, [pokemon])

  const distanceDescriptions: Record<number, string> = {
    1: "A list of all Pokémon that require 1 km (0.61 miles) walking to earn 1 Candy as a Buddy Pokémon. One kilometer is equivalent to 0.6214 miles.",
    3: "A list of all Pokémon that require 3 km (1.86 miles) walking to earn 1 Candy as a Buddy Pokémon. Three kilometers is equivalent to 1.8641 miles.",
    5: "A list of all Pokémon that require 5 km (3.11 miles) walking to earn 1 Candy as a Buddy Pokémon. Five kilometers is equivalent to 3.1069 miles.",
    20: "A list of all Pokémon that require 20 km (12.43 miles) walking to earn 1 Candy as a Buddy Pokémon. Twenty kilometers is equivalent to 12.4274 miles.",
  }

  const formatPokemonName = (name: string, form: string) => {
    if (form && form !== "Normal" && form !== name) {
      return `${form} ${name}`
    }
    return name
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{distanceDescriptions[distance]}</p>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 md:w-16">#</TableHead>
              <TableHead className="min-w-[200px] md:min-w-[250px]">Name</TableHead>
              <TableHead className="w-28 md:w-32 cursor-pointer hover:bg-muted" onClick={() => handleSort("maxCP")}>
                Max CP{renderSortIcon("maxCP")}
              </TableHead>
              <TableHead className="w-28 md:w-32 cursor-pointer hover:bg-muted" onClick={() => handleSort("attack")}>
                Attack{renderSortIcon("attack")}
              </TableHead>
              <TableHead className="w-28 md:w-32 cursor-pointer hover:bg-muted" onClick={() => handleSort("defense")}>
                Defense{renderSortIcon("defense")}
              </TableHead>
              <TableHead className="w-28 md:w-32 cursor-pointer hover:bg-muted" onClick={() => handleSort("stamina")}>
                Stamina{renderSortIcon("stamina")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPokemon.map((p) => (
              <TableRow key={`${p.pokemon_id}-${p.form}`} className="hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground text-sm">{p.pokemon_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`}
                      alt={p.pokemon_name}
                      width={40}
                      height={40}
                      className="pixelated md:w-12 md:h-12 flex-shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-medium text-sm md:text-base truncate">
                        {formatPokemonName(p.pokemon_name, p.form)}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        <Badge
                          className={`${TYPE_COLORS[p.type_1]} text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 whitespace-nowrap`}
                        >
                          {p.type_1}
                        </Badge>
                        {p.type_2 && (
                          <Badge
                            className={`${TYPE_COLORS[p.type_2]} text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 whitespace-nowrap`}
                          >
                            {p.type_2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-green-500 font-semibold text-xs md:text-sm whitespace-nowrap">
                      {p.maxCP} CP
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(p.maxCP / maxStats.maxCP) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-blue-500 font-semibold text-xs md:text-sm whitespace-nowrap">
                      {p.base_attack} ATK
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(p.base_attack / maxStats.attack) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-yellow-500 font-semibold text-xs md:text-sm whitespace-nowrap">
                      {p.base_defense} DEF
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: `${(p.base_defense / maxStats.defense) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-pink-500 font-semibold text-xs md:text-sm whitespace-nowrap">
                      {p.base_stamina} HP
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-pink-500 h-1.5 rounded-full"
                        style={{ width: `${(p.base_stamina / maxStats.stamina) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              setItemsPerPage(Number(v))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="25">Show 25</SelectItem>
              <SelectItem value="50">Show 50</SelectItem>
              <SelectItem value="100">Show 100</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  )
}

export function BuddyDistanceClient({ pokemonData }: BuddyDistanceClientProps) {
  const searchParams = useSearchParams()
  const distanceParam = searchParams.get("distance")
  const [activeTab, setActiveTab] = useState(distanceParam || "1")

  useEffect(() => {
    if (distanceParam) {
      setActiveTab(distanceParam)
    }
  }, [distanceParam])

  const pokemonByDistance = useMemo(() => {
    return {
      1: pokemonData.filter((p) => p.distance === 1).sort((a, b) => a.pokemon_id - b.pokemon_id),
      3: pokemonData.filter((p) => p.distance === 3).sort((a, b) => a.pokemon_id - b.pokemon_id),
      5: pokemonData.filter((p) => p.distance === 5).sort((a, b) => a.pokemon_id - b.pokemon_id),
      20: pokemonData.filter((p) => p.distance === 20).sort((a, b) => a.pokemon_id - b.pokemon_id),
    }
  }, [pokemonData])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Buddy Distance</h1>
        <p className="text-muted-foreground">
          Browse Pokémon organized by their buddy distance requirements to earn candy
        </p>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto gap-2">
            <TabsTrigger value="1" className="text-sm md:text-base">
              1 km ({pokemonByDistance[1].length})
            </TabsTrigger>
            <TabsTrigger value="3" className="text-sm md:text-base">
              3 km ({pokemonByDistance[3].length})
            </TabsTrigger>
            <TabsTrigger value="5" className="text-sm md:text-base">
              5 km ({pokemonByDistance[5].length})
            </TabsTrigger>
            <TabsTrigger value="20" className="text-sm md:text-base">
              20 km ({pokemonByDistance[20].length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1 km Buddy Pokémon List</h2>
              <BuddyDistanceTable pokemon={pokemonByDistance[1]} distance={1} />
            </div>
          </TabsContent>

          <TabsContent value="3">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3 km Buddy Pokémon List</h2>
              <BuddyDistanceTable pokemon={pokemonByDistance[3]} distance={3} />
            </div>
          </TabsContent>

          <TabsContent value="5">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">5 km Buddy Pokémon List</h2>
              <BuddyDistanceTable pokemon={pokemonByDistance[5]} distance={5} />
            </div>
          </TabsContent>

          <TabsContent value="20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">20 km Buddy Pokémon List</h2>
              <BuddyDistanceTable pokemon={pokemonByDistance[20]} distance={20} />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
