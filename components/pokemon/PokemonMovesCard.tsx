import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { PokemonMoves } from "@/lib/fetchers"
import { Zap, Flame } from "lucide-react"

interface PokemonMovesCardProps {
  moves: PokemonMoves
}

export default function PokemonMovesCard({ moves }: PokemonMovesCardProps) {
  return (
    <Card className="p-6 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Moves</h2>

      <Tabs defaultValue="fast" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fast" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Fast Moves
          </TabsTrigger>
          <TabsTrigger value="charged" className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Charged Moves
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fast" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Available Fast Moves
            </h3>
            <div className="flex flex-wrap gap-2">
              {moves.fast_moves && moves.fast_moves.length > 0 ? (
                moves.fast_moves.map((move, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {move}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No fast moves available</p>
              )}
            </div>
          </div>

          {moves.elite_fast_moves && moves.elite_fast_moves.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Elite Fast Moves</h3>
              <div className="flex flex-wrap gap-2">
                {moves.elite_fast_moves.map((move, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1.5 px-3 border-amber-500 text-amber-500">
                    {move}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charged" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Available Charged Moves
            </h3>
            <div className="flex flex-wrap gap-2">
              {moves.charged_moves && moves.charged_moves.length > 0 ? (
                moves.charged_moves.map((move, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {move}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No charged moves available</p>
              )}
            </div>
          </div>

          {moves.elite_charged_moves && moves.elite_charged_moves.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Elite Charged Moves</h3>
              <div className="flex flex-wrap gap-2">
                {moves.elite_charged_moves.map((move, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1.5 px-3 border-amber-500 text-amber-500">
                    {move}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
