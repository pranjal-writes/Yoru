
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import ghostLaugh from "/audio/ghostLaugh.mp3"

export default function GhostModel({
    isHovered = false,
    onPointerOver,
    onPointerOut,
    onClick,
    scaleOnHover = true,
    ...props
}) {
    const { nodes, materials } = useGLTF("/ghost.glb");

    const ghostRef = useRef();
    const audioRef = useRef(null);

    const touchTimer = useRef(0);
    const touchHovered = useRef(false);

    const bodyMaterial = useMemo(() => {
        const material = materials["Material.002"].clone();
        material.emissive.set("red");
        material.emissiveIntensity = 0.3;
        return material;
    }, [materials]);

    const eyeMaterial = useMemo(() => {
        const icoMaterial = nodes.Icosphere086.material.clone();
        icoMaterial.emissive.set("orange");
        icoMaterial.emissiveIntensity = 0;
        return icoMaterial;
    }, []);

    useFrame((_, delta) => {
        if (touchHovered.current) {
            touchTimer.current -= delta;

            if (touchTimer.current <= 0) {
                touchHovered.current = false;
                onPointerOut?.();
            }
        }

        const activeHover = isHovered || touchHovered.current;

        if (!ghostRef.current) return;

        const targetScale = activeHover && scaleOnHover ? 1.2 : 1;
        const targetGlow = activeHover ? 3 : 0.3;
        const targetEyeGlow = activeHover ? 8 : 0.3;

        const currentScale = THREE.MathUtils.damp(
            ghostRef.current.scale.x,
            targetScale,
            0.5,
            delta,
        );

        ghostRef.current.scale.setScalar(currentScale);

        bodyMaterial.emissive.set(isHovered ? "red" : "white");

        bodyMaterial.emissiveIntensity = THREE.MathUtils.damp(
            bodyMaterial.emissiveIntensity,
            targetGlow,
            4,
            delta,
        );

        eyeMaterial.emissiveIntensity = THREE.MathUtils.damp(
            eyeMaterial.emissiveIntensity,
            targetEyeGlow,
            4,
            delta,
        );
    });

    // No audio is created or requested during component mounting.
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeAttribute("src");
                audioRef.current.load();
                audioRef.current = null;
            }
        };
    }, []);

    const handleGhostClick = (event) => {
        event.stopPropagation();

        onClick?.(event);

        let audio = audioRef.current;

        // Create audio only on the first ghost click.
        if (!audio) {
            audio = new Audio(ghostLaugh);
            audio.volume = 0.4;
            audio.preload = "auto";
            audioRef.current = audio;
        }

        audio.currentTime = 0;

        audio.play().catch((error) => {
            console.error("Ghost sound playback failed:", error);
        });
    };

    const handlePointerDown = (event) => {
        if (event.pointerType !== "touch") return;

        event.stopPropagation();

        touchHovered.current = true;
        touchTimer.current = 2;

        onPointerOver?.(event);
    };

    return (
        <group
            ref={ghostRef}
            {...props}
            dispose={null}
            onPointerOver={(event) => {
                event.stopPropagation();
                onPointerOver?.(event);
            }}
            onPointerOut={(event) => {
                event.stopPropagation();

                if (event.pointerType !== "touch") {
                    onPointerOut?.(event);
                }
            }}
            onClick={handleGhostClick}
            onPointerDown={handlePointerDown}
        >
            {/* Eyes — unchanged */}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Icosphere086.geometry}
                material={eyeMaterial}
            >
                <meshStandardMaterial
                    attach="material"
                    emissive="cyan"
                    emissiveIntensity={5}
                />
            </mesh>

            {/* Ghost body — original material cloned */}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Sphere016.geometry}
                material={bodyMaterial}
            />
        </group>
    );
}

useGLTF.preload("/ghost.glb");
