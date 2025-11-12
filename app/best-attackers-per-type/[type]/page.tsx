import {
  fetchAllPokemonWithForms,
  fetchPokemonMoves,
  typeEffectiveness,
  fetchFastMoves,
  fetchChargedMoves,
  fetchPokemonTypes,
} from "@/lib/fetchers";
import { TYPE_COLORS } from "@/lib/type-colors";
import { notFound } from "next/navigation";
import BestAttackersTable from "./BestAttackersTable";

export async function generateStaticParams() {
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];
  return types.map((type) => ({ type }));
}

interface TypePageProps {
  params: { type: string };
}

export default async function BestAttackersTypePage({ params }: TypePageProps) {
  const type = params.type.toLowerCase();
  const validTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  if (!validTypes.includes(type)) notFound();

  const [pokemonStats, pokemonMoves, fastMoves, chargedMoves, pokemonTypes] =
    await Promise.all([
      fetchAllPokemonWithForms(),
      fetchPokemonMoves(),
      fetchFastMoves(),
      fetchChargedMoves(),
      fetchPokemonTypes(),
    ]);

  const typeColors = TYPE_COLORS[type as keyof typeof TYPE_COLORS];
  const effectiveness = typeEffectiveness[type];

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div
          className={`rounded-lg p-8 mb-8 ${typeColors.bg} ${typeColors.border} border-2`}
          style={{ boxShadow: `0 0 30px ${typeColors.glow}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-4xl font-bold capitalize ${typeColors.text}`}>
              Best {type}-Type Attackers in Pokémon GO
            </h1>
            <div
              className={`w-16 h-16 rounded-full ${typeColors.bg} ${typeColors.border} border-2 flex items-center justify-center`}
            >
              <span className={`text-2xl font-bold ${typeColors.text}`}>
                {type[0].toUpperCase()}
              </span>
            </div>
          </div>

          <p className="text-foreground/90 mb-4">
            Explore the strongest {type}-type attackers currently available in
            Pokémon GO. Rankings are based on each Pokémon’s best {type}-type
            moveset using DPS, TDO, and overall performance.
          </p>

          {effectiveness && (
            <p className="text-foreground/80">
              {type.charAt(0).toUpperCase() + type.slice(1)}-type Pokémon are
              weak to{" "}
              {effectiveness.weaknesses.map((w, i) => (
                <span key={w}>
                  <span className="font-semibold capitalize">{w}</span>
                  {i < effectiveness.weaknesses.length - 1 && ", "}
                </span>
              ))}{" "}
              moves, and take reduced damage from{" "}
              {effectiveness.resistances.map((r, i) => (
                <span key={r}>
                  <span className="font-semibold capitalize">{r}</span>
                  {i < effectiveness.resistances.length - 1 && ", "}
                </span>
              ))}{" "}
              moves.
            </p>
          )}
        </div>

        {/* Table */}
        <BestAttackersTable
          type={type}
          pokemonStats={pokemonStats}
          pokemonMoves={pokemonMoves}
          fastMoves={fastMoves}
          chargedMoves={chargedMoves}
          pokemonTypes={pokemonTypes}
        />
      </div>
    </div>
  );
}
