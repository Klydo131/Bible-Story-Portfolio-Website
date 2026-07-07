import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function DavidScene({ progress = 0 }) {
  const crownRef = useRef()
  const mangerRef = useRef()
  const starRef = useRef()
  const mangerLightRef = useRef()
  const throneRef = useRef()
  const starBeamRef = useRef()
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

    if (crownRef.current) {
      crownRef.current.rotation.y = elapsedTime * 0.12
      crownRef.current.position.y = 0.8 - progress * 1.1
    }

    // Throne rises up as section scrolls in
    if (throneRef.current) {
      throneRef.current.rotation.y = elapsedTime * 0.05
      const throneRise = Math.min(1.0, progress * 1.5)
      throneRef.current.position.y = THREE.MathUtils.lerp(-1.0, -0.2, throneRise)
      throneRef.current.scale.setScalar(throneRise)
    }

    if (mangerRef.current) {
      const visibility = Math.max(0, (progress - 0.3) * 1.5)
      mangerRef.current.scale.set(visibility, visibility, visibility)
    }

    if (mangerLightRef.current) {
      const pulse = 1.5 + Math.sin(elapsedTime * 3.0) * 0.5
      mangerLightRef.current.intensity = Math.max(0, (progress - 0.4) * 5.0) * pulse
    }

    if (starRef.current) {
      const scale = progress * 1.0
      starRef.current.scale.set(scale, scale, scale)
      starRef.current.rotation.z = elapsedTime * 0.05
      const starPulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.08
      starRef.current.scale.multiplyScalar(starPulse)
    }

    if (starBeamRef.current) {
      const visibility = Math.max(0, (progress - 0.5) * 2.0)
      starBeamRef.current.scale.set(visibility, visibility, visibility)
      starBeamRef.current.material.opacity = visibility * 0.3
    }
  })

  const spikeAngles = [...Array(6)].map((_, i) => (i / 6) * Math.PI * 2)

  return (
    <group ref={mouseFollowRef}>
      {/* Star of Bethlehem sparkles */}
      {progress > 0.4 && (
        <Sparkles
          count={40}
          scale={[1.5, 3, 1.5]}
          position={[0, 0.6, 0]}
          size={3}
          speed={0.8}
          color="#fffde7"
        />
      )}

      {/* Strong white directional light always active to show crown & manger */}
      <directionalLight ref={dirLightRef} position={[3, 5, 3]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} color="#1a3a5c" />

      {/* 1. King David's Throne */}
      <group ref={throneRef} position={[0, -1.0, 0]} scale={[0, 0, 0]}>
        {/* Throne Base steps */}
        <mesh position={[0, -0.25, 0]} scale={[1.2, 0.1, 1.0]}><boxGeometry /><meshStandardMaterial color="#455a64" roughness={0.9} /></mesh>
        <mesh position={[0, -0.15, 0.05]} scale={[0.9, 0.1, 0.8]}><boxGeometry /><meshStandardMaterial color="#37474f" roughness={0.9} /></mesh>
        
        {/* Throne Seat */}
        <mesh position={[0, 0.05, -0.05]} scale={[0.6, 0.3, 0.5]}><boxGeometry /><meshStandardMaterial color="#37474f" roughness={0.9} /></mesh>
        {/* Throne Backrest */}
        <mesh position={[0, 0.5, -0.25]} scale={[0.55, 0.7, 0.15]}><boxGeometry /><meshStandardMaterial color="#37474f" roughness={0.9} /></mesh>
        {/* Throne Armrests */}
        <mesh position={[-0.32, 0.22, -0.05]} scale={[0.08, 0.3, 0.5]}><boxGeometry /><meshStandardMaterial color="#263238" /></mesh>
        <mesh position={[0.32, 0.22, -0.05]} scale={[0.08, 0.3, 0.5]}><boxGeometry /><meshStandardMaterial color="#263238" /></mesh>

        {/* Velvet seat cushion */}
        <mesh position={[0, 0.21, -0.05]} scale={[0.5, 0.04, 0.44]}><boxGeometry /><meshStandardMaterial color="#8b2635" roughness={0.8} /></mesh>
      </group>

      {/* 2. David's Crown */}
      <group ref={crownRef} position={[0, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.06, 8, 32]} />
          <meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} />
        </mesh>
        
        {spikeAngles.map((angle, i) => {
          const r = 0.5
          const x = Math.cos(angle) * r
          const z = Math.sin(angle) * r
          return (
            <group key={i} position={[x, 0.08, z]} rotation={[0, -angle, 0.25]}>
              <mesh>
                <coneGeometry args={[0.06, 0.25, 4]} />
                <meshStandardMaterial color="#e8c96a" metalness={0.95} roughness={0.05} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={i % 2 === 0 ? '#ff1744' : '#00e5ff'} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* 3. The Manger */}
      <group ref={mangerRef} position={[0, -0.5, 0]} scale={[0, 0, 0]}>
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.56, 0.05, 0.36]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0.17]}>
            <boxGeometry args={[0.56, 0.2, 0.03]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.08, -0.17]}>
            <boxGeometry args={[0.56, 0.2, 0.03]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.95} />
          </mesh>
          <mesh position={[-0.27, 0.08, 0]}>
            <boxGeometry args={[0.03, 0.2, 0.32]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.95} />
          </mesh>
          <mesh position={[0.27, 0.08, 0]}>
            <boxGeometry args={[0.03, 0.2, 0.32]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.95} />
          </mesh>

          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.28]} />
            <meshStandardMaterial color="#ffd54f" roughness={0.8} />
          </mesh>
        </group>

        <mesh position={[-0.24, 0.0, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[-0.24, 0.0, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0.24, 0.0, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0.24, 0.0, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>

        <pointLight ref={mangerLightRef} position={[0, 0.22, 0]} intensity={0} distance={3.5} color="#fffde7" />
      </group>

      {/* 4. The Ornate Star of Bethlehem */}
      <group ref={starRef} position={[0, 1.4, 0]} scale={[0, 0, 0]}>
        <Float speed={4} rotationIntensity={0.2} floatIntensity={0.1}>
          <mesh><boxGeometry args={[0.08, 0.9, 0.05]} /><meshBasicMaterial color="#fffde7" /></mesh>
          <mesh><boxGeometry args={[0.55, 0.08, 0.05]} /><meshBasicMaterial color="#fffde7" /></mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.3, 0.04, 0.04]} /><meshBasicMaterial color="#e8c96a" /></mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.3, 0.04, 0.04]} /><meshBasicMaterial color="#e8c96a" /></mesh>
          <mesh><sphereGeometry args={[0.13, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </Float>
      </group>

      {/* Volumetric Starlight Ray Beam */}
      <mesh ref={starBeamRef} position={[0, 0.45, 0]} scale={[0, 0, 0]}>
        <coneGeometry args={[0.3, 1.9, 16, 1, true]} />
        <meshBasicMaterial
          color="#fffde7"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight position={[0, 1.4, 0]} intensity={progress * 5.0} distance={6} color="#fffde7" />
    </group>
  )
}
