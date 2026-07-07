import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function CreationScene({ progress = 0 }) {
  const orreryRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const sunRef = useRef()
  const planet1Ref = useRef()
  const planet2Ref = useRef()
  const mouseFollowRef = useRef()
  const dirLightRef = useRef()

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime()

    // Smooth mouse follow parallax
    if (mouseFollowRef.current) {
      mouseFollowRef.current.rotation.y = THREE.MathUtils.lerp(
        mouseFollowRef.current.rotation.y,
        state.pointer.x * 0.45,
        0.1
      )
      mouseFollowRef.current.rotation.x = THREE.MathUtils.lerp(
        mouseFollowRef.current.rotation.x,
        -state.pointer.y * 0.35,
        0.1
      )
    }

    // Dynamic light tracking pointer
    if (dirLightRef.current) {
      dirLightRef.current.position.x = 5 + state.pointer.x * 3.5
      dirLightRef.current.position.y = 8 - state.pointer.y * 3.5
    }

    if (orreryRef.current) {
      orreryRef.current.rotation.y = elapsedTime * 0.04
    }

    // Sun growth animation tied to scroll progress
    if (sunRef.current) {
      sunRef.current.rotation.y = elapsedTime * 0.2
      const pulse = 1.0 + Math.sin(elapsedTime * 3) * 0.08
      const scrollScale = Math.min(1.0, progress * 2.2)
      sunRef.current.scale.setScalar(pulse * scrollScale)
    }

    // Orbit tracks expand outward from center
    const ringScale = Math.min(1.0, progress * 1.8)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = elapsedTime * 0.15
      ring1Ref.current.scale.setScalar(ringScale)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -elapsedTime * 0.25
      ring2Ref.current.scale.setScalar(ringScale)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = elapsedTime * 0.08
      ring3Ref.current.scale.setScalar(ringScale)
    }

    // Planets spiral outward from the sun
    const spiralFactor = Math.min(1.0, progress * 1.5)
    if (planet1Ref.current) {
      const angle = elapsedTime * 0.5
      const radius = 1.5 * spiralFactor
      planet1Ref.current.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      planet1Ref.current.rotation.y = elapsedTime * 0.8
      planet1Ref.current.scale.setScalar(spiralFactor)
    }

    if (planet2Ref.current) {
      const angle = -elapsedTime * 0.3 + 2.0
      const radius = 2.2 * spiralFactor
      planet2Ref.current.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      planet2Ref.current.rotation.y = -elapsedTime * 0.5
      planet2Ref.current.scale.setScalar(spiralFactor)
    }
  })

  return (
    <group ref={mouseFollowRef}>
      {/* High-density starfield */}
      <Stars radius={90} depth={30} count={4000} factor={7} saturation={0.9} fade speed={2} />

      {/* Floating stardust */}
      <Sparkles
        count={150}
        scale={6}
        size={3}
        speed={0.6}
        color={progress > 0.5 ? '#80deea' : '#ffe082'}
      />

      <ambientLight intensity={0.15} />
      <directionalLight ref={dirLightRef} position={[5, 8, 5]} intensity={2.8} color="#fffde7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#26c6da" />
      <pointLight position={[0, 0, 0]} intensity={4 + progress * 3} distance={8} color="#ffd54f" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.25}>
        <group ref={orreryRef} rotation={[0.3, 0, 0.2]}>
          {/* 1. Central Cosmic Sun */}
          <mesh ref={sunRef}>
            <dodecahedronGeometry args={[0.7, 1]} />
            <meshPhysicalMaterial
              color="#d4a843"
              emissive="#ffb300"
              emissiveIntensity={2.0 - progress * 1.2}
              roughness={0.05}
              metalness={0.95}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* 2. Ethereal Glass Atmospheric Shell */}
          <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshPhysicalMaterial
              color="#ffe082"
              transparent
              opacity={0.3}
              transmission={0.95}
              thickness={1.5}
              roughness={0.0}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* 3. Orbiting Planet 1: "The Waters" */}
          <group ref={planet1Ref}>
            <mesh>
              <dodecahedronGeometry args={[0.22, 1]} />
              <meshPhysicalMaterial
                color="#0288d1"
                emissive="#00acc1"
                emissiveIntensity={progress * 1.5}
                transmission={0.85}
                thickness={0.8}
                roughness={0.05}
                clearcoat={1.0}
              />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[0.34, 0.008, 6, 32]} />
              <meshBasicMaterial color="#80deea" transparent opacity={progress * 0.7} />
            </mesh>
          </group>

          {/* 4. Orbiting Planet 2: "The Land" */}
          <group ref={planet2Ref}>
            <mesh>
              <icosahedronGeometry args={[0.26, 1]} />
              <meshPhysicalMaterial
                color={new THREE.Color('#4caf50').lerp(new THREE.Color('#8d6e63'), 0.4)}
                roughness={0.6}
                metalness={0.1}
                clearcoat={0.5}
                flatShading
              />
            </mesh>
          </group>

          {/* 5. Orbital Ring Tracks */}
          <group ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.015, 8, 64]} />
            <meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} />
          </group>
          <group ref={ring2Ref} rotation={[Math.PI / 2.2, 0.3, 0]}>
            <torusGeometry args={[2.2, 0.015, 8, 64]} />
            <meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} />
          </group>
          <group ref={ring3Ref} rotation={[Math.PI / 1.8, -0.4, 0.2]}>
            <torusGeometry args={[2.8, 0.01, 6, 48]} />
            <meshStandardMaterial color="#a07c2e" metalness={0.95} roughness={0.1} />
          </group>
        </group>
      </Float>
    </group>
  )
}
