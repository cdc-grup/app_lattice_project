import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { Text, Float } from '@react-three/drei/native';
import * as THREE from 'three';

export const MainARScene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          position={[0, 0, -5]}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={hovered ? '#4ade80' : '#3b82f6'} wireframe />
        </mesh>
      </Float>

      <Text
        position={[0, -2, -5]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Circuit Copilot AR
      </Text>
    </>
  );
};
