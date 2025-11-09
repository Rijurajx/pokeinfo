"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronUp, ChevronDown, Search } from "lucide-react"

interface EventMove {
  move: string
  move_type: string
  pokemon: string
}

interface CommunityDay {
  start_date: string
  end_date: string
  event_moves: EventMove[]
  bonuses: string[]
  boosted_pokemon: string[]
}

interface ProcessedEntry {
  year: number
  month: string
  monthNum: number
  pokemon: string
  pokemonId: string
  evolution: string
  evolutionId: string
  fastAttack: string | null
  fastAttackType: string | null
  chargedAttack: string | null
  chargedAttackType: string | null
}

const EVOLUTION_MAP: Record<string, { base: string; evolution: string }> = {
  Pikachu: { base: "Pikachu", evolution: "Pikachu" },
  Raichu: { base: "Pikachu", evolution: "Raichu" },
  Dratini: { base: "Dratini", evolution: "Dragonite" },
  Dragonair: { base: "Dratini", evolution: "Dragonite" },
  Dragonite: { base: "Dratini", evolution: "Dragonite" },
  Bulbasaur: { base: "Bulbasaur", evolution: "Venusaur" },
  Ivysaur: { base: "Bulbasaur", evolution: "Venusaur" },
  Venusaur: { base: "Bulbasaur", evolution: "Venusaur" },
  Charmander: { base: "Charmander", evolution: "Charizard" },
  Charmeleon: { base: "Charmander", evolution: "Charizard" },
  Charizard: { base: "Charmander", evolution: "Charizard" },
  Squirtle: { base: "Squirtle", evolution: "Blastoise" },
  Wartortle: { base: "Squirtle", evolution: "Blastoise" },
  Blastoise: { base: "Squirtle", evolution: "Blastoise" },
  Mareep: { base: "Mareep", evolution: "Ampharos" },
  Flaaffy: { base: "Mareep", evolution: "Ampharos" },
  Ampharos: { base: "Mareep", evolution: "Ampharos" },
  Larvitar: { base: "Larvitar", evolution: "Tyranitar" },
  Pupitar: { base: "Larvitar", evolution: "Tyranitar" },
  Tyranitar: { base: "Larvitar", evolution: "Tyranitar" },
  Eevee: { base: "Eevee", evolution: "Eevee" },
  Vaporeon: { base: "Eevee", evolution: "Vaporeon" },
  Jolteon: { base: "Eevee", evolution: "Jolteon" },
  Flareon: { base: "Eevee", evolution: "Flareon" },
  Espeon: { base: "Eevee", evolution: "Espeon" },
  Umbreon: { base: "Eevee", evolution: "Umbreon" },
  Leafeon: { base: "Eevee", evolution: "Leafeon" },
  Glaceon: { base: "Eevee", evolution: "Glaceon" },
  Sylveon: { base: "Eevee", evolution: "Sylveon" },
  Chikorita: { base: "Chikorita", evolution: "Meganium" },
  Bayleef: { base: "Chikorita", evolution: "Meganium" },
  Meganium: { base: "Chikorita", evolution: "Meganium" },
  Cyndaquil: { base: "Cyndaquil", evolution: "Typhlosion" },
  Quilava: { base: "Cyndaquil", evolution: "Typhlosion" },
  Typhlosion: { base: "Cyndaquil", evolution: "Typhlosion" },
  Totodile: { base: "Totodile", evolution: "Feraligatr" },
  Croconaw: { base: "Totodile", evolution: "Feraligatr" },
  Feraligatr: { base: "Totodile", evolution: "Feraligatr" },
  Beldum: { base: "Beldum", evolution: "Metagross" },
  Metang: { base: "Beldum", evolution: "Metagross" },
  Metagross: { base: "Beldum", evolution: "Metagross" },
  Slakoth: { base: "Slakoth", evolution: "Slaking" },
  Vigoroth: { base: "Slakoth", evolution: "Slaking" },
  Slaking: { base: "Slakoth", evolution: "Slaking" },
  Treecko: { base: "Treecko", evolution: "Sceptile" },
  Grovyle: { base: "Treecko", evolution: "Sceptile" },
  Sceptile: { base: "Treecko", evolution: "Sceptile" },
  Torchic: { base: "Torchic", evolution: "Blaziken" },
  Combusken: { base: "Torchic", evolution: "Blaziken" },
  Blaziken: { base: "Torchic", evolution: "Blaziken" },
  Mudkip: { base: "Mudkip", evolution: "Swampert" },
  Marshtomp: { base: "Mudkip", evolution: "Swampert" },
  Swampert: { base: "Mudkip", evolution: "Swampert" },
  Ralts: { base: "Ralts", evolution: "Gardevoir" },
  Kirlia: { base: "Ralts", evolution: "Gardevoir" },
  Gardevoir: { base: "Ralts", evolution: "Gardevoir" },
  Gallade: { base: "Ralts", evolution: "Gallade" },
  Bagon: { base: "Bagon", evolution: "Salamence" },
  Shelgon: { base: "Bagon", evolution: "Salamence" },
  Salamence: { base: "Bagon", evolution: "Salamence" },
  Trapinch: { base: "Trapinch", evolution: "Flygon" },
  Vibrava: { base: "Trapinch", evolution: "Flygon" },
  Flygon: { base: "Trapinch", evolution: "Flygon" },
  Turtwig: { base: "Turtwig", evolution: "Torterra" },
  Grotle: { base: "Turtwig", evolution: "Torterra" },
  Torterra: { base: "Turtwig", evolution: "Torterra" },
  Chimchar: { base: "Chimchar", evolution: "Infernape" },
  Monferno: { base: "Chimchar", evolution: "Infernape" },
  Infernape: { base: "Chimchar", evolution: "Infernape" },
  Piplup: { base: "Piplup", evolution: "Empoleon" },
  Prinplup: { base: "Piplup", evolution: "Empoleon" },
  Empoleon: { base: "Piplup", evolution: "Empoleon" },
  Rhyhorn: { base: "Rhyhorn", evolution: "Rhyperior" },
  Rhydon: { base: "Rhyhorn", evolution: "Rhyperior" },
  Rhyperior: { base: "Rhyhorn", evolution: "Rhyperior" },
  Swinub: { base: "Swinub", evolution: "Mamoswine" },
  Piloswine: { base: "Swinub", evolution: "Mamoswine" },
  Mamoswine: { base: "Swinub", evolution: "Mamoswine" },
  Seedot: { base: "Seedot", evolution: "Shiftry" },
  Nuzleaf: { base: "Seedot", evolution: "Shiftry" },
  Shiftry: { base: "Seedot", evolution: "Shiftry" },
  Weedle: { base: "Weedle", evolution: "Beedrill" },
  Kakuna: { base: "Weedle", evolution: "Beedrill" },
  Beedrill: { base: "Weedle", evolution: "Beedrill" },
  Gastly: { base: "Gastly", evolution: "Gengar" },
  Haunter: { base: "Gastly", evolution: "Gengar" },
  Gengar: { base: "Gastly", evolution: "Gengar" },
  Magikarp: { base: "Magikarp", evolution: "Gyarados" },
  Gyarados: { base: "Magikarp", evolution: "Gyarados" },
  Porygon: { base: "Porygon", evolution: "Porygon-Z" },
  Porygon2: { base: "Porygon", evolution: "Porygon-Z" },
  "Porygon-Z": { base: "Porygon", evolution: "Porygon-Z" },
  Electabuzz: { base: "Elekid", evolution: "Electivire" },
  Elekid: { base: "Elekid", evolution: "Electivire" },
  Electivire: { base: "Elekid", evolution: "Electivire" },
  Magmar: { base: "Magby", evolution: "Magmortar" },
  Magby: { base: "Magby", evolution: "Magmortar" },
  Magmortar: { base: "Magby", evolution: "Magmortar" },
  Machop: { base: "Machop", evolution: "Machamp" },
  Machoke: { base: "Machop", evolution: "Machamp" },
  Machamp: { base: "Machop", evolution: "Machamp" },
  Abra: { base: "Abra", evolution: "Alakazam" },
  Kadabra: { base: "Abra", evolution: "Alakazam" },
  Alakazam: { base: "Abra", evolution: "Alakazam" },
  Gible: { base: "Gible", evolution: "Garchomp" },
  Gabite: { base: "Gible", evolution: "Garchomp" },
  Garchomp: { base: "Gible", evolution: "Garchomp" },
  Fletchling: { base: "Fletchling", evolution: "Talonflame" },
  Fletchinder: { base: "Fletchling", evolution: "Talonflame" },
  Talonflame: { base: "Fletchling", evolution: "Talonflame" },
  Snivy: { base: "Snivy", evolution: "Serperior" },
  Servine: { base: "Snivy", evolution: "Serperior" },
  Serperior: { base: "Snivy", evolution: "Serperior" },
  Tepig: { base: "Tepig", evolution: "Emboar" },
  Pignite: { base: "Tepig", evolution: "Emboar" },
  Emboar: { base: "Tepig", evolution: "Emboar" },
  Oshawott: { base: "Oshawott", evolution: "Samurott" },
  Dewott: { base: "Oshawott", evolution: "Samurott" },
  Samurott: { base: "Oshawott", evolution: "Samurott" },
  Chespin: { base: "Chespin", evolution: "Chesnaught" },
  Quilladin: { base: "Chespin", evolution: "Chesnaught" },
  Chesnaught: { base: "Chespin", evolution: "Chesnaught" },
  Fennekin: { base: "Fennekin", evolution: "Delphox" },
  Braixen: { base: "Fennekin", evolution: "Delphox" },
  Delphox: { base: "Fennekin", evolution: "Delphox" },
  Froakie: { base: "Froakie", evolution: "Greninja" },
  Frogadier: { base: "Froakie", evolution: "Greninja" },
  Greninja: { base: "Froakie", evolution: "Greninja" },
  Rowlet: { base: "Rowlet", evolution: "Decidueye" },
  Dartrix: { base: "Rowlet", evolution: "Decidueye" },
  Decidueye: { base: "Rowlet", evolution: "Decidueye" },
  Litten: { base: "Litten", evolution: "Incineroar" },
  Torracat: { base: "Litten", evolution: "Incineroar" },
  Incineroar: { base: "Litten", evolution: "Incineroar" },
  Popplio: { base: "Popplio", evolution: "Primarina" },
  Brionne: { base: "Popplio", evolution: "Primarina" },
  Primarina: { base: "Popplio", evolution: "Primarina" },
  Grookey: { base: "Grookey", evolution: "Rillaboom" },
  Thwackey: { base: "Grookey", evolution: "Rillaboom" },
  Rillaboom: { base: "Grookey", evolution: "Rillaboom" },
  Scorbunny: { base: "Scorbunny", evolution: "Cinderace" },
  Raboot: { base: "Scorbunny", evolution: "Cinderace" },
  Cinderace: { base: "Scorbunny", evolution: "Cinderace" },
  Sobble: { base: "Sobble", evolution: "Inteleon" },
  Drizzile: { base: "Sobble", evolution: "Inteleon" },
  Inteleon: { base: "Sobble", evolution: "Inteleon" },
  Sprigatito: { base: "Sprigatito", evolution: "Meowscarada" },
  Floragato: { base: "Sprigatito", evolution: "Meowscarada" },
  Meowscarada: { base: "Sprigatito", evolution: "Meowscarada" },
  Fuecoco: { base: "Fuecoco", evolution: "Skeledirge" },
  Crocalor: { base: "Fuecoco", evolution: "Skeledirge" },
  Skeledirge: { base: "Fuecoco", evolution: "Skeledirge" },
  Quaxly: { base: "Quaxly", evolution: "Quaquaval" },
  Quaxwell: { base: "Quaxly", evolution: "Quaquaval" },
  Quaquaval: { base: "Quaxly", evolution: "Quaquaval" },
  Sandshrew: { base: "Sandshrew", evolution: "Sandslash" },
  Sandslash: { base: "Sandshrew", evolution: "Sandslash" },
  Stufful: { base: "Stufful", evolution: "Bewear" },
  Bewear: { base: "Stufful", evolution: "Bewear" },
  Litwick: { base: "Litwick", evolution: "Chandelure" },
  Lampent: { base: "Litwick", evolution: "Chandelure" },
  Chandelure: { base: "Litwick", evolution: "Chandelure" },
  Goomy: { base: "Goomy", evolution: "Goodra" },
  Sliggoo: { base: "Goomy", evolution: "Goodra" },
  Goodra: { base: "Goomy", evolution: "Goodra" },
  Starly: { base: "Starly", evolution: "Staraptor" },
  Staravia: { base: "Starly", evolution: "Staraptor" },
  Staraptor: { base: "Starly", evolution: "Staraptor" },
  Hoppip: { base: "Hoppip", evolution: "Jumpluff" },
  Skiploom: { base: "Hoppip", evolution: "Jumpluff" },
  Jumpluff: { base: "Hoppip", evolution: "Jumpluff" },
  Alolan: { base: "Sandshrew", evolution: "Sandslash" },
  Timburr: { base: "Timburr", evolution: "Conkeldurr" },
  Gurdurr: { base: "Timburr", evolution: "Conkeldurr" },
  Conkeldurr: { base: "Timburr", evolution: "Conkeldurr" },
  Duskull: { base: "Duskull", evolution: "Dusknoir" },
  Dusclops: { base: "Duskull", evolution: "Dusknoir" },
  Dusknoir: { base: "Duskull", evolution: "Dusknoir" },
  Shinx: { base: "Shinx", evolution: "Luxray" },
  Luxio: { base: "Shinx", evolution: "Luxray" },
  Luxray: { base: "Shinx", evolution: "Luxray" },
  Roggenrola: { base: "Roggenrola", evolution: "Gigalith" },
  Boldore: { base: "Roggenrola", evolution: "Gigalith" },
  Gigalith: { base: "Roggenrola", evolution: "Gigalith" },
  Deino: { base: "Deino", evolution: "Hydreigon" },
  Zweilous: { base: "Deino", evolution: "Hydreigon" },
  Hydreigon: { base: "Deino", evolution: "Hydreigon" },
  Axew: { base: "Axew", evolution: "Haxorus" },
  Fraxure: { base: "Axew", evolution: "Haxorus" },
  Haxorus: { base: "Axew", evolution: "Haxorus" },
  Clauncher: { base: "Clauncher", evolution: "Clawitzer" },
  Clawitzer: { base: "Clauncher", evolution: "Clawitzer" },
  Bounsweet: { base: "Bounsweet", evolution: "Tsareena" },
  Steenee: { base: "Bounsweet", evolution: "Tsareena" },
  Tsareena: { base: "Bounsweet", evolution: "Tsareena" },
  Rockruff: { base: "Rockruff", evolution: "Lycanroc" },
  Lycanroc: { base: "Rockruff", evolution: "Lycanroc" },
  Exeggcute: { base: "Exeggcute", evolution: "Exeggutor" },
  Exeggutor: { base: "Exeggcute", evolution: "Exeggutor" },
  Oddish: { base: "Oddish", evolution: "Vileplume" },
  Gloom: { base: "Oddish", evolution: "Vileplume" },
  Vileplume: { base: "Oddish", evolution: "Vileplume" },
  Bellossom: { base: "Oddish", evolution: "Bellossom" },
  Poliwag: { base: "Poliwag", evolution: "Poliwrath" },
  Poliwhirl: { base: "Poliwag", evolution: "Poliwrath" },
  Poliwrath: { base: "Poliwag", evolution: "Poliwrath" },
  Politoed: { base: "Poliwag", evolution: "Politoed" },
  Slowpoke: { base: "Slowpoke", evolution: "Slowbro" },
  Slowbro: { base: "Slowpoke", evolution: "Slowbro" },
  Slowking: { base: "Slowpoke", evolution: "Slowking" },
  Magnemite: { base: "Magnemite", evolution: "Magnezone" },
  Magneton: { base: "Magnemite", evolution: "Magnezone" },
  Magnezone: { base: "Magnemite", evolution: "Magnezone" },
  Onix: { base: "Onix", evolution: "Steelix" },
  Steelix: { base: "Onix", evolution: "Steelix" },
  Scyther: { base: "Scyther", evolution: "Scizor" },
  Scizor: { base: "Scyther", evolution: "Scizor" },
  Kleavor: { base: "Scyther", evolution: "Kleavor" },
  Sneasel: { base: "Sneasel", evolution: "Weavile" },
  Weavile: { base: "Sneasel", evolution: "Weavile" },
  Sneasler: { base: "Sneasel", evolution: "Sneasler" },
  Teddiursa: { base: "Teddiursa", evolution: "Ursaring" },
  Ursaring: { base: "Teddiursa", evolution: "Ursaring" },
  Ursaluna: { base: "Teddiursa", evolution: "Ursaluna" },
  Roselia: { base: "Budew", evolution: "Roserade" },
  Budew: { base: "Budew", evolution: "Roserade" },
  Roserade: { base: "Budew", evolution: "Roserade" },
  Bronzor: { base: "Bronzor", evolution: "Bronzong" },
  Bronzong: { base: "Bronzor", evolution: "Bronzong" },
  Croagunk: { base: "Croagunk", evolution: "Toxicroak" },
  Toxicroak: { base: "Croagunk", evolution: "Toxicroak" },
  Purrloin: { base: "Purrloin", evolution: "Liepard" },
  Liepard: { base: "Purrloin", evolution: "Liepard" },
  Venipede: { base: "Venipede", evolution: "Scolipede" },
  Whirlipede: { base: "Venipede", evolution: "Scolipede" },
  Scolipede: { base: "Venipede", evolution: "Scolipede" },
  Cottonee: { base: "Cottonee", evolution: "Whimsicott" },
  Whimsicott: { base: "Cottonee", evolution: "Whimsicott" },
  Petilil: { base: "Petilil", evolution: "Lilligant" },
  Lilligant: { base: "Petilil", evolution: "Lilligant" },
  Dwebble: { base: "Dwebble", evolution: "Crustle" },
  Crustle: { base: "Dwebble", evolution: "Crustle" },
  Joltik: { base: "Joltik", evolution: "Galvantula" },
  Galvantula: { base: "Joltik", evolution: "Galvantula" },
  Tynamo: { base: "Tynamo", evolution: "Eelektross" },
  Eelektrik: { base: "Tynamo", evolution: "Eelektross" },
  Eelektross: { base: "Tynamo", evolution: "Eelektross" },
  Litleo: { base: "Litleo", evolution: "Pyroar" },
  Pyroar: { base: "Litleo", evolution: "Pyroar" },
  Skiddo: { base: "Skiddo", evolution: "Gogoat" },
  Gogoat: { base: "Skiddo", evolution: "Gogoat" },
  Inkay: { base: "Inkay", evolution: "Malamar" },
  Malamar: { base: "Inkay", evolution: "Malamar" },
  Helioptile: { base: "Helioptile", evolution: "Heliolisk" },
  Heliolisk: { base: "Helioptile", evolution: "Heliolisk" },
  Noibat: { base: "Noibat", evolution: "Noivern" },
  Noivern: { base: "Noibat", evolution: "Noivern" },
  Pikipek: { base: "Pikipek", evolution: "Toucannon" },
  Trumbeak: { base: "Pikipek", evolution: "Toucannon" },
  Toucannon: { base: "Pikipek", evolution: "Toucannon" },
  Yungoos: { base: "Yungoos", evolution: "Gumshoos" },
  Gumshoos: { base: "Yungoos", evolution: "Gumshoos" },
  Grubbin: { base: "Grubbin", evolution: "Vikavolt" },
  Charjabug: { base: "Grubbin", evolution: "Vikavolt" },
  Vikavolt: { base: "Grubbin", evolution: "Vikavolt" },
  Mareanie: { base: "Mareanie", evolution: "Toxapex" },
  Toxapex: { base: "Mareanie", evolution: "Toxapex" },
  Mudbray: { base: "Mudbray", evolution: "Mudsdale" },
  Mudsdale: { base: "Mudbray", evolution: "Mudsdale" },
  Dewpider: { base: "Dewpider", evolution: "Araquanid" },
  Araquanid: { base: "Dewpider", evolution: "Araquanid" },
  Fomantis: { base: "Fomantis", evolution: "Lurantis" },
  Lurantis: { base: "Fomantis", evolution: "Lurantis" },
  Salandit: { base: "Salandit", evolution: "Salazzle" },
  Salazzle: { base: "Salandit", evolution: "Salazzle" },
  Wimpod: { base: "Wimpod", evolution: "Golisopod" },
  Golisopod: { base: "Wimpod", evolution: "Golisopod" },
  Sandygast: { base: "Sandygast", evolution: "Palossand" },
  Palossand: { base: "Sandygast", evolution: "Palossand" },
  Jangmo: { base: "Jangmo-o", evolution: "Kommo-o" },
  "Jangmo-o": { base: "Jangmo-o", evolution: "Kommo-o" },
  Hakamo: { base: "Jangmo-o", evolution: "Kommo-o" },
  "Hakamo-o": { base: "Jangmo-o", evolution: "Kommo-o" },
  Kommo: { base: "Jangmo-o", evolution: "Kommo-o" },
  "Kommo-o": { base: "Jangmo-o", evolution: "Kommo-o" },
  Skwovet: { base: "Skwovet", evolution: "Greedent" },
  Greedent: { base: "Skwovet", evolution: "Greedent" },
  Rookidee: { base: "Rookidee", evolution: "Corviknight" },
  Corvisquire: { base: "Rookidee", evolution: "Corviknight" },
  Corviknight: { base: "Rookidee", evolution: "Corviknight" },
  Chewtle: { base: "Chewtle", evolution: "Drednaw" },
  Drednaw: { base: "Chewtle", evolution: "Drednaw" },
  Yamper: { base: "Yamper", evolution: "Boltund" },
  Boltund: { base: "Yamper", evolution: "Boltund" },
  Rolycoly: { base: "Rolycoly", evolution: "Coalossal" },
  Carkol: { base: "Rolycoly", evolution: "Coalossal" },
  Coalossal: { base: "Rolycoly", evolution: "Coalossal" },
  Applin: { base: "Applin", evolution: "Flapple" },
  Flapple: { base: "Applin", evolution: "Flapple" },
  Appletun: { base: "Applin", evolution: "Appletun" },
  Dipplin: { base: "Applin", evolution: "Dipplin" },
  Silicobra: { base: "Silicobra", evolution: "Sandaconda" },
  Sandaconda: { base: "Silicobra", evolution: "Sandaconda" },
  Arrokuda: { base: "Arrokuda", evolution: "Barraskewda" },
  Barraskewda: { base: "Arrokuda", evolution: "Barraskewda" },
  Toxel: { base: "Toxel", evolution: "Toxtricity" },
  Toxtricity: { base: "Toxel", evolution: "Toxtricity" },
  Sizzlipede: { base: "Sizzlipede", evolution: "Centiskorch" },
  Centiskorch: { base: "Sizzlipede", evolution: "Centiskorch" },
  Clobbopus: { base: "Clobbopus", evolution: "Grapploct" },
  Grapploct: { base: "Clobbopus", evolution: "Grapploct" },
  Hatenna: { base: "Hatenna", evolution: "Hatterene" },
  Hattrem: { base: "Hatenna", evolution: "Hatterene" },
  Hatterene: { base: "Hatenna", evolution: "Hatterene" },
  Impidimp: { base: "Impidimp", evolution: "Grimmsnarl" },
  Morgrem: { base: "Impidimp", evolution: "Grimmsnarl" },
  Grimmsnarl: { base: "Impidimp", evolution: "Grimmsnarl" },
  Falinks: { base: "Falinks", evolution: "Falinks" },
  Pincurchin: { base: "Pincurchin", evolution: "Pincurchin" },
  Snom: { base: "Snom", evolution: "Frosmoth" },
  Frosmoth: { base: "Snom", evolution: "Frosmoth" },
  Cufant: { base: "Cufant", evolution: "Copperajah" },
  Copperajah: { base: "Cufant", evolution: "Copperajah" },
  Dreepy: { base: "Dreepy", evolution: "Dragapult" },
  Drakloak: { base: "Dreepy", evolution: "Dragapult" },
  Dragapult: { base: "Dreepy", evolution: "Dragapult" },
}

function getPokemonIdFromName(name: string, allPokemon: any[]): string {
  const pokemon = allPokemon.find(
    (p) =>
      p.pokemon_name.toLowerCase() === name.toLowerCase() ||
      p.pokemon_name.toLowerCase().replace(/[^a-z0-9]/g, "") === name.toLowerCase().replace(/[^a-z0-9]/g, ""),
  )
  return pokemon ? String(pokemon.pokemon_id).padStart(3, "0") : "000"
}

export default function CommunityDayClient({
  communityDays,
  allPokemon,
  fastMoves,
  chargedMoves,
}: {
  communityDays: CommunityDay[]
  allPokemon: any[]
  fastMoves: any[]
  chargedMoves: any[]
}) {
  const [sortBy, setSortBy] = useState<"year" | "month" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const fastMoveTypes = new Map(fastMoves.map((m) => [m.name, m.type]))
  const chargedMoveTypes = new Map(chargedMoves.map((m) => [m.name, m.type]))

  const entries: ProcessedEntry[] = useMemo(() => {
    const result: ProcessedEntry[] = []

    for (const cd of communityDays) {
      const startDate = new Date(cd.start_date)
      const year = startDate.getFullYear()
      const monthNum = startDate.getMonth()
      const month = startDate.toLocaleString("en-US", { month: "long" })

      const pokemonMoves = new Map<string, { fast: EventMove | null; charged: EventMove | null }>()

      for (const move of cd.event_moves) {
        if (!pokemonMoves.has(move.pokemon)) {
          pokemonMoves.set(move.pokemon, { fast: null, charged: null })
        }
        const moveData = pokemonMoves.get(move.pokemon)!

        if (fastMoveTypes.has(move.move)) {
          moveData.fast = move
        } else if (chargedMoveTypes.has(move.move)) {
          moveData.charged = move
        }
      }

      for (const [pokemonName, moves] of pokemonMoves) {
        const evolutionData = EVOLUTION_MAP[pokemonName] || { base: pokemonName, evolution: pokemonName }
        const basePokemon = evolutionData.base
        const evolutionPokemon = evolutionData.evolution

        const pokemonId = getPokemonIdFromName(basePokemon, allPokemon)
        const evolutionId = getPokemonIdFromName(evolutionPokemon, allPokemon)

        result.push({
          year,
          month,
          monthNum,
          pokemon: basePokemon,
          pokemonId,
          evolution: evolutionPokemon,
          evolutionId,
          fastAttack: moves.fast?.move || null,
          fastAttackType: moves.fast ? fastMoveTypes.get(moves.fast.move) || null : null,
          chargedAttack: moves.charged?.move || null,
          chargedAttackType: moves.charged ? chargedMoveTypes.get(moves.charged.move) || null : null,
        })
      }
    }

    return result
  }, [communityDays, allPokemon, fastMoveTypes, chargedMoveTypes])

  const sortedEntries = useMemo(() => {
    const sorted = [...entries]

    if (sortBy === "year") {
      sorted.sort((a, b) => {
        const yearDiff = sortOrder === "asc" ? a.year - b.year : b.year - a.year
        if (yearDiff !== 0) return yearDiff
        return sortOrder === "asc" ? a.monthNum - b.monthNum : b.monthNum - a.monthNum
      })
    } else if (sortBy === "month") {
      sorted.sort((a, b) => {
        const yearDiff = sortOrder === "asc" ? a.year - b.year : b.year - a.year
        if (yearDiff !== 0) return yearDiff
        return sortOrder === "asc" ? a.monthNum - b.monthNum : b.monthNum - a.monthNum
      })
    } else {
      sorted.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.monthNum - a.monthNum
      })
    }

    return sorted
  }, [entries, sortBy, sortOrder])

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return sortedEntries

    const query = searchQuery.toLowerCase().trim()
    return sortedEntries.filter((entry) => {
      return (
        entry.pokemon.toLowerCase().includes(query) ||
        entry.evolution.toLowerCase().includes(query) ||
        (entry.fastAttack && entry.fastAttack.toLowerCase().includes(query)) ||
        (entry.chargedAttack && entry.chargedAttack.toLowerCase().includes(query))
      )
    })
  }, [sortedEntries, searchQuery])

  const handleSort = (column: "year" | "month") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder(column === "year" ? "asc" : "asc")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-4">All Community Day Moves</h1>
              <p className="text-muted-foreground leading-relaxed">
                Community Days in Pokémon GO are some of the most popular events, where Community Day moves hold a
                special place in our heart. Along with the chance to catch rare shiny versions of Pokémon, these events
                offer exclusive moves for certain Pokémon that can significantly improving their performance in PvE
                (gyms, raids) and PvP (GO Battle League). These Community Day moves are exclusive forms during the event
                for via Elite TMs later, making them highly sought after. Here's a comprehensive list of all the
                Community Day moves from past events.
              </p>
            </div>
            <div className="lg:w-80 w-full flex-shrink-0">
              <Image
                src="/pokemon-go-community-day-colorful-banner.jpg"
                alt="Community Day Banner"
                width={320}
                height={180}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Pokémon or move name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredEntries.length} result{filteredEntries.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-20" />
                <col className="w-32" />
                <col className="w-48" />
                <col className="w-48" />
                <col className="w-52" />
                <col className="w-52" />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    className="p-4 text-left text-foreground font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("year")}
                  >
                    <div className="flex items-center gap-2">
                      Year
                      {sortBy === "year" &&
                        (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left text-foreground font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("month")}
                  >
                    <div className="flex items-center gap-2">
                      Month
                      {sortBy === "month" &&
                        (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="p-4 text-left text-foreground font-semibold">Pokémon</th>
                  <th className="p-4 text-left text-foreground font-semibold">Evolution</th>
                  <th className="p-4 text-left text-foreground font-semibold">Fast Attack</th>
                  <th className="p-4 text-left text-foreground font-semibold">Charged Attack</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground">{entry.year}</td>
                      <td className="p-4 text-muted-foreground">{entry.month}</td>
                      <td className="p-4">
                        <Link
                          href={`/pokemon/${entry.pokemonId}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number.parseInt(entry.pokemonId)}.png`}
                            alt={entry.pokemon}
                            width={48}
                            height={48}
                            className="pixelated flex-shrink-0"
                          />
                          <span className="text-foreground font-medium truncate">{entry.pokemon}</span>
                        </Link>
                      </td>
                      <td className="p-4">
                        {entry.evolution !== entry.pokemon ? (
                          <Link
                            href={`/pokemon/${entry.evolutionId}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number.parseInt(entry.evolutionId)}.png`}
                              alt={entry.evolution}
                              width={48}
                              height={48}
                              className="pixelated flex-shrink-0"
                            />
                            <span className="text-foreground font-medium truncate">{entry.evolution}</span>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {entry.fastAttack ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                backgroundColor: getTypeColor(entry.fastAttackType || "normal"),
                              }}
                            >
                              {getTypeIcon(entry.fastAttackType || "normal")}
                            </div>
                            <span className="text-foreground text-sm truncate">{entry.fastAttack}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {entry.chargedAttack ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                backgroundColor: getTypeColor(entry.chargedAttackType || "normal"),
                              }}
                            >
                              {getTypeIcon(entry.chargedAttackType || "normal")}
                            </div>
                            <span className="text-foreground text-sm truncate">{entry.chargedAttack}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No results found for "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  }
  return colors[type.toLowerCase()] || colors.normal
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    normal: "⚪",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "👊",
    poison: "☠️",
    ground: "⛰️",
    flying: "🦅",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌙",
    steel: "⚙️",
    fairy: "✨",
  }
  return icons[type.toLowerCase()] || "⚪"
}
