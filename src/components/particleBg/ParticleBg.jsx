"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from '@tsparticles/slim';
import ThemeContext from "@/context/ThemeContext";
import { options } from "./ParticleConfig";

const ParticleBg = () => {
    const [init, setInit] = useState(false);
    const { theme, setTheme } = useContext(ThemeContext);


    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            {init && <Particles
                id="tsparticles"
                options={options(theme)} />
            }
        </div>
    );
};

export default ParticleBg;