"use client"

import { useEffect, useState } from "react"
import { fetchChargedMoves } from "@/lib/fetchers"
import { MoveTable } from "@/components/moves/MoveTable"
import { TYPE_COLORS } from "@/lib/type-colors"

export default function ChargedMovesPage() {
  const [moves, setMoves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChargedMoves().then((data) => {
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
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (value: number) => `${(value / 1000).toFixed(1)}s`,
    },
    {
      key: "dps",
      label: "DPS",
      sortable: true,
      render: (_: any, row: any) => {
        const dps = (row.power / (row.duration / 1000)).toFixed(2)
        return dps
      },
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
          title="Charge Attacks in Gym and Raid Battles"
          description="A list of all Charge attacks in Pokémon GO with their Gym and Raid Battle stats. Unleash devastating power! Dive into our comprehensive guide on Pokémon GO Charge Attacks for Gym and Raid Battles."
        />
      </div>
    </div>
  )
}
