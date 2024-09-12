"use client";

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useAnimations, useCubeTexture  } from '@react-three/drei';
import * as THREE from 'three';
import AnimatedText from './3DText';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

  
const CameraLogger = () => {
  const { camera } = useThree();

  useFrame(() => {
    // console.log('Camera Position:', {
    //   x: camera.position.x,
    //   y: camera.position.y,
    //   z: camera.position.z,
    // });
    // console.log('Camera Position (degrees):', {
    //   x: THREE.MathUtils.radToDeg(camera.position.x),
    //   y: THREE.MathUtils.radToDeg(camera.position.y),
    //   z: THREE.MathUtils.radToDeg(camera.position.z),
    // });
  });
  return null;
};

const Cat = ({ position }: { position: [number, number, number] }) => {
  // const { scene, animations } = useGLTF('/3d/cat/scene.gltf') as any;
  const { scene, animations } = useLoader(GLTFLoader, "/3d/cat/scene.gltf");
  const ref = useRef<THREE.Group>(null!);
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(position[0], position[1], position[2]);
      ref.current.scale.set(0.007, 0.007, 0.007); // Scale down the model

      // Play the animation (assuming the first animation is the one you want to play)
      if (actions && Object.keys(actions).length > 0) {
        const firstAction = actions[Object.keys(actions)[0]];
        if (firstAction) {
          firstAction.play();
        }
      }
    }
  }, [position, actions]);

  return <primitive ref={ref} object={scene} />;
};

interface Props {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModelViewer({ setShowChat }: Props) {
  const { scene } = useLoader(GLTFLoader, "/3d/scene.gltf");
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  // Desired camera position and target
  const cameraPosition = new THREE.Vector3(
    -0.9086362791170548,
    0.6565,
    -0.4
  );

  const targetPosition = new THREE.Vector3(-1, 0.6479162114519987, -0.41090802154821415);

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
        <Cat position={[ -1.25,
    0.3865,
    -0.45]}
     /> 
      </Suspense>
      <OrbitControls target={targetPosition} 
      maxPolarAngle={2} // Restrict downward rotation
      minPolarAngle={1.2}
      enablePan={false}
      enableZoom={false}/>
      <CameraLogger />    
        <group layers={1}>
        <Suspense fallback={null}>
          <AnimatedText setShowChat={setShowChat}/>
        </Suspense>
      </group>
      <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
          </EffectComposer>
    </Canvas>
  );
}
