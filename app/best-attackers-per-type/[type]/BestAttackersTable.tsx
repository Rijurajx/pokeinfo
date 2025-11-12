"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TYPE_COLORS } from "@/lib/type-colors";
import { getCPMultiplier } from "@/lib/cpm-table";
import type {
  Pokemon,
  PokemonMoves,
  FastMove,
  ChargedMove,
  PokemonType,
} from "@/lib/fetchers";

interface BestAttackersTableProps {
  type: string;
  pokemonStats: Pokemon[];
  pokemonMoves: PokemonMoves[];
  fastMoves: FastMove[];
  chargedMoves: ChargedMove[];
  pokemonTypes: PokemonType[];
}

interface RankedPokemon {
  pokemon: Pokemon;
  fastMove: FastMove;
  chargedMove: ChargedMove;
  dps: number;
  tdo: number;
  score: number;
}

export default function BestAttackersTable({
  type,
  pokemonStats,
  pokemonMoves,
  fastMoves,
  chargedMoves,
  pokemonTypes,
}: BestAttackersTableProps) {
  const [rankings, setRankings] = useState<RankedPokemon[]>([]);
  const [sortColumn, setSortColumn] = useState<"dps" | "tdo" | "score" | null>(
    "score"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const typeMap = useMemo(() => {
    const map = new Map<string, { type_1: string; type_2?: string }>();
    if (!Array.isArray(pokemonTypes)) return map;
    for (const t of pokemonTypes) {
      if (!t || !Array.isArray(t.type)) continue;
      const key = `${t.pokemon_id}-${t.form || "Normal"}`;
      map.set(key, { type_1: t.type[0] || "Normal", type_2: t.type[1] });
    }
    return map;
  }, [pokemonTypes]);

  // Exact same DPS & TDO logic used in DpsTdoComparerClient
  const calculateStats = (
    pokemon: Pokemon,
    fastMove: FastMove,
    chargedMove: ChargedMove
  ) => {
    const cpm = getCPMultiplier(40); // attacker level (default 40)
    const attackScaled = pokemon.base_attack * cpm;

    // Defender defense constant (baseline)
    const defenderDefense = 150;

    // STAB calculation
    const form = pokemon.form || "Normal";
    const key = `${pokemon.pokemon_id}-${form}`;
    const types = typeMap.get(key) ||
      typeMap.get(`${pokemon.pokemon_id}-Normal`) || { type_1: "Normal" };

    const fastStab =
      fastMove.type.toLowerCase() === types.type_1.toLowerCase() ||
      fastMove.type.toLowerCase() === types.type_2?.toLowerCase()
        ? 1.2
        : 1.0;

    const chargedStab =
      chargedMove.type.toLowerCase() === types.type_1.toLowerCase() ||
      chargedMove.type.toLowerCase() === types.type_2?.toLowerCase()
        ? 1.2
        : 1.0;

    // Weather boosts handled later (default clear)
    const fastWeatherBonus = 1.0;
    const chargedWeatherBonus = 1.0;

    // Damage formula — identical to comparer
    const fastMoveDamage =
      0.5 *
      fastMove.power *
      (attackScaled / defenderDefense) *
      fastStab *
      fastWeatherBonus;

    const chargedMoveDamage =
      0.5 *
      chargedMove.power *
      (attackScaled / defenderDefense) *
      chargedStab *
      chargedWeatherBonus;

    // Move durations (ms → s)
    const fastDuration = fastMove.duration / 1000;
    const chargedDuration = chargedMove.duration / 1000;

    // Number of fast moves required to reach charged move
    const energyNeeded = Math.abs(chargedMove.energy_delta);
    const fastMoveEnergyGain = fastMove.energy_delta;
    const nFast = Math.ceil(energyNeeded / fastMoveEnergyGain);

    // Cycle damage & time
    const cycleDamage = fastMoveDamage * nFast + chargedMoveDamage;
    const cycleTime = fastDuration * nFast + chargedDuration;

    // DPS, TDO, and score
    const dps = cycleDamage / cycleTime;
    const tdo = (dps * pokemon.base_stamina * cpm) / 14;
    const score = (dps * tdo) / 100;

    return {
      dps: Number(dps.toFixed(2)),
      tdo: Number(tdo.toFixed(2)),
      score: Number(score.toFixed(2)),
    };
  };

  useEffect(() => {
    const results: RankedPokemon[] = [];
    for (const p of pokemonStats) {
      const moves = pokemonMoves.find((m) => m.pokemon_id === p.pokemon_id);
      if (!moves) continue;

      let best: RankedPokemon | null = null;

      for (const fastName of moves.fast_moves) {
        const fast = fastMoves.find((fm) => fm.name === fastName);
        if (!fast) continue;

        for (const chargedName of moves.charged_moves) {
          const charged = chargedMoves.find((cm) => cm.name === chargedName);
          if (!charged) continue;

          const hasTypeMove =
            fast.type.toLowerCase() === type.toLowerCase() ||
            charged.type.toLowerCase() === type.toLowerCase();

          if (!hasTypeMove) continue;

          const stats = calculateStats(p, fast, charged);
          if (!best || stats.score > best.score) {
            best = {
              pokemon: p,
              fastMove: fast,
              chargedMove: charged,
              ...stats,
            };
          }
        }
      }
      if (best) results.push(best);
    }

    const sorted = results.sort((a, b) => b.score - a.score);
    setRankings(sorted);
  }, [pokemonStats, pokemonMoves, fastMoves, chargedMoves, type]);

  const sortedRankings = useMemo(() => {
    if (!sortColumn) return rankings;
    return [...rankings].sort((a, b) =>
      sortOrder === "desc"
        ? b[sortColumn] - a[sortColumn]
        : a[sortColumn] - b[sortColumn]
    );
  }, [rankings, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedRankings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = sortedRankings.slice(startIndex, endIndex);

  const handleSort = (column: "dps" | "tdo" | "score") => {
    if (sortColumn === column)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const renderSortIcon = (column: "dps" | "tdo" | "score") => {
    if (sortColumn !== column)
      return <ArrowUpDown size={14} className="opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-0">
        {/* 🧩 Wrap table in a responsive container */}
        <div className="w-full overflow-x-auto">
  <table className="w-full table-fixed border-collapse min-w-[800px]">
    <thead className="bg-muted/50 border-b border-border text-xs sm:text-sm">
      <tr>
        <th className="px-2 sm:px-4 py-3 text-left font-semibold w-[40px]">#</th>
        <th className="px-2 sm:px-4 py-3 text-left font-semibold w-[180px]">Pokémon</th>
        <th className="px-2 sm:px-4 py-3 text-left font-semibold w-[160px]">Fast Attack</th>
        <th className="px-2 sm:px-4 py-3 text-left font-semibold w-[160px]">Charged Attack</th>

        {/* DPS / TDO / Score headers are centered both visually & logically */}
        <th
          className="px-2 sm:px-4 py-3 font-semibold text-center w-[80px] cursor-pointer"
          onClick={() => handleSort("dps")}
        >
          <div className="flex flex-col items-center justify-center">
            DPS {renderSortIcon("dps")}
          </div>
        </th>
        <th
          className="px-2 sm:px-4 py-3 font-semibold text-center w-[80px] cursor-pointer"
          onClick={() => handleSort("tdo")}
        >
          <div className="flex flex-col items-center justify-center">
            TDO {renderSortIcon("tdo")}
          </div>
        </th>
        <th
          className="px-2 sm:px-4 py-3 font-semibold text-center w-[80px] cursor-pointer"
          onClick={() => handleSort("score")}
        >
          <div className="flex flex-col items-center justify-center">
            Score {renderSortIcon("score")}
          </div>
        </th>
      </tr>
    </thead>

    <tbody className="text-xs sm:text-sm">
      {currentPageData.length === 0 ? (
        <tr>
          <td colSpan={7} className="text-center py-10 text-muted-foreground">
            Loading best {type}-type attackers...
          </td>
        </tr>
      ) : (
        currentPageData.map((entry, i) => (
          <tr
            key={`${entry.pokemon.pokemon_id}-${entry.fastMove.name}-${entry.chargedMove.name}-${i}`}
            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
          >
            <td className="px-2 sm:px-4 py-3 text-center font-medium">
              {startIndex + i + 1}
            </td>

            <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
              <Link
                href={`/pokemon/${entry.pokemon.pokemon_id}`}
                className="flex items-center gap-2 sm:gap-3"
              >
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.pokemon.pokemon_id}.png`}
                  alt={entry.pokemon.pokemon_name}
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
                <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                  {entry.pokemon.pokemon_name}
                </span>
              </Link>
            </td>

            <td className="px-2 sm:px-4 py-3 text-muted-foreground whitespace-nowrap truncate max-w-[130px]">
              {entry.fastMove.name}
            </td>

            <td className="px-2 sm:px-4 py-3 text-muted-foreground whitespace-nowrap truncate max-w-[130px]">
              {entry.chargedMove.name}
            </td>

            {/* 👇 FIXED: DPS/TDO/Score now perfectly centered across devices */}
            <td className="px-2 sm:px-4 py-3 font-bold text-blue-400 text-center">
              {entry.dps}
            </td>
            <td className="px-2 sm:px-4 py-3 font-bold text-yellow-400 text-center">
              {entry.tdo}
            </td>
            <td className="px-2 sm:px-4 py-3 font-bold text-green-400 text-center">
              {entry.score}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


        {/* Pagination Footer (unchanged) */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-muted/30 text-sm flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Show 10</SelectItem>
                <SelectItem value="25">Show 25</SelectItem>
                <SelectItem value="50">Show 50</SelectItem>
                <SelectItem value="100">Show 100</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, rankings.length)} of{" "}
              {rankings.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
