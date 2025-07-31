"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { OrderbookData, OrderFlowEvent } from "@/lib/types"

interface UseOrderbookDataReturn {
  orderbooks: Map<string, OrderbookData>
  isConnected: boolean
  error: string | null
  orderFlowEvents: OrderFlowEvent[]
  reconnect: () => void
}

export function useOrderbookData(
  venues: Array<{ id: string; name: string; enabled: boolean }>,
  symbol: string,
): UseOrderbookDataReturn {
  const [orderbooks, setOrderbooks] = useState<Map<string, OrderbookData>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderFlowEvents, setOrderFlowEvents] = useState<OrderFlowEvent[]>([])
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const simulationIntervalRef = useRef<NodeJS.Timeout>()

  // Generate mock orderbook data
  const generateMockOrderbook = useCallback(
    (venueId: string): OrderbookData => {
      const basePrice = 45000 + Math.random() * 1000 // BTC price around 45k-46k
      const spread = 0.5 + Math.random() * 2 // $0.5-$2.5 spread

      const bids: Array<[number, number]> = []
      const asks: Array<[number, number]> = []

      // Generate bids (below mid price)
      for (let i = 0; i < 20; i++) {
        const price = basePrice - spread / 2 - i * (0.5 + Math.random() * 2)
        const quantity = 0.1 + Math.random() * 5
        bids.push([price, quantity])
      }

      // Generate asks (above mid price)
      for (let i = 0; i < 20; i++) {
        const price = basePrice + spread / 2 + i * (0.5 + Math.random() * 2)
        const quantity = 0.1 + Math.random() * 5
        asks.push([price, quantity])
      }

      return {
        venue: venueId,
        symbol,
        bids: bids.sort((a, b) => b[0] - a[0]), // Sort bids descending
        asks: asks.sort((a, b) => a[0] - b[0]), // Sort asks ascending
        timestamp: Date.now(),
        sequence: Math.floor(Math.random() * 1000000),
      }
    },
    [symbol],
  )

  // Generate mock order flow events
  const generateOrderFlowEvent = useCallback((): OrderFlowEvent => {
    const venues = ["binance", "coinbase", "kraken"]
    const types: Array<"large_order" | "sweep" | "iceberg" | "block_trade"> = [
      "large_order",
      "sweep",
      "iceberg",
      "block_trade",
    ]

    return {
      id: Math.random().toString(36).substr(2, 9),
      venue: venues[Math.floor(Math.random() * venues.length)],
      type: types[Math.floor(Math.random() * types.length)],
      side: Math.random() > 0.5 ? "buy" : "sell",
      price: 45000 + (Math.random() - 0.5) * 1000,
      quantity: 0.5 + Math.random() * 10,
      timestamp: Date.now(),
      impact: Math.random() * 0.1, // 0-10% impact
    }
  }, [])

  const startSimulation = useCallback(() => {
    setIsConnected(true)
    setError(null)

    // Update orderbooks every 500ms
    simulationIntervalRef.current = setInterval(() => {
      const newOrderbooks = new Map<string, OrderbookData>()

      venues.forEach((venue) => {
        if (venue.enabled) {
          newOrderbooks.set(venue.id, generateMockOrderbook(venue.id))
        }
      })

      setOrderbooks(newOrderbooks)

      // Occasionally generate order flow events
      if (Math.random() < 0.3) {
        // 30% chance per update
        const event = generateOrderFlowEvent()
        setOrderFlowEvents((prev) => [event, ...prev.slice(0, 49)]) // Keep last 50 events
      }
    }, 500)
  }, [venues, generateMockOrderbook, generateOrderFlowEvent])

  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
      simulationIntervalRef.current = undefined
    }
    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    stopSimulation()
    setError(null)

    // Simulate connection delay
    reconnectTimeoutRef.current = setTimeout(() => {
      try {
        startSimulation()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect")
        setIsConnected(false)
      }
    }, 1000)
  }, [startSimulation, stopSimulation])

  // Initialize connection
  useEffect(() => {
    const timer = setTimeout(() => {
      startSimulation()
    }, 1000) // Initial delay

    return () => {
      clearTimeout(timer)
      stopSimulation()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [startSimulation, stopSimulation])

  // Update when venues or symbol changes
  useEffect(() => {
    if (isConnected) {
      stopSimulation()
      startSimulation()
    }
  }, [venues, symbol, isConnected, startSimulation, stopSimulation])

  return {
    orderbooks,
    isConnected,
    error,
    orderFlowEvents,
    reconnect,
  }
}
