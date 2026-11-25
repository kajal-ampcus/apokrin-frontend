import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  DisintegratingVisualSlide,
  GalleryVisualPattern,
  ServiceFeatureGalleryCard,
} from '../../data/servicesConfig';
import { useTheme } from '../../theme/themeConfig';

interface SquareParticle {
  sx: number;
  sy: number;
  dx: number;
  dy: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  delay: number;
  color: string;
}

const CANVAS_W = 520;
const CANVAS_H = 310;

/**
 * Renders a crisp architectural light-theme visual onto an offscreen canvas
 * when a slide doesn't have a photo backdrop, or overlays an image cleanly.
 */
function paintSlideToCanvas(
  ctx: CanvasRenderingContext2D,
  slide: DisintegratingVisualSlide,
  width: number,
  height: number,
  loadedImg?: HTMLImageElement | null,
) {
  const [c1, c2, c3] = slide.palette;

  // Base light glass gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#F8FBFF');
  bgGrad.addColorStop(0.55, c3);
  bgGrad.addColorStop(1, '#EEF5FF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
    // Cover crop photo cleanly
    const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
    const targetRatio = width / height;
    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > targetRatio) {
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    } else {
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    }

    ctx.drawImage(loadedImg, offsetX, offsetY, drawW, drawH);

    // Subtle light-blue brand glass glaze so photo blends seamlessly with Apokrin light UI
    const glaze = ctx.createLinearGradient(0, 0, 0, height);
    glaze.addColorStop(0, 'rgba(10, 17, 40, 0.08)');
    glaze.addColorStop(0.6, 'rgba(10, 17, 40, 0.14)');
    glaze.addColorStop(1, 'rgba(10, 17, 40, 0.58)');
    ctx.fillStyle = glaze;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Subtle architectural dot grid
  ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
  for (let gx = 20; gx < width; gx += 26) {
    for (let gy = 20; gy < height; gy += 26) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Soft ambient radial glow
  const glow = ctx.createRadialGradient(
    width * 0.68,
    height * 0.34,
    12,
    width * 0.68,
    height * 0.34,
    width * 0.45,
  );
  glow.addColorStop(0, `${c2}33`);
  glow.addColorStop(0.55, `${c1}14`);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawArchitecturalPattern(ctx, slide.pattern, c1, c2, width, height);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

function drawArchitecturalPattern(
  ctx: CanvasRenderingContext2D,
  pattern: GalleryVisualPattern,
  c1: string,
  c2: string,
  w: number,
  h: number,
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);

  if (pattern === 'bars') {
    const heights = [0.36, 0.58, 0.46, 0.78, 0.66, 0.88, 0.72];
    const barW = 36;
    const gap = 18;
    const startX = (w - (heights.length * barW + (heights.length - 1) * gap)) / 2;
    const baseY = h - 56;
    heights.forEach((ratio, idx) => {
      const bh = ratio * 155;
      const x = startX + idx * (barW + gap);
      const y = baseY - bh;
      drawRoundedRect(ctx, x, y, barW, bh, 10);
      ctx.fillStyle = idx % 2 === 0 ? grad : 'rgba(255,255,255,0.88)';
      ctx.fill();
      ctx.strokeStyle = `${c1}44`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    // Trend overlay line
    ctx.beginPath();
    ctx.moveTo(startX + 12, baseY - 68);
    ctx.bezierCurveTo(w * 0.34, baseY - 125, w * 0.62, baseY - 110, w - startX - 10, baseY - 154);
    ctx.strokeStyle = c1;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    return;
  }

  if (pattern === 'network' || pattern === 'workforce') {
    const nodes = [
      { x: w * 0.22, y: h * 0.32, r: 22 },
      { x: w * 0.5, y: h * 0.44, r: 32 },
      { x: w * 0.78, y: h * 0.3, r: 22 },
      { x: w * 0.3, y: h * 0.7, r: 18 },
      { x: w * 0.7, y: h * 0.72, r: 20 },
    ];
    ctx.strokeStyle = `${c1}45`;
    ctx.lineWidth = 2.2;
    nodes.forEach((n, i) => {
      if (i !== 1) {
        ctx.beginPath();
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    });
    nodes.forEach((n, i) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? grad : 'rgba(255,255,255,0.92)';
      ctx.fill();
      ctx.strokeStyle = i === 1 ? '#FFFFFF' : `${c1}66`;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? '#FFFFFF' : c2;
      ctx.fill();
    });
    return;
  }

  if (pattern === 'layers' || pattern === 'cluster') {
    const stackCount = 3;
    for (let i = 0; i < stackCount; i++) {
      const y = 58 + i * 62;
      const inset = i * 16;
      drawRoundedRect(ctx, 76 + inset, y, w - 152 - inset * 2, 46, 14);
      ctx.fillStyle = i === 0 ? grad : 'rgba(255,255,255,0.92)';
      ctx.fill();
      ctx.strokeStyle = i === 0 ? '#FFFFFF88' : `${c1}44`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Status bars inside tier
      drawRoundedRect(ctx, 98 + inset, y + 17, 84, 10, 5);
      ctx.fillStyle = i === 0 ? 'rgba(255,255,255,0.82)' : `${c1}35`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w - 102 - inset, y + 23, 6, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#FFFFFF' : c2;
      ctx.fill();
    }
    return;
  }

  if (pattern === 'shield') {
    const cx = w / 2;
    const cy = h / 2 - 4;
    // Concentric rings
    [98, 70].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 0 ? `${c1}22` : `${c2}38`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    // Shield emblem
    ctx.beginPath();
    ctx.moveTo(cx, cy - 58);
    ctx.lineTo(cx + 50, cy - 38);
    ctx.lineTo(cx + 46, cy + 12);
    ctx.quadraticCurveTo(cx + 38, cy + 52, cx, cy + 68);
    ctx.quadraticCurveTo(cx - 38, cy + 52, cx - 46, cy + 12);
    ctx.lineTo(cx - 50, cy - 38);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Checkmark inside shield
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + 2);
    ctx.lineTo(cx - 4, cy + 17);
    ctx.lineTo(cx + 22, cy - 14);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    return;
  }

  if (pattern === 'devices') {
    // Desktop / tablet glass panel
    drawRoundedRect(ctx, 82, 48, 250, 178, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fill();
    ctx.strokeStyle = `${c1}55`;
    ctx.lineWidth = 2;
    ctx.stroke();

    drawRoundedRect(ctx, 102, 70, 110, 14, 7);
    ctx.fillStyle = grad;
    ctx.fill();
    drawRoundedRect(ctx, 102, 98, 210, 42, 10);
    ctx.fillStyle = `${c1}14`;
    ctx.fill();
    drawRoundedRect(ctx, 102, 152, 96, 52, 10);
    ctx.fillStyle = `${c2}22`;
    ctx.fill();
    drawRoundedRect(ctx, 210, 152, 102, 52, 10);
    ctx.fillStyle = `${c1}1C`;
    ctx.fill();

    // Overlapping Mobile Frame
    drawRoundedRect(ctx, 314, 74, 112, 186, 22);
    ctx.fillStyle = '#0A1128';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    drawRoundedRect(ctx, 326, 94, 88, 144, 14);
    ctx.fillStyle = grad;
    ctx.fill();

    drawRoundedRect(ctx, 338, 112, 64, 10, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
    drawRoundedRect(ctx, 338, 132, 44, 8, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fill();
    return;
  }

  if (pattern === 'hologram') {
    const cx = w / 2;
    const cy = h / 2 - 4;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130 - i * 24, 52 - i * 9, (i * Math.PI) / 10, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? `${c1}55` : `${c2}66`;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    return;
  }

  // Default: 'pipeline' / 'streams'
  const lanes = [84, 148, 212];
  lanes.forEach((ly, idx) => {
    ctx.beginPath();
    ctx.moveTo(54, ly);
    ctx.bezierCurveTo(w * 0.32, ly - 24, w * 0.68, ly + 24, w - 54, ly);
    ctx.strokeStyle = idx === 1 ? c1 : `${c2}88`;
    ctx.lineWidth = idx === 1 ? 4 : 2.6;
    ctx.lineCap = 'round';
    ctx.stroke();

    [0.2, 0.5, 0.8].forEach((t, nIdx) => {
      const nx = 54 + (w - 108) * t;
      const ny = ly + (nIdx === 1 ? 0 : idx === 1 ? 0 : nIdx === 0 ? -8 : 8);
      ctx.beginPath();
      ctx.arc(nx, ny, idx === 1 && nIdx === 1 ? 16 : 10, 0, Math.PI * 2);
      ctx.fillStyle = idx === 1 && nIdx === 1 ? grad : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = idx === 1 ? c1 : c2;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
  });
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

interface DisintegratingGalleryCardProps {
  card: ServiceFeatureGalleryCard;
}

/**
 * Single glassmorphic service card enhanced with the Aceternity Disintegrating Gallery effect.
 * On click/selection, ONLY the visual stage disintegrates into small square particles and
 * smoothly reassembles into the next visual slide—keeping text and controls crisp at all times.
 */
export function DisintegratingGalleryCard({ card }: DisintegratingGalleryCardProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const isAnimatingRef = useRef(false);

  const activeSlide = card.slides[activeSlideIdx] ?? card.slides[0];

  const loadImage = useCallback((src?: string): Promise<HTMLImageElement | null> => {
    if (!src) return Promise.resolve(null);
    const cached = imageCacheRef.current.get(src);
    if (cached && cached.complete) return Promise.resolve(cached);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.onload = () => {
        imageCacheRef.current.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }, []);

  // Paint resting static slide whenever activeSlide changes (and not mid-particle-burst)
  useEffect(() => {
    let cancelled = false;
    const canvas = displayCanvasRef.current;
    if (!canvas || isAnimatingRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    loadImage(activeSlide.imageSrc).then((img) => {
      if (cancelled || isAnimatingRef.current) return;
      paintSlideToCanvas(ctx, activeSlide, CANVAS_W, CANVAS_H, img);
    });

    return () => {
      cancelled = true;
    };
  }, [activeSlide, loadImage]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const triggerDisintegrateTo = useCallback(
    async (targetIdx: number) => {
      if (isAnimatingRef.current || targetIdx === activeSlideIdx) return;

      const currentSlide = card.slides[activeSlideIdx];
      const nextSlide = card.slides[targetIdx];
      if (!currentSlide || !nextSlide) return;

      // Accessible non-particle fallback under prefers-reduced-motion
      if (prefersReducedMotion) {
        setActiveSlideIdx(targetIdx);
        return;
      }

      const canvas = displayCanvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        setActiveSlideIdx(targetIdx);
        return;
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);

      const [fromImg, toImg] = await Promise.all([
        loadImage(currentSlide.imageSrc),
        loadImage(nextSlide.imageSrc),
      ]);

      // Create transient offscreen buffers for source & destination square tiles
      const fromCanvas = document.createElement('canvas');
      fromCanvas.width = CANVAS_W;
      fromCanvas.height = CANVAS_H;
      const fromCtx = fromCanvas.getContext('2d');

      const toCanvas = document.createElement('canvas');
      toCanvas.width = CANVAS_W;
      toCanvas.height = CANVAS_H;
      const toCtx = toCanvas.getContext('2d');

      if (!fromCtx || !toCtx) {
        isAnimatingRef.current = false;
        setIsAnimating(false);
        setActiveSlideIdx(targetIdx);
        return;
      }

      paintSlideToCanvas(fromCtx, currentSlide, CANVAS_W, CANVAS_H, fromImg);
      paintSlideToCanvas(toCtx, nextSlide, CANVAS_W, CANVAS_H, toImg);

      const tileSize = 16;
      const cols = Math.ceil(CANVAS_W / tileSize);
      const rows = Math.ceil(CANVAS_H / tileSize);

      const outParticles: SquareParticle[] = [];
      const inParticles: SquareParticle[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sx = c * tileSize;
          const sy = r * tileSize;
          const normDiag = (c / cols + r / rows) * 0.5;
          const randAngle = (Math.random() - 0.5) * Math.PI * 1.4;
          const speed = 26 + Math.random() * 68;

          outParticles.push({
            sx,
            sy,
            dx: sx,
            dy: sy,
            size: tileSize,
            vx: Math.cos(randAngle) * speed + 24,
            vy: Math.sin(randAngle) * speed - 18,
            rot: (Math.random() - 0.5) * 1.6,
            delay: normDiag * 0.24 + Math.random() * 0.08,
            color: nextSlide.palette[0],
          });

          inParticles.push({
            sx,
            sy,
            dx: sx,
            dy: sy,
            size: tileSize,
            vx: -Math.cos(randAngle) * (speed * 0.85) - 20,
            vy: -Math.sin(randAngle) * (speed * 0.85) + 14,
            rot: (Math.random() - 0.5) * 1.2,
            delay: normDiag * 0.22 + Math.random() * 0.08,
            color: nextSlide.palette[1],
          });
        }
      }

      // Switch slide caption cleanly midway through the reassembly
      let committedState = false;
      const totalDuration = 820;
      const startTime = performance.now();

      const animateFrame = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / totalDuration);

        if (progress >= 0.42 && !committedState) {
          committedState = true;
          setActiveSlideIdx(targetIdx);
        }

        // Clear to soft light glass backdrop
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#F4F8FF';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Phase 1: Outgoing square particles disintegrate & drift outward
        if (progress < 0.65) {
          for (let i = 0; i < outParticles.length; i++) {
            const p = outParticles[i];
            const localT = Math.max(0, Math.min(1, (progress - p.delay) / 0.36));
            if (localT >= 1) continue;

            const ease = easeInOutQuad(localT);
            const scale = 1 - ease * 0.62;
            const alpha = 1 - ease;
            const drawX = p.sx + p.vx * ease;
            const drawY = p.sy + p.vy * ease;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(drawX + p.size * 0.5, drawY + p.size * 0.5);
            if (ease > 0.02) ctx.rotate(p.rot * ease);
            ctx.scale(scale, scale);
            ctx.drawImage(
              fromCanvas,
              p.sx,
              p.sy,
              p.size,
              p.size,
              -p.size * 0.5,
              -p.size * 0.5,
              p.size,
              p.size,
            );
            // Crisp cyan edge glint as squares break apart
            if (ease > 0.08 && ease < 0.72) {
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
              ctx.lineWidth = 1;
              ctx.strokeRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
            }
            ctx.restore();
          }
        }

        // Phase 2: Incoming square particles materialize and reassemble cleanly into the next visual
        if (progress > 0.28) {
          for (let i = 0; i < inParticles.length; i++) {
            const p = inParticles[i];
            const localT = Math.max(0, Math.min(1, (progress - 0.28 - p.delay) / 0.44));
            if (localT <= 0) continue;

            const ease = easeOutCubic(localT);
            const inv = 1 - ease;
            const scale = 0.45 + ease * 0.55;
            const drawX = p.sx + p.vx * inv;
            const drawY = p.sy + p.vy * inv;

            ctx.save();
            ctx.globalAlpha = Math.min(1, localT * 1.35);
            ctx.translate(drawX + p.size * 0.5, drawY + p.size * 0.5);
            if (inv > 0.01) ctx.rotate(p.rot * inv);
            ctx.scale(scale, scale);
            ctx.drawImage(
              toCanvas,
              p.sx,
              p.sy,
              p.size,
              p.size,
              -p.size * 0.5,
              -p.size * 0.5,
              p.size,
              p.size,
            );
            if (inv > 0.12 && inv < 0.85) {
              ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
              ctx.lineWidth = 1;
              ctx.strokeRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
            }
            ctx.restore();
          }
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animateFrame);
        } else {
          // Draw final pixel-crisp destination visual and release animation lock
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
          ctx.drawImage(toCanvas, 0, 0);
          isAnimatingRef.current = false;
          setIsAnimating(false);
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(animateFrame);
    },
    [activeSlideIdx, card.slides, loadImage, prefersReducedMotion],
  );

  const handleCycleNext = () => {
    const nextIdx = (activeSlideIdx + 1) % card.slides.length;
    void triggerDisintegrateTo(nextIdx);
  };

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      className="apokrin-clay-panel group relative flex h-full flex-col overflow-hidden rounded-[1.85rem] border border-white/95 p-4 transition-shadow duration-300 hover:shadow-[0_24px_46px_-18px_var(--color-glow),0_10px_24px_-10px_rgba(6,182,212,0.18)] sm:p-5"
    >
      {/* Subtle hover border glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${themeConfig.primary}45`,
        }}
      />

      {/* Interactive Disintegrating Visual Stage (Click / Tap to Disintegrate & Reassemble) */}
      <button
        type="button"
        onClick={handleCycleNext}
        aria-label={`${card.title}: currently showing ${activeSlide.label}. Click to reveal next visual.`}
        className="relative block w-full overflow-hidden rounded-[1.35rem] border border-[#E2E8F0]/90 bg-[#F4F8FF] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
      >
        <canvas
          ref={displayCanvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block aspect-[16/10] w-full object-cover"
        />

        {/* Subtle Top Visual Metadata Overlay */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/75 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[#0A1128] shadow-xs backdrop-blur-md">
            <Layers className="h-3 w-3" style={{ color: themeConfig.primaryStrong }} />
            <span>
              {activeSlideIdx + 1} / {card.slides.length}
            </span>
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border border-white/70 bg-[#0A1128]/78 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md transition-transform duration-200 ${
              isAnimating ? 'scale-95 opacity-90' : 'group-hover:scale-105'
            }`}
          >
            <Sparkles className="h-3 w-3 text-[#38BDF8]" />
            <span>{isAnimating ? 'Reassembling…' : 'Next Visual'}</span>
          </span>
        </div>

        {/* Bottom Visual Caption Scrim (Always Crisp & Readable) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1128]/82 via-[#0A1128]/48 to-transparent px-4 pb-3 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-display text-xs font-bold text-white sm:text-[13px]">
                {activeSlide.label}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-200">
                {activeSlide.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </button>

      {/* Card Body — Always Crisp, Static, High-Contrast & Uninterrupted */}
      <div className="mt-5 flex flex-1 flex-col justify-between px-1">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#64748B]">
            <span>
              {card.index} · {card.category}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight text-[#0A1128] sm:text-xl">
            {card.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{card.description}</p>
        </div>

        {/* Accessible Slide Selector Dots + Next View Trigger */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E2E8F0]/90 pt-4">
          <div className="flex items-center gap-1.5" role="group" aria-label={`Visual slides for ${card.title}`}>
            {card.slides.map((slide, idx) => {
              const isSelected = idx === activeSlideIdx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => void triggerDisintegrateTo(idx)}
                  aria-label={`View ${slide.label}`}
                  aria-pressed={isSelected}
                  className={`h-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                    isSelected ? 'w-7' : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  }`}
                  style={
                    isSelected
                      ? { background: 'var(--color-btn-gradient)' }
                      : undefined
                  }
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCycleNext}
            disabled={isAnimating}
            className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors hover:underline disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            style={{ color: themeConfig.primaryStrong }}
          >
            <span>Switch View</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

interface DisintegratingFeatureGalleryProps {
  cards: ServiceFeatureGalleryCard[];
}

export function DisintegratingFeatureGallery({ cards }: DisintegratingFeatureGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <DisintegratingGalleryCard key={card.id} card={card} />
      ))}
    </div>
  );
}
