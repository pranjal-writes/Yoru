import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

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
    console.log(ghostRef.current)
    const audioRef = useRef(null);

    const touchTimer = useRef(0);
    const touchHovered = useRef(false);

    // Leva controls
    const {
        ghostColor,
        ghostHoverColor,
        normalEmissive,
        hoverEmissive,

        eyeColor,
        eyeHoverColor,
        eyeGlow,
        eyeHoverGlow,
    } = useControls(
        "Ghost Settings",
        {
            ghostColor: {
                value: "#FFFFFF",
                label: "Ghost Color",
            },
            ghostHoverColor: {
                value: "#FF0000",
                label: "Ghost Hover Color",
            },
            normalEmissive: {
                value: 0.3,
                min: 0,
                max: 5,
                step: 0.1,
                label: "Normal Glow",
            },
            hoverEmissive: {
                value: 3,
                min: 0,
                max: 15,
                step: 0.1,
                label: "Hover Glow",
            },

            eyeColor: {
                value: "#00FFFF",
                label: "Eye Color",
            },
            eyeHoverColor: {
                value: "#FFFFFF",
                label: "Eye Hover Color",
            },
            eyeGlow: {
                value: 10,
                min: 0,
                max: 20,
                step: 0.1,
                label: "Eye Glow",
            },
            eyeHoverGlow: {
                value: 8,
                min: 0,
                max: 20,
                step: 0.1,
                label: "Eye Hover Glow",
            },
        },
        { collapsed: true },
    );

    // Ghost body material
    const bodyMaterial = useMemo(() => {
        const material = materials["Material.002"].clone();

        material.emissive.set("#FF0000");
        material.emissiveIntensity = 0.3;

        return material;
    }, [materials]);

    // Ghost eye material
    const eyeMaterial = useMemo(() => {
        const material = nodes.Icosphere086.material.clone();

        material.emissive.set("#00FFFF");
        material.emissiveIntensity = 0.3;

        return material;
    }, [nodes]);

    // Animation and material updates
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

        // Ghost scaling
        const targetScale = activeHover && scaleOnHover ? 1.2 : 1;

        const currentScale = THREE.MathUtils.damp(
            ghostRef.current.scale.x,
            targetScale,
            4,
            delta,
        );
        
         ghostRef.current.scale.setScalar(currentScale);

        // Ghost body color and glow
        const targetColor = activeHover ? ghostHoverColor : ghostColor;
        const targetGlow = activeHover ? hoverEmissive : normalEmissive;

        bodyMaterial.color.set(targetColor);
        bodyMaterial.emissive.set(targetColor);

        bodyMaterial.emissiveIntensity = THREE.MathUtils.damp(
            bodyMaterial.emissiveIntensity,
            targetGlow,
            4,
            delta,
        );

        // Ghost eye color and glow
        const targetEyeColor = activeHover ? eyeHoverColor : eyeColor;
        const targetEyeGlow = activeHover ? eyeHoverGlow : eyeGlow;

        eyeMaterial.color.set(targetEyeColor);
        eyeMaterial.emissive.set(targetEyeColor);

        eyeMaterial.emissiveIntensity = THREE.MathUtils.damp(
            eyeMaterial.emissiveIntensity,
            targetEyeGlow,
            4,
            delta,
        );
    });

    // Audio cleanup
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

    // Ghost click and laugh sound
    const handleGhostClick = (event) => {
        event.stopPropagation();

        onClick?.(event);

        let audio = audioRef.current;

        if (!audio) {
            audio = new Audio("/audio/ghostLaugh.mp3");
            audio.volume = 0.4;
            audio.preload = "auto";

            audioRef.current = audio;
        }

        audio.currentTime = 0;

        audio.play().catch((error) => {
            console.error("Ghost sound playback failed:", error);
        });
    };

    // Mobile touch interaction
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
            {/* Ghost Eyes */}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Icosphere086.geometry}
                material={eyeMaterial}
            />

            {/* Ghost Body */}
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
