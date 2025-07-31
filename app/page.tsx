"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useOrderbookData } from "@/hooks/useOrderbookData"
import { useVisualizationStore } from "@/store/visualizationStore"
import ControlPanel from "@/components/controls/ControlPanel"
import StatsPanel from "@/components/stats/StatsPanel"
import { WebGLCompatibilityInfo } from "@/components/3d/WebGLChecker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, Wifi, WifiOff, Monitor, ExternalLink, Info } from "lucide-react"

// Dynamically import the 3D component to avoid SSR issues
const OrderbookVisualization = dynamic(() => import("@/components/3d/OrderbookVisualization"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading 3D Visualization...</p>
        <p className="text-sm text-gray-400 mt-2">Optimizing for your hardware...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const { venues, selectedSymbol } = useVisualizationStore()
  const { orderbooks, isConnected, error, orderFlowEvents, reconnect } = useOrderbookData(venues, selectedSymbol)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3D Orderbook Depth Visualizer
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time cryptocurrency orderbook visualization</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={reconnect}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
                Reconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages Section */}
      <div className="container mx-auto px-4 py-4 space-y-3">
        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="flex items-center gap-3 py-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-800 dark:text-red-200">Connection Error</p>
                <p className="text-sm text-red-600 dark:text-red-300 truncate">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={reconnect} className="flex-shrink-0 bg-transparent">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Graphics Compatibility Info - Completely Separate */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardContent className="py-3">
            <div className="flex items-start gap-3">
              <Monitor className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Graphics Status</h3>
                <WebGLCompatibilityInfo />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://get.webgl.org/", "_blank")}
                className="flex items-center gap-2 text-xs flex-shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Application Content */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="sticky top-32 max-h-[calc(100vh-200px)] overflow-y-auto">
              <ControlPanel />
            </div>
          </div>

          {/* Center - Main Visualization */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <Card className="h-[600px] xl:h-[700px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Orderbook Visualization</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">{selectedSymbol}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-70px)]">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-b-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="font-medium">Optimizing Visualization...</p>
                        <p className="text-sm text-muted-foreground mt-2">Adapting to your hardware...</p>
                      </div>
                    </div>
                  }
                >
                  <OrderbookVisualization
                    orderbooks={orderbooks}
                    className="w-full h-full rounded-b-lg overflow-hidden"
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Stats */}
          <div className="xl:col-span-1 order-3">
            <div className="sticky top-32 max-h-[calc(100vh-200px)] overflow-y-auto">
              <StatsPanel orderbooks={orderbooks} orderFlowEvents={orderFlowEvents} isConnected={isConnected} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Help Section */}
      <div className="border-t bg-white/50 dark:bg-slate-900/50 mt-8">
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" />
                System Requirements & Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400">3D Mode Features</h4>
                  </div>
                  <ul className="space-y-1 text-muted-foreground pl-5">
                    <li>• Interactive 3D orderbook visualization</li>
                    <li>• Real-time pressure zone analysis</li>
                    <li>• Multi-venue data integration</li>
                    <li>• Hardware-accelerated rendering</li>
                    <li>• Mouse controls (rotate, zoom, pan)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400">2D Fallback Mode</h4>
                  </div>
                  <ul className="space-y-1 text-muted-foreground pl-5">
                    <li>• Enhanced 2D orderbook display</li>
                    <li>• Pressure zone highlighting</li>
                    <li>• Compatible with all devices</li>
                    <li>• Optimized performance</li>
                    <li>• Full analytical features</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-400">Troubleshooting</h4>
                  </div>
                  <ul className="space-y-1 text-muted-foreground pl-5">
                    <li>• Update graphics drivers</li>
                    <li>• Enable hardware acceleration</li>
                    <li>• Try Chrome or Firefox</li>
                    <li>• Check WebGL support</li>
                    <li>• Restart browser if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
