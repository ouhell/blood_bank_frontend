import React from "react";
import { Particles as ReactParticles } from "react-tsparticles";
import { loadFull } from "tsparticles";

const Particles = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = React.useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = React.useCallback(async () => {}, []);
  return (
    <ReactParticles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute h-full w-full"
      options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#e68e2e",
          },
          links: {
            color: "#f5d393",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default Particles;
