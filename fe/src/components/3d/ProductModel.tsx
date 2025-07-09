import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function ProductModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Base - Thân sản phẩm */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#65BD60"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Top - Nắp thiết bị */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.2, 0.2, 2.2]} />
        <meshStandardMaterial
          color="#4E4540"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Screen - Màn hình */}
      <mesh position={[0, 0.2, 1.01]}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.8}
          roughness={0.1}
          emissive="#003366"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Buttons - Các nút bấm */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, -0.8, 1.01]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default ProductModel; 