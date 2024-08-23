"use client";

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';


  
const CameraLogger = () => {
  const { camera } = useThree();

  useFrame(() => {
    console.log('Camera Rotation (radians):', camera.rotation);
    console.log('Camera Rotation (degrees):', {
      x: THREE.MathUtils.radToDeg(camera.rotation.x),
      y: THREE.MathUtils.radToDeg(camera.rotation.y),
      z: THREE.MathUtils.radToDeg(camera.rotation.z),
    });
  });

  return null;
};

export function ModelViewer() {
  const modelPath = '/3d/scene.gltf';
  const { scene } = useGLTF(modelPath) as unknown as { scene: THREE.Scene };
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  // Desired camera position and target
  const cameraPosition = new THREE.Vector3(
    -0.9086362791170548,
    0.6565,
    -0.2
  );

  const targetPosition = new THREE.Vector3(-0.9750185175385239, 0.6479162114519987, -0.41090802154821415);

  
  return (
    <Canvas
      camera={{
        position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
        fov: 75,
      }}
      onCreated={({ camera }) => {
        cameraRef.current = camera as THREE.PerspectiveCamera;
        camera.lookAt(targetPosition);
      }}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[5, 5, 5]} intensity={1} decay={2} /> {/* Added point light */}
      <hemisphereLight  groundColor="#444444" intensity={1} /> {/* Added hemisphere light */}
      <Suspense fallback={null}>
        <primitive object={scene} scale={0.5} />
      </Suspense>
      <OrbitControls target={targetPosition} 
      maxPolarAngle={2} // Restrict downward rotation
      minPolarAngle={1.2}
      enablePan={false}/>
      <CameraLogger />
    </Canvas>
  );
}
