import { ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function SafeCanvas({ children }: { children: ReactNode }) {
  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true
      }}
      camera={{ position: [0, 15, 25], fov: 45 }}
      onCreated={(state) => {
        state.gl.localClippingEnabled = true;
       // state.gl.physicallyCorrectLights = true;
      }}
    >
      <Suspense fallback={null}>
        {children}
        <OrbitControls makeDefault />
      </Suspense>
    </Canvas>
  );
}