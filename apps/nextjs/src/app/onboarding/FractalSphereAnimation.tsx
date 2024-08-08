import React, { useEffect, useState } from "react";

const FractalSphereAnimation: React.FC = () => {
  const [frame, setFrame] = useState<number>(0);
  const size = 120; // Increased to 250 characters wide and tall
  const sphereRadius = 53; // Increased proportionally from 33

  const generateFractal = (depth: number): string => {
    if (depth === 0) return "*";

    let fractal = "";
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        fractal += " ".repeat(3 ** (depth - 1));
      } else {
        fractal += generateFractal(depth - 1);
      }
    }
    return fractal;
  };

  const rotatePoint = (
    x: number,
    y: number,
    z: number,
    angleX: number,
    angleY: number,
  ): { x: number; y: number; z: number } => {
    const newX: number = x * Math.cos(angleY) - z * Math.sin(angleY);
    let newZ: number = x * Math.sin(angleY) + z * Math.cos(angleY);

    const newY: number = y * Math.cos(angleX) - newZ * Math.sin(angleX);
    newZ = y * Math.sin(angleX) + newZ * Math.cos(angleX);

    return { x: newX, y: newY, z: newZ };
  };

  const project = (
    x: number,
    y: number,
    z: number,
  ): { x: number; y: number } => {
    const perspective = 415; // Increased proportionally from 133
    const scale: number = perspective / (perspective + z);
    return {
      x: Math.floor(x * scale + size / 2),
      y: Math.floor(y * scale + size / 2),
    };
  };

  const createFrame = (): string => {
    const angleX: number = frame * 0.02;
    const angleY: number = frame * 0.03;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const display: string[][] = Array(size)
      .fill(null)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map(() => Array(size).fill(" "));

    const fractal: string = generateFractal(4); // Increased depth for more detail
    const fractalSize = 81; // 3^4 for the new fractal depth

    for (let phi = 0; phi < Math.PI; phi += Math.PI / 60) {
      // Increased detail
      for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 60) {
        const x: number = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y: number = sphereRadius * Math.sin(phi) * Math.sin(theta);
        const z: number = sphereRadius * Math.cos(phi);

        const waveX: number = Math.sin(phi * 5 + frame * 0.1) * 12; // Increased wave amplitude
        const waveY: number = Math.cos(theta * 5 + frame * 0.1) * 12;

        const rotated = rotatePoint(x + waveX, y + waveY, z, angleX, angleY);
        const projected = project(rotated.x, rotated.y, rotated.z);

        if (
          projected.x >= 0 &&
          projected.x < size &&
          projected.y >= 0 &&
          projected.y < size
        ) {
          const fractalX: number = Math.floor((phi / Math.PI) * fractalSize);
          const fractalY: number = Math.floor(
            (theta / (Math.PI * 2)) * fractalSize,
          );
          if (fractal[fractalY * fractalSize + fractalX] === "*") {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            display[projected.y]![projected.x] = String.fromCharCode(
              33 + Math.floor(Math.random() * 94),
            );
          }
        }
      }
    }

    return display.map((row) => row.join("")).join("\n");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <pre
      style={{
        fontFamily: "monospace",
        fontSize: "4px", // Increased from 3.5px
        lineHeight: "3px", // Increased from 2px
        whiteSpace: "pre",
        background: "white",
        color: "black",
        width: "400px", // Increased from 160px
        height: "400px", // Increased from 160px
        overflow: "hidden",
      }}
    >
      {createFrame()}
    </pre>
  );
};

export default FractalSphereAnimation;
