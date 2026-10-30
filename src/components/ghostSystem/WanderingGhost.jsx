import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import GhostModel from "./GhostModel";

export default function WanderingGhost({
    position = [0, 1.5, 0],
    speed = 0.4,
    bounds = { minX: -5, maxX: 5, minZ: -4, maxZ: 4 },
}) {
    const movementRef = useRef();
    const bobRef = useRef();

    const [isHovered, setIsHovered] = useState(false);

    const motion = useMemo(
        () => ({
            curve: null,
            progress: 0,
            duration: 5,
            pause: 0,
            clock: Math.random() * Math.PI * 2,
            target: new THREE.Vector3(),
            tangent: new THREE.Vector3(),
        }),
        [],
    );

    function chooseDestination(start) {
        // Pick a destination inside the permitted garden bounds.
        const end = new THREE.Vector3(
            THREE.MathUtils.randFloat(bounds.minX, bounds.maxX),
            position[1],
            THREE.MathUtils.randFloat(bounds.minZ, bounds.maxZ),
        );

        // Randomize the intermediate points to make the path curved.
        const control1 = start.clone().lerp(end, 0.33);
        const control2 = start.clone().lerp(end, 0.66);

        control1.x += THREE.MathUtils.randFloat(-1.2, 1.2);
        control1.z += THREE.MathUtils.randFloat(-1.2, 1.2);
        control2.x += THREE.MathUtils.randFloat(-1.2, 1.2);
        control2.z += THREE.MathUtils.randFloat(-1.2, 1.2);

        // Keep the control points inside the bounds.
        for (const point of [control1, control2]) {
            point.x = THREE.MathUtils.clamp(point.x, bounds.minX, bounds.maxX);
            point.z = THREE.MathUtils.clamp(point.z, bounds.minZ, bounds.maxZ);
        }

        motion.curve = new THREE.CatmullRomCurve3([
            start.clone(),
            control1,
            control2,
            end,
        ]);

        motion.progress = 0;
        motion.duration = THREE.MathUtils.randFloat(4, 7);
    }

    useFrame((_, delta) => {
        const mover = movementRef.current;
        if (!mover) return;

        motion.clock += delta;

        if (motion.pause > 0) {
            motion.pause -= delta;
        } else {
            if (!motion.curve) {
                chooseDestination(mover.position);
            }

            motion.progress = Math.min(
                1,
                motion.progress + (delta * speed) / motion.duration,
            );

            motion.curve.getPointAt(motion.progress, motion.target);
            motion.curve.getTangentAt(motion.progress, motion.tangent);

            mover.position.copy(motion.target);

            // Face the horizontal direction of travel.
            if (motion.tangent.lengthSq() > 0.0001) {
                mover.rotation.y = Math.atan2(
                    motion.tangent.x,
                    motion.tangent.z,
                );
            }

            if (motion.progress >= 1) {
                motion.curve = null;
                motion.pause = THREE.MathUtils.randFloat(0.3, 1.2);
            }
        }

        // Animate bobbing on a separate child group.
        if (bobRef.current) {
            const startledTilt = isHovered ? 0.18 : 0;

            bobRef.current.position.y = Math.sin(motion.clock * 2) * 0.12;
            bobRef.current.rotation.z = Math.sin(motion.clock * 1.4) * 0.04;
        }
    });

    return (
        <group ref={movementRef} position={position}>
            <group ref={bobRef}>
                <GhostModel
                    isHovered={isHovered}
                    onPointerOver={() => setIsHovered(true)}
                    onPointerOut={() => setIsHovered(false)}
                />
            </group>
        </group>
    );
}
