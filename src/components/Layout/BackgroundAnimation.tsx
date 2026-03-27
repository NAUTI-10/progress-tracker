import React, { memo, useEffect, useRef } from 'react';

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  vx: number;
  rotation: number;
  vr: number;
  opacity: number;
  hue: string;
  phase: number;
};

const PETAL_COLORS = ['#ffc0cb', '#ffb7c5', '#ffd1dc', '#ffdae1'] as const;
const DESKTOP_PETAL_COUNT = 12;
const MOBILE_PETAL_COUNT = 8;

const createPetal = (width: number, height: number): Petal => {
  const size = 12 + Math.random() * 12;

  return {
    x: Math.random() * width,
    y: -Math.random() * height,
    size,
    speed: 9 + Math.random() * 7,
    drift: 5 + Math.random() * 8,
    vx: -2 + Math.random() * 4,
    rotation: Math.random() * Math.PI * 2,
    vr: -0.002 + Math.random() * 0.004,
    opacity: 0.2 + Math.random() * 0.35,
    hue: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
};

export const BackgroundAnimation: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      return;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let previousTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const petalCount = reducedMotion
        ? 0
        : width < 768
          ? MOBILE_PETAL_COUNT
          : DESKTOP_PETAL_COUNT;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      petalsRef.current = Array.from({ length: petalCount }, () => createPetal(width, height));
    };

    const drawPetal = (petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);

      const w = petal.size;
      const h = petal.size * (1.1 + Math.sin(petal.phase) * 0.15);

      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(w * 0.25, -h * 0.65, w * 0.7, -h * 0.1, 0, h * 0.5);
      ctx.bezierCurveTo(-w * 0.7, -h * 0.1, -w * 0.25, -h * 0.65, 0, -h * 0.5);
      ctx.closePath();

      ctx.fillStyle = petal.hue;
      ctx.globalAlpha = petal.opacity;
      ctx.fill();
      ctx.restore();
    };

    const step = (time: number) => {
      const delta = Math.min(1 / 30, (time - previousTime) / 1000);
      previousTime = time;

      ctx.clearRect(0, 0, width, height);

      for (const petal of petalsRef.current) {
        petal.y += petal.speed * delta;
        petal.x += Math.sin(petal.phase * 2) * petal.drift * delta + petal.vx * delta;
        petal.rotation += petal.vr;
        petal.phase += 0.015;

        if (petal.y > height + petal.size * 2 || petal.x < -80 || petal.x > width + 80) {
          Object.assign(petal, createPetal(width, height));
          petal.y = -20;
        }

        drawPetal(petal);
      }

      frameId = window.requestAnimationFrame(step);
    };

    setupCanvas();
    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(step);
    }
    window.addEventListener('resize', setupCanvas, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  return (
    <div className="sakura-bg-overlay" aria-hidden="true">
      <div className="sakura-blob sakura-blob-1" />
      <div className="sakura-blob sakura-blob-2" />
      <div className="sakura-blob sakura-blob-3" />
      <div className="sakura-light-rays" />
      <canvas ref={canvasRef} className="sakura-canvas" />
    </div>
  );
});

BackgroundAnimation.displayName = 'BackgroundAnimation';
