"use client"

import { useEffect, useState } from "react"
import { fetchPvPChargedMoves } from "@/lib/fetchers"
import { MoveTable } from "@/components/moves/MoveTable"
import { TYPE_COLORS } from "@/lib/type-colors"

export default function PvPChargedMovesPage() {
  const [moves, setMoves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPvPChargedMoves().then((data) => {
      setMoves(data)
      setLoading(false)
    })
  }, [])

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: string, row: any) => {
        const type = row.type.toLowerCase()
        const colors = TYPE_COLORS[type as keyof typeof TYPE_COLORS]
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full ${colors?.bg || "bg-gray-500/20"}`}
              style={{
                boxShadow: `0 0 10px ${colors?.glow || "rgba(156, 163, 175, 0.3)"}`,
              }}
            />
            <span className="font-medium">{value}</span>
          </div>
        )
      },
    },
    {
      key: "power",
      label: "PWR",
      sortable: true,
    },
    {
      key: "energy_delta",
      label: "ENG",
      sortable: true,
      render: (value: number) => Math.abs(value),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <MoveTable
          moves={moves}
          columns={columns}
          title="Charge Attacks in Trainer Battles"
          description="A list of all Charge attacks in Pokémon GO with their Trainer Battle (PvP) stats. Crush your opponents! Explore our detailed breakdown of Pokémon GO Charge Attacks for Trainer Battles and rise to the top."
        />
      </div>
    </div>
  )
}
