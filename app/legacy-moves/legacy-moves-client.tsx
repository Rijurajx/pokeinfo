"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check, X, ArrowUpDown, Search } from "lucide-react"
import type { LegacyMoveData } from "@/lib/fetchers"

const TYPE_COLORS: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-orange-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-cyan-300",
  Fighting: "bg-red-600",
  Poison: "bg-purple-500",
  Ground: "bg-yellow-600",
  Flying: "bg-indigo-400",
  Psychic: "bg-pink-500",
  Bug: "bg-lime-500",
  Rock: "bg-yellow-700",
  Ghost: "bg-purple-700",
  Dragon: "bg-indigo-600",
  Dark: "bg-gray-700",
  Steel: "bg-gray-500",
  Fairy: "bg-pink-300",
}

interface LegacyMovesClientProps {
  legacyMoves: LegacyMoveData[]
}

export default function LegacyMovesClient({ legacyMoves }: LegacyMovesClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<"fast" | "charged" | "tm" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMoves = useMemo(() => {
    if (!searchQuery.trim()) return legacyMoves

    const query = searchQuery.toLowerCase()
    return legacyMoves.filter((move) => {
      const pokemonMatch = move.pokemon_name.toLowerCase().includes(query)
      const fastAttackMatch = move.fast_attack?.toLowerCase().includes(query)
      const chargedAttackMatch = move.charged_attack?.toLowerCase().includes(query)
      return pokemonMatch || fastAttackMatch || chargedAttackMatch
    })
  }, [legacyMoves, searchQuery])

  const sortedMoves = useMemo(() => {
    if (!sortColumn || !sortOrder) return filteredMoves

    return [...filteredMoves].sort((a, b) => {
      if (sortColumn === "fast") {
        const aHasFast = a.fast_attack ? 1 : 0
        const bHasFast = b.fast_attack ? 1 : 0
        return sortOrder === "desc" ? bHasFast - aHasFast : aHasFast - bHasFast
      } else if (sortColumn === "charged") {
        const aHasCharged = a.charged_attack ? 1 : 0
        const bHasCharged = b.charged_attack ? 1 : 0
        return sortOrder === "desc" ? bHasCharged - aHasCharged : aHasCharged - bHasCharged
      } else if (sortColumn === "tm") {
        const aCanTM = a.obtainable_via_tm ? 1 : 0
        const bCanTM = b.obtainable_via_tm ? 1 : 0
        return sortOrder === "desc" ? bCanTM - aCanTM : aCanTM - bCanTM
      }
      return 0
    })
  }, [filteredMoves, sortColumn, sortOrder])

  const totalPages = Math.ceil(sortedMoves.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMoves = sortedMoves.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleColumnSort = (column: "fast" | "charged" | "tm" | null) => {
    if (sortColumn === column) {
      if (sortOrder === "desc") {
        setSortOrder("asc")
      } else if (sortOrder === "asc") {
        setSortColumn(null)
        setSortOrder(null)
      }
    } else {
      setSortColumn(column)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="bg-card border-border">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-3xl font-bold">Legacy Moves in Pokémon GO</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Description Section */}
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              In Pokémon GO, Legacy Moves are special attacks that were once available but have since been removed from
              a Pokémon's current moveset. Most of these moves can no longer be learned through standard evolution or
              normal TMs (Technical Machines). To get these moves, Trainers must use Elite TMs or take advantage of
              special events like Community Days or Raid Days.
            </p>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">How to Get Legacy Moves</h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>
                  Elite TMs are special items that allow Trainers to teach their Pokémon any move, including Legacy
                  Moves. These items are rare and can only be obtained through special events, GO Battle League rewards,
                  or by reaching Rank 7 in the GO Battle League.
                </li>
                <li>
                  During special events like Community Days or Raid Days, Niantic may bring back certain Legacy Moves
                  for a limited time. Trainers can take advantage of these events to teach their Pokémon these moves.
                </li>
                <li>
                  Some Legacy Moves are no longer available in Pokémon GO, even with Elite TMs or special events. These
                  moves are considered extremely rare and valuable among Trainers.
                </li>
              </ul>
            </div>
          </div>

          {/* Legacy Moves List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Legacy Moves List</h2>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Pokémon or moves..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-2 sm:p-4 font-semibold min-w-[180px] sm:min-w-[200px]">Pokémon</th>
                    <th
                      className="text-left p-2 sm:p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors min-w-[140px] sm:min-w-[160px]"
                      onClick={() => handleColumnSort("fast")}
                    >
                      <div className="flex items-center gap-2">
                        Fast Attack
                        {sortColumn === "fast" && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                    <th
                      className="text-left p-2 sm:p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors min-w-[140px] sm:min-w-[160px]"
                      onClick={() => handleColumnSort("charged")}
                    >
                      <div className="flex items-center gap-2">
                        Charged Attack
                        {sortColumn === "charged" && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                    <th
                      className="text-center p-2 sm:p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleColumnSort("tm")}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="hidden sm:inline">Can be obtained via TM</span>
                        <span className="sm:hidden">Via TM</span>
                        {sortColumn === "tm" && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentMoves.map((move, index) => (
                    <tr
                      key={`${move.pokemon_id}-${move.fast_attack}-${move.charged_attack}-${index}`}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      {/* Pokémon Column */}
                      <td className="p-2 sm:p-4">
                        <Link
                          href={`/pokemon/${move.pokemon_id}`}
                          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${move.pokemon_id}.png`}
                            alt={move.pokemon_name}
                            width={40}
                            height={40}
                            className="pixelated sm:w-12 sm:h-12 flex-shrink-0"
                          />
                          <span className="font-medium text-sm sm:text-base truncate">{move.pokemon_name}</span>
                        </Link>
                      </td>

                      {/* Fast Attack Column */}
                      <td className="p-2 sm:p-4">
                        {move.fast_attack ? (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 ${
                                TYPE_COLORS[move.fast_attack_type || "Normal"]
                              }`}
                            />
                            <span className="text-sm sm:text-base truncate">{move.fast_attack}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Charged Attack Column */}
                      <td className="p-2 sm:p-4">
                        {move.charged_attack ? (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 ${
                                TYPE_COLORS[move.charged_attack_type || "Normal"]
                              }`}
                            />
                            <span className="text-sm sm:text-base truncate">{move.charged_attack}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* TM Availability Column */}
                      <td className="p-2 sm:p-4 text-center">
                        <div className="flex justify-center">
                          {move.obtainable_via_tm ? (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded flex items-center justify-center">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded flex items-center justify-center">
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Show</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-4">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
