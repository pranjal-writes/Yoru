import React from "react";
import { useThree } from "@react-three/fiber";

export default function Fog() {
    const { size } = useThree();

    const isMobile = size.width < 768;
    const fogDensity = isMobile ? 0.02 : 0.03;

    return <fogExp2 attach="fog" args={["#5C6B6B", fogDensity]} />;
}
