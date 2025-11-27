"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Image from "next/image";
import { fetchAllPokemonWithForms } from "@/lib/fetchers";
import { Button } from "@/components/ui/button";

type PokemonStats = {
  pokemon_id: number | string;
  pokemon_name: string;
  base_attack: number;
  base_defense: number;
  base_stamina: number;
  form?: string | null;
};

// CPM table copied from your CP calculator (levels 1 -> 51, including halves)
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
};

export default function IVLevelCalculatorPage() {
  type SortableColumn =
    | "atkIV"
    | "defIV"
    | "hpIV"
    | "level"
    | "sumIV"
    | "percent";

  const [searchQuery, setSearchQuery] = useState("");
  const [allPokemon, setAllPokemon] = useState<PokemonStats[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonStats[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonStats | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputCP, setInputCP] = useState<number | "">("");
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const [computing, setComputing] = useState(false);
  const [results, setResults] = useState<
    {
      atkIV: number;
      defIV: number;
      hpIV: number;
      level: number;
      sumIV: number;
      percent: number;
    }[]
  >([]);
  const [maxResultsToShow, setMaxResultsToShow] = useState<number>(200); // safety cap for UI

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await fetchAllPokemonWithForms();
        const converted: PokemonStats[] = data.map((p) => ({
          pokemon_id: Number(p.pokemon_id),
          pokemon_name: p.pokemon_name,
          base_attack: p.base_attack,
          base_defense: p.base_defense,
          base_stamina: p.base_stamina,
          form: p.form,
        }));
        // sort alphabetically
        converted.sort((a, b) => a.pokemon_name.localeCompare(b.pokemon_name));
        setAllPokemon(converted);
      } catch (err) {
        console.error("Failed to fetch pokemon list", err);
        setAllPokemon([]);
      }
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setFilteredPokemon([]);
      setShowDropdown(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allPokemon
      .filter((p) => p.pokemon_name.toLowerCase().includes(q))
      .slice(0, 12);
    setFilteredPokemon(filtered);
    setShowDropdown(true);
  }, [searchQuery, allPokemon]);

  const levels = useMemo(() => {
    const ls: number[] = [];
    for (let l = 1; l <= 51; l += 0.5) {
      // avoid floating precision issues by rounding to nearest 0.5 multiple
      const rounded = Math.round(l * 2) / 2;
      ls.push(rounded);
    }
    return ls;
  }, []);

  const handleSelectPokemon = (pokemon: PokemonStats) => {
    setSelectedPokemon(pokemon);
    const displayName =
      pokemon.form && pokemon.form !== "Normal"
        ? `${pokemon.pokemon_name} (${pokemon.form})`
        : pokemon.pokemon_name;
    setSearchQuery(displayName);
    setShowDropdown(false);
    setResults([]);
  };

  const renderSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column || sortOrder === "none") {
      return <span className="opacity-40 text-xs ml-1">⇅</span>;
    }
    if (sortOrder === "asc") {
      return <span className="text-primary text-xs ml-1">▲</span>;
    }
    return <span className="text-primary text-xs ml-1">▼</span>;
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortOrder("asc");
    } else {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc"
      );
    }
  };

  // CP formula used in Pokémon GO
  const computeCP = (atk: number, def: number, stam: number, cpm: number) => {
    const cp = Math.floor(
      (atk * Math.sqrt(def) * Math.sqrt(stam) * Math.pow(cpm, 2)) / 10
    );
    return Math.max(10, cp);
  };

  const runCalculation = async () => {
    setResults([]);
    if (!selectedPokemon) {
      alert("Please select a Pokémon first.");
      return;
    }
    if (!inputCP || Number.isNaN(Number(inputCP))) {
      alert("Please enter a valid CP value.");
      return;
    }
    const targetCP = Number(inputCP);
    setComputing(true);

    // We will accumulate matches and then set state once
    const matches: {
      atkIV: number;
      defIV: number;
      hpIV: number;
      level: number;
      sumIV: number;
      percent: number;
    }[] = [];

    // For performance, keep references local
    const baseAtk = selectedPokemon.base_attack;
    const baseDef = selectedPokemon.base_defense;
    const baseSta = selectedPokemon.base_stamina;

    for (const lvl of levels) {
      const cpm = CPM_TABLE[lvl];
      if (!cpm) continue;

      for (let atkIV = 0; atkIV <= 15; atkIV++) {
        const atk = baseAtk + atkIV;

        for (let defIV = 0; defIV <= 15; defIV++) {
          const def = baseDef + defIV;

          for (let hpIV = 0; hpIV <= 15; hpIV++) {
            const stam = baseSta + hpIV;

            // Compute CP normally
            const cp = computeCP(atk, def, stam, cpm);
            if (cp !== targetCP) continue;

            // Calculate metadata
            const sumIV = atkIV + defIV + hpIV;
            const percent = Math.round((sumIV / 45) * 100);

            matches.push({
              atkIV,
              defIV,
              hpIV,
              level: lvl,
              sumIV,
              percent,
            });
          }
        }
      }
    }

    // sort results by sumIV desc then level (common UI preference)
    matches.sort((a, b) => {
      if (b.sumIV !== a.sumIV) return b.sumIV - a.sumIV;
      if (b.level !== a.level) return b.level - a.level;
      if (b.atkIV !== a.atkIV) return b.atkIV - a.atkIV;
      return b.defIV - a.defIV;
    });

    setResults(matches);
    setComputing(false);
  };
  const sortedResults = useMemo(() => {
    if (!sortColumn || sortOrder === "none") return results;

    return [...results].sort((a, b) => {
      if (sortOrder === "asc") return a[sortColumn] - b[sortColumn];
      return b[sortColumn] - a[sortColumn];
    });
  }, [results, sortColumn, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:block gap-6">
          <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6">
            <h1 className="text-3xl font-bold text-white mb-3">
              IV & Level Finder (from CP)
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Enter a CP and the calculator will enumerate all ATK/DEF/HP IV
              combinations and attacker levels that produce that CP. (Levels
              tested: 1 → 51 in 0.5 steps; IVs tested: 0–15). Results are exact
              matches to Pokémon GO’s CP formula.
            </p>
          </Card>

          <div className="contents lg:flex lg:gap-3">
            <Card className="bg-slate-900/80 border-secondary/30 shadow-lg shadow-secondary/10 p-6 lg:flex-1">
              <div className="space-y-6">
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Pokémon
                  </label>
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedPokemon(null);
                        setResults([]);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowDropdown(false), 150);
                      }}
                      onFocus={() => {
                        if (
                          searchQuery.trim() !== "" &&
                          filteredPokemon.length > 0
                        ) {
                          setShowDropdown(true);
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
                            key={`${pokemon.pokemon_id}-${
                              pokemon.form || "normal"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectPokemon(pokemon);
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
                              {pokemon.form &&
                                pokemon.form !== "Normal" &&
                                ` (${pokemon.form})`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">
                    CP (Combat Power)
                  </label>
                  <Input
                    value={inputCP}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setInputCP(v === "" ? "" : Number(v));
                    }}
                    placeholder="Enter CP (e.g. 1534)"
                    className="bg-slate-800/80 border-slate-700 text-white pr-10 focus:border-primary focus:ring-primary/50"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={runCalculation}
                    className="bg-primary"
                    disabled={computing || !selectedPokemon || inputCP === ""}
                  >
                    {computing ? "Calculating…" : "Calculate"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedPokemon(null);
                      setInputCP("");
                      setResults([]);
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <div className="text-sm text-slate-400">
                  Tip: pick a Pokémon first, then enter CP. Results will show
                  all exact matches.
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6 lg:flex-1 flex items-center justify-center">
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
                    {selectedPokemon.form &&
                      selectedPokemon.form !== "Normal" && (
                        <span className="text-lg text-primary ml-2">
                          ({selectedPokemon.form})
                        </span>
                      )}
                  </h2>

                  <div className="text-slate-300 text-sm">
                    Base stats — ATK:{" "}
                    <span className="font-semibold text-cyan-300">
                      {selectedPokemon.base_attack}
                    </span>
                    , DEF:{" "}
                    <span className="font-semibold text-orange-300">
                      {selectedPokemon.base_defense}
                    </span>
                    , STA:{" "}
                    <span className="font-semibold text-red-300">
                      {selectedPokemon.base_stamina}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full text-slate-400">
                  <p>Select a Pokémon to compute IV possibilities</p>
                </div>
              )}
            </Card>
          </div>

          <Card className="bg-slate-900/80 border-primary/30 shadow-lg shadow-primary/10 p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Results ({results.length})
            </h3>

            {computing ? (
              <div className="text-white">
                Running through combinations — this usually takes less than a
                second.
              </div>
            ) : results.length === 0 ? (
              <div className="text-slate-400">
                No matches yet. Enter a CP and press Calculate.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 gap-4">
                  <div className="text-sm text-slate-300">
                    Showing up to {maxResultsToShow} results.{" "}
                    {results.length > maxResultsToShow
                      ? `(${results.length} total)`
                      : ""}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-slate-300 text-sm">
                      Max to show
                    </label>
                    <Select
                      value={String(maxResultsToShow)}
                      onValueChange={(v) => setMaxResultsToShow(Number(v))}
                    >
                      <SelectTrigger className="w-24 h-8 bg-slate-800/80 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-primary/30">
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed border-collapse">
                    <thead className="bg-slate-800/60">
                      <tr>
                        <th className="p-2 text-left text-xs text-slate-300">
                          #
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("atkIV")}
                        >
                          <div className="flex items-center gap-1">
                            ATK IV {renderSortIcon("atkIV")}
                          </div>
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("defIV")}
                        >
                          <div className="flex items-center gap-1">
                            DEF IV {renderSortIcon("defIV")}
                          </div>
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("hpIV")}
                        >
                          <div className="flex items-center gap-1">
                            HP IV {renderSortIcon("hpIV")}
                          </div>
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("level")}
                        >
                          <div className="flex items-center gap-1">
                            Level {renderSortIcon("level")}
                          </div>
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("sumIV")}
                        >
                          <div className="flex items-center gap-1">
                            Sum IV {renderSortIcon("sumIV")}
                          </div>
                        </th>

                        <th
                          className="p-2 text-left text-xs text-slate-300 cursor-pointer select-none"
                          onClick={() => handleSort("percent")}
                        >
                          <div className="flex items-center gap-1">
                            IV % {renderSortIcon("percent")}
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedResults
                        .slice(0, maxResultsToShow)
                        .map((r, idx) => (
                          <tr
                            key={`${r.level}-${r.atkIV}-${r.defIV}-${r.hpIV}-${idx}`}
                            className="border-b border-slate-800"
                          >
                            <td className="p-2 text-sm text-slate-200">
                              {idx + 1}
                            </td>
                            <td className="p-2 text-sm text-slate-100 font-medium">
                              {r.atkIV}
                            </td>
                            <td className="p-2 text-sm text-slate-100 font-medium">
                              {r.defIV}
                            </td>
                            <td className="p-2 text-sm text-slate-100 font-medium">
                              {r.hpIV}
                            </td>
                            <td className="p-2 text-sm text-slate-100 font-medium">
                              {Number.isInteger(r.level)
                                ? r.level
                                : r.level.toFixed(1)}
                            </td>
                            <td className="p-2 text-sm text-slate-100">
                              {r.sumIV}
                            </td>
                            <td className="p-2 text-sm text-slate-100">
                              {r.percent}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
