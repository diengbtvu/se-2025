import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute } from 'three';
import { MeshStandardMaterial } from 'three';

export function HoneycombModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const createHoneycomb = () => {
    const geometry = new BufferGeometry();
    const vertices = [];
    const indices = [];
    const radius = 0.5;
    const height = 0.2;

    // Create pattern of hexagons
    const pattern = [
      { x: 0, z: 0 },
      { x: 0.75, z: 1.3 },
      { x: 0.75, z: -1.3 },
      { x: -0.75, z: 1.3 },
      { x: -0.75, z: -1.3 },
      { x: 1.5, z: 0 },
      { x: -1.5, z: 0 },
    ];

    pattern.forEach(({ x: centerX, z: centerZ }) => {
      // Create hexagon vertices
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + radius * Math.cos(angle);
        const z = centerZ + radius * Math.sin(angle);
        
        // Bottom vertex
        vertices.push(x, 0, z);
        // Top vertex
        vertices.push(x, height, z);
      }

      // Calculate base index for this hexagon
      const baseIndex = vertices.length / 3 - 12; // 12 vertices per hexagon

      // Create faces
      for (let i = 0; i < 6; i++) {
        const current = baseIndex + i * 2;
        const next = baseIndex + ((i + 1) % 6) * 2;

        // Side faces (2 triangles per side)
        indices.push(
          current, current + 1, next + 1,
          current, next + 1, next
        );

        // Top and bottom faces
        if (i < 4) {
          indices.push(
            baseIndex + 1, baseIndex + (i + 2) * 2 + 1, baseIndex + (i + 1) * 2 + 1,
            baseIndex, baseIndex + (i + 1) * 2, baseIndex + (i + 2) * 2
          );
        }
      }
    });

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  };

  return (
    <mesh ref={meshRef}>
      <primitive object={createHoneycomb()} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.5}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export default HoneycombModel; 