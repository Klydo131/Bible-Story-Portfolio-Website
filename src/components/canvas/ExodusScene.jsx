import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function ExodusScene({ progress = 0 }) {
  const doorRef = useRef()
  const seaLeftRef = useRef()
  const seaRightRef = useRef()
  const pillarRef = useRef()
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

    // Doorframe rises and scales
    if (doorRef.current) {
      doorRef.current.rotation.y = elapsedTime * 0.08
      const scaleVal = Math.min(1.0, progress * 2.0)
      doorRef.current.scale.set(scaleVal, scaleVal, scaleVal)
      doorRef.current.position.z = -0.5 + progress * 0.5
    }

    // Parting waves rise from below
    const waveRise = Math.min(1.0, progress * 1.8)
    const waveY = THREE.MathUtils.lerp(-1.5, 0.35, waveRise)

    if (seaLeftRef.current) {
      seaLeftRef.current.position.x = -1.1 - progress * 1.6
      seaLeftRef.current.position.y = waveY
      const pos = seaLeftRef.current.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const wave = Math.sin(y * 3.0 + elapsedTime * 4.0) * 0.06
        pos.setZ(i, wave)
      }
      pos.needsUpdate = true
    }

    if (seaRightRef.current) {
      seaRightRef.current.position.x = 1.1 + progress * 1.6
      seaRightRef.current.position.y = waveY
      const pos = seaRightRef.current.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const wave = Math.sin(y * 3.0 - elapsedTime * 4.0) * 0.06
        pos.setZ(i, wave)
      }
      pos.needsUpdate = true
    }

    if (pillarRef.current) {
      pillarRef.current.position.y = 0.4 + Math.sin(elapsedTime * 2.0) * 0.05
      pillarRef.current.rotation.y = -elapsedTime * 0.15
      pillarRef.current.scale.setScalar(Math.min(1.0, progress * 1.5))
    }
  })

  return (
    <group ref={mouseFollowRef}>
      {/* Path stardust */}
      <Sparkles
        count={50}
        scale={[1.5, 1, 3]}
        position={[0, 0.2, -1]}
        size={2.5}
        speed={0.6}
        color="#ffe082"
      />

      {/* Strong white directional light always active to show doorposts and path */}
      <directionalLight ref={dirLightRef} position={[3, 5, 3]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} color="#b0bec5" />

      {/* 1. Stone Doorframe flanked by columns */}
      <group ref={doorRef} scale={[0, 0, 0]}>
        {/* Left Stone post */}
        <mesh position={[-0.55, 0.45, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.1, 8]} />
          <meshStandardMaterial color="#455a64" roughness={0.9} />
        </mesh>
        {/* Left column capital */}
        <mesh position={[-0.55, 1.0, 0]} scale={[0.13, 0.08, 0.13]}>
          <boxGeometry />
          <meshStandardMaterial color="#37474f" />
        </mesh>
        {/* Blood on left post */}
        <mesh position={[-0.55, 0.78, 0.07]} scale={[0.06, 0.18, 0.01]}>
          <boxGeometry />
          <meshPhysicalMaterial
            color="#8b2635"
            emissive="#8b2635"
            emissiveIntensity={3 + progress * 2}
            roughness={0.1}
          />
        </mesh>

        {/* Right Stone post */}
        <mesh position={[0.55, 0.45, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.1, 8]} />
          <meshStandardMaterial color="#455a64" roughness={0.9} />
        </mesh>
        {/* Right column capital */}
        <mesh position={[0.55, 1.0, 0]} scale={[0.13, 0.08, 0.13]}>
          <boxGeometry />
          <meshStandardMaterial color="#37474f" />
        </mesh>
        {/* Blood on right post */}
        <mesh position={[0.55, 0.78, 0.07]} scale={[0.06, 0.18, 0.01]}>
          <boxGeometry />
          <meshPhysicalMaterial
            color="#8b2635"
            emissive="#8b2635"
            emissiveIntensity={3 + progress * 2}
            roughness={0.1}
          />
        </mesh>

        {/* Lintel */}
        <mesh position={[0, 1.06, 0]}>
          <boxGeometry args={[1.34, 0.1, 0.16]} />
          <meshStandardMaterial color="#37474f" roughness={0.9} />
        </mesh>
        {/* Blood on Lintel */}
        <mesh position={[0, 1.06, 0.085]} scale={[0.38, 0.05, 0.01]}>
          <boxGeometry />
          <meshPhysicalMaterial
            color="#8b2635"
            emissive="#8b2635"
            emissiveIntensity={3 + progress * 2}
            roughness={0.1}
          />
        </mesh>

        {/* Path Base (sandy path) */}
        <mesh position={[0, -0.05, -1.0]} scale={[0.8, 0.04, 2.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#bcaaa4" roughness={0.95} />
        </mesh>
      </group>

      {/* 2. Parting waves */}
      <mesh ref={seaLeftRef} position={[-1.1, -1.5, -1.5]}>
        <planeGeometry args={[0.3, 1.5, 12, 24]} />
        <meshPhysicalMaterial
          color="#0d47a1"
          transmission={0.85}
          roughness={0.05}
          metalness={0.1}
          thickness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          clearcoat={1.0}
        />
      </mesh>

      <mesh ref={seaRightRef} position={[1.1, -1.5, -1.5]}>
        <planeGeometry args={[0.3, 1.5, 12, 24]} />
        <meshPhysicalMaterial
          color="#0d47a1"
          transmission={0.85}
          roughness={0.05}
          metalness={0.1}
          thickness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Pillar of Fire */}
      <group ref={pillarRef} position={[0, 0.4, -2.2]} scale={[0, 0, 0]}>
        <mesh>
          <capsuleGeometry args={[0.14, 1.2, 8, 16]} />
          <meshPhysicalMaterial
            color="#ff5722"
            emissive="#ffab40"
            emissiveIntensity={2 + progress * 3}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        <Sparkles
          count={25}
          scale={[0.3, 1.2, 0.3]}
          size={3}
          speed={1.5}
          color="#ffc107"
        />
      </group>

      <pointLight position={[0, 0.4, -2.2]} intensity={2.5 + progress * 4.0} distance={5} color="#ffa726" />
    </group>
  )
}
