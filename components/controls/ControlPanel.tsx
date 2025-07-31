"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, TrendingUp, Palette, Play, Pause } from "lucide-react"
import { useVisualizationStore } from "@/store/visualizationStore"

export default function ControlPanel() {
  const {
    venues,
    selectedSymbol,
    settings,
    isRotating,
    rotationSpeed,
    toggleVenue,
    setSelectedSymbol,
    updateSettings,
    toggleRotation,
    setRotationSpeed,
  } = useVisualizationStore()

  const symbols = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "SOLUSDT", "DOTUSDT"]

  return (
    <div className="space-y-4">
      {/* Trading Pair Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Trading Pair
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger>
              <SelectValue placeholder="Select trading pair" />
            </SelectTrigger>
            <SelectContent>
              {symbols.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Trading Venues */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trading Venues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: venue.color }} />
                <span className="font-medium">{venue.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={venue.enabled ? "default" : "secondary"} className="text-xs">
                  {venue.enabled ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={venue.enabled} onCheckedChange={() => toggleVenue(venue.id)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Visualization Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Time Range</label>
              <span className="text-sm text-muted-foreground">{settings.timeRange} min</span>
            </div>
            <Slider
              value={[settings.timeRange]}
              onValueChange={([value]) => updateSettings({ timeRange: value })}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          {/* Animation Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Animation Speed</label>
              <span className="text-sm text-muted-foreground">{settings.animationSpeed}x</span>
            </div>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={([value]) => updateSettings({ animationSpeed: value })}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotation Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Rotation</label>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRotation}
                className="flex items-center gap-2 bg-transparent"
              >
                {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isRotating ? "Pause" : "Start"}
              </Button>
            </div>
            {isRotating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Speed</span>
                  <span className="text-xs text-muted-foreground">{rotationSpeed.toFixed(1)}</span>
                </div>
                <Slider
                  value={[rotationSpeed]}
                  onValueChange={([value]) => setRotationSpeed(value)}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Color Scheme */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Scheme
            </label>
            <Select
              value={settings.colorScheme}
              onValueChange={(value: "default" | "heatmap" | "volume") => updateSettings({ colorScheme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="heatmap">Heatmap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Pressure Zones</label>
              <Switch
                checked={settings.showPressureZones}
                onCheckedChange={(checked) => updateSettings({ showPressureZones: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume Profile</label>
              <Switch
                checked={settings.showVolumeProfile}
                onCheckedChange={(checked) => updateSettings({ showVolumeProfile: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
