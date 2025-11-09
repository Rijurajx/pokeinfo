"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

type TierPokemon = {
  id: number
  name: string
  form?: string
  types: string[]
  cp?: number
}

const TIER_DATA = {
  S: {
    title: "S Tier",
    color: "bg-green-600",
    description:
      "S Tier Pokémon are the strongest, most versatile, and most useful Pokémon you can power up. These Pokémon consistently serve as the best counters to a wide variety of raid bosses, making them some of the best investments of Stardust and Candy you can make. Here are the top Attackers in Pokémon GO.",
    pokemon: [
      { id: 383, name: "Primal Groudon", form: "primal", types: ["ground", "fire"] },
      { id: 384, name: "Mega Rayquaza", form: "mega", types: ["dragon", "flying"] },
      { id: 384, name: "Rayquaza", types: ["dragon", "flying"] },
      { id: 150, name: "Shadow Mewtwo", form: "shadow", types: ["psychic"] },
      { id: 646, name: "Black Kyurem", types: ["dragon", "ice"] },
      { id: 382, name: "Primal Kyogre", form: "primal", types: ["water"] },
      { id: 409, name: "Shadow Rampardos", form: "shadow", types: ["rock"] },
      { id: 644, name: "Zekrom", types: ["dragon", "electric"] },
      { id: 445, name: "Garchomp", types: ["dragon", "ground"] },
      { id: 530, name: "Excadrill", types: ["ground", "steel"] },
      { id: 257, name: "Mega Blaziken", form: "mega", types: ["fire", "fighting"] },
      { id: 646, name: "White Kyurem", types: ["dragon", "ice"] },
      { id: 448, name: "Mega Lucario", form: "mega", types: ["fighting", "steel"] },
      { id: 473, name: "Shadow Mamoswine", form: "shadow", types: ["ice", "ground"] },
      { id: 150, name: "Mega Mewtwo Y", form: "mega-y", types: ["psychic"] },
      { id: 373, name: "Mega Salamence", form: "mega", types: ["dragon", "flying"] },
      { id: 609, name: "Shadow Chandelure", form: "shadow", types: ["ghost", "fire"] },
      { id: 486, name: "Shadow Regigigas", form: "shadow", types: ["normal"] },
      { id: 381, name: "Mega Latios", form: "mega", types: ["dragon", "psychic"] },
      { id: 282, name: "Mega Gardevoir", form: "mega", types: ["psychic", "fairy"] },
      { id: 248, name: "Mega Tyranitar", form: "mega", types: ["rock", "dark"] },
    ],
  },
  "A+": {
    title: "A+ Tier",
    color: "bg-lime-500",
    description:
      "A+ Tier Pokémon are amazing attackers and frequently strong counters to your team. They are powerful, versatile, and dependable Pokémon that are definitely worth powering up. Often these Pokémon are the best counters to a few specific raid bosses but not quite as versatile as S Tier.",
    pokemon: [
      { id: 243, name: "Shadow Raikou", form: "shadow", types: ["electric"] },
      { id: 150, name: "Dark Mega Mewtwo X", form: "mega-x", types: ["psychic", "fighting"] },
      { id: 94, name: "Mega Gengar", form: "mega", types: ["ghost", "poison"] },
      { id: 491, name: "Shadow Darkrai", form: "shadow", types: ["dark"] },
      { id: 888, name: "Crowned Shield Zacian", form: "crowned", types: ["fairy", "steel"] },
      { id: 376, name: "Shadow Metagross", form: "shadow", types: ["steel", "psychic"] },
      { id: 248, name: "Shadow Tyranitar", form: "shadow", types: ["rock", "dark"] },
      { id: 310, name: "Mega Manectric", form: "mega", types: ["electric"] },
      { id: 384, name: "Rayquaza", types: ["dragon", "flying"] },
      { id: 149, name: "Shadow Dragonite", form: "shadow", types: ["dragon", "flying"] },
      { id: 380, name: "Mega Latias", form: "mega", types: ["dragon", "psychic"] },
      { id: 6, name: "Mega Y Charizard", form: "mega-y", types: ["fire", "flying"] },
      { id: 68, name: "Shadow Machamp", form: "shadow", types: ["fighting"] },
      { id: 244, name: "Shadow Entei", form: "shadow", types: ["fire"] },
      { id: 150, name: "Shadow Mewtwo", form: "shadow", types: ["psychic"] },
      { id: 242, name: "Blissey", types: ["normal"] },
      { id: 462, name: "Shadow Magnezone", form: "shadow", types: ["electric", "steel"] },
      { id: 65, name: "Mega Alakazam", form: "mega", types: ["psychic"] },
      { id: 639, name: "Terrakion", types: ["rock", "fighting"] },
      { id: 430, name: "Shadow Honchkrow", form: "shadow", types: ["dark", "flying"] },
      { id: 145, name: "Shadow Zapdos", form: "shadow", types: ["electric", "flying"] },
      { id: 428, name: "Mega Lopunny", form: "mega", types: ["normal", "fighting"] },
      { id: 645, name: "Landorus", types: ["ground", "flying"] },
      { id: 260, name: "Mega Swampert", form: "mega", types: ["water", "ground"] },
      { id: 628, name: "Braviary", types: ["normal", "flying"] },
      { id: 795, name: "Pheromosa", types: ["bug", "fighting"] },
      { id: 645, name: "Therian Forme Landorus", form: "therian", types: ["ground", "flying"] },
      { id: 798, name: "Kartana", types: ["grass", "steel"] },
      { id: 793, name: "Nihilego", types: ["rock", "poison"] },
      { id: 720, name: "Hoopa Unbound", form: "unbound", types: ["psychic", "dark"] },
    ],
  },
  A: {
    title: "A Tier",
    color: "bg-yellow-500",
    description:
      "A Tier Pokémon are situational specialists and set a high standard for attacking counters. These Pokémon exemplify the best among non-Shadow and non-Mega Pokémon, and even the Shadow and Mega forms of these Pokémon are still solid counters.",
    pokemon: [
      { id: 248, name: "Shadow Tyranitar", form: "shadow", types: ["rock", "dark"] },
      { id: 647, name: "Keldeo", types: ["water", "fighting"] },
      { id: 534, name: "Shadow Conkeldurr", form: "shadow", types: ["fighting"] },
      { id: 150, name: "Mewtwo", types: ["psychic"] },
      { id: 150, name: "Shadow Mewtwo", form: "shadow", types: ["psychic"] },
      { id: 894, name: "Regieleki", types: ["electric"] },
      { id: 448, name: "Lucario", types: ["fighting", "steel"] },
      { id: 461, name: "Shadow Weavile", form: "shadow", types: ["dark", "ice"] },
      { id: 466, name: "Shadow Electivire", form: "shadow", types: ["electric"] },
      { id: 642, name: "Thundurus Therian", form: "therian", types: ["electric", "flying"] },
      { id: 635, name: "Shadow Hydreigon", form: "shadow", types: ["dark", "dragon"] },
      { id: 649, name: "Genesect", types: ["bug", "steel"] },
      { id: 484, name: "Palkia", types: ["water", "dragon"] },
      { id: 644, name: "Zekrom", types: ["dragon", "electric"] },
      { id: 376, name: "Shadow Metagross", form: "shadow", types: ["steel", "psychic"] },
      { id: 229, name: "Mega Houndoom", form: "mega", types: ["dark", "fire"] },
      { id: 142, name: "Mega Aerodactyl", form: "mega", types: ["rock", "flying"] },
      { id: 6, name: "Mega Charizard X", form: "mega-x", types: ["fire", "dragon"] },
      { id: 445, name: "Mega Garchomp", form: "mega", types: ["dragon", "ground"] },
      { id: 359, name: "Mega Absol", form: "mega", types: ["dark"] },
      { id: 310, name: "Mega Manectric", form: "mega", types: ["electric"] },
      { id: 68, name: "Shadow Machamp", form: "shadow", types: ["fighting"] },
      { id: 130, name: "Shadow Gyarados", form: "shadow", types: ["water", "flying"] },
      { id: 646, name: "Kyurem", types: ["dragon", "ice"] },
      { id: 130, name: "Mega Gyarados", form: "mega", types: ["water", "dark"] },
      { id: 796, name: "Xurkitree", types: ["electric"] },
      { id: 244, name: "Shadow Entei", form: "shadow", types: ["fire"] },
      { id: 383, name: "Groudon", types: ["ground"] },
      { id: 647, name: "Keldeo Resolute Forme", form: "resolute", types: ["water", "fighting"] },
      { id: 130, name: "Mega Gyarados", form: "mega", types: ["water", "dark"] },
      { id: 555, name: "Galarian Darmanitan", form: "galarian", types: ["ice"] },
      { id: 643, name: "Reshiram", types: ["dragon", "fire"] },
      { id: 282, name: "Shadow Gardevoir", form: "shadow", types: ["psychic", "fairy"] },
      { id: 609, name: "Chandelure", types: ["ghost", "fire"] },
      { id: 150, name: "Shadow Mewtwo X", form: "shadow-mega-x", types: ["psychic", "fighting"] },
      { id: 310, name: "Mega Manectric", form: "mega", types: ["electric"] },
      { id: 385, name: "Jirachi", types: ["steel", "psychic"] },
      { id: 809, name: "Melmetal", types: ["steel"] },
      { id: 18, name: "Mega Pidgeot", form: "mega", types: ["normal", "flying"] },
      { id: 492, name: "Sky Forme Shaymin", form: "sky", types: ["grass", "flying"] },
      { id: 460, name: "Shadow Abomasnow", form: "shadow", types: ["grass", "ice"] },
      { id: 212, name: "Shadow Scizor", form: "shadow", types: ["bug", "steel"] },
      { id: 530, name: "Excadrill", types: ["ground", "steel"] },
      { id: 135, name: "Jolteon", types: ["electric"] },
      { id: 3, name: "Mega Venusaur", form: "mega", types: ["grass", "poison"] },
      { id: 254, name: "Shadow Sceptile", form: "shadow", types: ["grass"] },
      { id: 310, name: "Mega Manectric", form: "mega", types: ["electric"] },
      { id: 15, name: "Shadow Beedrill", form: "shadow", types: ["bug", "poison"] },
    ],
  },
  B: {
    title: "B Tier",
    color: "bg-orange-500",
    description:
      "B Tier Pokémon are solid attackers and useful counters. They are reliable and effective in many situations, making them good investments.",
    pokemon: [],
  },
  C: {
    title: "C Tier",
    color: "bg-orange-600",
    description:
      "C Tier Pokémon are decent attackers and have their uses. They may not be the best counters but are still valuable additions to your team.",
    pokemon: [],
  },
  D: {
    title: "D Tier",
    color: "bg-red-600",
    description:
      "D Tier Pokémon are average attackers and may have limited use. They are still worth considering for specific roles.",
    pokemon: [],
  },
  F: {
    title: "F Tier",
    color: "bg-gray-700",
    description:
      "F Tier Pokémon are weak attackers and should be used sparingly. They may have niche uses but are generally not recommended.",
    pokemon: [],
  },
}

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

export default function TierListClient() {
  const [activeTier, setActiveTier] = useState<"S" | "A+" | "A" | "B" | "C" | "D" | "F">("S")

  const getImageUrl = (pokemon: TierPokemon) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }

  const currentTierData = TIER_DATA[activeTier]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Best Attackers Tier List</h1>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <p className="text-muted-foreground mb-4">
              Explore our complete tier list of the best and most effective raid Pokémon. This guide will help you
              understand which Pokémon reign supreme, which are the best investments, and which Pokémon offer the best
              return on investment. Whether you're a seasoned Trainer or just starting out, learn which Pokémon offer
              the best return on your Stardust and Candy.
            </p>
            <p className="text-sm text-muted-foreground mb-4">Click to jump to a particular tier:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTier("S")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "S" ? "bg-green-600" : "bg-green-700"} text-white hover:opacity-80 transition-opacity`}
              >
                S
              </button>
              <button
                onClick={() => setActiveTier("A+")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "A+" ? "bg-lime-500" : "bg-lime-600"} text-white hover:opacity-80 transition-opacity`}
              >
                A+
              </button>
              <button
                onClick={() => setActiveTier("A")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "A" ? "bg-yellow-500" : "bg-yellow-600"} text-white hover:opacity-80 transition-opacity`}
              >
                A
              </button>
              <button
                onClick={() => setActiveTier("B")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "B" ? "bg-orange-500" : "bg-orange-600"} text-white hover:opacity-80 transition-opacity`}
              >
                B
              </button>
              <button
                onClick={() => setActiveTier("C")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "C" ? "bg-orange-600" : "bg-orange-700"} text-white hover:opacity-80 transition-opacity`}
              >
                C
              </button>
              <button
                onClick={() => setActiveTier("D")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "D" ? "bg-red-600" : "bg-red-700"} text-white hover:opacity-80 transition-opacity`}
              >
                D
              </button>
              <button
                onClick={() => setActiveTier("F")}
                className={`px-4 py-2 rounded font-bold ${activeTier === "F" ? "bg-gray-700" : "bg-gray-800"} text-white hover:opacity-80 transition-opacity`}
              >
                F
              </button>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Note: Pokémon inside every tier are sorted by their Max CP.
            </p>
          </div>
          <div className="w-full md:w-64 flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_21-10-2025_213210_db.pokemongohub.net-vfnS8UAwOFsRmudH1xrmBwDOM9lu5J.jpeg"
              alt="Best Attackers Tier List"
              width={256}
              height={256}
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {currentTierData && (
        <div className="mb-8">
          <div className={`${currentTierData.color} rounded-t-lg p-4`}>
            <h2 className="text-3xl font-bold text-white">{currentTierData.title}</h2>
          </div>
          <div className="bg-slate-800 rounded-b-lg p-6">
            <p className="text-muted-foreground mb-6">{currentTierData.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentTierData.pokemon.map((pokemon, index) => (
                <Link
                  key={`${pokemon.id}-${pokemon.form || "normal"}-${index}`}
                  href={`/pokemon/${pokemon.id}`}
                  className="bg-slate-900 rounded-lg p-3 hover:bg-slate-700 transition-colors"
                >
                  <div className="relative w-full aspect-square mb-2">
                    <Image
                      src={getImageUrl(pokemon) || "/placeholder.svg"}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="text-foreground text-sm font-medium text-center mb-2 line-clamp-2">{pokemon.name}</p>
                  <div className="flex justify-center gap-1">
                    {pokemon.types.map((type) => (
                      <div
                        key={type}
                        className={`w-6 h-6 rounded-full ${TYPE_COLORS[type]} flex items-center justify-center`}
                        title={type}
                      >
                        <span className="text-xs text-white font-bold uppercase">{type[0]}</span>
                      </div>
                    ))}
                  </div>
                  {pokemon.cp && <p className="text-xs text-muted-foreground text-center mt-1">CP {pokemon.cp}</p>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
