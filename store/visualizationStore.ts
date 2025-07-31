import { create } from "zustand"
import type { VisualizationSettings, VenueConfig, PressureZone } from "@/lib/types"

interface VisualizationState {
  settings: VisualizationSettings
  venues: VenueConfig[]
  pressureZones: PressureZone[]
  selectedSymbol: string
  isRotating: boolean
  rotationSpeed: number

  // Actions
  updateSettings: (settings: Partial<VisualizationSettings>) => void
  toggleVenue: (venueId: string) => void
  updateVenues: (venues: VenueConfig[]) => void
  setPressureZones: (zones: PressureZone[]) => void
  setSelectedSymbol: (symbol: string) => void
  toggleRotation: () => void
  setRotationSpeed: (speed: number) => void
}

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  settings: {
    timeRange: 5, // 5 minutes
    priceRange: [0, 100000],
    quantityThreshold: 0.01,
    showPressureZones: true,
    showVolumeProfile: true,
    animationSpeed: 1.0,
    colorScheme: "default",
  },

  venues: [
    {
      id: "binance",
      name: "Binance",
      color: "#F0B90B",
      enabled: true,
      websocketUrl: "wss://stream.binance.com:9443/ws/",
    },
    {
      id: "okx",
      name: "OKX",
      color: "#0052FF",
      enabled: false,
      websocketUrl: "wss://ws.okx.com:8443/ws/v5/public",
    },
    {
      id: "bybit",
      name: "Bybit",
      color: "#F7931A",
      enabled: false,
      websocketUrl: "wss://stream.bybit.com/v5/public/spot",
    },
  ],

  pressureZones: [],
  selectedSymbol: "BTCUSDT",
  isRotating: true,
  rotationSpeed: 0.5,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  toggleVenue: (venueId) =>
    set((state) => ({
      venues: state.venues.map((venue) => (venue.id === venueId ? { ...venue, enabled: !venue.enabled } : venue)),
    })),

  updateVenues: (venues) => set({ venues }),

  setPressureZones: (zones) => set({ pressureZones: zones }),

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  toggleRotation: () => set((state) => ({ isRotating: !state.isRotating })),

  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
}))
