"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Image from "next/image"
import { fetchAllPokemonWithForms } from "@/lib/fetchers"

// CPM (Combat Power Multiplier) table for levels 1-51
const CPM_TABLE: Record<number, number> = {
  1: 0.094,
  1.5: 0.1351374318,
  2: 0.16639787,
  2.5: 0.192650919,
  3: 0.21573247,
  3.5: 0.2365726613,
  4: 0.25572005,
  4.5: 0.2735303812,
  5: 0.29024988,
  5.5: 0.3060573775,
  6: 0.3210876,
  6.5: 0.3354450362,
  7: 0.34921268,
  7.5: 0.3624577511,
  8: 0.3752356,
  8.5: 0.387592416,
  9: 0.39956728,
  9.5: 0.4111935514,
  10: 0.4225,
  10.5: 0.4329264091,
  11: 0.44310755,
  11.5: 0.4530599591,
  12: 0.4627984,
  12.5: 0.472336093,
  13: 0.48168495,
  13.5: 0.4908558003,
  14: 0.49985844,
  14.5: 0.508701765,
  15: 0.51739395,
  15.5: 0.5259425113,
  16: 0.5343543,
  16.5: 0.5426357375,
  17: 0.5507927,
  17.5: 0.5588305862,
  18: 0.5667545,
  18.5: 0.5745691333,
  19: 0.5822789,
  19.5: 0.5898879072,
  20: 0.5974,
  20.5: 0.6048236651,
  21: 0.6121573,
  21.5: 0.6194041216,
  22: 0.6265671,
  22.5: 0.6336491432,
  23: 0.64065295,
  23.5: 0.6475809666,
  24: 0.65443563,
  24.5: 0.6612192524,
  25: 0.667934,
  25.5: 0.6745818959,
  26: 0.6811649,
  26.5: 0.6876849038,
  27: 0.69414365,
  27.5: 0.70054287,
  28: 0.7068842,
  28.5: 0.7131691091,
  29: 0.7193991,
  29.5: 0.7255756136,
  30: 0.7317,
  30.5: 0.7347410093,
  31: 0.7377695,
  31.5: 0.7407855938,
  32: 0.74378943,
  32.5: 0.7467812109,
  33: 0.74976104,
  33.5: 0.7527290867,
  34: 0.7556855,
  34.5: 0.7586303683,
  35: 0.76156384,
  35.5: 0.7644860647,
  36: 0.76739717,
  36.5: 0.7702972656,
  37: 0.7731865,
  37.5: 0.7760649616,
  38: 0.77893275,
  38.5: 0.7817900548,
  39: 0.784637,
  39.5: 0.7874736075,
  40: 0.7903,
  40.5: 0.7931164,
  41: 0.7953,
  41.5: 0.7974,
  42: 0.8003,
  42.5: 0.8032,
  43: 0.8053,
  43.5: 0.8074,
  44: 0.8103,
  44.5: 0.8132,
  45: 0.8153,
  45.5: 0.8174,
  46: 0.8203,
  46.5: 0.8232,
  47: 0.8253,
  47.5: 0.8274,
  48: 0.8303,
  48.5: 0.8332,
  49: 0.8353,
  49.5: 0.8374,
  50: 0.8403,
  50.5: 0.8432,
  51: 0.8453,
}

interface PokemonStats {
  pokemon_id: number
  pokemon_name: string
  base_attack: number
  base_defense: number
  base_stamina: number
  form?: string
}

export default function CPCalculatorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allPokemon, setAllPokemon] = useState<PokemonStats[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonStats[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonStats | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const [level, setLevel] = useState(1)
  const [atkIV, setAtkIV] = useState(1)
  const [defIV, setDefIV] = useState(1)
  const [hpIV, setHpIV] = useState(1)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await fetchAllPokemonWithForms()
        const converted: PokemonStats[] = data.map((p) => ({
          pokemon_id: Number(p.pokemon_id),
          pokemon_name: p.pokemon_name,
          base_attack: p.base_attack,
          base_defense: p.base_defense,
          base_stamina: p.base_stamina,
          form: p.form,
        }))
        setAllPokemon(converted)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching Pokémon:", error)
        setLoading(false)
      }
    }
    fetchPokemon()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPokemon([])
      setShowDropdown(false)
    } else {
      const filtered = allPokemon
        .filter((p) => p.pokemon_name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 10)
      setFilteredPokemon(filtered)
      setShowDropdown(true)
    }
  }, [searchQuery, allPokemon])

  const calculateCP = () => {
    if (!selectedPokemon) return 0

    const attack = selectedPokemon.base_attack + atkIV
    const defense = selectedPokemon.base_defense + defIV
    const stamina = selectedPokemon.base_stamina + hpIV
    const cpm = CPM_TABLE[level] || 0.7903

    const cp = Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(cpm, 2)) / 10)

    return Math.max(10, cp)
  }

  const calculateStats = () => {
    if (!selectedPokemon) return { atk: 0, def: 0, hp: 0 }

    const cpm = CPM_TABLE[level] || 0.7903
    const atk = (selectedPokemon.base_attack + atkIV) * cpm
    const def = (selectedPokemon.base_defense + defIV) * cpm
    const hp = Math.floor((selectedPokemon.base_stamina + hpIV) * cpm)

    return {
      atk: Math.round(atk * 100) / 100,
      def: Math.round(def * 100) / 100,
      hp: Math.max(10, hp),
    }
  }

  const cp = calculateCP()
  const stats = calculateStats()

  const handleSelectPokemon = (pokemon: PokemonStats) => {
    setSelectedPokemon(pokemon)
    const displayName =
      pokemon.form && pokemon.form !== "Normal" ? `${pokemon.pokemon_name} (${pokemon.form})` : pokemon.pokemon_name
    setSearchQuery(displayName)
    setShowDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:block gap-6">
          {/* Header Card - order-3 on mobile (bottom), order-1 on desktop (top) */}
          <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6 order-3 lg:order-1 lg:mb-6">
            <h1 className="text-3xl font-bold text-white mb-3">Pokémon GO Combat Power Calculator</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Calculate CP (Combat Power) for any Pokémon in Pokémon GO, at any level, up to current maximum level in
              Pokémon GO. Select a Pokémon below to begin.
            </p>
          </Card>

          <div className="contents lg:flex lg:gap-3">
            {/* Input Card - order-1 on mobile (top), order-2 on desktop (left) */}
            <Card className="bg-slate-900/80 border-secondary/30 shadow-lg shadow-secondary/10 p-6 order-1 lg:order-2 lg:flex-1">
              <div className="space-y-6">
                <div>
                  <label className="text-white font-semibold mb-2 block">Pokémon</label>
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        setTimeout(() => setShowDropdown(false), 200)
                      }}
                      onFocus={() => {
                        if (searchQuery.trim() !== "" && filteredPokemon.length > 0) {
                          setShowDropdown(true)
                        }
                      }}
                      placeholder="Search Pokémon..."
                      className="bg-slate-800/80 border-slate-700 text-white pr-10 focus:border-primary focus:ring-primary/50"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    {showDropdown && filteredPokemon.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-primary/30 rounded-md shadow-lg shadow-primary/20 max-h-60 overflow-y-auto">
                        {filteredPokemon.map((pokemon) => (
                          <button
                            key={`${pokemon.pokemon_id}-${pokemon.form || "normal"}`}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleSelectPokemon(pokemon)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-700 hover:border-l-2 hover:border-primary text-white transition-all flex items-center gap-3"
                          >
                            <div className="relative w-8 h-8 flex-shrink-0">
                              <Image
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
                                alt={pokemon.pokemon_name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span>
                              {pokemon.pokemon_name}
                              {pokemon.form && pokemon.form !== "Normal" && ` (${pokemon.form})`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">Level</label>
                  <Select value={level.toString()} onValueChange={(v) => setLevel(Number(v))}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white focus:border-primary focus:ring-primary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-primary/30 max-h-60">
                      {Array.from({ length: 51 }, (_, i) => i + 1).map((lvl) => (
                        <SelectItem
                          key={lvl}
                          value={lvl.toString()}
                          className="text-white hover:bg-slate-700 focus:bg-slate-700"
                        >
                          Level {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">ATK IV</label>
                    <Select value={atkIV.toString()} onValueChange={(v) => setAtkIV(Number(v))}>
                      <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white focus:border-primary focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-primary/30">
                        {Array.from({ length: 16 }, (_, i) => i).map((iv) => (
                          <SelectItem
                            key={iv}
                            value={iv.toString()}
                            className="text-white hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {iv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">DEF IV</label>
                    <Select value={defIV.toString()} onValueChange={(v) => setDefIV(Number(v))}>
                      <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white focus:border-primary focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-primary/30">
                        {Array.from({ length: 16 }, (_, i) => i).map((iv) => (
                          <SelectItem
                            key={iv}
                            value={iv.toString()}
                            className="text-white hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {iv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">HP IV</label>
                    <Select value={hpIV.toString()} onValueChange={(v) => setHpIV(Number(v))}>
                      <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white focus:border-primary focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-primary/30">
                        {Array.from({ length: 16 }, (_, i) => i).map((iv) => (
                          <SelectItem
                            key={iv}
                            value={iv.toString()}
                            className="text-white hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {iv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Result Card - order-2 on mobile (middle), order-3 on desktop (right) */}
            <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6 order-2 lg:order-3 lg:flex-1 flex items-center justify-center">
              {selectedPokemon ? (
                <div className="flex flex-col items-center justify-center w-full space-y-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.pokemon_id}.png`}
                      alt={selectedPokemon.pokemon_name}
                      fill
                      className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    {selectedPokemon.pokemon_name}
                    {selectedPokemon.form && selectedPokemon.form !== "Normal" && (
                      <span className="text-lg text-primary ml-2">({selectedPokemon.form})</span>
                    )}
                  </h2>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-sm">
                      ⚡ Level {level} ({atkIV}/{defIV}/{hpIV})
                    </span>
                  </div>

                  <div className="text-5xl font-bold text-primary drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    {cp} CP
                  </div>

                  <div className="flex gap-4 text-sm">
                    <span className="text-cyan-400 font-semibold">{stats.atk.toFixed(2)} ATK</span>
                    <span className="text-orange-400 font-semibold">{stats.def.toFixed(2)} DEF</span>
                    <span className="text-red-400 font-semibold">{stats.hp} HP</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full text-slate-400">
                  <p>Select a Pokémon to calculate CP</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">About the Pokémon GO Combat Power Calculator</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The calculator works as a helper tool to quickly calculate a Pokémon's Combat Power and effective stats at a
            given level. This calculator uses the standard Pokémon GO Combat Power formula, and standard CPM tables to
            calculate CP and stats. CPM stands for Combat Power Multiplier, and it is a level-based scaling factor used
            by the CP formula. As Pokémon base stats and IVs don't change as they level up, CPM is used to increase
            Pokémon CP value.
          </p>

          <h3 className="text-lg font-bold text-white mb-3">What formula the CP Calculator uses?</h3>
          <p className="text-slate-300 text-sm mb-3">The CP Calculator uses the following Combat Power formula:</p>
          <div className="bg-slate-950/80 border border-primary/20 p-4 rounded-md mb-6 overflow-x-auto">
            <code className="text-primary text-xs font-mono whitespace-pre">
              Combat Power (CP) = FLOOR(((Attack + Attack IV) * SQRT(Defense + Defense IV) * SQRT(Stamina + Stamina IV)
              * (CPM_AT_LEVEL(Level) ^ 2)) / 10)
            </code>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Attack, Defense, and Stamina are derived from Pokémon's base stats. You, the user, selects the Pokémon
            level, Attack IV, Defense IV, and Stamina IVs by using the dropdowns above. The formula then adds those two
            together for all stats, multiplies the Attack stat with square root of Defense, square root of Stamina, and
            a square CPM factor. Lastly, the formula divides the multiplication result by 10 and floors the decimal
            number to create an integer.
          </p>

          <h3 className="text-lg font-bold text-white mb-3">What CPM Table does this calculator use?</h3>
          <p className="text-slate-300 text-sm mb-4">
            The GO Hub CP multiplier calculator uses the standard CPM table found in Pokémon GO's Game Master file. The
            CPM factors are listed for regular levels, in order to calculate the half-level CPM, sum the half-level and
            next level, and divide by two.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((col) => (
              <div key={col} className="space-y-1">
                {Object.entries(CPM_TABLE)
                  .filter((_, i) => i % 3 === col)
                  .slice(0, 17)
                  .map(([lvl, cpm]) => (
                    <div
                      key={lvl}
                      className="flex justify-between bg-slate-950/50 border border-slate-800 px-3 py-1.5 rounded text-xs hover:border-primary/30 transition-colors"
                    >
                      <span className="text-white font-semibold">{lvl}</span>
                      <span className="text-slate-300">{cpm}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
