import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, useAnimations, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBoy() {
    const group = useRef();
    // Using an incredibly smooth animated humanoid from Three.js examples
    const { scene, animations } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the "Idle" animation to give him life and breathing motion
        if (actions && actions['Idle']) {
            actions['Idle'].reset().fadeIn(0.5).play();
        }
        
        // Let's create an insanely sleek customized material (White stylized glass/marble)
        scene.traverse((child) => {
            if (child.isMesh) {
                // Replacing the default military textures with a premium elegant aesthetic
                child.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color('#f4f7f6'),
                    roughness: 0.2,
                    metalness: 0.1,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    transmission: 0.2,
                    ior: 1.5,
                });
            }
        });
    }, [actions, scene]);

    // Make the character gracefully track the user's mouse
    useFrame((state) => {
        // We let the character subtly turn his whole body toward the mouse
        const targetX = (state.mouse.x * Math.PI) / 6;

        
        // Smooth interpolation
        group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
        // Optionally map X to rotation Z or X for leaning
        // group.current.rotation.x += (-targetY - group.current.rotation.x) * 0.05;
    });

    return (
        <group ref={group} dispose={null} scale={2} position={[0, -2.5, 0]}>
            <primitive object={scene} />
        </group>
    );
}

// Pre-load the character model
useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb');

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
                <ambientLight intensity={0.8} />
                
                {/* Cinematic Key Lighting */}
                <directionalLight 
                    position={[10, 10, 10]} 
                    intensity={2} 
                    color="#20b26c" 
                    castShadow 
                />
                
                {/* Fill Lighting */}
                <directionalLight 
                    position={[-10, 5, -10]} 
                    intensity={1.5} 
                    color="#ffffff" 
                />
                
                {/* Rim Lighting to make the silhouette pop */}
                <spotLight 
                    position={[0, 10, -5]} 
                    intensity={3} 
                    color="#1152d4" 
                    penumbra={1} 
                />

                <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
                    <AnimatedBoy />
                </Float>

                {/* Soft ground shadow to anchor the character */}
                <ContactShadows position={[0, -2.5, 0]} opacity={0.7} scale={10} blur={2.5} far={4} color="#000000" />
                
                {/* Environment reflections */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
