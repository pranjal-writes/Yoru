import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import ChimneySmoke from "./environment/ChimneySmoke";
import { useFrame } from "@react-three/fiber";
import GhostModel from "./ghostSystem/GhostModel";

export function Base(props) {
    const { nodes, materials } = useGLTF("/coloredSceneFinal.glb");

    const [isHovered, setIsHovered] = useState(false);

    const swingRef = useRef();
    const swingAngle = useRef(0);
    const swingVelocity = useRef(0);
    const elapsedTime = useRef(0);

    const applySwingForce = () => {
        // Add momentum
        swingVelocity.current += 2.0;
    };

    useFrame((_, delta) => {
        if (!swingRef.current) return;

        const dt = Math.min(delta, 0.033);
        elapsedTime.current += dt;

        // Gentle, continuous idle swing.
        const idleAngle = Math.sin(elapsedTime.current * 1.8) * 0.25;

        // Pull the swing back toward its idle motion.
        const springStrength = 5;
        const damping = 2.2;

        const acceleration =
            springStrength * (idleAngle - swingAngle.current) -
            damping * swingVelocity.current;

        swingVelocity.current += acceleration * dt;
        swingAngle.current += swingVelocity.current * dt;

        //rotation
        swingRef.current.rotation.x = swingAngle.current;
    });

    return (
        <group {...props} dispose={null}>
            {/* swing */}
            <group
                ref={swingRef}
                position={[-7.257, 3.547, -4.11]}
                name="swing"
                onClick={(event) => {
                    event.stopPropagation();
                    applySwingForce();
                }}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube006.geometry}
                    material={materials.rope}
                />

                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube006_1.geometry}
                    material={materials.wood}
                />

                <GhostModel
                    position={[8.1, -2, -13.9]}
                    rotation={[0, Math.PI, 0]}
                    scale={0.7}
                    isHovered={isHovered}
                    onPointerOver={() => setIsHovered(true)}
                    onPointerOut={() => setIsHovered(false)}
                    onClick={applySwingForce}
                    scaleOnHover={false}
                />
            </group>
            {/* swing end */}

            <mesh
                name="mainTree"
                castShadow
                receiveShadow
                geometry={nodes.Cube036.geometry}
                material={materials["wood 2"]}
                position={[-5.466, -0.187, -3.553]}
                rotation={[Math.PI, -0.094, Math.PI]}
            />
            <group
                name="pavement"
                position={[-3.644, -0.08, 13.11]}
                rotation={[0.037, 0, 0]}
                scale={[1.314, 0.182, 0.466]}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube041.geometry}
                    material={materials["stone 1"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube041_1.geometry}
                    material={materials["stone 2"]}
                />
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube083.geometry}
                material={materials["iron.002"]}
                position={[-1.603, 0.359, 13.503]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube086.geometry}
                material={materials["iron.002"]}
                position={[-1.878, 1.637, 6.414]}
            />

            <group
                position={[0.008, 0.006, 0.501]}
                rotation={[Math.PI, 0, Math.PI]}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005.geometry}
                    material={materials.walls}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_1.geometry}
                    material={materials["wood 2.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_2.geometry}
                    material={materials["wood 2.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_3.geometry}
                    material={materials["roof tiles.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_4.geometry}
                    material={materials["roof tiles 2.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_5.geometry}
                    material={nodes.Plane005_5.material}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_6.geometry}
                    material={materials.wood}
                />

                {/* chimney mesh */}
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane005_7.geometry}
                    material={materials["roof tiles 2.003"]}
                />
                <ChimneySmoke />
                {/* chimney mesh ends */}
            </group>
            <group
                position={[-0.074, 0.908, 4.023]}
                rotation={[0, -1.571, 0]}
                scale={[-0.011, -0.106, -0.108]}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube042.geometry}
                    material={materials["wood 2.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube042_1.geometry}
                    material={materials["iron.002"]}
                />
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube063.geometry}
                material={materials["wood 2"]}
                position={[-12.326, 0.439, 13.876]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube061.geometry}
                material={materials["wood 2"]}
                position={[7.533, 0.439, 13.864]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube064.geometry}
                material={materials["wood 2"]}
                position={[-11.753, 0.439, -6.908]}
            />
        </group>
    );
}

useGLTF.preload("/coloredSceneFinal.glb");
