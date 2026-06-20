import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#06b6d4" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#6366f1" />
      
      <AnimatedShape />
      
      {/* Optional: Add orbit controls, but disable zoom so it doesn't interfere with scroll */}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

import { Suspense } from 'react'

export default function CanvasBackground({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none', background: 'transparent', ...style }}>
      <Suspense fallback={null}>
        <Canvas 
          camera={{ position: [0, 0, 3.5] }} 
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
