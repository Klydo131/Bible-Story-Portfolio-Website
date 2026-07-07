import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function NoahScene({ progress = 0 }) {
  const arkRef = useRef()
  const wavesGroupRef = useRef()
  const rainbowRef = useRef()
  const mouseFollowRef = useRef()
  const dirLightRef = useRef()
  
  // Ref for the flying dove and its wings
  const doveRef = useRef()
  const leftWingRef = useRef()
  const rightWingRef = useRef()

  // Generate 25 wave cubes (5x5 grid)
  const waveCubes = useMemo(() => {
    const grid = []
    const size = 5
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        grid.push({
          x: (x - 2) * 0.8,
          z: (z - 2) * 0.8,
          offset: Math.random() * Math.PI * 2,
          speed: 1.5 + Math.random() * 1.5
        })
      }
    }
    return grid
  }, [])

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
        0.25 - state.pointer.y * 0.35,
        0.1
      )
    }

    // Dynamic light tracking pointer
    if (dirLightRef.current) {
      dirLightRef.current.position.x = 5 + state.pointer.x * 3.5
      dirLightRef.current.position.y = 10 - state.pointer.y * 3.5
    }

    // 1. Ark landing and bobbing animation
    if (arkRef.current) {
      const bobY = 0.18 + Math.sin(elapsedTime * 1.8) * 0.05
      const landProgress = Math.min(1.0, progress * 2.0)
      arkRef.current.position.y = THREE.MathUtils.lerp(-1.0, bobY, landProgress)
      arkRef.current.rotation.z = Math.sin(elapsedTime * 1.2) * 0.04
      arkRef.current.rotation.x = Math.cos(elapsedTime * 1.0) * 0.02
      arkRef.current.rotation.y = elapsedTime * 0.04
      arkRef.current.scale.setScalar(landProgress)
    }

    // 2. Wave grid rises up and ripples
    if (wavesGroupRef.current) {
      // Wave grid rises up from depth
      const baseHeight = -1.2 + Math.min(1.0, progress * 1.6) * 0.75
      wavesGroupRef.current.position.y = baseHeight

      wavesGroupRef.current.children.forEach((cube, i) => {
        const waveConfig = waveCubes[i]
        const yOffset = Math.sin(elapsedTime * waveConfig.speed + waveConfig.offset) * 0.06
        cube.position.y = yOffset
        cube.rotation.x = Math.sin(elapsedTime * 0.5 + i) * 0.05
      })
    }

    // 3. Rainbow scaling
    if (rainbowRef.current) {
      const rainbowScale = Math.max(0, (progress - 0.5) * 2) * 1.6
      rainbowRef.current.scale.set(rainbowScale, rainbowScale, rainbowScale)
      rainbowRef.current.rotation.z = elapsedTime * 0.03
    }

    // 4. Animate the flying dove
    if (doveRef.current) {
      const visibility = Math.max(0, (progress - 0.5) * 2)
      doveRef.current.scale.set(visibility * 0.4, visibility * 0.4, visibility * 0.4)
      
      const angle = elapsedTime * 1.2
      doveRef.current.position.set(
        Math.cos(angle) * 1.1,
        0.6 + Math.sin(elapsedTime * 2.0) * 0.1,
        Math.sin(angle) * 1.1
      )
      
      doveRef.current.rotation.y = -angle + Math.PI / 2

      const flap = Math.sin(elapsedTime * 14.0) * 0.8
      if (leftWingRef.current) leftWingRef.current.rotation.z = flap
      if (rightWingRef.current) rightWingRef.current.rotation.z = -flap
    }
  })

  const rainbowColors = [
    '#ff3b30',
    '#ff9500',
    '#ffcc00',
    '#4cd964',
    '#5ac8fa',
    '#007aff',
    '#5856d6'
  ]

  return (
    <group ref={mouseFollowRef}>
      {/* Rain sparkles */}
      {progress < 0.75 && (
        <Sparkles
          count={100}
          scale={5}
          size={2.5}
          speed={1.5}
          color="#80deea"
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight ref={dirLightRef} position={[5, 10, 5]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={progress * 1.0} color="#fffde7" />

      {/* 1. Low-Poly Ark */}
      <group ref={arkRef} position={[0, -1.0, 0]} scale={[0, 0, 0]}>
        {/* Hull */}
        <mesh>
          <boxGeometry args={[1.2, 0.32, 0.52]} />
          <meshStandardMaterial color="#5d4037" roughness={0.85} />
        </mesh>
        
        {/* Curved Bow */}
        <mesh position={[0.6, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.22, 0.22, 0.52]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        {/* Curved Stern */}
        <mesh position={[-0.6, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.22, 0.22, 0.52]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>

        {/* Deck Cabin */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.7, 0.18, 0.34]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.7} />
        </mesh>
        <mesh position={[-0.05, 0.38, 0]} scale={[0.8, 0.8, 0.8]}>
          <boxGeometry args={[0.7, 0.18, 0.34]} />
          <meshStandardMaterial color="#a1887f" roughness={0.7} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[-0.05, 0.48, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.32]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>

        {/* Hanging Stern Lantern */}
        <group position={[-0.72, 0.08, 0]}>
          <mesh scale={[0.1, 0.02, 0.02]}><boxGeometry /></mesh>
          <mesh position={[-0.06, -0.06, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
            <meshBasicMaterial color="#ffe082" />
          </mesh>
          <pointLight position={[-0.06, -0.06, 0]} intensity={1.5} distance={1} color="#ffb74d" />
        </group>

        {/* Porthole Windows */}
        <mesh position={[0.2, 0.25, 0.175]} scale={[0.04, 0.05, 0.01]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffd54f" />
        </mesh>
        <mesh position={[-0.2, 0.25, 0.175]} scale={[0.04, 0.05, 0.01]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffd54f" />
        </mesh>
      </group>

      {/* 2. Wave Grid */}
      <group ref={wavesGroupRef} position={[0, -1.2, 0]}>
        {waveCubes.map((cube, idx) => (
          <mesh key={idx} position={[cube.x, 0, cube.z]}>
            <boxGeometry args={[0.78, 0.3, 0.78]} />
            <meshPhysicalMaterial
              color="#00695c"
              roughness={0.05}
              metalness={0.1}
              transmission={0.85}
              thickness={0.8}
              transparent
              opacity={0.85}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
        ))}
      </group>

      {/* 3. The Flying Dove */}
      <group ref={doveRef} position={[0, 0.6, 0]} scale={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.08, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0.09, 0.04, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.13, 0.02, 0]} scale={[0.04, 0.015, 0.03]} rotation={[0, 0.3, 0.1]}>
          <boxGeometry />
          <meshBasicMaterial color="#4caf50" />
        </mesh>
        <mesh ref={leftWingRef} position={[0, 0.04, 0.05]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.18]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh ref={rightWingRef} position={[0, 0.04, -0.05]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.18]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
      </group>

      {/* 4. Glass Rainbow */}
      <group ref={rainbowRef} position={[0, 0.2, -1.2]} scale={[0, 0, 0]}>
        {rainbowColors.map((color, idx) => (
          <mesh key={idx} position={[0, 0, idx * 0.03]}>
            <torusGeometry args={[1.4 + idx * 0.05, 0.024, 8, 48, Math.PI]} />
            <meshPhysicalMaterial
              color={color}
              transmission={0.9}
              roughness={0.0}
              transparent
              opacity={0.45}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight position={[0, 1.5, -0.8]} intensity={progress * 4.0} color="#ffd54f" />
    </group>
  )
}
