# 3D Orderbook Depth Visualizer



A real-time cryptocurrency orderbook visualization tool with intelligent hardware adaptation, featuring both 3D and 2D rendering modes.

## Features

### Core Visualization
- **Real-time Data**: Live WebSocket feeds from Binance, Coinbase, and Kraken
- **Dual-mode Rendering**:
  - **3D Mode**: WebGL-accelerated depth charts with Three.js
  - **2D Fallback**: Canvas-based rendering for unsupported devices
- **Multi-exchange Support**: Unified view across 5+ major exchanges

### Market Analysis
- **Pressure Zones**: AI-detected support/resistance levels
- **Order Flow**: Real-time tracking of large orders (>5BTC)
- **Liquidity Heatmap**: Visual representation of market depth

### Technical Features
- **Auto-detection**: Dynamically switches between 3D/2D based on GPU capabilities
- **Performance Optimized**: 60fps rendering even with 10,000+ orders
- **Responsive Design**: Works on desktop, tablet, and mobile

## Technology Stack

| Category          | Technologies Used |
|-------------------|-------------------|
| Framework         | Next.js 14 (App Router) |
| Language          | TypeScript 5+ |
| 3D Rendering      | React Three Fiber (R3F) + Three.js |
| UI Components     | shadcn/ui + Tailwind CSS |
| State Management  | Zustand |
| Data Visualization| D3.js (2D mode) |
| WebSockets        | Socket.IO |
| Testing           | Jest + React Testing Library |

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- WebGL 2.0 capable browser (for 3D mode)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/3dBookordervisual.git
cd 3dBookordervisual

# Install dependencies
npm install

Running Locally
bash
# Start development server
npm run dev
Open http://localhost:3000 in your browser


Browser Support
Browser	3D Support	2D Support
Chrome	✅ Full	✅ Full
Firefox	✅ Full	✅ Full
Safari	⚠️ Limited*	✅ Full
Edge	✅ Full	✅ Full
Mobile Chrome	⚠️ Basic	✅ Full

Troubleshooting:

Common Issues
Blank Screen in 3D Mode:

Verify WebGL support at webglreport.com

Enable hardware acceleration in browser settings

Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.

