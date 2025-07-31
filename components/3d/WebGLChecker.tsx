"use client"

import { useEffect, useState } from "react"

interface WebGLCapabilities {
  supported: boolean
  version: string | null
  renderer: string | null
  vendor: string | null
  maxTextureSize: number
  maxVertexUniforms: number
  extensions: string[]
  error?: string
  hardwareAccelerated: boolean
  isIntelHD: boolean
  shouldUse3D: boolean
}

export function useWebGLCapabilities(): WebGLCapabilities | null {
  const [capabilities, setCapabilities] = useState<WebGLCapabilities | null>(null)

  useEffect(() => {
    const checkWebGL = () => {
      try {
        // First, check if we're on known problematic hardware
        const userAgent = navigator.userAgent.toLowerCase()
        const isOldIntel =
          userAgent.includes("intel") && (userAgent.includes("hd graphics") || userAgent.includes("gma"))

        // Create a temporary canvas to test WebGL
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1

        let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
        let contextType = ""
        let error = ""

        const contextOptions = {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          preserveDrawingBuffer: false,
          powerPreference: "default" as WebGLPowerPreference,
          failIfMajorPerformanceCaveat: true, // Fail on software rendering
          desynchronized: false,
        }

        // Try different context types
        const contextTypes = ["webgl", "experimental-webgl"]

        for (const type of contextTypes) {
          try {
            gl = canvas.getContext(type, contextOptions) as WebGLRenderingContext | WebGL2RenderingContext
            if (gl) {
              contextType = type
              break
            }
          } catch (e) {
            error = e instanceof Error ? e.message : "Unknown context creation error"
            console.warn(`Failed to get ${type} context:`, e)
          }
        }

        if (!gl) {
          // Clean up and return failure
          canvas.remove()
          setCapabilities({
            supported: false,
            version: null,
            renderer: null,
            vendor: null,
            maxTextureSize: 0,
            maxVertexUniforms: 0,
            extensions: [],
            error: error || "No WebGL context could be created",
            hardwareAccelerated: false,
            isIntelHD: isOldIntel,
            shouldUse3D: false,
          })
          return
        }

        // Get renderer info
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
        const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)

        // Check for problematic Intel HD Graphics
        const rendererStr = renderer.toString().toLowerCase()
        const isIntelHD =
          rendererStr.includes("intel") &&
          (rendererStr.includes("hd graphics") ||
            rendererStr.includes("gma") ||
            rendererStr.includes("direct3d9") ||
            rendererStr.includes("vs_3_0"))

        // Detect software rendering
        const isHardwareAccelerated =
          !rendererStr.includes("software") &&
          !rendererStr.includes("swiftshader") &&
          !rendererStr.includes("llvmpipe") &&
          !rendererStr.includes("mesa")

        const extensions = gl.getSupportedExtensions() || []
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)

        // Determine if we should use 3D based on multiple factors
        const shouldUse3D =
          isHardwareAccelerated && !isIntelHD && maxTextureSize >= 2048 && !rendererStr.includes("direct3d9") // Avoid old DirectX versions

        // Test basic WebGL functionality
        let functionalityError = ""
        try {
          const testShader = gl.createShader(gl.VERTEX_SHADER)
          if (!testShader) {
            throw new Error("Cannot create shader")
          }

          // Test shader compilation
          gl.shaderSource(
            testShader,
            `
            attribute vec4 position;
            void main() {
              gl_Position = position;
            }
          `,
          )
          gl.compileShader(testShader)

          if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
            throw new Error("Shader compilation failed")
          }

          gl.deleteShader(testShader)
        } catch (e) {
          functionalityError = e instanceof Error ? e.message : "Basic functionality test failed"
        }

        // Clean up
        canvas.remove()

        if (functionalityError) {
          setCapabilities({
            supported: false,
            version: gl.getParameter(gl.VERSION),
            renderer: renderer,
            vendor: vendor,
            maxTextureSize: maxTextureSize,
            maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
            extensions: [],
            error: functionalityError,
            hardwareAccelerated: isHardwareAccelerated,
            isIntelHD: isIntelHD,
            shouldUse3D: false,
          })
          return
        }

        setCapabilities({
          supported: true,
          version: gl.getParameter(gl.VERSION),
          renderer: renderer,
          vendor: vendor,
          maxTextureSize: maxTextureSize,
          maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
          extensions,
          hardwareAccelerated: isHardwareAccelerated,
          isIntelHD: isIntelHD,
          shouldUse3D: shouldUse3D,
        })
      } catch (error) {
        console.error("WebGL capability check failed:", error)
        setCapabilities({
          supported: false,
          version: null,
          renderer: null,
          vendor: null,
          maxTextureSize: 0,
          maxVertexUniforms: 0,
          extensions: [],
          error: error instanceof Error ? error.message : "Unknown WebGL error",
          hardwareAccelerated: false,
          isIntelHD: true, // Assume problematic hardware on error
          shouldUse3D: false,
        })
      }
    }

    // Delay the check to ensure DOM is ready
    const timer = setTimeout(checkWebGL, 100)
    return () => clearTimeout(timer)
  }, [])

  return capabilities
}

export function WebGLCompatibilityInfo() {
  const capabilities = useWebGLCapabilities()

  if (!capabilities) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-muted-foreground">Checking graphics compatibility...</span>
      </div>
    )
  }

  if (!capabilities.supported || !capabilities.shouldUse3D) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-blue-700 dark:text-blue-300">Enhanced 2D Mode Active</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            {capabilities.isIntelHD
              ? "Intel HD Graphics detected - using optimized 2D visualization"
              : "Using 2D mode for maximum compatibility"}
          </p>
          {capabilities.renderer && (
            <p className="truncate">
              GPU: {capabilities.renderer.toString().substring(0, 40)}
              {capabilities.renderer.toString().length > 40 ? "..." : ""}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-medium text-green-700 dark:text-green-300">3D Graphics Available</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="truncate">
          GPU: {capabilities.renderer?.toString().substring(0, 40)}
          {capabilities.renderer?.toString().length > 40 ? "..." : ""}
        </p>
        <div className="flex gap-4">
          <span>Hardware: {capabilities.hardwareAccelerated ? "Yes" : "No"}</span>
          <span>Max Texture: {capabilities.maxTextureSize}px</span>
        </div>
      </div>
    </div>
  )
}
