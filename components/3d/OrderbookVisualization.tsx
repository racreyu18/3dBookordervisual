import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SafeCanvas from '../SafeCanvas';

interface Order {
  price: number;
  amount: number;
}

export default function OrderbookVisualization() {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  // Initialize with safe default data
  useEffect(() => {
    setBids(Array(10).fill(null).map((_, i) => ({
      price: 100 - i,
      amount: 5 + Math.random() * 5
    })));
    setAsks(Array(10).fill(null).map((_, i) => ({
      price: 101 + i,
      amount: 5 + Math.random() * 5
    })));
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <SafeCanvas>
        <OrderBars bids={bids} asks={asks} />
      </SafeCanvas>
    </div>
  );
}

function OrderBars({ bids, asks }: { bids: Order[]; asks: Order[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const maxAmount = Math.max(
    1, // Minimum fallback
    ...bids.map(b => b?.amount || 0),
    ...asks.map(a => a?.amount || 0)
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={0.8} />

      {bids.map((bid, i) => (
        <Bar
          key={`bid-${i}`}
          position={[
            i * 1.5 - (bids.length * 1.5) / 2,
            ((bid?.amount || 0) / maxAmount) * 10 / 2,
            -5
          ]}
          size={[1, ((bid?.amount || 0) / maxAmount) * 10, 1]}
          color="#10B981"
        />
      ))}

      {asks.map((ask, i) => (
        <Bar
          key={`ask-${i}`}
          position={[
            i * 1.5 - (asks.length * 1.5) / 2,
            ((ask?.amount || 0) / maxAmount) * 10 / 2,
            5
          ]}
          size={[1, ((ask?.amount || 0) / maxAmount) * 10, 1]}
          color="#EF4444"
        />
      ))}

      <gridHelper args={[30, 20]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Bar({
  position,
  size,
  color
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  // This explicit mesh declaration is crucial
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}