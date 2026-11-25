import { useEffect, useId, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColors?: string[];
  particleDensity?: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  isStar: boolean;
}

const DEFAULT_COLORS = ['#2563EB', '#06B6D4', '#38BDF8', '#16A34A', '#F97316'];

/**
 * Aceternity UI–inspired high-DPI Canvas Sparkles particle layer.
 * Uses hardware-friendly Canvas 2D drawing at 60 FPS with zero extra dependencies,
 * supporting multi-color brand sparkles, soft luminance halos, and prefers-reduced-motion.
 */
export function SparklesCore({
  id,
  className = '',
  background = 'transparent',
  minSize = 0.7,
  maxSize = 2.1,
  speed = 0.7,
  particleColors = DEFAULT_COLORS,
  particleDensity = 95,
}: SparklesCoreProps) {
  const generatedId = useId();
  const canvasId = id ?? `sparkles-${generatedId}`;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let particles: SparkleParticle[] = [];

    const createParticles = (w: number, h: number) => {
      const area = Math.max(w * h, 1);
      // Scale count proportionally to area, matching Aceternity density semantics
      const count = Math.min(
        240,
        Math.max(24, Math.round((area / 120000) * particleDensity)),
      );

      const next: SparkleParticle[] = [];
      for (let i = 0; i < count; i += 1) {
        const radius = minSize + Math.random() * (maxSize - minSize);
        const angle = Math.random() * Math.PI * 2;
        const velocity = (0.12 + Math.random() * 0.36) * speed;
        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * velocity * 0.55,
          vy: -Math.abs(Math.sin(angle) * velocity) - 0.08 * speed,
          radius,
          baseAlpha: 0.32 + Math.random() * 0.62,
          alpha: Math.random(),
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: (0.015 + Math.random() * 0.032) * (0.7 + speed * 0.4),
          color: particleColors[i % particleColors.length] ?? '#2563EB',
          isStar: i % 5 === 0,
        });
      }
      particles = next;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles(width, height);
    };

    const drawFourPointSparkle = (
      x: number,
      y: number,
      r: number,
      color: string,
      alpha: number,
    ) => {
      const arm = r * 2.5;
      const inner = r * 0.42;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - arm);
      ctx.quadraticCurveTo(x + inner, y - inner, x + arm, y);
      ctx.quadraticCurveTo(x + inner, y + inner, x, y + arm);
      ctx.quadraticCurveTo(x - inner, y + inner, x - arm, y);
      ctx.quadraticCurveTo(x - inner, y - inner, x, y - arm);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const renderFrame = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          p.twinklePhase += p.twinkleSpeed;

          if (p.y < -8) {
            p.y = height + 8;
            p.x = Math.random() * width;
          }
          if (p.x < -8) p.x = width + 8;
          if (p.x > width + 8) p.x = -8;
        }

        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.twinklePhase));
        p.alpha = p.baseAlpha * twinkle;

        // Soft luminance halo
        ctx.save();
        ctx.globalAlpha = p.alpha * 0.28;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Crisp core particle or 4-point sparkle glint
        if (p.isStar && p.radius > 1.15) {
          drawFourPointSparkle(p.x, p.y, p.radius, p.color, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    resize();

    const observer = new ResizeObserver(() => {
      resize();
      if (prefersReducedMotion) {
        renderFrame(false);
      }
    });
    observer.observe(canvas);

    if (prefersReducedMotion) {
      renderFrame(false);
    } else {
      const tick = () => {
        renderFrame(true);
        rafId = window.requestAnimationFrame(tick);
      };
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [maxSize, minSize, particleColors, particleDensity, prefersReducedMotion, speed]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      aria-hidden="true"
      style={{ background }}
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
