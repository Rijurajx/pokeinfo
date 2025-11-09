import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function PerfectIVOddsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Perfect IV (Hundo) Odds in Pokémon GO</h1>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Here are all the odds to get a perfect IV Pokémon in Pokémon GO, including IV floors for each method of
              obtaining a Pokémon. Perfect Pokémon are Pokémon that have 15/15/15 IVs, and they are commonly referred to
              as Hundos. A hundo guarantees the Pokémon reaches 100% of its potential IV values. You can check your IV
              values using the in-game appraisal system or external IV calculators.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wild Catch Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🌿</span> Wild Catch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Wild Catch</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Wild Catch
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Weather Boosted
                  </Badge>
                </TableCell>
                <TableCell>1 / 1728</TableCell>
                <TableCell>0.058%</TableCell>
                <TableCell>4/4/4</TableCell>
                <TableCell>28.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Wild catches include Pokémon caught in the wild, from Incense, and from Lures.
          </div>
        </CardContent>
      </Card>

      {/* Research Task Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">📋</span> Research Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Field Research</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Party Play Reward</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Referral Reward</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Special Research</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Timed Research</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Research tasks include Field Research, Special Research, and Timed Research, but also the special Referral
            and Party Play rewards. These encounters cannot be weather boosted.
          </div>
        </CardContent>
      </Card>

      {/* Egg Hatch Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🥚</span> Egg Hatch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">All Egg Hatches</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Egg hatches include Pokémon hatched from Eggs, regardless of the distance required to hatch. Pokémon hatched
            from eggs are always Level 20 and have an IV floor of 10/10/10.
          </div>
        </CardContent>
      </Card>

      {/* Raid Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">⚔️</span> Raid
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Raid Catch</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Raid Catch
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Weather Boosted
                  </Badge>
                </TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Raid encounters include Pokémon caught from Raid Battles, including Legendary Raids, Mega Raids, and
            Dynamax. Non-Shadow Raid Bosses have a 10/10/10 IV floor, while Shadow Raid Bosses have a 10/10/10 IV floor.
          </div>
        </CardContent>
      </Card>

      {/* GO Battle League Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🏆</span> GO Battle League
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Reward</TableCell>
                <TableCell>1 / 216</TableCell>
                <TableCell>0.463%</TableCell>
                <TableCell>10/10/10</TableCell>
                <TableCell>66.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GO Battle Day</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GO Battle Weekend</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GO Battle Week</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            GO Battle League encounters include Pokémon caught from GBL rewards, including the end-of-season rewards,
            GBL rank encounters, and special GO Battle day/weekend encounters. Interestingly, GO Battle day/weekend/week
            encounters have their IV floor removed for legendary and mythical encounters, giving you a chance of optimal
            PvP IVs.
          </div>
        </CardContent>
      </Card>

      {/* Team GO Rocket Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🚀</span> Team GO Rocket
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Grunts and Leaders</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Grunts and Leaders
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Weather Boosted
                  </Badge>
                </TableCell>
                <TableCell>1 / 1728</TableCell>
                <TableCell>0.058%</TableCell>
                <TableCell>4/4/4</TableCell>
                <TableCell>28.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Giovanni</TableCell>
                <TableCell>1 / 1000</TableCell>
                <TableCell>0.100%</TableCell>
                <TableCell>6/6/6</TableCell>
                <TableCell>40.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Shadow Raid</TableCell>
                <TableCell>1 / 1000</TableCell>
                <TableCell>0.100%</TableCell>
                <TableCell>6/6/6</TableCell>
                <TableCell>40.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Shadow Raid
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Weather Boosted
                  </Badge>
                </TableCell>
                <TableCell>1 / 1000</TableCell>
                <TableCell>0.100%</TableCell>
                <TableCell>6/6/6</TableCell>
                <TableCell>40.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Team GO Rocket encounters include Pokémon caught from Team Rocket Grunts, Leaders, and Giovanni. These
            encounters have different IV floors: 4/4/4 when weather boosted from Grunts and Leaders, and 6/6/6 in Shadow
            Raids and from Giovanni catch rewards.
          </div>
        </CardContent>
      </Card>

      {/* Purifying Shadow Pokémon Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">✨</span> Purifying Shadow Pokémon
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Grunts and Leaders</TableCell>
                <TableCell>1 / 152</TableCell>
                <TableCell>0.658%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Grunts and Leaders
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Weather Boosted
                  </Badge>
                </TableCell>
                <TableCell>1 / 64</TableCell>
                <TableCell>1.563%</TableCell>
                <TableCell>4/4/4</TableCell>
                <TableCell>28.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Giovanni</TableCell>
                <TableCell>1 / 37</TableCell>
                <TableCell>2.703%</TableCell>
                <TableCell>6/6/6</TableCell>
                <TableCell>40.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Raid</TableCell>
                <TableCell>1 / 37</TableCell>
                <TableCell>2.703%</TableCell>
                <TableCell>6/6/6</TableCell>
                <TableCell>40.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            These odds are calculated only if you are Purifying 13/13/13 Shadow Pokémon or higher. Purifying a Shadow
            Pokémon adds +2 to Attack, Defense, and HP.
          </div>
        </CardContent>
      </Card>

      {/* Trade Section */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🤝</span> Trade
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold">Encounter Type</TableHead>
                <TableHead className="font-semibold">Hundo Odds</TableHead>
                <TableHead className="font-semibold">Hundo Odds (%)</TableHead>
                <TableHead className="font-semibold">IV Floor</TableHead>
                <TableHead className="font-semibold">Min IV (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Friend (0 hearts)</TableCell>
                <TableCell>1 / 4096</TableCell>
                <TableCell>0.024%</TableCell>
                <TableCell>0/0/0</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Good Friend</TableCell>
                <TableCell>1 / 841</TableCell>
                <TableCell>0.119%</TableCell>
                <TableCell>1/1/1</TableCell>
                <TableCell>6.7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Great Friend</TableCell>
                <TableCell>1 / 687</TableCell>
                <TableCell>0.146%</TableCell>
                <TableCell>2/2/2</TableCell>
                <TableCell>13.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ultra Friend</TableCell>
                <TableCell>1 / 624</TableCell>
                <TableCell>0.160%</TableCell>
                <TableCell>3/3/3</TableCell>
                <TableCell>20.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Best Friend</TableCell>
                <TableCell>1 / 603</TableCell>
                <TableCell>0.166%</TableCell>
                <TableCell>5/5/5</TableCell>
                <TableCell>33.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lucky Friend</TableCell>
                <TableCell>1 / 64</TableCell>
                <TableCell>1.563%</TableCell>
                <TableCell>12/12/12</TableCell>
                <TableCell>80.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 text-sm text-muted-foreground">
            Odds to get a perfect IV Pokémon from trades grow with your Friendship level. These odds are calculated for
            a random trade with a Good Friend, Great Friend, Ultra Friend, Best Friend, or Lucky Friend. Includes a
            default 5% chance to get a Lucky Pokémon.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
