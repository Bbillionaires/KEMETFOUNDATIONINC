"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

/**
 * Lightweight canvas2d fire/ember particle system, additively blended.
 * `intensityRef` (0..1, mutated externally each frame) controls spawn rate
 * so the caller can ramp ignition up and extinguish it down without
 * remounting the canvas.
 */
export function FireParticles({
  width,
  height,
  intensityRef,
  maxParticles,
}: {
  width: number;
  height: number;
  intensityRef: React.MutableRefObject<number>;
  maxParticles: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context2d = canvas.getContext("2d");
    if (!context2d) return;
    const ctx: CanvasRenderingContext2D = context2d;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    function spawn(count: number) {
      for (let i = 0; i < count; i++) {
        if (particlesRef.current.length >= maxParticles) break;
        const originX = width * 0.5 + (Math.random() - 0.5) * width * 0.75;
        const originY = height * (0.55 + Math.random() * 0.35);
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: (Math.random() - 0.5) * 14,
          vy: -(30 + Math.random() * 55),
          life: 0,
          maxLife: 0.6 + Math.random() * 0.55,
          size: 3 + Math.random() * 6,
          hue: 28 + Math.random() * 30, // amber -> gold -> red-orange range
        });
      }
    }

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const intensity = intensityRef.current;
      if (intensity > 0.02) {
        spawn(Math.round(intensity * maxParticles * dt * 2.2));
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy -= 18 * dt; // accelerate upward like rising heat
        p.vx *= 0.98;

        const t = p.life / p.maxLife;
        const alpha = (1 - t) * intensity;
        const radius = p.size * (1 - t * 0.4);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `hsla(${p.hue + 20}, 100%, 85%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.9})`);
        gradient.addColorStop(1, `hsla(${p.hue - 15}, 90%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [width, height, maxParticles, intensityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width, height, position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
