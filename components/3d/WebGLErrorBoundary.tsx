"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Monitor, ExternalLink } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WebGL Error:", error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      const isWebGLError =
        this.state.error?.message?.includes("WebGL") || this.state.error?.message?.includes("context")

      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center space-y-4 p-8 max-w-2xl">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
            <CardTitle className="text-xl">3D Visualization Unavailable</CardTitle>

            {isWebGLError ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">WebGL Context Creation Failed</p>
                <p>Your graphics hardware or drivers may not support WebGL properly.</p>

                <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                  <p className="font-medium">Common Solutions:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Update your graphics drivers to the latest version</li>
                    <li>• Enable hardware acceleration in browser settings</li>
                    <li>• Try a different browser (Chrome, Firefox, Edge)</li>
                    <li>• Restart your browser completely</li>
                    <li>• Check if other WebGL sites work (webglreport.com)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Intel HD Graphics Users:</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Older Intel HD Graphics may have limited WebGL support. The 2D fallback mode provides full
                    functionality without 3D graphics.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>An unexpected error occurred while initializing the 3D visualization.</p>
                <p>You can continue using the 2D visualization mode.</p>
              </div>
            )}

            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null })
                }}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                Use 2D Mode
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://get.webgl.org/", "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Test WebGL
              </Button>
            </div>

            {this.state.error && (
              <details className="text-xs text-left bg-muted p-4 rounded mt-4">
                <summary className="cursor-pointer font-medium">Technical Details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
