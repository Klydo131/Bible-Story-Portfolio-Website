import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const clamp01 = (value) => Math.max(0, Math.min(1, value))

function easeProgress(value) {
  return THREE.MathUtils.smootherstep(clamp01(value), 0, 1)
}

export function SceneRig({
  progress = 0,
  reverse = false,
  accentColor = '#d4a843',
  chapterIndex = 0,
  motionEnabled = true,
}) {
  const { camera, gl } = useThree()
  const smoothProgressRef = useRef(progress)
  const lookAtRef = useMemo(() => new THREE.Vector3(0, 0.2, 0), [])
  const lightRef = useRef()
  const side = reverse ? -1 : 1

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.08
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()
    const damping = motionEnabled ? 4.2 : 24
    smoothProgressRef.current = THREE.MathUtils.damp(
      smoothProgressRef.current,
      progress,
      damping,
      delta
    )

    const eased = easeProgress(smoothProgressRef.current)
    const pointerX = motionEnabled ? state.pointer.x : 0
    const pointerY = motionEnabled ? state.pointer.y : 0
    const breath = motionEnabled ? Math.sin(elapsed * 0.45 + chapterIndex) * 0.055 : 0

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      side * (0.22 - eased * 0.12) + pointerX * 0.14,
      damping,
      delta
    )
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.35 + eased * 0.18 - pointerY * 0.08 + breath,
      damping,
      delta
    )
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      4.75 - eased * 0.55,
      damping,
      delta
    )

    lookAtRef.set(
      side * (0.08 - eased * 0.08) + pointerX * 0.04,
      0.22 + eased * 0.14,
      0
    )
    camera.lookAt(lookAtRef)

    if (lightRef.current) {
      lightRef.current.intensity = 0.65 + eased * 0.45 + Math.max(0, breath) * 1.5
      lightRef.current.position.x = side * (2.4 - eased * 0.4) + pointerX * 0.5
      lightRef.current.position.y = 2.3 + eased * 0.4 - pointerY * 0.25
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[side * 2.4, 2.3, 2.2]}
      intensity={0.75}
      distance={5}
      color={accentColor}
    />
  )
}

export function SceneEntrance({ progress = 0, reverse = false, motionEnabled = true, children }) {
  const groupRef = useRef()
  const smoothProgressRef = useRef(progress)
  const side = reverse ? -1 : 1

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const damping = motionEnabled ? 5 : 24
    smoothProgressRef.current = THREE.MathUtils.damp(
      smoothProgressRef.current,
      progress,
      damping,
      delta
    )

    const eased = easeProgress(smoothProgressRef.current)
    const breathe = motionEnabled ? Math.sin(state.clock.getElapsedTime() * 0.7) * 0.012 : 0

    groupRef.current.position.y = (1 - eased) * 0.18
    groupRef.current.rotation.x = motionEnabled ? (1 - eased) * 0.045 : 0
    groupRef.current.rotation.y = motionEnabled ? side * (1 - eased) * 0.16 : 0
    groupRef.current.scale.setScalar(0.94 + eased * 0.06 + breathe)
  })

  return <group ref={groupRef}>{children}</group>
}
