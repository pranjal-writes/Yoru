import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const COUNT_PER_ZONE = 5;
const MIN_DISTANCE = 2.5; // Minimum distance between grave centers
const MAX_ATTEMPTS = 100;

const ZONES = [
    { minX: -17, maxX: -7, minZ: -7, maxZ: 4 },
    { minX: 5, maxX: 10, minZ: -7, maxZ: 4 },
    { minX: -10, maxX: 8, minZ: -12, maxZ: -4.4 },
];

export function Grave() {
    const { scene } = useGLTF("/grave.glb");
    const meshRef = useRef();

    const graveMesh = scene.children[0];

    const placements = useMemo(() => {
        const result = [];

        ZONES.forEach((zone) => {
            let placedInZone = 0;
            let attempts = 0;

            while (placedInZone < COUNT_PER_ZONE && attempts < MAX_ATTEMPTS) {
                attempts++;

                const x = THREE.MathUtils.randFloat(zone.minX, zone.maxX);
                const z = THREE.MathUtils.randFloat(zone.minZ, zone.maxZ);

                // Check distance against every previously placed grave.
                const isFarEnough = result.every((grave) => {
                    const dx = grave.position[0] - x;
                    const dz = grave.position[2] - z;

                    return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE;
                });

                if (isFarEnough) {
                    result.push({
                        position: [x, 0, z],
                        rotation: Math.PI + Math.random() * Math.PI,
                    });

                    placedInZone++;
                }
            }
        });

        return result;
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;

        const dummy = new THREE.Object3D();

        placements.forEach((grave, index) => {
            dummy.position.set(...grave.position);
            dummy.rotation.set(0, grave.rotation, 0);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!graveMesh?.isMesh) {
        console.warn(
            "Grave.glb: scene.children[0] is not a single mesh. Use the multi-mesh version instead.",
        );
        return null;
    }

    return (
        <instancedMesh
            ref={meshRef}
            args={[graveMesh.geometry, graveMesh.material, placements.length]}
            castShadow
            receiveShadow
            frustumCulled={false}
        />
    );
}

useGLTF.preload("/grave.glb");
