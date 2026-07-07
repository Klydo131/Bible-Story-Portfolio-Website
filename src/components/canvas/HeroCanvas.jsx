import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

function FloatingCross() {
  const groupRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Slow organic rotation + mouse follow parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.25 + state.pointer.x * 0.4
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.1 - state.pointer.y * 0.3
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.12
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.3
      ringRef.current.rotation.x = Math.sin(time * 0.6) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Cross Pillar */}
      <mesh>
        <boxGeometry args={[0.18, 1.4, 0.18]} />
        <meshPhysicalMaterial
          color="#d4a843"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.8}
          emissive="#d4a843"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Cross Bar */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.18]} />
        <meshPhysicalMaterial
          color="#d4a843"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.8}
          emissive="#d4a843"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Floating Crown of Thorns Ring (abstract geometry) */}
      <mesh ref={ringRef} position={[0, 0.3, 0.02]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.26, 0.015, 8, 24]} />
        <meshPhysicalMaterial
          color="#8b2635"
          metalness={0.8}
          roughness={0.2}
          emissive="#8b2635"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Floating particles close to the cross */}
      <Sparkles count={30} scale={1.8} size={4} speed={0.8} color="#e8c96a" />
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <div className="hero__canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Stars radius={90} depth={40} count={1200} factor={4} saturation={0.5} fade speed={1} />
        
        {/* Lights */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#8b2635" />
        <pointLight position={[0, 0.3, 1]} intensity={1.5} distance={3} color="#d4a843" />

        <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.2}>
          <FloatingCross />
        </Float>
      </Canvas>
    </div>
  )
}
