import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import PopChat from './VNChat';

const createGradientTexture = () => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#ff9a9e'); // Light pink
    gradient.addColorStop(1, '#fad0c4'); // Light peach
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  
    return new THREE.CanvasTexture(canvas);
  };

  interface Props {
    setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
export default function AnimatedText({setShowChat} :Props) {
    const [hovered, setHovered] = useState(false);

    const textRef = useRef<THREE.Mesh>(null);
    const textPosition = new THREE.Vector3(-1.35, 0.45, -1); // Adjust this position
    const underlineStart = new THREE.Vector3(-0.2, -0.06, 0); // Adjust this position
    const underlineEnd = new THREE.Vector3(0.2, -0.06, 0); // Adjust this position
    
    return (
      <>
        <group position={textPosition} rotation={[0, Math.PI / 6, 0]}>
          <Text
            ref={textRef}
            fontSize={0.09}
            color="white"
            position={[0, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => {setShowChat(true)}}
          >
            Phục vụ
          </Text>
          {hovered && (
          <>
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([
                    underlineStart.x,
                    underlineStart.y,
                    underlineStart.z,
                    underlineEnd.x,
                    underlineEnd.y,
                    underlineEnd.z,
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color={'white'} linewidth={2} />
            </line>
          </>
        )}
  
          
        </group>
      </>
    );
}
