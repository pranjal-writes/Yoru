import { DoubleSide } from "three";

export default function Floor() {
    return (
        <>
            <mesh
                position={[0, -0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[110, 110, 1, 1]} DoubleSide />

                <meshStandardMaterial
                    color="#7F8076"
                    roughness={0.6}
                    side={DoubleSide}
                />
            </mesh>
        </>
    );
}
