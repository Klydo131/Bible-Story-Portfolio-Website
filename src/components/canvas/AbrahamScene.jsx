import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function AbrahamScene({ progress = 0 }) {
  const mountainGroupRef = useRef()
  const lightShaftRef = useRef()
  const ramRef = useRef()
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
        0.2 - state.pointer.y * 0.35,
        0.1
      )
    }

    // Dynamic light tracking pointer
    if (dirLightRef.current) {
      dirLightRef.current.position.x = 3 + state.pointer.x * 3.5
      dirLightRef.current.position.y = 5 - state.pointer.y * 3.5
    }

    // Mountain peak rises out of the fog based on scroll progress
    if (mountainGroupRef.current) {
      mountainGroupRef.current.rotation.y = elapsedTime * 0.03
      const riseProgress = Math.min(1.0, progress * 1.6)
      mountainGroupRef.current.position.y = THREE.MathUtils.lerp(-1.3, 0.0, riseProgress)
      mountainGroupRef.current.scale.setScalar(riseProgress)
    }

    if (lightShaftRef.current) {
      const visibility = Math.max(0, (progress - 0.4) * 2)
      lightShaftRef.current.scale.y = visibility * 4.5
      lightShaftRef.current.position.y = 2.5 - (visibility * 2.25)
      lightShaftRef.current.material.opacity = visibility * 0.45
      lightShaftRef.current.rotation.y = -elapsedTime * 0.1
    }

    if (ramRef.current) {
      const visibility = Math.max(0, (progress - 0.6) * 2.5)
      ramRef.current.scale.set(visibility * 0.35, visibility * 0.35, visibility * 0.35)
      ramRef.current.rotation.y = elapsedTime * 0.25
    }
  })

  return (
    <group ref={mouseFollowRef}>
      <Stars radius={50} depth={20} count={1200} factor={3} saturation={0.8} speed={0.8} />

      <ambientLight intensity={0.15} />
      <directionalLight ref={dirLightRef} position={[3, 5, 3]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-3, -3, -3]} intensity={0.5} color="#1a3a5c" />

      {/* Rugged Mountain Peak */}
      <group ref={mountainGroupRef} position={[0, -1.3, 0]} scale={[0, 0, 0]}>
        <mesh position={[0, 0.2, 0]} scale={[1.2, 0.7, 1.2]}>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color="#37474f" roughness={0.9} flatShading />
        </mesh>
        
        <mesh position={[0, 0.75, 0]} scale={[0.8, 0.6, 0.8]}>
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial color="#263238" roughness={0.9} flatShading />
        </mesh>

        <mesh position={[0.6, 0.3, 0.4]} rotation={[0.2, 0.5, 0.1]} scale={[0.5, 0.4, 0.5]}>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#455a64" roughness={0.95} flatShading />
        </mesh>
        <mesh position={[-0.5, 0.2, -0.5]} rotation={[-0.1, -0.3, 0.2]} scale={[0.6, 0.5, 0.6]}>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#455a64" roughness={0.95} flatShading />
        </mesh>

        {/* Stone Altar with firewood logs */}
        <group position={[0, 1.12, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.42, 0.08, 0.32]} />
            <meshStandardMaterial color="#546e7a" roughness={0.9} />
          </mesh>
          <mesh position={[0.08, -0.15, 0.08]} scale={[0.08, 0.2, 0.08]}>
            <boxGeometry /><meshStandardMaterial color="#455a64" />
          </mesh>
          <mesh position={[-0.08, -0.15, 0.08]} scale={[0.08, 0.2, 0.08]}>
            <boxGeometry /><meshStandardMaterial color="#455a64" />
          </mesh>
          <mesh position={[0.08, -0.15, -0.08]} scale={[0.08, 0.2, 0.08]}>
            <boxGeometry /><meshStandardMaterial color="#455a64" />
          </mesh>
          <mesh position={[-0.08, -0.15, -0.08]} scale={[0.08, 0.2, 0.08]}>
            <boxGeometry /><meshStandardMaterial color="#455a64" />
          </mesh>

          <mesh position={[0, 0.04, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.05]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.07, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.05]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Volumetric Light Column */}
      <mesh ref={lightShaftRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.25, 0.6, 1, 16, 1, true]} />
        <meshBasicMaterial
          color="#e8c96a"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {progress > 0.4 && (
        <Sparkles
          count={45}
          scale={[0.8, 3, 0.8]}
          position={[0, 1.5, 0]}
          size={3}
          speed={1.0}
          color="#ffe082"
        />
      )}

      {/* The Ram */}
      <group ref={ramRef} position={[0, 1.34, 0.35]} scale={[0, 0, 0]}>
        <Float speed={3} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh>
            <dodecahedronGeometry args={[0.38]} />
            <meshPhysicalMaterial color="#eceff1" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.24, 0.22, 0]}>
            <dodecahedronGeometry args={[0.22]} />
            <meshPhysicalMaterial color="#cfd8dc" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.18, 0.34, 0.1]} rotation={[0, 0.4, 0.4]}>
            <torusGeometry args={[0.14, 0.035, 6, 16, Math.PI * 1.2]} />
            <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.18, 0.34, -0.1]} rotation={[0, -0.4, -0.4]}>
            <torusGeometry args={[0.14, 0.035, 6, 16, Math.PI * 1.2]} />
            <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.1} />
          </mesh>
        </Float>
      </group>

      <pointLight position={[0, 3, 0]} intensity={progress * 6.0} distance={6} color="#e8c96a" />
    </group>
  )
}
