"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, BarChart3, Zap, Clock, Target } from "lucide-react"
import type { OrderbookData, OrderFlowEvent } from "@/lib/types"
import { formatPrice, formatQuantity, formatTimestamp } from "@/lib/utils"

interface StatsPanelProps {
  orderbooks: Map<string, OrderbookData>
  orderFlowEvents: OrderFlowEvent[]
  isConnected: boolean
}

export default function StatsPanel({ orderbooks, orderFlowEvents, isConnected }: StatsPanelProps) {
  const stats = useMemo(() => {
    const orderbookArray = Array.from(orderbooks.values())

    if (orderbookArray.length === 0) {
      return {
        totalVolume: 0,
        avgSpread: 0,
        bestBid: 0,
        bestAsk: 0,
        midPrice: 0,
        spreadPercentage: 0,
        liquidityScore: 0,
        marketDepth: 0,
      }
    }

    // Calculate aggregate stats
    let totalBidVolume = 0
    let totalAskVolume = 0
    let totalSpread = 0
    let bestBid = 0
    let bestAsk = Number.POSITIVE_INFINITY

    orderbookArray.forEach((orderbook) => {
      // Volume calculations
      const bidVolume = orderbook.bids.slice(0, 10).reduce((sum, [, qty]) => sum + qty, 0)
      const askVolume = orderbook.asks.slice(0, 10).reduce((sum, [, qty]) => sum + qty, 0)
      totalBidVolume += bidVolume
      totalAskVolume += askVolume

      // Best prices
      if (orderbook.bids[0]) {
        bestBid = Math.max(bestBid, orderbook.bids[0][0])
      }
      if (orderbook.asks[0]) {
        bestAsk = Math.min(bestAsk, orderbook.asks[0][0])
      }

      // Spread
      if (orderbook.bids[0] && orderbook.asks[0]) {
        totalSpread += orderbook.asks[0][0] - orderbook.bids[0][0]
      }
    })

    const avgSpread = totalSpread / orderbookArray.length
    const midPrice = (bestBid + bestAsk) / 2
    const spreadPercentage = (avgSpread / midPrice) * 100
    const liquidityScore = Math.min((totalBidVolume + totalAskVolume) / 100, 100)
    const marketDepth = Math.min(Math.min(totalBidVolume, totalAskVolume) / 50, 100)

    return {
      totalVolume: totalBidVolume + totalAskVolume,
      avgSpread,
      bestBid,
      bestAsk: bestAsk === Number.POSITIVE_INFINITY ? 0 : bestAsk,
      midPrice,
      spreadPercentage,
      liquidityScore,
      marketDepth,
    }
  }, [orderbooks])

  const recentEvents = useMemo(() => {
    return orderFlowEvents.slice(0, 10)
  }, [orderFlowEvents])

  const eventTypeColors = {
    large_order: "bg-blue-500",
    sweep: "bg-red-500",
    iceberg: "bg-purple-500",
    block_trade: "bg-green-500",
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card
        className={`border-2 ${isConnected ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"}`}
      >
        <CardContent className="py-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
            <span
              className={`font-medium ${isConnected ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
            >
              {isConnected ? "Live Data Stream" : "Disconnected"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Best Bid</p>
              <p className="font-mono text-sm font-semibold text-green-600">{formatPrice(stats.bestBid)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Best Ask</p>
              <p className="font-mono text-sm font-semibold text-red-600">{formatPrice(stats.bestAsk)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mid Price</span>
              <span className="font-mono font-semibold">{formatPrice(stats.midPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Spread</span>
              <span className="font-mono text-sm">{formatPrice(stats.avgSpread)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spread %</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {stats.spreadPercentage.toFixed(3)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5" />
            Liquidity Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <span className="font-mono text-sm">{formatQuantity(stats.totalVolume)}</span>
              </div>
              <Progress value={stats.liquidityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Liquidity Score: {stats.liquidityScore.toFixed(1)}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market Depth</span>
                <Badge variant="outline" className="text-xs">
                  {stats.marketDepth.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={stats.marketDepth} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Flow Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            Order Flow Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${eventTypeColors[event.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {event.venue}
                      </Badge>
                      <Badge variant={event.side === "buy" ? "default" : "destructive"} className="text-xs">
                        {event.side.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{event.type.replace("_", " ").toUpperCase()}</p>
                      <p className="font-mono">
                        {formatQuantity(event.quantity)} @ {formatPrice(event.price)}
                      </p>
                      <p>{formatTimestamp(event.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${event.impact > 0.05 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {(event.impact * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Venues</span>
            <Badge variant="default" className="text-xs">
              {Array.from(orderbooks.keys()).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Update Rate</span>
            <Badge variant="secondary" className="text-xs">
              2 Hz
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Data Points</span>
            <Badge variant="outline" className="text-xs">
              {Array.from(orderbooks.values()).reduce((sum, ob) => sum + ob.bids.length + ob.asks.length, 0)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
