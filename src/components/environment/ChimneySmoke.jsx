import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 8;
const LIFETIME = 3;

const START_POSITION = [-1.8, 5.65, -2.45];

export default function ChimneySmoke() {
    const particles = useRef([]);
    const elapsed = useRef(0);

    // Create one soft, cloudy texture and reuse it.
    const smokeTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);

        gradient.addColorStop(0, "rgba(220, 230, 240, 0.65)");
        gradient.addColorStop(0.35, "rgba(190, 205, 220, 0.35)");
        gradient.addColorStop(0.7, "rgba(160, 180, 200, 0.12)");
        gradient.addColorStop(1, "rgba(140, 160, 180, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        return texture;
    }, []);

    // Each particle gets its own material so its opacity
    // can change independently.
    const materials = useMemo(
        () =>
            Array.from({ length: PARTICLE_COUNT }, () => {
                return new THREE.SpriteMaterial({
                    map: smokeTexture,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    color: "#A9B8C8",
                });
            }),
        [smokeTexture],
    );

    useFrame((_, delta) => {
        elapsed.current += delta;

        particles.current.forEach((particle, index) => {
            if (!particle) return;

            // Offset each particle in time so the plume
            // doesn't move as one synchronized group.
            const phase = index / PARTICLE_COUNT;
            const progress = (elapsed.current / LIFETIME + phase) % 1;

            // Rise from the chimney.
            particle.position.set(
                START_POSITION[0] +
                    Math.sin(progress * Math.PI * 2 + index) * 0.12,

                START_POSITION[1] + progress * 4.0,

                START_POSITION[2] +
                    Math.cos(progress * Math.PI * 2 + index) * 0.08,
            );

            // Expand as the smoke rises.
            const scale = 0.16 + progress * 5;
            particle.scale.setScalar(scale);

            // Fade in at the beginning and fade out at the end.
            const fadeIn = Math.min(progress / 0.15, 1);
            const fadeOut = Math.min((1 - progress) / 0.3, 1);

            materials[index].opacity = 0.55 * fadeIn * fadeOut;
        });
    });

    return (
        <group>
            {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
                <sprite
                    key={index}
                    ref={(sprite) => {
                        particles.current[index] = sprite;
                    }}
                    position={START_POSITION}
                    scale={0.8}
                    material={materials[index]}
                    renderOrder={2}
                />
            ))}
        </group>
    );
}
