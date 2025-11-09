import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import type { PokeAPIEvolutionChain } from "@/lib/fetchers"
import { ArrowRight } from "lucide-react"

interface PokemonEvolutionProps {
  evolutionChain: PokeAPIEvolutionChain
}

interface EvolutionStage {
  name: string
  id: number
  trigger?: string
  level?: number
  item?: string
}

function extractEvolutions(chain: PokeAPIEvolutionChain["chain"]): EvolutionStage[][] {
  const stages: EvolutionStage[][] = []

  function traverse(node: any, depth: number) {
    if (!stages[depth]) {
      stages[depth] = []
    }

    const id = Number.parseInt(node.species.url.split("/").slice(-2, -1)[0])
    const evolution: EvolutionStage = {
      name: node.species.name,
      id,
    }

    if (node.evolution_details && node.evolution_details[0]) {
      const details = node.evolution_details[0]
      evolution.trigger = details.trigger.name
      evolution.level = details.min_level
      evolution.item = details.item?.name
    }

    stages[depth].push(evolution)

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((evo: any) => traverse(evo, depth + 1))
    }
  }

  traverse(chain, 0)
  return stages
}

export default function PokemonEvolution({ evolutionChain }: PokemonEvolutionProps) {
  const stages = extractEvolutions(evolutionChain.chain)

  if (stages.length <= 1) {
    return null
  }

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Evolution Chain</h2>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="flex items-center gap-4">
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.id} className="flex items-center gap-4">
                <Link
                  href={`/pokemon/${pokemon.id}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card/50 hover:bg-accent transition-colors"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                      alt={pokemon.name}
                      width={96}
                      height={96}
                      className="object-contain group-hover:scale-110 transition-transform"
                      unoptimized
                    />
                  </div>
                  <p className="text-sm font-medium capitalize text-foreground">{pokemon.name}</p>
                  <p className="text-xs text-muted-foreground">#{String(pokemon.id).padStart(3, "0")}</p>
                </Link>

                {pokemonIndex < stage.length - 1 && <ArrowRight className="w-6 h-6 text-muted-foreground" />}
              </div>
            ))}

            {stageIndex < stages.length - 1 && (
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-6 h-6 text-primary" />
                {stages[stageIndex + 1][0].level && (
                  <span className="text-xs text-muted-foreground">Lv. {stages[stageIndex + 1][0].level}</span>
                )}
                {stages[stageIndex + 1][0].item && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {stages[stageIndex + 1][0].item.replace("-", " ")}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
