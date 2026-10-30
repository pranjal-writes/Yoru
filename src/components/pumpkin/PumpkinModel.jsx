import React, { useContext, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function PumpkinModel(props) {
    const { nodes, materials } = useGLTF("/pumpkin.glb");

    const pumpkinRef = useRef();
    const isHovered = useRef(false);
    const { camera } = useThree();

    // Preserve this pumpkin's original randomized rotation.
    const originalRotation = useMemo(
        () =>
            new THREE.Euler(
                props.rotation?.[0] ?? 0,
                props.rotation?.[1] ?? 0,
                props.rotation?.[2] ?? 0,
            ),
        [props.rotation],
    );

    // Reuse all temporary Three.js objects.
    const targetQuaternion = useMemo(() => new THREE.Quaternion(), []);

    const worldTargetQuaternion = useMemo(() => new THREE.Quaternion(), []);

    const parentWorldQuaternion = useMemo(() => new THREE.Quaternion(), []);

    const pumpkinWorldPosition = useMemo(() => new THREE.Vector3(), []);

    const cameraWorldPosition = useMemo(() => new THREE.Vector3(), []);

    const direction = useMemo(() => new THREE.Vector3(), []);

    const lookMatrix = useMemo(() => new THREE.Matrix4(), []);

    const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

    const originalQuaternion = useMemo(
        () => new THREE.Quaternion().setFromEuler(originalRotation),
        [originalRotation],
    );

    const faceDownOffset = useMemo(
        () =>
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                THREE.MathUtils.degToRad(-15),
            ),
        [],
    );

    useFrame((_, delta) => {
        const pumpkin = pumpkinRef.current;
        if (!pumpkin) return;

        const smoothing = 1 - Math.exp(-5 * delta);

        if (isHovered.current) {
            // Get world positions using reusable vectors.
            pumpkin.getWorldPosition(pumpkinWorldPosition);
            camera.getWorldPosition(cameraWorldPosition);

            // Preserve the original look-at calculation.
            direction
                .copy(cameraWorldPosition)
                .sub(pumpkinWorldPosition)
                .normalize();

            lookMatrix.lookAt(
                pumpkinWorldPosition,
                direction
                    .copy(pumpkinWorldPosition)
                    .add(
                        cameraWorldPosition
                            .clone()
                            .sub(pumpkinWorldPosition)
                            .normalize(),
                    ),
                up,
            );

            worldTargetQuaternion
                .setFromRotationMatrix(lookMatrix)
                .multiply(faceDownOffset);

            // Convert world rotation into parent-local rotation.
            targetQuaternion.copy(worldTargetQuaternion);

            if (pumpkin.parent) {
                pumpkin.parent.getWorldQuaternion(parentWorldQuaternion);
                targetQuaternion.premultiply(parentWorldQuaternion.invert());
            }

            // Smoothly rotate toward the camera.
            pumpkin.quaternion.slerp(targetQuaternion, smoothing);
        } else {
            // Smoothly restore the original randomized rotation.
            pumpkin.quaternion.slerp(originalQuaternion, smoothing);
        }
    });

    return (
        <group
            ref={pumpkinRef}
            {...props}
            dispose={null}
            onPointerOver={(event) => {
                event.stopPropagation();
                isHovered.current = true;
            }}
            onPointerOut={(event) => {
                event.stopPropagation();
                isHovered.current = false;
            }}
        >
            <group scale={1}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere001.geometry}
                    material={materials["Material.005"]}
                >
                    <meshStandardMaterial
                        attach="material"
                        color="#F49240"
                        roughness={0.4}
                        metalness={0.4}
                    />
                </mesh>

                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere001_1.geometry}
                    material={materials["leave green 2"]}
                />
            </group>

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Icosphere003.geometry}
                material={nodes.Icosphere003.material}
                position={[0, 0.7, 0]}
                scale={0.7}
            >
                <meshStandardMaterial
                    attach="material"
                    emissive="orange"
                    emissiveIntensity={4}
                />
            </mesh>
        </group>
    );
}

useGLTF.preload("/pumpkin.glb");
