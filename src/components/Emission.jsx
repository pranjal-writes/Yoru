import React, { useRef } from "react";
import { useGLTF, useHelper } from "@react-three/drei";
import { PointLightHelper, SpotLightHelper } from "three";

export function Emission(props) {
    const { nodes, materials } = useGLTF("/emission.glb");

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube218.geometry}
                material={nodes.Cube218.material}
                position={[-1.964, 1.503, 4.356]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={0.831}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={5}
                />
            </mesh>
            <pointLight
                position={[7.5, 1.2, -6.75]}
                intensity={4}
                color="#EB6123"
            />
            <pointLight
                position={[-12.3, 1.2, -6.75]}
                intensity={4}
                color="#EB6123"
            />
            <pointLight
                position={[-2, 1.5, 4.35]}
                intensity={4}
                color="#EB6123"
            />

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Torus016.geometry}
                position={[0.968, 1.097, 3.923]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={[1.62, 1.999, 0.111]}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={4}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Torus017.geometry}
                material={nodes.Torus017.material}
                position={[-2.807, 1.511, 0.687]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[2.303, 2.841, 0.089]}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={4}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Torus018.geometry}
                material={nodes.Torus018.material}
                position={[-2.912, 3.29, 0.451]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[1, 1, 0.082]}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={4}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Torus019.geometry}
                material={nodes.Torus019.material}
                position={[0, 2.814, 3.986]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={[1.999, 1.999, 0.821]}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={4}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube249.geometry}
                material={nodes.Cube249.material}
                position={[7.547, 1.646, 14.296]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={-0.064}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={5}
                />
            </mesh>
            <pointLight
                position={[7.53, 1.6, 14.296]}
                intensity={4}
                color="#EB6123"
            />

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube010.geometry}
                material={nodes.Cube010.material}
                position={[7.59, 1.646, 14.296]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={-0.064}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={5}
                />
            </mesh>
            <pointLight
                position={[-5.2, 1.8, 12.7]}
                intensity={4}
                color="#EB6123"
            />

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube012.geometry}
                material={nodes.Cube012.material}
                position={[7.61, 1.646, 14.296]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={-0.064}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={5}
                />
            </mesh>
            <pointLight
                position={[-12.38, 1.6, 14.296]}
                intensity={4}
                color="#EB6123"
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube038.geometry}
                material={nodes.Cube038.material}
                position={[7.555, 1.646, 14.296]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={-0.064}
            >
                <meshStandardMaterial
                    attach="material"
                    color="#FFB25A"
                    emissive="#FFB25A"
                    emissiveIntensity={5}
                />
            </mesh>
            <pointLight
                position={[3.65, 1.8, 12.7]}
                intensity={4}
                color="#EB6123"
            />
        </group>
    );
}

useGLTF.preload("/emission.glb");
