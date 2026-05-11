"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Stars,
  Trail,
} from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.y = t * 0.15;
    ref.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Trail
        width={1.2}
        length={5}
        color="#58e1ff"
        attenuation={(t) => t * t}
      >
        <mesh ref={ref} position={[1.8, 0, 0]} scale={1.3}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#58e1ff"
            wireframe
            distort={0.25}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Trail>
    </Float>
  );
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.3;
    ref.current.position.x = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={[-2.2, 1.2, -1]} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <MeshWobbleMaterial
          color="#ff8462"
          wireframe
          factor={0.3}
          speed={2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = Math.cos(t * 0.25) * 0.4;
    ref.current.position.y = Math.cos(t * 0.35) * 0.25 - 1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[0.5, -1.5, -0.5]} scale={0.45}>
        <torusGeometry args={[1, 0.35, 16, 32]} />
        <meshStandardMaterial
          color="#87ffbe"
          wireframe
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#58e1ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function RingSystem() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.15;
  });

  return (
    <group ref={ref} position={[0, 0, -2]}>
      {[1.8, 2.4, 3.0].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, 0]}>
          <torusGeometry args={[radius, 0.008, 8, 64]} />
          <meshStandardMaterial
            color={i === 0 ? "#58e1ff" : i === 1 ? "#ff8462" : "#a98bff"}
            transparent
            opacity={0.25 - i * 0.05}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#58e1ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#ff8462" />
        <pointLight position={[0, 3, -5]} intensity={0.3} color="#87ffbe" />

        <FloatingIcosahedron />
        <FloatingOctahedron />
        <FloatingTorus />
        <RingSystem />
        <Particles />
        <Stars
          radius={50}
          depth={30}
          count={800}
          factor={3}
          saturation={0.5}
          fade
          speed={0.5}
        />
      </Canvas>
    </div>
  );
}
