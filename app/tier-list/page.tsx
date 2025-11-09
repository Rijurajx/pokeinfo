import { Suspense } from "react"
import TierListClient from "./tier-list-client"

export const metadata = {
  title: "Best Attackers Tier List | Pokémon GO Database",
  description:
    "Explore our complete tier list of the best and most effective raid Pokémon. This guide will help you understand which Pokémon reign supreme in Pokémon GO.",
}

export default function TierListPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8 text-center">Loading tier list...</div>}>
        <TierListClient />
      </Suspense>
    </div>
  )
}
