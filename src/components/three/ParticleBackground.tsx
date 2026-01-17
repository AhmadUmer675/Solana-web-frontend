import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9945FF"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function WaveField() {
  const ref = useRef<THREE.Points>(null);
  
  const { positions, originalPositions } = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * count * 3);
    const originalPositions = new Float32Array(count * count * 3);
    
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        positions[index] = (i - count / 2) * 0.15;
        positions[index + 1] = 0;
        positions[index + 2] = (j - count / 2) * 0.15 - 5;
        
        originalPositions[index] = positions[index];
        originalPositions[index + 1] = positions[index + 1];
        originalPositions[index + 2] = positions[index + 2];
      }
    }
    return { positions, originalPositions };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const positionAttribute = ref.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalPositions[i * 3];
        const z = originalPositions[i * 3 + 2];
        
        positionAttribute.setY(
          i,
          Math.sin(x * 0.5 + time) * 0.3 + Math.sin(z * 0.5 + time * 0.8) * 0.3
        );
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#14F195"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
        <WaveField />
      </Canvas>
    </div>
  );
}
