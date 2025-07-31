export interface OrderbookData {
  venue: string
  symbol: string
  bids: Array<[number, number]> // [price, quantity]
  asks: Array<[number, number]> // [price, quantity]
  timestamp: number
  sequence: number
}

export interface PressureZone {
  priceLevel: number
  intensity: number
  volume: number
  side: "bid" | "ask"
  timestamp: number
}

export interface OrderFlowEvent {
  id: string
  venue: string
  type: "large_order" | "sweep" | "iceberg" | "block_trade"
  side: "buy" | "sell"
  price: number
  quantity: number
  timestamp: number
  impact: number
}

export interface VenueConfig {
  id: string
  name: string
  color: string
  enabled: boolean
  websocketUrl: string
}

export interface VisualizationSettings {
  timeRange: number // minutes
  priceRange: [number, number]
  quantityThreshold: number
  showPressureZones: boolean
  showVolumeProfile: boolean
  animationSpeed: number
  colorScheme: "default" | "heatmap" | "volume"
}
