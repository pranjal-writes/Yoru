"use client";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";

import { useControls } from "leva";
import { useRef } from "react";

import * as THREE from "three";

import { Base } from "./Base";
import Floor from "./environment/Floor";
import { Emission } from "./Emission";
import { PumpkinScatter } from "./pumpkin/PumpkinScatter";
import FlowerPotA from "./environment/FlowerPotA";
import FlowerPotB from "./environment/FlowerPotB";
import { Grave } from "./grave/Grave";
import WanderingGhost from "./ghostSystem/WanderingGhost";
import Background from "./environment/Background";
import Fog from "./environment/fog";
import PineTree from "./environment/PineTree";
import BackgroundAudio from "./environment/BackgroundAudio";

export default function Experience() {
    const controlsRef = useRef();

    function CameraController({ controlsRef }) {
        const { camera } = useThree();

        useControls(
            "Camera",
            {
                position: {
                    value: [-15.5, 6.0, 18.0],
                    step: 0.1,
                    onChange: (v) => {
                        // 1. Update the camera position
                        camera.position.set(v[0], v[1], v[2]);

                        // 2. Synchronize OrbitControls internal state
                        if (controlsRef.current) {
                            controlsRef.current.update();
                        }
                    },
                },
                lookAtTarget: {
                    value: [-3.5, -0.1, 0],
                    step: 0.1,
                    onChange: (v) => {
                        // 1. Update the focal point OrbitControls orbits around
                        if (controlsRef.current) {
                            controlsRef.current.target.set(v[0], v[1], v[2]);
                            controlsRef.current.update();
                        } else {
                            camera.lookAt(v[0], v[1], v[2]);
                        }
                    },
                },
            },
            { collapsed: true },
        );

        return null;
    }

    return (
        <>
            <BackgroundAudio />
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    outputColorSpace: THREE.LinearSRGBColorSpace,
                    toneMapping: THREE.ACESFilmicToneMapping,
                }}
                dpr={[1, 2]}
                onPointerMissed={() => {
                    // Clear selected ghost/pumpkin state here.
                }}
            >
                <Stats showPanel={0} />

                <Background />
                <OrbitControls ref={controlsRef} />
                <color attach="background" args={["black"]} />
                <Fog />
                <Base />
                <Emission />
                <PumpkinScatter count={13} />
                <FlowerPotA />
                <FlowerPotB />
                <Grave />

                <WanderingGhost
                    position={[-3, 1.5, 1]}
                    speed={0.4}
                    bounds={{ minX: -5, maxX: 5, minZ: -4, maxZ: 4 }}
                />

                <WanderingGhost
                    position={[2, 1.8, -2]}
                    speed={0.3}
                    bounds={{ minX: -5, maxX: 5, minZ: -4, maxZ: 4 }}
                />

                <WanderingGhost
                    position={[0, 1.2, 3]}
                    speed={0.5}
                    bounds={{ minX: -5, maxX: 5, minZ: -4, maxZ: 4 }}
                />

                <PineTree />
                <Floor />
                <CameraController controlsRef={controlsRef} />
            </Canvas>
        </>
    );
}
