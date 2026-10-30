"use client";

import React from "react";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";

export default function Fog() {
    const { size } = useThree();

    const isMobile = size.width < 768;

    const { fogColor, fogDensity } = useControls(
        "Fog Settings",
        {
            fogColor: {
                value: "#5C6B6B",
                label: "Fog Color",
            },
            fogDensity: {
                value: 0.03,
                min: 0,
                max: 0.1,
                step: 0.001,
                label: "Fog Density",
            },
        },
        { collapsed: true },
    );

    return (
        <fogExp2
            attach="fog"
            args={[
                fogColor,
                isMobile ? Math.min(fogDensity, 0.02) : fogDensity,
            ]}
        />
    );
}
