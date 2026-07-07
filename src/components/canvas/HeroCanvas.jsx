import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ScarletThread — A flowing ribbon/thread that weaves through space.
 * Represents the thread of redemption running through Scripture.
 * No literal cross, no sparkle particles. Subtle, evocative, premium.
 */
function ScarletThread() {
  const meshRef = useRef()
  const materialRef = useRef()

  /* Build the base curve once */
  const { curve, tubeGeometry } = useMemo(() => {
    const points = []
    const segments = 80
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = Math.sin(t * Math.PI * 2.5) * (0.6 + t * 0.5)
      const y = (t - 0.5) * 3.2
      const z = Math.cos(t * Math.PI * 1.8) * 0.4
      points.push(new THREE.Vector3(x, y, z))
    }
    const c = new THREE.CatmullRomCurve3(points)
    const g = new THREE.TubeGeometry(c, 120, 0.018, 8, false)
    return { curve: c, tubeGeometry: g }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      /* Gentle organic sway */
      meshRef.current.rotation.y = Math.sin(time * 0.18) * 0.15 + state.pointer.x * 0.12
      meshRef.current.rotation.x = Math.sin(time * 0.25) * 0.06 - state.pointer.y * 0.06
      meshRef.current.position.y = Math.sin(time * 0.4) * 0.08
    }

    if (materialRef.current) {
      /* Subtle emissive pulse */
      materialRef.current.emissiveIntensity = 0.35 + Math.sin(time * 0.8) * 0.15
    }
  })

  return (
    <group ref={meshRef}>
      {/* The scarlet thread itself */}
      <mesh geometry={tubeGeometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#a03030"
          emissive="#8b2635"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Soft warm glow along the thread path */}
      <pointLight position={[0, 0.8, 0.5]} intensity={0.6} distance={3} color="#d4a843" />
      <pointLight position={[0, -0.5, 0.3]} intensity={0.4} distance={2.5} color="#c4384a" />
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <div className="hero__canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Stars radius={90} depth={40} count={1500} factor={3.5} saturation={0.3} fade speed={0.6} />

        {/* Ambient and directional light for depth */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[4, 5, 4]} intensity={1.8} color="#f5f0e8" />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#4a2d6b" />

        <ScarletThread />
      </Canvas>
    </div>
  )
}
