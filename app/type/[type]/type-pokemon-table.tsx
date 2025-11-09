"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { TYPE_COLORS } from "@/lib/type-colors"

interface PokemonWithCP {
  pokemon_id: string
  pokemon_name: string
  form: string
  type_1: string
  type_2?: string
  base_attack: number
  base_defense: number
  base_stamina: number
  maxCP: number
  region: string
  generation: number
}

interface TypePokemonTableProps {
  pokemon: PokemonWithCP[]
  type: string
}

export default function TypePokemonTable({ pokemon, type }: TypePokemonTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<"maxCP" | "base_attack" | "base_defense" | "base_stamina" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const sortedPokemon = useMemo(() => {
    if (!sortColumn) return pokemon

    return [...pokemon].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (sortDirection === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [pokemon, sortColumn, sortDirection])

  const totalPages = Math.ceil(sortedPokemon.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPokemon = sortedPokemon.slice(startIndex, endIndex)

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))

  const handleSort = (column: "maxCP" | "base_attack" | "base_defense" | "base_stamina") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const renderSortIcon = (column: "maxCP" | "base_attack" | "base_defense" | "base_stamina") => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} className="opacity-50" />
    }
    return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-0">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Region</th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/50 transition-colors select-none"
                  onClick={() => handleSort("maxCP")}
                >
                  <div className="flex items-center gap-2">
                    Max CP
                    {renderSortIcon("maxCP")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/50 transition-colors select-none"
                  onClick={() => handleSort("base_attack")}
                >
                  <div className="flex items-center gap-2">
                    Attack
                    {renderSortIcon("base_attack")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/50 transition-colors select-none"
                  onClick={() => handleSort("base_defense")}
                >
                  <div className="flex items-center gap-2">
                    Defense
                    {renderSortIcon("base_defense")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/50 transition-colors select-none"
                  onClick={() => handleSort("base_stamina")}
                >
                  <div className="flex items-center gap-2">
                    Stamina
                    {renderSortIcon("base_stamina")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPokemon.map((p, index) => {
                const type1Colors = TYPE_COLORS[p.type_1.toLowerCase() as keyof typeof TYPE_COLORS]
                const type2Colors = p.type_2 ? TYPE_COLORS[p.type_2.toLowerCase() as keyof typeof TYPE_COLORS] : null

                return (
                  <tr
                    key={`${p.pokemon_id}-${p.form}-${index}`}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-medium">{p.pokemon_id}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/pokemon/${p.pokemon_id}`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.pokemon_id}.png`}
                            alt={p.pokemon_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {p.pokemon_name}
                            {p.form && p.form !== "Normal" && (
                              <span className="text-xs text-muted-foreground ml-2">({p.form})</span>
                            )}
                          </div>
                          <div className="flex gap-1 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${type1Colors.bg} ${type1Colors.text} border ${type1Colors.border}`}
                            >
                              {p.type_1}
                            </span>
                            {p.type_2 && type2Colors && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${type2Colors.bg} ${type2Colors.text} border ${type2Colors.border}`}
                              >
                                {p.type_2}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{p.region}</div>
                        <div className="text-xs text-muted-foreground">Generation {p.generation}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-green-400">{p.maxCP} CP</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-blue-400">{p.base_attack} ATK</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-yellow-400">{p.base_defense} DEF</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-pink-400">{p.base_stamina} HP</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-8 w-8 bg-transparent"
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 bg-transparent"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 bg-transparent"
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 bg-transparent"
            >
              <ChevronsRight size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Show 10</SelectItem>
                <SelectItem value="25">Show 25</SelectItem>
                <SelectItem value="50">Show 50</SelectItem>
                <SelectItem value="100">Show 100</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, sortedPokemon.length)} of {sortedPokemon.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
