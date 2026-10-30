"use client";
import React, { useRef } from "react";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function Sun(props) {
    const ref = useRef();

    return (
        <mesh ref={ref} {...props}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#356C70" fog={false} />
        </mesh>
    );
}

export default function Background() {
    const sunRef = useRef();

    const dirLight = useRef();
    useFrame((state, delta) => {
        if (sunRef.current && dirLight.current) {
            dirLight.current.position.copy(sunRef.current.position);
        }
    });

    return (
        <>
            <ambientLight intensity={0.9} />

            <directionalLight
                ref={dirLight}
                color="#356C70"
                position={[-10, 15, -5]}
                intensity={3}
                scale={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            <Sun ref={sunRef} position={[70, 70, -120]} scale={[5, 5, 5]} />
            <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            <Sparkles
                position={[0, 5, 0]}
                count={350}
                scale={[50, 50, 50]}
                size={3}
                speed={0.65}
                color="orange"
            />

            <EffectComposer autoClear={false}>
                <Bloom
                    mipmapBlur
                    luminanceThreshold={1} // Only things brighter than 1 will glow
                    intensity={1.4} // The strength of the glow
                />
                <GodRays
                    sun={sunRef}
                    blendFunction={BlendFunction.Screen}
                    samples={60}
                    density={0.96}
                    decay={0.9}
                    weight={0.4}
                    exposure={0.6}
                    clampMax={1}
                    blur={true}
                />
            </EffectComposer>
        </>
    );
}
