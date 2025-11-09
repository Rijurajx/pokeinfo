import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const weatherBoosts: Record<string, string[]> = {
  Sunny: ["grass", "ground", "fire"],
  Cloudy: ["fairy", "fighting", "poison"],
  Rainy: ["water", "electric", "bug"],
  "Partly Cloudy": ["normal", "rock"],
  Windy: ["dragon", "flying", "psychic"],
  Snow: ["ice", "steel"],
  Fog: ["dark", "ghost"],
}

export function getWeatherBoost(types: string[]): string[] {
  const boosts: string[] = []

  for (const [weather, boostedTypes] of Object.entries(weatherBoosts)) {
    if (types.some((type) => boostedTypes.includes(type.toLowerCase()))) {
      boosts.push(weather)
    }
  }

  return boosts
}
