import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function FallScene({ progress = 0 }) {
  const islandRef = useRef()
  const mouseFollowRef = useRef()
  const dirLightRef = useRef()

  // Individual refs to animate growing/scaling without stretching the group
  const trunkMainRef = useRef()
  const branchLeftRef = useRef()
  const branchRightRef = useRef()
  
  const leafMainRef = useRef()
  const leafLeftRef = useRef()
  const leafRightRef = useRef()
  
  const seedRef = useRef()
  const haloRef = useRef()
  const serpentRef = useRef()

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
      dirLightRef.current.position.x = 5 + state.pointer.x * 3.5
      dirLightRef.current.position.y = 10 - state.pointer.y * 3.5
    }

    // Floating island grows and rotates
    if (islandRef.current) {
      islandRef.current.rotation.y = elapsedTime * 0.03
      const islandScale = Math.min(1.0, progress * 2.2)
      islandRef.current.scale.set(islandScale, islandScale, islandScale)
    }

    // Individual trunk/branch growth (vertical scale, no distortion)
    const trunkGrow = Math.min(1.0, progress * 1.8)
    if (trunkMainRef.current) {
      trunkMainRef.current.scale.set(1, trunkGrow, 1)
    }
    
    const branchGrow = Math.max(0, (progress - 0.15) * 2.0)
    const branchScale = Math.min(1.0, branchGrow)
    if (branchLeftRef.current) {
      branchLeftRef.current.scale.set(1, branchScale, 1)
    }
    if (branchRightRef.current) {
      branchRightRef.current.scale.set(1, branchScale, 1)
    }

    // Leaf clusters blossom (uniform scaling only - no squashing!)
    const leavesScaleVal = Math.min(1.0, Math.max(0, (progress - 0.3) * 2.0))
    if (leafMainRef.current) leafMainRef.current.scale.setScalar(leavesScaleVal)
    if (leafLeftRef.current) leafLeftRef.current.scale.setScalar(leavesScaleVal)
    if (leafRightRef.current) leafRightRef.current.scale.setScalar(leavesScaleVal)

    // Seed of Promise
    if (seedRef.current) {
      const scale = progress * 1.3
      seedRef.current.scale.set(scale, scale, scale)
      seedRef.current.rotation.y = elapsedTime * 0.8
      seedRef.current.rotation.x = elapsedTime * 0.4
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = -elapsedTime * 0.5
      haloRef.current.scale.setScalar(progress * 1.4)
    }

    // Serpent coils
    if (serpentRef.current) {
      serpentRef.current.rotation.y = elapsedTime * 0.4
      serpentRef.current.position.y = 0.45 + Math.sin(elapsedTime) * 0.02
      const serpentScale = Math.min(1.0, Math.max(0, (progress - 0.35) * 3.0))
      serpentRef.current.scale.set(serpentScale * 0.18, serpentScale * 0.25, serpentScale * 0.18)
    }
  })

  // Colors that fade out to withered colors as progress increases
  const trunkColor = new THREE.Color('#5d4037').lerp(new THREE.Color('#263238'), progress)
  const leafColorMain = new THREE.Color('#2e7d32').lerp(new THREE.Color('#455a64'), progress)
  const leafColorAccent = new THREE.Color('#66bb6a').lerp(new THREE.Color('#78909c'), progress)
  const islandColor = new THREE.Color('#33691e').lerp(new THREE.Color('#212121'), progress)
  
  // Withered flower color lerp
  const flowerColorRed = new THREE.Color('#ff5252').lerp(new THREE.Color('#4e342e'), progress)
  const flowerColorYellow = new THREE.Color('#ffeb3b').lerp(new THREE.Color('#37474f'), progress)

  return (
    <group ref={mouseFollowRef}>
      {/* Dynamic stardust sparks */}
      <Sparkles
        count={90}
        scale={4}
        size={3.5}
        speed={0.6}
        color={progress > 0.5 ? '#e53935' : '#81c784'}
      />

      <ambientLight intensity={0.15} />
      <directionalLight ref={dirLightRef} position={[5, 10, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={progress * 1.2} color="#ff8a80" />

      {/* Floating Garden Island */}
      <group ref={islandRef}>
        {/* Grassy Island Base */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.12, 8]} />
          <meshStandardMaterial color={islandColor} roughness={0.9} flatShading />
        </mesh>
        
        {/* Dirt lower layer */}
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[1.6, 1.4, 0.1, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.95} flatShading />
        </mesh>

        {/* Garden Flowers */}
        <group position={[-0.6, 0.05, 0.5]} scale={[0.12, 0.12, 0.12]}>
          <mesh><dodecahedronGeometry /><meshStandardMaterial color={flowerColorRed} flatShading /></mesh>
          <mesh position={[0, -0.4, 0]} scale={[0.3, 0.8, 0.3]}><cylinderGeometry /><meshStandardMaterial color="#2e7d32" /></mesh>
        </group>
        <group position={[0.5, 0.05, -0.6]} scale={[0.1, 0.1, 0.1]}>
          <mesh><dodecahedronGeometry /><meshStandardMaterial color={flowerColorYellow} flatShading /></mesh>
          <mesh position={[0, -0.4, 0]} scale={[0.3, 0.8, 0.3]}><cylinderGeometry /><meshStandardMaterial color="#2e7d32" /></mesh>
        </group>

        {/* Rock stairs details */}
        <mesh position={[0.7, -0.03, 0.7]} rotation={[0, Math.PI / 4, 0]} scale={[0.3, 0.08, 0.15]}>
          <boxGeometry />
          <meshStandardMaterial color="#546e7a" roughness={0.8} />
        </mesh>
        <mesh position={[0.8, -0.08, 0.8]} rotation={[0, Math.PI / 4, 0]} scale={[0.4, 0.08, 0.15]}>
          <boxGeometry />
          <meshStandardMaterial color="#546e7a" roughness={0.8} />
        </mesh>

        {/* The Tree of Knowledge (Split-branch structural model) */}
        <group>
          {/* Main Trunk (Grows from base center up to y=0.35) */}
          <mesh ref={trunkMainRef} position={[0, 0.35, 0]} scale={[1, 0, 1]}>
            <cylinderGeometry args={[0.08, 0.14, 0.7, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>

          {/* Left Branch (Splits off main trunk) */}
          <mesh
            ref={branchLeftRef}
            position={[-0.15, 0.65, 0.05]}
            rotation={[0, 0, 0.45]}
            scale={[1, 0, 1]}
          >
            <cylinderGeometry args={[0.05, 0.08, 0.45, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>

          {/* Right Branch (Splits off main trunk) */}
          <mesh
            ref={branchRightRef}
            position={[0.15, 0.7, -0.05]}
            rotation={[0, 0, -0.45]}
            scale={[1, 0, 1]}
          >
            <cylinderGeometry args={[0.04, 0.07, 0.4, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>

          {/* Foliage Leaf balls (Uniform scale - prevents stretching!) */}
          
          {/* Main center top leaf ball */}
          <group ref={leafMainRef} position={[0, 0.9, 0]} scale={[0, 0, 0]}>
            <mesh>
              <dodecahedronGeometry args={[0.45, 1]} />
              <meshPhysicalMaterial color={leafColorMain} roughness={0.7} clearcoat={0.3} />
            </mesh>
          </group>

          {/* Left branch leaf ball */}
          <group ref={leafLeftRef} position={[-0.32, 0.85, 0.1]} scale={[0, 0, 0]}>
            <mesh>
              <dodecahedronGeometry args={[0.32, 1]} />
              <meshPhysicalMaterial color={leafColorAccent} roughness={0.8} />
            </mesh>
          </group>

          {/* Right branch leaf ball */}
          <group ref={leafRightRef} position={[0.3, 0.88, -0.1]} scale={[0, 0, 0]}>
            <mesh>
              <dodecahedronGeometry args={[0.28, 1]} />
              <meshPhysicalMaterial color={leafColorAccent} roughness={0.8} />
            </mesh>
          </group>

          {/* The Serpent coiling up the trunk */}
          <group ref={serpentRef} position={[0, 0.45, 0]} scale={[0, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.7, 0.16, 8, 24]} />
              <meshStandardMaterial color="#d4a843" metalness={0.9} roughness={0.1} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* The Seed of Promise */}
      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.3}>
        <group position={[0.2, 0.12, 0.9]}>
          <mesh ref={seedRef} scale={[0, 0, 0]}>
            <octahedronGeometry args={[0.15]} />
            <meshPhysicalMaterial
              color="#d4a843"
              emissive="#e8c96a"
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          <mesh ref={haloRef} rotation={[Math.PI / 3, 0, 0]} scale={[0, 0, 0]}>
            <torusGeometry args={[0.26, 0.008, 8, 32]} />
            <meshBasicMaterial color="#d4a843" transparent opacity={progress * 0.8} />
          </mesh>
        </group>
      </Float>

      {/* Local point light */}
      {progress > 0.1 && (
        <pointLight
          position={[0.2, 0.12, 0.9]}
          intensity={progress * 7.0}
          distance={3.5}
          color="#d4a843"
        />
      )}
    </group>
  )
}
