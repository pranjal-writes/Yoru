
import { useEffect, useRef } from "react";
import backgroundAudio from '/audio/backgroundAudio.mp3'

export default function BackgroundAudio() {
    const audioRef = useRef(null);
    const startedRef = useRef(false);

    useEffect(() => {
        const startAudio = () => {
            if (startedRef.current) return;

            // Create the audio only after user interaction.
            const audio = new Audio(backgroundAudio);

            audio.loop = true;
            audio.volume = 0.3;
            audio.preload = "auto";

            audioRef.current = audio;

            audio.play()
                .then(() => {
                    startedRef.current = true;

                    window.removeEventListener("pointerdown", startAudio, true);
                    window.removeEventListener("touchstart", startAudio, true);

                    console.log("MIDNIGHT ambience started");
                })
                .catch((error) => {
                    console.error("Background audio failed:", error);

                    audio.pause();
                    audioRef.current = null;
                });
        };

        // Wait for the first user interaction.
        window.addEventListener("pointerdown", startAudio, {
            capture: true,
            passive: true,
        });

        window.addEventListener("touchstart", startAudio, {
            capture: true,
            passive: true,
        });

        return () => {
            window.removeEventListener("pointerdown", startAudio, true);
            window.removeEventListener("touchstart", startAudio, true);

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeAttribute("src");
                audioRef.current.load();
                audioRef.current = null;
            }
        };
    }, []);

    return null;
}
