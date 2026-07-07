import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function ProphecyScene({ progress = 0 }) {
  const scrollsGroupRef = useRef()
  const crossRef = useRef()
  const burstParticlesRef = useRef()
  const mouseFollowRef = useRef()

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime()

    // Smooth mouse follow parallax
    if (mouseFollowRef.current) {
      mouseFollowRef.current.rotation.y = THREE.MathUtils.lerp(
        mouseFollowRef.current.rotation.y,
        state.pointer.x * 0.4,
        0.1
      )
      mouseFollowRef.current.rotation.x = THREE.MathUtils.lerp(
        mouseFollowRef.current.rotation.x,
        0.2 - state.pointer.y * 0.3,
        0.1
      )
    }

    if (scrollsGroupRef.current) {
      scrollsGroupRef.current.rotation.y = elapsedTime * 0.08
      const distance = Math.max(0, 1.0 - progress * 1.5)
      
      scrollsGroupRef.current.children.forEach((scroll, idx) => {
        const angle = (idx / 4) * Math.PI * 2
        scroll.position.x = Math.cos(angle) * distance * 1.6
        scroll.position.z = Math.sin(angle) * distance * 1.6
        scroll.position.y = (idx % 2 === 0 ? 0.25 : -0.25) * distance
        scroll.rotation.x = elapsedTime * 0.25 + idx
        scroll.rotation.y = elapsedTime * 0.15
      })
    }

    if (crossRef.current) {
      const visibility = Math.max(0, (progress - 0.5) * 2)
      crossRef.current.scale.set(visibility, visibility, visibility)
      crossRef.current.rotation.y = elapsedTime * 0.25
      crossRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05
    }

    if (burstParticlesRef.current) {
      const burstScale = 1.0 + Math.max(0, (progress - 0.7) * 4.0) * 3.0
      burstParticlesRef.current.scale.set(burstScale, burstScale, burstScale)
      burstParticlesRef.current.rotation.y = elapsedTime * 0.05
    }
  })

  return (
    <group ref={mouseFollowRef}>
      {/* Background stardust */}
      <Sparkles
        count={60}
        scale={4}
        size={2.5}
        speed={0.6}
        color={progress > 0.65 ? '#8b2635' : '#b8c4d0'}
      />

      {/* Strong white directional light always active to show scrolls and cross */}
      <directionalLight position={[3, 5, 3]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} color="#b8c4d0" />

      {/* 1. Scrolls */}
      <group ref={scrollsGroupRef}>
        {[...Array(4)].map((_, i) => (
          <group key={i}>
            <Float speed={3} rotationIntensity={0.5} floatIntensity={0.3}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, 0.75, 16]} />
                <meshStandardMaterial
                  color="#f5f0e8"
                  roughness={0.9}
                  transparent
                  opacity={Math.max(0, 1.0 - progress * 1.6)}
                />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.015, 0.035, 0.07, 8]} />
                <meshStandardMaterial
                  color="#5d4037"
                  metalness={0.5}
                  transparent
                  opacity={Math.max(0, 1.0 - progress * 1.6)}
                />
              </mesh>
              <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.015, 0.035, 0.07, 8]} />
                <meshStandardMaterial
                  color="#5d4037"
                  metalness={0.5}
                  transparent
                  opacity={Math.max(0, 1.0 - progress * 1.6)}
                />
              </mesh>
              
              <mesh position={[0.09, 0, 0.01]} rotation={[0, 0.2, 0]}>
                <planeGeometry args={[0.15, 0.68]} />
                <meshStandardMaterial
                  color="#e8e0d4"
                  roughness={0.9}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={Math.max(0, 1.0 - progress * 1.6)}
                />
              </mesh>
            </Float>
          </group>
        ))}
      </group>

      {/* 2. Redemptive Cross with floating crown of thorns */}
      <group ref={crossRef} scale={[0, 0, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.15}>
          {/* Vertical beam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.22, 1.7, 0.22]} />
            <meshPhysicalMaterial
              color="#8b2635"
              emissive="#8b2635"
              emissiveIntensity={1.8}
              transmission={0.85}
              roughness={0.1}
              thickness={0.8}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>
          
          {/* Horizontal cross bar */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.1, 0.22, 0.22]} />
            <meshPhysicalMaterial
              color="#8b2635"
              emissive="#8b2635"
              emissiveIntensity={1.8}
              transmission={0.85}
              roughness={0.1}
              thickness={0.8}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Crown of Thorns floating around the cross center */}
          <group position={[0, 0.35, 0]}>
            <mesh>
              <torusGeometry args={[0.24, 0.02, 6, 24]} />
              <meshStandardMaterial color="#3e2723" roughness={0.9} />
            </mesh>
            {[...Array(8)].map((_, idx) => {
              const ang = (idx / 8) * Math.PI * 2
              return (
                <mesh
                  key={idx}
                  position={[Math.cos(ang) * 0.24, Math.sin(ang) * 0.05, Math.sin(ang) * 0.24]}
                  rotation={[0.3, ang, 0.3]}
                  scale={[0.02, 0.08, 0.02]}
                >
                  <coneGeometry />
                  <meshStandardMaterial color="#2d1a10" />
                </mesh>
              )
            })}
          </group>

          {/* Central Golden Star (representing the light of redemption) */}
          <mesh position={[0, 0.35, 0.13]}>
            <dodecahedronGeometry args={[0.12]} />
            <meshPhysicalMaterial
              color="#d4a843"
              emissive="#e8c96a"
              emissiveIntensity={3.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          <pointLight position={[0, 0.35, 0]} intensity={5.0} distance={5} color="#e8c96a" />
        </Float>
      </group>

      {/* 3. Explosion stardust */}
      {progress > 0.7 && (
        <group ref={burstParticlesRef}>
          <Sparkles
            count={60}
            scale={2.2}
            size={4}
            speed={2.2}
            color="#ffe082"
          />
        </group>
      )}
    </group>
  )
}
