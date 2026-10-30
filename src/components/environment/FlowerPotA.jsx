import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const POSITIONS = [
    [1.0, -0.13, 8.9],
    [6.2, -0.13, 9],
];

export default function FlowerPotA() {
    const { scene } = useGLTF("/pot1.glb");
    const meshes = useMemo(() => {
        const result = [];

        scene.updateMatrixWorld(true);

        scene.traverse((child) => {
            if (child.isMesh) {
                result.push({
                    geometry: child.geometry,
                    material: child.material,
                    matrix: child.matrixWorld.clone(),
                    castShadow: child.castShadow,
                    receiveShadow: child.receiveShadow,
                });
            }
        });

        return result;
    }, [scene]);

    return (
        <group>
            {meshes.map((mesh, meshIndex) => (
                <InstancedPotMesh key={meshIndex} mesh={mesh} />
            ))}
        </group>
    );
}

function InstancedPotMesh({ mesh }) {
    const ref = useRef();

    useLayoutEffect(() => {
        if (!ref.current) return;

        const dummy = new THREE.Object3D();
        const instanceScale = new THREE.Vector3(1.5, 1.5, 1.5);

        POSITIONS.forEach((position, index) => {
            dummy.position.set(...position);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.copy(instanceScale);
            dummy.updateMatrix();

            // Preserve the source mesh's transform within the GLB.
            dummy.matrix.multiply(mesh.matrix);
            ref.current.setMatrixAt(index, dummy.matrix);
        });

        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
    }, [mesh]);

    return (
        <instancedMesh
            ref={ref}
            args={[mesh.geometry, mesh.material, POSITIONS.length]}
            castShadow={mesh.castShadow}
            receiveShadow={mesh.receiveShadow}
        />
    );
}

useGLTF.preload("/pot1.glb");
