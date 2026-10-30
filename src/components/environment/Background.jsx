"use client";

import React, { useRef } from "react";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

function Moon({ color, ...props }) {
    return (
        <mesh {...props}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={color} fog={false} />
        </mesh>
    );
}

export default function Background() {
    const moonRef = useRef();
    const dirLight = useRef();

    // Moon controls
    const { moonColor, moonIntensity } = useControls(
        "Moon Settings",
        {
            moonColor: {
                value: "#356C70",
                label: "Moon Color",
            },
            moonIntensity: {
                value: 3,
                min: 0,
                max: 10,
                step: 0.1,
                label: "Moon Light Intensity",
            },
        },
        { collapsed: true },
    );

    // Sparkles controls
    const { sparkleColor, sparkleCount, sparkleSize, sparkleSpeed } =
        useControls(
            "Sparkles Settings",
            {
                sparkleColor: {
                    value: "orange",
                    label: "Sparkle Color",
                },
                sparkleCount: {
                    value: 350,
                    min: 0,
                    max: 1000,
                    step: 10,
                    label: "Sparkle Count",
                },
                sparkleSize: {
                    value: 3,
                    min: 0,
                    max: 10,
                    step: 0.1,
                    label: "Sparkle Size",
                },
                sparkleSpeed: {
                    value: 0.65,
                    min: 0,
                    max: 5,
                    step: 0.05,
                    label: "Sparkle Speed",
                },
            },
            { collapsed: true },
        );

    useFrame(() => {
        if (moonRef.current && dirLight.current) {
            dirLight.current.position.copy(moonRef.current.position);
        }
    });

    return (
        <>
            <ambientLight intensity={0.9} />

            <directionalLight
                ref={dirLight}
                color={moonColor}
                position={[-10, 15, -5]}
                intensity={moonIntensity}
                scale={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            <Moon
                ref={moonRef}
                position={[70, 70, -120]}
                scale={[5, 5, 5]}
                color={moonColor}
            />

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
                count={sparkleCount}
                scale={[50, 50, 50]}
                size={sparkleSize}
                speed={sparkleSpeed}
                color={sparkleColor}
            />

            <EffectComposer autoClear={false}>
                <Bloom mipmapBlur luminanceThreshold={1} intensity={1.4} />

                <GodRays
                    sun={moonRef}
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
