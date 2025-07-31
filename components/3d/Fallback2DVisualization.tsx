"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"
import type { OrderbookData } from "@/lib/types"
import { useVisualizationStore } from "@/store/visualizationStore"

interface Fallback2DVisualizationProps {
  orderbooks: Map<string, OrderbookData>
  className?: string
}

export default function Fallback2DVisualization({ orderbooks, className }: Fallback2DVisualizationProps) {
  const { venues, selectedSymbol } = useVisualizationStore()

  const processedData = useMemo(() => {
    const data: Array<{
      venue: string
      color: string
      bids: Array<{ price: number; quantity: number; total: number }>
      asks: Array<{ price: number; quantity: number; total: number }>
      spread: number
      midPrice: number
    }> = []

    orderbooks.forEach((orderbook, venueId) => {
      const venue = venues.find((v) => v.id === venueId)
      if (!venue || !venue.enabled) return

      // Process bids and asks with running totals
      let bidTotal = 0
      const processedBids = orderbook.bids.slice(0, 10).map(([price, quantity]) => {
        bidTotal += quantity
        return { price, quantity, total: bidTotal }
      })

      let askTotal = 0
      const processedAsks = orderbook.asks.slice(0, 10).map(([price, quantity]) => {
        askTotal += quantity
        return { price, quantity, total: askTotal }
      })

      const spread = orderbook.asks[0]?.[0] - orderbook.bids[0]?.[0] || 0
      const midPrice = (orderbook.asks[0]?.[0] + orderbook.bids[0]?.[0]) / 2 || 0

      data.push({
        venue: venue.name,
        color: venue.color,
        bids: processedBids,
        asks: processedAsks,
        spread,
        midPrice,
      })
    })

    return data
  }, [orderbooks, venues])

  const maxQuantity = useMemo(() => {
    let max = 0
    processedData.forEach((venue) => {
      venue.bids.forEach((bid) => {
        max = Math.max(max, bid.quantity)
      })
      venue.asks.forEach((ask) => {
        max = Math.max(max, ask.quantity)
      })
    })
    return max
  }, [processedData])

  if (processedData.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg`}>
        <div className="text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orderbook data available</p>
          <p className="text-sm text-muted-foreground mt-2">Waiting for real-time data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} bg-white dark:bg-slate-900 rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Enhanced 2D Orderbook</h3>
              <p className="text-blue-100 text-sm">Optimized for compatibility • Real-time data</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {selectedSymbol}
          </Badge>
        </div>
      </div>

      {/* Orderbook Grid */}
      <div className="p-4 space-y-6">
        {processedData.map((venue, venueIndex) => (
          <Card key={venue.venue} className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: venue.color }} />
                  <span>{venue.venue}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="font-mono">${venue.midPrice.toFixed(2)}</div>
                  <div className="text-muted-foreground">Spread: ${venue.spread.toFixed(2)}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bids */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Bids</h4>
                  </div>
                  <div className="space-y-2">
                    {venue.bids.map((bid, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-mono">${bid.price.toFixed(2)}</span>
                          <span className="font-mono">{bid.quantity.toFixed(4)}</span>
                        </div>
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                            style={{
                              width: `${(bid.quantity / maxQuantity) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total: {bid.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-700 dark:text-red-400">Asks</h4>
                  </div>
                  <div className="space-y-2">
                    {venue.asks.map((ask, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-mono">${ask.price.toFixed(2)}</span>
                          <span className="font-mono">{ask.quantity.toFixed(4)}</span>
                        </div>
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-300"
                            style={{
                              width: `${(ask.quantity / maxQuantity) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total: {ask.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>2D Mode Active • Full functionality available</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Venues: {processedData.length}</span>
            <span>Updates: Real-time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
