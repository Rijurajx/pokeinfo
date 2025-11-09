import Image from "next/image"
import Link from "next/link"
import { TYPE_COLORS } from "@/lib/type-colors"

// Static data for mega Pokémon organized by type boost
const megaBoostData = {
  normal: [
    { id: 115, name: "Mega Kangaskhan", types: ["normal"] },
    { id: 127, name: "Mega Pinsir", types: ["bug"] },
    { id: 142, name: "Mega Aerodactyl", types: ["rock", "flying"] },
    { id: 486, name: "Mega Regigigas", types: ["normal"] },
  ],
  fighting: [
    { id: 68, name: "Mega Machamp", types: ["fighting"] },
    { id: 214, name: "Mega Heracross", types: ["bug", "fighting"] },
    { id: 257, name: "Mega Blaziken", types: ["fire", "fighting"] },
    { id: 308, name: "Mega Medicham", types: ["fighting", "psychic"] },
    { id: 448, name: "Mega Lucario", types: ["fighting", "steel"] },
    { id: 475, name: "Mega Gallade", types: ["psychic", "fighting"] },
  ],
  flying: [
    { id: 6, name: "Mega Charizard Y", types: ["fire", "flying"] },
    { id: 18, name: "Mega Pidgeot", types: ["normal", "flying"] },
    { id: 142, name: "Mega Aerodactyl", types: ["rock", "flying"] },
    { id: 334, name: "Mega Altaria", types: ["dragon", "fairy"] },
    { id: 384, name: "Mega Rayquaza", types: ["dragon", "flying"] },
  ],
  poison: [
    { id: 3, name: "Mega Venusaur", types: ["grass", "poison"] },
    { id: 89, name: "Mega Muk", types: ["poison"] },
    { id: 94, name: "Mega Gengar", types: ["ghost", "poison"] },
    { id: 15, name: "Mega Beedrill", types: ["bug", "poison"] },
    { id: 34, name: "Mega Nidoking", types: ["poison", "ground"] },
  ],
  ground: [
    { id: 34, name: "Mega Nidoking", types: ["poison", "ground"] },
    { id: 208, name: "Mega Steelix", types: ["steel", "ground"] },
    { id: 260, name: "Mega Swampert", types: ["water", "ground"] },
    { id: 323, name: "Mega Camerupt", types: ["fire", "ground"] },
    { id: 445, name: "Mega Garchomp", types: ["dragon", "ground"] },
  ],
  rock: [
    { id: 142, name: "Mega Aerodactyl", types: ["rock", "flying"] },
    { id: 248, name: "Mega Tyranitar", types: ["rock", "dark"] },
    { id: 306, name: "Mega Aggron", types: ["steel", "rock"] },
    { id: 464, name: "Mega Rhyperior", types: ["ground", "rock"] },
    { id: 639, name: "Mega Terrakion", types: ["rock", "fighting"] },
  ],
  bug: [
    { id: 15, name: "Mega Beedrill", types: ["bug", "poison"] },
    { id: 127, name: "Mega Pinsir", types: ["bug"] },
    { id: 212, name: "Mega Scizor", types: ["bug", "steel"] },
    { id: 214, name: "Mega Heracross", types: ["bug", "fighting"] },
  ],
  ghost: [
    { id: 94, name: "Mega Gengar", types: ["ghost", "poison"] },
    { id: 354, name: "Mega Banette", types: ["ghost"] },
    { id: 302, name: "Mega Sableye", types: ["dark", "ghost"] },
    { id: 609, name: "Mega Chandelure", types: ["ghost", "fire"] },
  ],
  steel: [
    { id: 208, name: "Mega Steelix", types: ["steel", "ground"] },
    { id: 212, name: "Mega Scizor", types: ["bug", "steel"] },
    { id: 306, name: "Mega Aggron", types: ["steel", "rock"] },
    { id: 376, name: "Mega Metagross", types: ["steel", "psychic"] },
    { id: 448, name: "Mega Lucario", types: ["fighting", "steel"] },
  ],
  fire: [
    { id: 6, name: "Mega Charizard X", types: ["fire", "dragon"] },
    { id: 6, name: "Mega Charizard Y", types: ["fire", "flying"] },
    { id: 257, name: "Mega Blaziken", types: ["fire", "fighting"] },
    { id: 229, name: "Mega Houndoom", types: ["dark", "fire"] },
    { id: 323, name: "Mega Camerupt", types: ["fire", "ground"] },
    { id: 383, name: "Primal Groudon", types: ["ground", "fire"] },
  ],
  water: [
    { id: 9, name: "Mega Blastoise", types: ["water"] },
    { id: 130, name: "Mega Gyarados", types: ["water", "dark"] },
    { id: 260, name: "Mega Swampert", types: ["water", "ground"] },
    { id: 319, name: "Mega Sharpedo", types: ["water", "dark"] },
    { id: 350, name: "Mega Milotic", types: ["water"] },
    { id: 382, name: "Primal Kyogre", types: ["water"] },
  ],
  grass: [
    { id: 3, name: "Mega Venusaur", types: ["grass", "poison"] },
    { id: 254, name: "Mega Sceptile", types: ["grass", "dragon"] },
    { id: 389, name: "Mega Torterra", types: ["grass", "ground"] },
    { id: 497, name: "Mega Serperior", types: ["grass"] },
  ],
  electric: [
    { id: 25, name: "Mega Pikachu", types: ["electric"] },
    { id: 135, name: "Mega Jolteon", types: ["electric"] },
    { id: 181, name: "Mega Ampharos", types: ["electric", "dragon"] },
    { id: 310, name: "Mega Manectric", types: ["electric"] },
    { id: 405, name: "Mega Luxray", types: ["electric"] },
  ],
  psychic: [
    { id: 65, name: "Mega Alakazam", types: ["psychic"] },
    { id: 80, name: "Mega Slowbro", types: ["water", "psychic"] },
    { id: 196, name: "Mega Espeon", types: ["psychic"] },
    { id: 308, name: "Mega Medicham", types: ["fighting", "psychic"] },
    { id: 376, name: "Mega Metagross", types: ["steel", "psychic"] },
    { id: 475, name: "Mega Gallade", types: ["psychic", "fighting"] },
    { id: 282, name: "Mega Gardevoir", types: ["psychic", "fairy"] },
    { id: 150, name: "Mega Mewtwo X", types: ["psychic", "fighting"] },
    { id: 150, name: "Mega Mewtwo Y", types: ["psychic"] },
  ],
  ice: [
    { id: 91, name: "Mega Cloyster", types: ["water", "ice"] },
    { id: 131, name: "Mega Lapras", types: ["water", "ice"] },
    { id: 362, name: "Mega Glalie", types: ["ice"] },
    { id: 478, name: "Mega Froslass", types: ["ice", "ghost"] },
    { id: 471, name: "Mega Glaceon", types: ["ice"] },
  ],
  dragon: [
    { id: 6, name: "Mega Charizard X", types: ["fire", "dragon"] },
    { id: 130, name: "Mega Gyarados", types: ["water", "dark"] },
    { id: 181, name: "Mega Ampharos", types: ["electric", "dragon"] },
    { id: 254, name: "Mega Sceptile", types: ["grass", "dragon"] },
    { id: 334, name: "Mega Altaria", types: ["dragon", "fairy"] },
    { id: 373, name: "Mega Salamence", types: ["dragon", "flying"] },
    { id: 384, name: "Mega Rayquaza", types: ["dragon", "flying"] },
    { id: 445, name: "Mega Garchomp", types: ["dragon", "ground"] },
    { id: 643, name: "Mega Reshiram", types: ["dragon", "fire"] },
    { id: 644, name: "Mega Zekrom", types: ["dragon", "electric"] },
    { id: 646, name: "Mega Kyurem", types: ["dragon", "ice"] },
    { id: 706, name: "Mega Goodra", types: ["dragon"] },
  ],
  dark: [
    { id: 130, name: "Mega Gyarados", types: ["water", "dark"] },
    { id: 229, name: "Mega Houndoom", types: ["dark", "fire"] },
    { id: 248, name: "Mega Tyranitar", types: ["rock", "dark"] },
    { id: 302, name: "Mega Sableye", types: ["dark", "ghost"] },
    { id: 319, name: "Mega Sharpedo", types: ["water", "dark"] },
    { id: 359, name: "Mega Absol", types: ["dark"] },
    { id: 197, name: "Mega Umbreon", types: ["dark"] },
  ],
  fairy: [
    { id: 36, name: "Mega Clefable", types: ["fairy"] },
    { id: 40, name: "Mega Wigglytuff", types: ["normal", "fairy"] },
    { id: 282, name: "Mega Gardevoir", types: ["psychic", "fairy"] },
    { id: 303, name: "Mega Mawile", types: ["steel", "fairy"] },
    { id: 334, name: "Mega Altaria", types: ["dragon", "fairy"] },
    { id: 700, name: "Mega Sylveon", types: ["fairy"] },
    { id: 703, name: "Mega Diancie", types: ["rock", "fairy"] },
  ],
}

export default async function MegaBoostPage() {
  const typeOrder = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-screen-2xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Mega Pokémon Attack Boosts by Type</h1>
          <p className="text-muted-foreground text-lg max-w-3xl text-pretty">
            Full moons are the only time you can evolve Ursaring into Ursaluna. Use this tracker to schedule evolution
            windows. Since timezones can be tricky, all times are listed in UTC. In order to evolve Ursaluna, you must
            do so during the full moon window and the in-game night cycle has to be active. This page uses Meeus-based
            lunar phase calculations to forecast the next 12 full moons with sub-hour precision. It can be used
            worldwide, but remember to convert UTC to your local time.
          </p>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-6 py-10 space-y-8">
        {/* Type Sections */}
        {typeOrder.map((type) => {
          const colors = TYPE_COLORS[type]
          const pokemon = megaBoostData[type as keyof typeof megaBoostData] || []

          return (
            <section key={type} className="space-y-4">
              <div
                className={`p-4 rounded-lg ${colors.bg} ${colors.border} border-2`}
                style={{
                  boxShadow: `0 0 20px ${colors.glow}`,
                }}
              >
                <h2 className={`text-xl font-bold capitalize ${colors.text} flex items-center gap-2`}>
                  <span className="text-2xl">{type === "normal" ? "⚪" : type === "fire" ? "🔥" : "⚡"}</span>
                  {type}-type Mega Boost Pokémon
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  The following Mega and Primal Pokémon boost {type}-type attacks for your team:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pokemon.map((poke, idx) => (
                  <Link key={`${poke.id}-${idx}`} href={`/pokemon/${String(poke.id).padStart(4, "0")}`}>
                    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                      <div className="relative w-full aspect-square mb-2">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
                          alt={poke.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground mb-2">{poke.name}</p>
                        <div className="flex justify-center gap-1">
                          {poke.types.map((t) => {
                            const typeColors = TYPE_COLORS[t]
                            return (
                              <div
                                key={t}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${typeColors.bg}`}
                                title={t}
                              >
                                <span className="text-xs font-bold text-white">
                                  {t === "normal"
                                    ? "⚪"
                                    : t === "fire"
                                      ? "🔥"
                                      : t === "water"
                                        ? "💧"
                                        : t === "grass"
                                          ? "🌿"
                                          : t === "electric"
                                            ? "⚡"
                                            : t === "ice"
                                              ? "❄️"
                                              : t === "fighting"
                                                ? "👊"
                                                : t === "poison"
                                                  ? "☠️"
                                                  : t === "ground"
                                                    ? "🌍"
                                                    : t === "flying"
                                                      ? "🦅"
                                                      : t === "psychic"
                                                        ? "🔮"
                                                        : t === "bug"
                                                          ? "🐛"
                                                          : t === "rock"
                                                            ? "🪨"
                                                            : t === "ghost"
                                                              ? "👻"
                                                              : t === "dragon"
                                                                ? "🐉"
                                                                : t === "dark"
                                                                  ? "🌙"
                                                                  : t === "steel"
                                                                    ? "⚙️"
                                                                    : "🧚"}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* Information Sections */}
        <section className="space-y-6 pt-8 border-t border-border">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Mega and Primal Raid Bonus</h2>
            <p className="text-muted-foreground text-pretty">
              When you have a Mega-Evolved Pokémon or a Primal Pokémon in a raid, all players in the raid receive an
              attack boost for moves that match the Mega or Primal Pokémon's type(s). This means that even if you don't
              have a Mega-Evolved Pokémon yourself, you'll still benefit from the boost if another player has one. The
              boost is 10% for same-type attacks and 30% if you have a Mega-Evolved Pokémon of that type yourself.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Mega and Primal Catch Bonus</h2>
            <p className="text-muted-foreground text-pretty">
              When catching a Pokémon while you have a Mega-Evolved or Primal Pokémon active, you'll receive bonus
              Candy. If the caught Pokémon shares a type with your Mega or Primal Pokémon, you'll get +1 Candy. If it's
              the same species, you'll get +10 Candy and +25 XL Candy (if you're level 40+). This makes Mega Evolution
              extremely valuable for Community Days and when hunting specific Pokémon.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Note on Primal Energy, Primal Groudon, and Mega Rayquaza</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Primal Groudon and Primal Kyogre use Primal Energy instead of Mega Energy. Primal Energy works the same
                way as Mega Energy.
              </li>
              <li>
                Mega Rayquaza is unique in that it doesn't require Mega Energy to Mega Evolve. Instead, you need to
                teach it the Charged Attack "Dragon Ascent" and then you can Mega Evolve it for free.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
