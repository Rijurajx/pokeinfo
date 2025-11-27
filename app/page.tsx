"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trophy,
  Shield,
  Calculator,
  Map,
  Sparkles,
  Heart,
  Footprints,
  Zap,
  Swords,
  BookOpen,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  Moon,
  Sticker,
  HelpCircle,
} from "lucide-react";
import { TYPE_COLORS, POKEMON_TYPES, GENERATIONS } from "@/lib/type-colors";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-screen-2xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent text-balance">
              Pokémon GO Database
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              All Pokémon stats, moves, counters, and tools in one place.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Search Pokémon, moves, or types..."
                className="pl-12 h-12 bg-card border-border text-lg"
              />
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link href="/pokedex">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Map size={16} />
                  Pokédex
                </Button>
              </Link>
              <Link href="#tier-lists">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Trophy size={16} />
                  Tier Lists
                </Button>
              </Link>
              <Link href="#tools">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calculator size={16} />
                  Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-10">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tier Lists Section */}
          <section id="tier-lists">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="text-primary" size={28} />
              Tier Lists
            </h2>

            <div className="flex flex-col gap-6">
              <Link href="/tier-lists/attackers">
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                        <Swords size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          Best Attackers Tier List
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Top DPS Pokémon for raids
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      Updated
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tier-lists/defenders">
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          Best Defenders Tier List
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Top gym defenders
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      Updated
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/best-attackers-per-type">
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                        <Zap size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          Best Attackers per Type
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Type-specific rankings
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      Updated
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Best Attackers per Type */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Swords className="text-primary" size={28} />
              Best Attackers per Type
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {POKEMON_TYPES.map((type) => {
                const colors = TYPE_COLORS[type];

                return (
                  <Link key={type} href={`/best-attackers-per-type/${type}`}>
                    <Card
                      className={`group hover:border-${type} transition-all duration-300 cursor-pointer ${colors.bg} ${colors.border} border`}
                      style={{
                        boxShadow: `0 0 0 rgba(0,0,0,0)`,
                        transition: "box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                      }}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        {/* ✅ TYPE ICON */}
                        <div className="relative w-8 h-8">
                          <Image
                            src={`/type_icons/${type}.webp`}
                            alt={type}
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* ✅ OPTIONAL TEXT (you can remove this if you want icon-only) */}
                        <div
                          className={`font-bold capitalize text-xs ${colors.text}`}
                        >
                          {type}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Map className="text-primary" size={28} />
            Pokémon by Generation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {GENERATIONS.map((gen) => (
              <Link key={gen.id} href={`/pokedex/${gen.slug}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">
                      {gen.id}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{gen.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {gen.range}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section id="tools">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="text-primary" size={28} />
            Useful Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { name: "Pokédex", href: "/pokedex", icon: BookOpen },
              {
                name: "CP Calculator",
                href: "/tools/cp-calculator",
                icon: Calculator,
              },
              { name: "Type Chart", href: "/tools/type-chart", icon: Map },
              {
                name: "Shiny Checklist",
                href: "/tools/shiny-checklist",
                icon: Sparkles,
              },
              {
                name: "DPS Calculator",
                href: "/tools/dps-calculator",
                icon: Zap,
              },
              {
                name: "Community Day Moves",
                href: "/community-day-moves",
                icon: Calendar,
              },
              { name: "Legacy Moves", href: "/legacy-moves", icon: Clock },
              {
                name: "Perfect IV Odds",
                href: "/tools/perfect-iv-odds",
                icon: BarChart3,
              },
              {
                name: "DPS and TDO Comparer",
                href: "/tools/dps-tdo-comparer",
                icon: TrendingUp,
              },
              { name: "Mega Boost", href: "/mega-boost", icon: Zap },
              {
                name: "Ursaluna Full Moon Tracker",
                href: "/tools/ursaluna-tracker",
                icon: Moon,
              },
              {
                name: "IV Calculator",
                href: "/tools/iv-calculator",
                icon: HelpCircle,
              },
            ].map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <tool.icon className="text-primary" size={24} />
                    </div>
                    <div className="font-semibold">{tool.name}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Swords className="text-primary" size={28} />
            Move Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/moves/fast">
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Fast Attacks</h3>
                  <p className="text-sm text-muted-foreground">
                    Gym & Raid moves
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/moves/charged">
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Charge Attacks</h3>
                  <p className="text-sm text-muted-foreground">
                    Gym & Raid moves
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/moves/fast-attacks-trainer">
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Fast Attacks</h3>
                  <p className="text-sm text-muted-foreground">
                    Trainer Battles
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/moves/charge-attacks-trainer">
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Charge Attacks</h3>
                  <p className="text-sm text-muted-foreground">
                    Trainer Battles
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Footprints className="text-primary" size={28} />
            Buddy Distance Pokémon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["1 KM", "3 KM", "5 KM", "20 KM"].map((distance) => (
              <Link
                key={distance}
                href={`/buddy-distance?distance=${distance.split(" ")[0]}`}
              >
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6 text-center space-y-3">
                    <Heart className="mx-auto text-pink-400" size={32} />
                    <div className="font-bold text-lg">{distance}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
    <Map className="text-primary" size={28} />
    Pokémon by Type
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {POKEMON_TYPES.map((type) => {
      const colors = TYPE_COLORS[type];

      return (
        <Link key={type} href={`/type/${type}`}>
          <Card
            className={`group hover:border-${type} transition-all duration-300 cursor-pointer ${colors.bg} ${colors.border} border h-full`}
            style={{
              boxShadow: `0 0 0 rgba(0,0,0,0)`,
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
            }}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3">
              
              {/* ✅ TYPE ICON */}
              <div className="relative w-12 h-12">
                <Image
                  src={`/type_icons/${type}.webp`}
                  alt={type}
                  fill
                  className="object-contain"
                />
              </div>

              {/* ✅ OPTIONAL LABEL BELOW ICON */}
              <div
                className={`font-bold capitalize text-lg ${colors.text}`}
              >
                {type}
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    })}
  </div>
</section>


        {/* About Database Section - Full Width */}
        <section className="border-t border-border pt-10">
          <Card className="bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-8 md:p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary glow-blue" />
              <h2 className="text-3xl font-bold">About Pokémon GO Database</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Your ultimate Pokémon GO database. Explore stats, moves,
                evolutions, and meta-relevant data for every Pokémon. Stay
                updated with tier lists, tools, and comprehensive information to
                dominate raids, gyms, and PvP battles.
              </p>
              <p className="text-sm text-muted-foreground pt-4">
                Powered by PogoAPI • Built with ❤️ for Trainers
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
