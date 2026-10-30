import React, { useMemo, useRef } from "react";
import { useGLTF, Instances, Instance } from "@react-three/drei";

export default function PineTree({
    count = 300,
    innerRadius = 40,
    outerRadius = 50,
}) {
    // 1. Load your specific nodes and materials
    const { nodes, materials } = useGLTF("/pineTree.glb");

    const instancesData = useMemo(() => {
        return Array.from({ length: count }, () => {
            // 1. Generate a random angle around the circle
            const angle = Math.random() * Math.PI * 2;

            // 2. Uniformly distribute radius between innerRadius and outerRadius
            // Using Math.sqrt ensures an even spread so instances don't bunch up near the center
            const u = Math.random();
            const radius = Math.sqrt(
                u * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2,
            );

            // 3. Convert polar coordinates (radius, angle) back to Cartesian (X, Z)
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // 4. Random rotation around the Y axis so they look organic
            const rotationY = Math.random() * Math.PI * 2;

            return {
                position: [x, 0, z],
                rotation: [0, rotationY, 0],
                scale: 0.8 + Math.random() * 0.4,
            };
        });
    }, [count, innerRadius, outerRadius]);

    return (
        <>
            <group>
                {/* 3. Instance Pool for LEAVES */}
                <Instances
                    geometry={nodes.Cone002.geometry}
                    material={materials["leave green 2"]}
                >
                    {instancesData.map((props, i) => (
                        <Instance key={i} {...props} />
                    ))}
                </Instances>

                {/* 4. Instance Pool for TRUNK */}
                <Instances
                    geometry={nodes.Cone002_1.geometry}
                    material={materials["wood 2"]}
                >
                    {instancesData.map((props, i) => (
                        <Instance key={i} {...props} />
                    ))}
                </Instances>
            </group>
        </>
    );
}

// Preload the GLB model to prevent pop-in lag
useGLTF.preload("pineTree.glb");
