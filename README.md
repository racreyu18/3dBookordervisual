# 3D Orderbook Depth Visualizer

A real-time cryptocurrency orderbook visualization tool with intelligent hardware adaptation, featuring both 3D and 2D rendering modes.

## Features

- **Real-time Data**: Live orderbook data from multiple cryptocurrency exchanges
- **3D Visualization**: Interactive 3D orderbook depth charts with WebGL acceleration
- **2D Fallback**: Enhanced 2D visualization for systems without WebGL support
- **Multi-venue Support**: Aggregated data from Binance, Coinbase, Kraken, and more
- **Pressure Zone Analysis**: Intelligent detection of support and resistance levels
- **Order Flow Tracking**: Real-time monitoring of large orders and market sweeps
- **Hardware Adaptation**: Automatic detection and optimization for user's graphics capabilities

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: `useToast` for user feedback
- **3D Graphics**: React Three Fiber with Three.js
- **State Management**: Zustand
- **WebGL**: Hardware-accelerated 3D rendering

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/3d-orderbook-visualizer.git
   cd 3d-orderbook-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## System Requirements

### For 3D Mode
- Modern browser with WebGL 2.0 support
- Dedicated graphics card recommended
- 4GB+ RAM
- Hardware acceleration enabled

### For 2D Mode
- Any modern browser
- Works on all devices including mobile
- Minimal system requirements

## Browser Compatibility

| Browser | 3D Mode | 2D Mode |
|---------|---------|---------|
| Chrome 90+ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ |

## Features Overview

### 3D Visualization
- Interactive orderbook depth charts
- Real-time pressure zone highlighting
- Multi-venue data overlay
- Mouse controls (rotate, zoom, pan)
- Hardware-accelerated rendering

### 2D Fallback Mode
- Enhanced orderbook tables
- Pressure zone indicators
- Volume analysis charts
- Compatible with all devices
- Optimized performance

### Real-time Features
- Live orderbook updates (100ms intervals)
- Order flow event detection
- Market pressure analysis
- Connection status monitoring
- Automatic reconnection

## Configuration

The application automatically detects your system's capabilities and selects the optimal rendering mode. You can manually switch between modes using the control panel.

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Other Platforms
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting guide in the app
- Verify WebGL support at [get.webgl.org](https://get.webgl.org/)
