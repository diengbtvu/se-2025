import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Scene3DProps {
  className?: string;
  children?: ReactNode;
}

function FallbackComponent() {
  return (
    <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Could not load 3D model</p>
    </div>
  );
}

export function Scene3D({ className, children }: Scene3DProps) {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            {children}
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

export default Scene3D; 