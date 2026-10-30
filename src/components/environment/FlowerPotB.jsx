import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function FlowerPotB() {
    const { scene } = useGLTF("/pot2.glb");
    const meshRef = useRef();

    const potMesh = useMemo(() => {
        // Find the first mesh in the GLB.
        let foundMesh = null;
        scene.traverse((child) => {
            if (!foundMesh && child.isMesh) {
                foundMesh = child;
            }
        });
        return foundMesh;
    }, [scene]);

    const positions = useMemo(
        () => [
            [-6.38, -0.01, 7.12 - 1.28],
            [-6.38, -0.01, 3.54 - 1.28],
            [-6.38, -0.01, 0 - 1.28],
            [-6.38, -0.01, -3.54 - 1.28],
            [-6.38, -0.01, -7.12 - 1.28],
            [-6.38, -0.01, -10.56 - 1.28],

            [13, -0.01, -10.54 + 2.25],
            [13, -0.01, -11.85],

            [13, -0.01, 3.54 + 2.25],
            [13, -0.01, 0 + 2.25],
            [13, -0.01, -3.54 + 2.25],
            [13, -0.01, -7.12 + 2.25],
        ],
        [],
    );

    useLayoutEffect(() => {
        if (!meshRef.current || !potMesh) return;

        const dummy = new THREE.Object3D();

        // Preserve the original GLB mesh's local transform.
        const sourceMatrix = new THREE.Matrix4();
        potMesh.updateWorldMatrix(true, false);
        sourceMatrix.copy(potMesh.matrixWorld);

        // Convert world-space source transform into scene-local space.
        const parentInverse = new THREE.Matrix4();
        parentInverse.copy(scene.matrixWorld).invert();
        sourceMatrix.premultiply(parentInverse);

        positions.forEach((position, index) => {
            dummy.position.set(...position);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();

            // Apply the source mesh's local transform to each pot.
            dummy.matrix.multiply(sourceMatrix);
            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.computeBoundingSphere();
    }, [positions, potMesh, scene]);

    if (!potMesh) return null;

    return (
        <instancedMesh
            ref={meshRef}
            args={[potMesh.geometry, potMesh.material, positions.length]}
            castShadow
            receiveShadow
        />
    );
}

useGLTF.preload("/pot2.glb");
