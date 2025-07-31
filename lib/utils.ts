import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePressureZones(
  orders: Array<[number, number]>,
  side: "bid" | "ask",
): Array<{ price: number; intensity: number; volume: number }> {
  const zones: Array<{ price: number; intensity: number; volume: number }> = []

  // Group orders by price levels (rounded to nearest dollar)
  const priceGroups = new Map<number, number>()

  orders.forEach(([price, quantity]) => {
    const roundedPrice = Math.round(price)
    priceGroups.set(roundedPrice, (priceGroups.get(roundedPrice) || 0) + quantity)
  })

  // Find significant pressure zones (above average volume)
  const volumes = Array.from(priceGroups.values())
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length
  const threshold = avgVolume * 1.5 // 50% above average

  priceGroups.forEach((volume, price) => {
    if (volume > threshold) {
      zones.push({
        price,
        intensity: volume / avgVolume,
        volume,
      })
    }
  })

  // Sort by intensity (highest first)
  return zones.sort((a, b) => b.intensity - a.intensity)
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple color interpolation - in a real app, you'd use a proper color library
  return factor > 0.5 ? color2 : color1
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatQuantity(quantity: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(quantity)
}

export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp))
}
