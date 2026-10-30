
import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";

const FACE_OFFSET = -15 * (Math.PI / 180);
const MIN_DISTANCE = 2.5;
const MAX_ATTEMPTS = 100;

export function PumpkinScatter({ count = 20 }) {
    const { nodes, materials } = useGLTF("/pumpkin.glb");

    const bodyRef = useRef();
    const stemRef = useRef();
    const faceRef = useRef();

    const touchTimer = useRef(0);
    const touchHoveredId = useRef(null);

    const audioRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);

    // Leva controls
    const { faceColor, faceGlow } = useControls("Pumpkin Settings", {
        faceColor: {
            value: "#FFA500",
            label: "Face Color",
        },
        faceGlow: {
            value: 4,
            min: 0,
            max: 20,
            step: 0.1,
            label: "Face Glow",
        },
    }, { collapsed: true });

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

    const pumpkins = useMemo(() => {
        const positions = [];

        for (let i = 0; i < count; i++) {
            let position = null;
            let attempts = 0;

            while (attempts < MAX_ATTEMPTS) {
                attempts++;

                const x = THREE.MathUtils.randFloat(-13, 12);
                const z = THREE.MathUtils.randFloat(4.5, 17);

                const tooClose = positions.some((pumpkin) => {
                    const dx = pumpkin.position.x - x;
                    const dz = pumpkin.position.z - z;

                    return Math.sqrt(dx * dx + dz * dz) < MIN_DISTANCE;
                });

                if (!tooClose) {
                    position = new THREE.Vector3(x, 0.025, z);
                    break;
                }
            }

            if (!position) continue;

            const scale = THREE.MathUtils.randFloat(0.4, 0.7);
            const rotation = new THREE.Euler(
                0,
                Math.random() * Math.PI * 2,
                0
            );
            const quaternion = new THREE.Quaternion().setFromEuler(rotation);

            positions.push({
                position,
                rotation,
                scale: new THREE.Vector3(scale, scale, scale),
                currentQuaternion: quaternion.clone(),
                originalQuaternion: quaternion.clone(),
            });
        }

        return positions;
    }, [count]);

    const bodyMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#F49240",
                roughness: 0.4,
                metalness: 0.4,
            }),
        [],
    );

    const faceMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                emissive: "#FFA500",
                emissiveIntensity: 4,
            }),
        [],
    );

    // Update face material from Leva
    useEffect(() => {
        faceMaterial.color.set(faceColor);
        faceMaterial.emissive.set(faceColor);
        faceMaterial.emissiveIntensity = faceGlow;
    }, [faceColor, faceGlow, faceMaterial]);

    const faceLocalMatrix = useMemo(() => {
        return new THREE.Matrix4().compose(
            new THREE.Vector3(0, 0.7, 0),
            new THREE.Quaternion(),
            new THREE.Vector3(0.7, 0.7, 0.7),
        );
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const offsetRotation = useMemo(
        () =>
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                FACE_OFFSET,
            ),
        [],
    );

    const lookMatrix = useMemo(() => new THREE.Matrix4(), []);
    const direction = useMemo(() => new THREE.Vector3(), []);
    const cameraPosition = useMemo(() => new THREE.Vector3(), []);
    const targetPosition = useMemo(() => new THREE.Vector3(), []);
    const faceMatrix = useMemo(() => new THREE.Matrix4(), []);
    const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

    useFrame(({ camera }, delta) => {
        if (touchHoveredId.current !== null) {
            touchTimer.current -= delta;

            if (touchTimer.current <= 0) {
                touchHoveredId.current = null;
                setHoveredId(null);
            }
        }

        if (!bodyRef.current || !stemRef.current || !faceRef.current) {
            return;
        }

        camera.getWorldPosition(cameraPosition);

        pumpkins.forEach((pumpkin, index) => {
            const targetQuaternion = pumpkin.originalQuaternion.clone();

            if (hoveredId === index) {
                direction
                    .copy(cameraPosition)
                    .sub(pumpkin.position)
                    .normalize();

                targetPosition.copy(pumpkin.position).add(direction);

                lookMatrix.lookAt(pumpkin.position, targetPosition, up);

                targetQuaternion.setFromRotationMatrix(lookMatrix);
                targetQuaternion.multiply(offsetRotation);
            }

            pumpkin.currentQuaternion.slerp(
                targetQuaternion,
                1 - Math.exp(-4 * delta),
            );

            dummy.position.copy(pumpkin.position);
            dummy.quaternion.copy(pumpkin.currentQuaternion);
            dummy.scale.copy(pumpkin.scale);
            dummy.updateMatrix();

            bodyRef.current.setMatrixAt(index, dummy.matrix);
            stemRef.current.setMatrixAt(index, dummy.matrix);

            faceMatrix.multiplyMatrices(dummy.matrix, faceLocalMatrix);

            faceRef.current.setMatrixAt(index, faceMatrix);
        });

        bodyRef.current.instanceMatrix.needsUpdate = true;
        stemRef.current.instanceMatrix.needsUpdate = true;
        faceRef.current.instanceMatrix.needsUpdate = true;
    });

    const handlePointerOver = (event) => {
        event.stopPropagation();

        if (event.instanceId !== undefined) {
            setHoveredId(event.instanceId);
            document.body.style.cursor = "pointer";
        }
    };

    const handlePointerOut = (event) => {
        event.stopPropagation();
        if (event.pointerType === "touch") return;

        setHoveredId(null);
        document.body.style.cursor = "auto";
    };

    const handlePointerDown = (event) => {
        if (event.pointerType !== "touch") return;

        event.stopPropagation();

        if (event.instanceId === undefined) return;

        touchHoveredId.current = event.instanceId;
        touchTimer.current = 3.3;

        setHoveredId(event.instanceId);
    };

    const handleClick = (event) => {
        event.stopPropagation();

        let audio = audioRef.current;

        // Create audio only on the first pumpkin click.
        if (!audio) {
            audio = new Audio("/audio/iSeeYou.mp3");
            audio.volume = 0.2;
            audio.preload = "auto";
            audioRef.current = audio;
        }

        audio.currentTime = 0;

        audio.play().catch((error) => {
            console.error("Pumpkin sound playback failed:", error);
        });
    };

    const actualCount = pumpkins.length;

    return (
        <group>
            <instancedMesh
                ref={bodyRef}
                args={[nodes.Sphere001.geometry, bodyMaterial, actualCount]}
                castShadow
                receiveShadow
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
            />

            <instancedMesh
                ref={stemRef}
                args={[
                    nodes.Sphere001_1.geometry,
                    materials["leave green 2"],
                    actualCount,
                ]}
                castShadow
                receiveShadow
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
            />

            <instancedMesh
                ref={faceRef}
                args={[nodes.Icosphere003.geometry, faceMaterial, actualCount]}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
            />
        </group>
    );
}

useGLTF.preload("/pumpkin.glb");
