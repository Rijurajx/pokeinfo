import { Card } from "@/components/ui/card"

export default function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="p-4 space-y-3 animate-pulse">
        {/* Name and ID */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>

        {/* Types */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-16" />
        </div>

        {/* Stats */}
        <div className="pt-3 border-t border-border/50">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-8 mx-auto" />
              <div className="h-4 bg-muted rounded w-10 mx-auto" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-8 mx-auto" />
              <div className="h-4 bg-muted rounded w-10 mx-auto" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-8 mx-auto" />
              <div className="h-4 bg-muted rounded w-10 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
