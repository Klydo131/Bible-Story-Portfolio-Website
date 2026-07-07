import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function SanctuaryScene({ progress = 0 }) {
  const containerRef = useRef()
  const veilLeftRef = useRef()
  const veilRightRef = useRef()
  const shekinahRef = useRef()
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

    // Tabernacle container scales up from the ground
    if (containerRef.current) {
      containerRef.current.rotation.y = elapsedTime * 0.05
      containerRef.current.rotation.x = 0.35 // fixed tilt for viewing angle
      
      const assembleScale = Math.min(1.0, progress * 2.0)
      containerRef.current.scale.set(assembleScale, assembleScale, assembleScale)
    }

    if (shekinahRef.current) {
      const pulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.12
      const scale = progress * 1.6
      shekinahRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse)
    }

    const tear = Math.max(0, (progress - 0.5) * 2)
    if (veilLeftRef.current) {
      veilLeftRef.current.position.x = -0.16 - tear * 0.45
      veilLeftRef.current.rotation.y = -tear * 0.5
    }
    if (veilRightRef.current) {
      veilRightRef.current.position.x = 0.16 + tear * 0.45
      veilRightRef.current.rotation.y = tear * 0.5
    }
  })

  return (
    <group ref={mouseFollowRef}>
      {/* Court dust */}
      <Sparkles
        count={50}
        scale={[2, 1, 3]}
        size={2.5}
        speed={0.5}
        color="#e8c96a"
      />

      {/* Strong white directional light always active to show Ark, Laver, Altar, walls */}
      <directionalLight ref={dirLightRef} position={[3, 5, 3]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.6} color="#7986cb" />

      <group ref={containerRef} scale={[0, 0, 0]}>
        {/* 1. Outer Court Wall */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[2.0, 0.05, 3.0]} />
          <meshStandardMaterial color="#4a2d6b" roughness={0.9} wireframe />
        </mesh>

        {/* 2. Bronze Altar */}
        <group position={[0, 0.05, 0.9]}>
          <mesh>
            <boxGeometry args={[0.36, 0.18, 0.36]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.8} metalness={0.7} />
          </mesh>
          <mesh position={[-0.18, 0.1, 0.18]} scale={[0.03, 0.05, 0.03]}><boxGeometry /></mesh>
          <mesh position={[0.18, 0.1, 0.18]} scale={[0.03, 0.05, 0.03]}><boxGeometry /></mesh>
          <mesh position={[-0.18, 0.1, -0.18]} scale={[0.03, 0.05, 0.03]}><boxGeometry /></mesh>
          <mesh position={[0.18, 0.1, -0.18]} scale={[0.03, 0.05, 0.03]}><boxGeometry /></mesh>
          
          <Sparkles count={8} scale={[0.2, 0.2, 0.2]} position={[0, 0.12, 0]} size={2} color="#ff3d00" speed={1.5} />
          <pointLight position={[0, 0.15, 0]} intensity={1.5} distance={1.5} color="#ff3d00" />
        </group>

        {/* 3. Laver */}
        <group position={[0, 0.06, 0.35]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.1, 0.12, 12]} />
            <meshStandardMaterial color="#b0bec5" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 12]} />
            <meshPhysicalMaterial color="#00bcd4" transmission={0.85} roughness={0.05} clearcoat={1.0} />
          </mesh>
        </group>

        {/* 4. Tabernacle Shroud */}
        <group position={[0, 0.35, -0.8]}>
          <mesh>
            <boxGeometry args={[0.9, 0.75, 1.7]} />
            <meshStandardMaterial
              color="#311b92"
              transparent
              opacity={0.15 + (1 - progress) * 0.15}
              roughness={0.9}
              wireframe
            />
          </mesh>
          
          <mesh position={[-0.42, -0.37, 0.85]} scale={[0.04, 0.75, 0.04]}><cylinderGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[-0.14, -0.37, 0.85]} scale={[0.04, 0.75, 0.04]}><cylinderGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0.14, -0.37, 0.85]} scale={[0.04, 0.75, 0.04]}><cylinderGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0.42, -0.37, 0.85]} scale={[0.04, 0.75, 0.04]}><cylinderGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
        </group>

        {/* 5. Golden Lampstand */}
        <group position={[-0.25, 0.18, -0.6]}>
          <mesh><cylinderGeometry args={[0.015, 0.015, 0.35]} /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.08, 0.01, 8, 16, Math.PI]} /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
          <pointLight position={[0, 0.2, 0]} intensity={0.8} distance={1} color="#ffc107" />
        </group>

        {/* Table of Showbread */}
        <group position={[0.25, 0.1, -0.6]}>
          <mesh scale={[0.18, 0.08, 0.28]}><boxGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
        </group>

        {/* Altar of Incense */}
        <group position={[0, 0.15, -0.9]}>
          <mesh scale={[0.12, 0.22, 0.12]}><boxGeometry /><meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} /></mesh>
        </group>

        {/* 6. The Ark */}
        <group position={[0, 0.16, -1.3]}>
          <mesh>
            <boxGeometry args={[0.3, 0.18, 0.2]} />
            <meshStandardMaterial color="#d4a843" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[-0.09, 0.15, 0]} rotation={[0, 0, Math.PI / 3.5]}>
            <torusGeometry args={[0.09, 0.01, 6, 16, Math.PI]} />
            <meshStandardMaterial color="#e8c96a" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[0.09, 0.15, 0]} rotation={[0, 0, -Math.PI / 3.5]}>
            <torusGeometry args={[0.09, 0.01, 6, 16, Math.PI]} />
            <meshStandardMaterial color="#e8c96a" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Shekinah Glory */}
        <mesh ref={shekinahRef} position={[0, 0.22, -1.3]} scale={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshPhysicalMaterial
            color="#fffde7"
            emissive="#e8c96a"
            emissiveIntensity={3}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>

        {/* 7. The Veil */}
        <group position={[0, 0.35, -0.7]}>
          <mesh ref={veilLeftRef} position={[-0.16, 0, 0]}>
            <planeGeometry args={[0.32, 0.65]} />
            <meshStandardMaterial
              color="#311b92"
              roughness={0.8}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh ref={veilRightRef} position={[0.16, 0, 0]}>
            <planeGeometry args={[0.32, 0.65]} />
            <meshStandardMaterial
              color="#311b92"
              roughness={0.8}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      </group>

      {progress > 0.1 && (
        <pointLight
          position={[0, 0.3, -1.3]}
          intensity={progress * 10.0}
          distance={5}
          color="#e8c96a"
        />
      )}
    </group>
  )
}
