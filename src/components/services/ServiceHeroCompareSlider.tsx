import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  MoveHorizontal,
  Pause,
  Play,
  Server,
  Sparkles,
} from 'lucide-react';
import { animate, motion, useReducedMotion } from 'motion/react';
import {
  getAdjacentServices,
  getServiceConfig,
  ServiceConfig,
  ServiceId,
} from '../../data/servicesConfig';
import { useTheme } from '../../theme/themeConfig';
import { useServiceTransition } from './ServiceTransitionProvider';

interface ServiceHeroCompareSliderProps {
  serviceId: ServiceId;
  heroVisual?: ReactNode;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
}

type DragDirection = 'next' | 'prev';

interface SeamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

const COMMIT_THRESHOLD = 0.75;
const MIN_DRAG_INTENT_PX = 14;

/**
 * Lightweight Canvas 2D particle beam strictly active along the moving comparison divider.
 * Emits luminous brand sparks when hovering or dragging; zero CPU cost at rest.
 */
function CompareSeamParticles({
  active,
  dividerXPercent,
  velocity,
  colors,
  reducedMotion,
}: {
  active: boolean;
  dividerXPercent: number;
  velocity: number;
  colors: [string, string, string];
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ active, dividerXPercent, velocity, colors });
  stateRef.current = { active, dividerXPercent, velocity, colors };

  useEffect(() => {
    if (reducedMotion || !active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const particles: SeamParticle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { dividerXPercent: pct, velocity: vel, colors: palette } = stateRef.current;
      const seamX = (pct / 100) * w;

      ctx.clearRect(0, 0, w, h);

      // Emit crisp micro-particles along the divider seam proportional to drag speed
      const spawnCount = Math.min(8, 2 + Math.floor(Math.abs(vel) * 0.35));
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < 75) {
          const dir = vel === 0 ? (Math.random() > 0.5 ? 1 : -1) : vel > 0 ? -1 : 1;
          particles.push({
            x: seamX + (Math.random() - 0.5) * 6,
            y: Math.random() * h,
            vx: dir * (0.8 + Math.random() * 2.6 + Math.min(4, Math.abs(vel) * 0.14)),
            vy: (Math.random() - 0.5) * 1.1,
            size: 1.6 + Math.random() * 2.8,
            alpha: 0.65 + Math.random() * 0.35,
            life: 0,
            maxLife: 20 + Math.random() * 24,
            color: palette[Math.floor(Math.random() * palette.length)],
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        const fade = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = p.alpha * fade;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [active, reducedMotion]);

  if (reducedMotion || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}

/**
 * Unified dark glass hero visual card matching the Infrastructure Management Services hero layout.
 * Renders a crisp 16:10 looping HD video when configured (or editorial photography) above a clean
 * 3-pillar architectural caption strip, identical across all 9 services and Compare Slider previews.
 */
function ServiceHeroMediaCard({
  service,
  isPreview,
  prefersReducedMotion,
}: {
  service: ServiceConfig;
  isPreview: boolean;
  prefersReducedMotion: boolean;
}) {
  const { heroCard } = service.hero;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [videoProgress, setVideoProgress] = useState(0);

  const shouldRenderVideo = Boolean(!isPreview && heroCard.videoSrc && !videoFailed);

  useEffect(() => {
    setImgFailed(false);
    setVideoFailed(false);
    setVideoProgress(0);
    const video = videoRef.current;
    if (!video || !shouldRenderVideo) return;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [service.id, heroCard.videoSrc, shouldRenderVideo, prefersReducedMotion]);

  const handleTogglePlayback = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (video.paused) {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.85rem] border border-white/15 bg-white/6 p-2.5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-[#0F172A]">
        {shouldRenderVideo ? (
          <>
            <video
              ref={videoRef}
              key={heroCard.videoSrc}
              src={heroCard.videoSrc}
              poster={heroCard.imageSrc}
              aria-label={heroCard.imageAlt}
              autoPlay={!prefersReducedMotion}
              loop
              muted
              playsInline
              preload="auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => {
                const el = e.currentTarget;
                if (el.duration > 0) {
                  setVideoProgress(Math.min(1, Math.max(0, el.currentTime / el.duration)));
                }
              }}
              onError={() => setVideoFailed(true)}
              className="aspect-[16/10] w-full object-cover"
            />

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleTogglePlayback}
              aria-label={isPlaying ? `Pause ${service.name} video` : `Play ${service.name} video`}
              aria-pressed={isPlaying}
              className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#0A1128]/70 text-white backdrop-blur-md transition-transform duration-150 hover:scale-105 hover:bg-[#0A1128]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5 translate-x-[1px]" aria-hidden="true" />
              )}
            </button>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/15"
            >
              <div
                className="h-full w-full origin-left transition-transform duration-150 ease-linear"
                style={{
                  transform: `scaleX(${videoProgress})`,
                  background: 'var(--color-btn-gradient)',
                }}
              />
            </div>
          </>
        ) : imgFailed ? (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 p-8 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{ background: 'var(--color-btn-gradient)' }}
            >
              <Server className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="font-display text-base font-bold text-white">
              {heroCard.fallbackTitle}
            </p>
            <p className="max-w-xs text-xs text-slate-300">
              {heroCard.fallbackSubtitle}
            </p>
          </div>
        ) : (
          <img
            src={heroCard.imageSrc}
            alt={isPreview ? '' : heroCard.imageAlt}
            aria-hidden={isPreview || undefined}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="aspect-[16/10] w-full object-cover"
          />
        )}
      </div>

      {/* Clean 3-Pillar Architectural Caption Strip */}
      <div className="grid grid-cols-3 divide-x divide-white/10 px-2 pb-1.5 pt-3 text-center">
        {heroCard.pillars.map((pillar) => (
          <div key={pillar.label} className="px-2">
            <p className="font-mono text-[11px] font-semibold text-slate-400">{pillar.label}</p>
            <p className="mt-0.5 font-display text-xs font-bold text-white sm:text-sm">
              {pillar.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders either the active service hero or the adjacent preview hero using the exact unified
 * dark split hero design across all 9 services.
 */
function ServiceHeroLayer({
  service,
  heroVisual,
  isPreview,
  prefersReducedMotion,
  onPrimaryCta,
  onSecondaryCta,
}: {
  service: ServiceConfig;
  heroVisual?: ReactNode;
  isPreview: boolean;
  prefersReducedMotion: boolean;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
}) {
  const { themeConfig } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [service.id]);

  const isDark = service.hero.themeVariant === 'dark';
  const isSplit = service.hero.layoutVariant === 'split';

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        isDark
          ? 'bg-[#0A1128] text-white'
          : 'apokrin-hero-light text-[#0A1128]'
      }`}
    >
      {/* Background Photography or Soft Light-Theme Ambient Wash */}
      {isDark && service.hero.backdropImage && !imgFailed && (
        <img
          src={service.hero.backdropImage}
          alt={isPreview ? '' : service.hero.backdropAlt ?? service.name}
          aria-hidden={isPreview || undefined}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
      )}

      {isDark ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, rgba(10,17,40,0.92) 0%, rgba(10,17,40,0.78) 52%, rgba(10,17,40,0.86) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background: `radial-gradient(circle, ${themeConfig.primary} 0%, transparent 70%)`,
            }}
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full opacity-45 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
          }}
        />
      )}

      {/* Main Hero Inner Grid */}
      <div className="apokrin-container relative z-10 flex min-h-[450px] flex-col justify-center pb-20 pt-12 sm:min-h-[490px] sm:pb-24 sm:pt-14 lg:min-h-[520px] lg:pt-16">
        {isSplit ? (
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Typography Column */}
            <div className="lg:col-span-6">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold ${
                  isDark
                    ? 'border border-white/20 bg-white/10 text-white backdrop-blur-sm'
                    : 'apokrin-badge'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: service.hero.accentGradient }}
                />
                <span>{service.hero.badge}</span>
              </span>

              {isPreview ? (
                <p
                  style={{ textWrap: 'balance' }}
                  className={`apokrin-heading-hero mt-4 font-display font-extrabold ${
                    isDark ? 'text-white' : 'text-[#0A1128]'
                  }`}
                >
                  {service.hero.titlePrefix}
                  <span
                    className={
                      isDark ? 'bg-clip-text text-transparent' : 'apokrin-gradient-text'
                    }
                    style={
                      isDark
                        ? {
                            backgroundImage: `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 52%, ${themeConfig.secondary} 100%)`,
                          }
                        : undefined
                    }
                  >
                    {service.hero.titleHighlight}
                  </span>
                </p>
              ) : (
                <h1
                  id={`${service.id}-hero-heading`}
                  style={{ textWrap: 'balance' }}
                  className={`apokrin-heading-hero mt-4 font-display font-extrabold ${
                    isDark ? 'text-white' : 'text-[#0A1128]'
                  }`}
                >
                  {service.hero.titlePrefix}
                  <span
                    className={
                      isDark ? 'bg-clip-text text-transparent' : 'apokrin-gradient-text'
                    }
                    style={
                      isDark
                        ? {
                            backgroundImage: `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 52%, ${themeConfig.secondary} 100%)`,
                          }
                        : undefined
                    }
                  >
                    {service.hero.titleHighlight}
                  </span>
                </h1>
              )}

              <p
                className={`mt-4 max-w-xl font-display text-base font-bold tracking-tight sm:text-lg ${
                  isDark ? 'text-slate-100' : 'text-[#1E293B]'
                }`}
              >
                {service.hero.subtitle}
              </p>

              {service.hero.description && (
                <p
                  className={`mt-3 max-w-xl text-sm leading-relaxed sm:text-base ${
                    isDark ? 'text-slate-300' : 'text-[#475569]'
                  }`}
                >
                  {service.hero.description}
                </p>
              )}

              {!isPreview && (service.hero.primaryCtaLabel || service.hero.secondaryCtaLabel) && (
                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  {service.hero.primaryCtaLabel && onPrimaryCta && (
                    <button
                      type="button"
                      onClick={onPrimaryCta}
                      className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                    >
                      <span>{service.hero.primaryCtaLabel}</span>
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}

                  {service.hero.secondaryCtaLabel && onSecondaryCta && (
                    <button
                      type="button"
                      onClick={onSecondaryCta}
                      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                        isDark
                          ? 'border border-white/25 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/80'
                          : 'apokrin-btn-secondary focus-visible:ring-[var(--color-primary-strong)]'
                      }`}
                    >
                      <span>{service.hero.secondaryCtaLabel}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Visual Column (Unified Infrastructure-Style Dark Glass Card with Video/Photo + 3-Pillar Strip) */}
            <div className="relative lg:col-span-6">
              {!isPreview && heroVisual ? (
                heroVisual
              ) : (
                <ServiceHeroMediaCard
                  service={service}
                  isPreview={isPreview}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}
            </div>
          </div>
        ) : (
          /* Centered Layout Variant (Staffing, Mobility, Analytics, HRMS) */
          <div className="relative mx-auto max-w-4xl text-center">
            {service.hero.floatingTags && service.hero.floatingTags.length >= 2 && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-28 top-0 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-left text-white shadow-xl backdrop-blur-md xl:flex"
                >
                  <Sparkles className="h-4 w-4 text-[#38BDF8]" />
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {service.hero.floatingTags[0].title}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {service.hero.floatingTags[0].subtitle}
                    </p>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-28 top-2 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-left text-white shadow-xl backdrop-blur-md xl:flex"
                >
                  <Sparkles className="h-4 w-4 text-[#38BDF8]" />
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {service.hero.floatingTags[1].title}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {service.hero.floatingTags[1].subtitle}
                    </p>
                  </div>
                </div>
              </>
            )}

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold tracking-wide ${
                isDark
                  ? 'border border-white/25 bg-white/10 text-white backdrop-blur-sm'
                  : 'text-white shadow-sm'
              }`}
              style={isDark ? undefined : { background: service.hero.accentGradient }}
            >
              {service.hero.badge}
            </span>

            {isPreview ? (
              <p
                style={{ textWrap: 'balance' }}
                className={`apokrin-heading-hero mt-5 font-display font-extrabold ${
                  isDark ? 'text-white' : 'text-[#0A1128]'
                }`}
              >
                {service.hero.titlePrefix}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: isDark
                      ? `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 48%, ${themeConfig.secondary} 100%)`
                      : service.hero.accentGradient,
                  }}
                >
                  {service.hero.titleHighlight}
                </span>
              </p>
            ) : (
              <h1
                id={`${service.id}-hero-heading`}
                style={{ textWrap: 'balance' }}
                className={`apokrin-heading-hero mt-5 font-display font-extrabold ${
                  isDark ? 'text-white' : 'text-[#0A1128]'
                }`}
              >
                {service.hero.titlePrefix}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: isDark
                      ? `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 48%, ${themeConfig.secondary} 100%)`
                      : service.hero.accentGradient,
                  }}
                >
                  {service.hero.titleHighlight}
                </span>
              </h1>
            )}

            <p
              className={`mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed sm:text-lg ${
                isDark ? 'text-slate-200' : 'text-[#1E293B]'
              }`}
            >
              {service.hero.subtitle}
            </p>

            {service.hero.description && (
              <p
                className={`mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed sm:text-base ${
                  isDark ? 'text-slate-300' : 'text-[#475569]'
                }`}
              >
                {service.hero.description}
              </p>
            )}

            {!isPreview && service.hero.primaryCtaLabel && onPrimaryCta && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={onPrimaryCta}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    isDark
                      ? 'border border-white/25 bg-white/12 text-white backdrop-blur-sm hover:bg-white/22 focus-visible:ring-white'
                      : 'apokrin-btn-primary focus-visible:ring-[var(--color-primary-strong)]'
                  }`}
                >
                  <span>{service.hero.primaryCtaLabel}</span>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Aceternity Compare Slider adapted into an interactive Service-Page Switcher Hero.
 * - Dragging right-to-left progressively reveals the Next Service's hero.
 * - Dragging left-to-right progressively reveals the Previous Service's hero.
 * - Crossing >= 75% commits a full-page service navigation with URL, SEO, dropdown & content sync.
 * - Includes visible Previous / Next buttons, keyboard support, touch scroll safety & reduced-motion fallback.
 */
export function ServiceHeroCompareSlider({
  serviceId,
  heroVisual,
  onPrimaryCta,
  onSecondaryCta,
}: ServiceHeroCompareSliderProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { navigateToService, isTransitioning } = useServiceTransition();

  const currentService = getServiceConfig(serviceId);
  const { prev: prevService, next: nextService, index, total } = getAdjacentServices(serviceId);

  const containerRef = useRef<HTMLElement | null>(null);

  // Active comparison state
  const [dragDirection, setDragDirection] = useState<DragDirection>('next');
  const [progress, setProgress] = useState<number>(0); // 0 = resting, 1 = 100% revealed
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSeamHovered, setIsSeamHovered] = useState<boolean>(false);
  const [dragVelocity, setDragVelocity] = useState<number>(0);
  const [committingTarget, setCommittingTarget] = useState<ServiceId | null>(null);

  // Pointer tracking refs for clean touch disambiguation (vertical scroll vs horizontal drag)
  const pointerStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    mode: 'idle' | 'pending' | 'dragging' | 'scrolling';
    forcedDirection: DragDirection | null;
    currentProgress: number;
    direction: DragDirection;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    mode: 'idle',
    forcedDirection: null,
    currentProgress: 0,
    direction: 'next',
  });

  // Reset slider cleanly whenever serviceId changes
  useEffect(() => {
    setProgress(0);
    setIsDragging(false);
    setDragVelocity(0);
    setCommittingTarget(null);
    setDragDirection('next');
    pointerStateRef.current.mode = 'idle';
    pointerStateRef.current.pointerId = null;
    pointerStateRef.current.currentProgress = 0;
  }, [serviceId]);

  const targetService = dragDirection === 'next' ? nextService : prevService;

  // Position of the vertical comparison divider in percentage (0% = left edge, 100% = right edge)
  const restNextPercent = 100;
  const dividerPercent =
    progress > 0
      ? dragDirection === 'next'
        ? Math.max(0, (1 - progress) * 100)
        : Math.min(100, progress * 100)
      : restNextPercent;

  const commitNavigation = useCallback(
    (target: ServiceConfig, direction: DragDirection, fromProgress: number) => {
      if (isTransitioning || committingTarget) return;
      setCommittingTarget(target.id);
      setDragDirection(direction);
      setIsDragging(false);

      if (prefersReducedMotion) {
        setProgress(1);
        navigateToService(target.id, direction);
        return;
      }

      animate(fromProgress, 1, {
        duration: Math.max(0.22, (1 - fromProgress) * 0.42),
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setProgress(latest),
        onComplete: () => {
          navigateToService(target.id, direction);
        },
      });
    },
    [committingTarget, isTransitioning, navigateToService, prefersReducedMotion],
  );

  const springBack = useCallback(
    (fromProgress: number) => {
      setIsDragging(false);
      setDragVelocity(0);

      if (prefersReducedMotion || fromProgress <= 0.01) {
        setProgress(0);
        return;
      }

      animate(fromProgress, 0, {
        type: 'spring',
        stiffness: 340,
        damping: 32,
        onUpdate: (latest) => setProgress(latest),
        onComplete: () => {
          setProgress(0);
          setDragDirection('next');
        },
      });
    },
    [prefersReducedMotion],
  );

  const beginHandleDrag = (e: PointerEvent<HTMLButtonElement>, dir: DragDirection) => {
    if (isTransitioning || committingTarget) return;
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    container.setPointerCapture(e.pointerId);
    const rect = container.getBoundingClientRect();
    const rawInitialProgress =
      rect.width > 0
        ? dir === 'next'
          ? (rect.right - e.clientX) / rect.width
          : (e.clientX - rect.left) / rect.width
        : 0.02;
    const initialProgress = Math.max(0.015, Math.min(0.08, rawInitialProgress));
    const now = performance.now();
    pointerStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: now,
      mode: 'dragging',
      forcedDirection: dir,
      currentProgress: initialProgress,
      direction: dir,
    };
    setDragDirection(dir);
    setIsDragging(true);
    setProgress(initialProgress);
  };

  const handleContainerPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (isTransitioning || committingTarget) return;
    // Ignore clicks on buttons, links, canvas controls, or interactive elements inside hero
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest('button, a, input, [role="tab"], canvas')) return;

    const now = performance.now();
    pointerStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: now,
      mode: 'pending',
      forcedDirection: null,
      currentProgress: 0,
      direction: 'next',
    };
  };

  const handleContainerPointerMove = (e: PointerEvent<HTMLElement>) => {
    const state = pointerStateRef.current;
    if (state.pointerId !== e.pointerId || state.mode === 'idle' || state.mode === 'scrolling') {
      return;
    }

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    // Disambiguate vertical scrolling vs horizontal compare drag on touch & trackpad
    if (state.mode === 'pending') {
      if (Math.abs(dx) < MIN_DRAG_INTENT_PX && Math.abs(dy) < MIN_DRAG_INTENT_PX) {
        return;
      }
      if (Math.abs(dy) >= Math.abs(dx) * 0.9) {
        state.mode = 'scrolling';
        return;
      }

      // Confirmed horizontal intent: right-to-left => next, left-to-right => prev
      const resolvedDir: DragDirection = dx < 0 ? 'next' : 'prev';
      state.mode = 'dragging';
      state.direction = resolvedDir;
      setDragDirection(resolvedDir);
      setIsDragging(true);
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable
      }
    }

    const now = performance.now();
    const dt = Math.max(8, now - state.lastTime);
    const instVel = ((e.clientX - state.lastX) / dt) * 16;
    state.lastX = e.clientX;
    state.lastTime = now;

    // Compute progress 0..1 smoothly based on pointer X relative to container width
    let nextProgress = 0;
    if (state.forcedDirection === 'next') {
      nextProgress = Math.max(0, Math.min(1, (rect.right - e.clientX) / rect.width));
    } else if (state.forcedDirection === 'prev') {
      nextProgress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    } else if (state.direction === 'next') {
      // Swipe right-to-left from anywhere in hero: amplify slightly so 65% swipe reaches commit smoothly
      nextProgress = Math.max(0, Math.min(1, (-dx / (rect.width * 0.72))));
    } else {
      nextProgress = Math.max(0, Math.min(1, dx / (rect.width * 0.72)));
    }

    state.currentProgress = nextProgress;
    setDragVelocity(instVel);
    setProgress(nextProgress);
  };

  const finishPointerDrag = (e: PointerEvent<HTMLElement>) => {
    const state = pointerStateRef.current;
    if (state.pointerId !== e.pointerId) return;

    const container = containerRef.current;
    if (container && container.hasPointerCapture(e.pointerId)) {
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // Safe cleanup
      }
    }

    const wasDragging = state.mode === 'dragging';
    const finalProgress = state.currentProgress;
    const finalDir = state.direction;

    state.mode = 'idle';
    state.pointerId = null;

    if (!wasDragging) return;

    if (finalProgress >= COMMIT_THRESHOLD) {
      const target = finalDir === 'next' ? nextService : prevService;
      commitNavigation(target, finalDir, finalProgress);
    } else {
      springBack(finalProgress);
    }
  };

  // Accessible keyboard control on the compare divider
  const handleDividerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (isTransitioning || committingTarget) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commitNavigation(nextService, 'next', 0.15);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      commitNavigation(prevService, 'prev', 0.15);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commitNavigation(nextService, 'next', 0.15);
    }
  };

  const isRevealing = progress > 0.005;
  const isReadyToCommit = progress >= COMMIT_THRESHOLD;
  const progressPct = Math.round(progress * 100);

  // Subtle velocity-driven motion blur & chromatic split strictly during active drag
  const speedFactor = prefersReducedMotion || !isDragging ? 0 : Math.min(1, Math.abs(dragVelocity) / 22);
  const seamBlurPx = speedFactor * 2.2;
  const rgbSplitPx = speedFactor * 4.5;

  // Clip-path unveiling the preview hero cleanly from right-to-left (next) or left-to-right (prev)
  const previewClipPath =
    dragDirection === 'next'
      ? `inset(0 0 0 ${dividerPercent}%)`
      : `inset(0 ${100 - dividerPercent}% 0 0)`;

  const isCurrentDark = currentService.hero.themeVariant === 'dark';

  return (
    <section
      ref={containerRef}
      aria-labelledby={`${serviceId}-hero-heading`}
      aria-roledescription="interactive service hero switcher"
      onPointerDown={handleContainerPointerDown}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      style={{ touchAction: 'pan-y' }}
      className="relative isolate overflow-hidden border-b border-[#E2E8F0] select-none"
    >
      {/* 1. Base Layer: Current Service's Complete Hero */}
      <div
        className="relative z-0 transition-transform duration-150"
        style={{
          filter:
            isRevealing && !prefersReducedMotion && speedFactor > 0.25
              ? `blur(${(seamBlurPx * 0.45).toFixed(2)}px)`
              : undefined,
        }}
      >
        <ServiceHeroLayer
          service={currentService}
          heroVisual={heroVisual}
          isPreview={false}
          prefersReducedMotion={prefersReducedMotion}
          onPrimaryCta={onPrimaryCta}
          onSecondaryCta={onSecondaryCta}
        />
      </div>

      {/* 2. Revealed Preview Layer: Adjacent Service's Real Hero (Clipped by Divider) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 will-change-[clip-path]"
        style={{
          clipPath: previewClipPath,
          filter:
            isRevealing && !prefersReducedMotion && seamBlurPx > 0.2
              ? `blur(${(seamBlurPx * 0.65).toFixed(2)}px)`
              : undefined,
        }}
      >
        <ServiceHeroLayer
          service={targetService}
          isPreview={true}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Subtle Chromatic Edge Shimmer along the unveiled seam */}
        {isRevealing && !prefersReducedMotion && rgbSplitPx > 0.3 && (
          <div
            className="pointer-events-none absolute inset-y-0 w-10 opacity-65 mix-blend-screen"
            style={{
              left: dragDirection === 'next' ? `${dividerPercent}%` : undefined,
              right: dragDirection === 'prev' ? `${100 - dividerPercent}%` : undefined,
              background:
                'linear-gradient(90deg, rgba(6,182,212,0.55) 0%, rgba(37,99,235,0.45) 50%, rgba(124,58,237,0.35) 100%)',
              transform: `translateX(${dragDirection === 'next' ? -rgbSplitPx : rgbSplitPx}px)`,
              filter: 'blur(6px)',
            }}
          />
        )}
      </div>

      {/* 3. Live Canvas Particle Stream along Moving Divider */}
      <CompareSeamParticles
        active={isDragging || isSeamHovered || Boolean(committingTarget)}
        dividerXPercent={dividerPercent}
        velocity={dragVelocity}
        colors={targetService.hero.particleColors}
        reducedMotion={prefersReducedMotion}
      />

      {/* 4. Luminous Comparison Divider Beam + Chromatic Split + Draggable Handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-30"
        style={{
          left: `${dividerPercent}%`,
          transform: !isRevealing ? 'translateX(-100%)' : 'translateX(-50%)',
        }}
      >
        {/* Chromatic Split Halo Left/Right when dragging */}
        {!prefersReducedMotion && (isDragging || isSeamHovered) && (
          <>
            <div
              className="absolute inset-y-0 w-[3px] opacity-75"
              style={{
                left: `${-Math.max(2, rgbSplitPx)}px`,
                background: 'linear-gradient(180deg, transparent 0%, #06B6D4 25%, #38BDF8 75%, transparent 100%)',
                filter: 'blur(1.5px)',
              }}
            />
            <div
              className="absolute inset-y-0 w-[3px] opacity-70"
              style={{
                left: `${Math.max(2, rgbSplitPx)}px`,
                background: 'linear-gradient(180deg, transparent 0%, #2563EB 25%, #818CF8 75%, transparent 100%)',
                filter: 'blur(1.5px)',
              }}
            />
          </>
        )}

        {/* Core Luminous Beam */}
        <div
          className="h-full w-[2.5px] transition-all duration-150"
          style={{
            background: isReadyToCommit
              ? 'linear-gradient(180deg, transparent 0%, #10B981 18%, #06B6D4 50%, #2563EB 82%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, #38BDF8 18%, #2563EB 50%, #06B6D4 82%, transparent 100%)',
            boxShadow: isDragging
              ? '0 0 22px rgba(6,182,212,0.85), 0 0 42px rgba(37,99,235,0.55)'
              : '0 0 14px rgba(37,99,235,0.55)',
          }}
        />

        {/* Tactile Draggable Center Handle (Docked flush to right edge at rest, full circle while dragging) */}
        <button
          type="button"
          role="slider"
          aria-label={`Drag left to preview and switch to ${nextService.name}, or press Enter to switch`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          aria-valuetext={
            isRevealing
              ? `${progressPct}% revealing ${targetService.name}`
              : `Viewing ${currentService.name}. Next service: ${nextService.name}`
          }
          onPointerDown={(e) => beginHandleDrag(e, 'next')}
          onPointerEnter={() => setIsSeamHovered(true)}
          onPointerLeave={() => setIsSeamHovered(false)}
          onKeyDown={handleDividerKeyDown}
          className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 flex cursor-ew-resize items-center justify-center border-white/95 text-white shadow-[0_12px_30px_-6px_rgba(37,99,235,0.65)] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#38BDF8]/60 ${
            isRevealing
              ? 'left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border-2'
              : 'right-0 h-12 w-11 rounded-l-full rounded-r-none border-y-2 border-l-2 border-r-0 pl-1'
          } ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
          style={{
            background: isReadyToCommit
              ? 'linear-gradient(135deg, #059669 0%, #06B6D4 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          }}
        >
          <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Live Floating Preview Pill on Divider */}
        <motion.div
          animate={{
            opacity: isDragging || isSeamHovered ? 1 : 0.94,
            scale: isReadyToCommit ? 1.04 : 1,
          }}
          transition={{ duration: 0.16 }}
          className={`pointer-events-none absolute top-[calc(50%-3.85rem)] whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md ${
            !isRevealing
              ? 'right-3'
              : dividerPercent > 70
                ? 'right-5'
                : dividerPercent < 30
                  ? 'left-5'
                  : 'left-1/2 -translate-x-1/2'
          } ${
            isReadyToCommit
              ? 'border-emerald-300/80 bg-[#059669]/95 text-white'
              : 'border-white/85 bg-[#0A1128]/88 text-white'
          }`}
        >
          {isRevealing ? (
            <span className="inline-flex items-center gap-2 tabular-nums">
              <span>
                {isReadyToCommit
                  ? `Release to open ${targetService.shortName}`
                  : `${dragDirection === 'next' ? 'Next' : 'Previous'}: ${targetService.shortName}`}
              </span>
              <span className="font-mono text-[11px] text-[#7DD3FC]">{progressPct}%</span>
            </span>
          ) : (
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <ArrowLeft className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Drag for {nextService.shortName}</span>
            </span>
          )}
        </motion.div>
      </div>

      {/* Subtle Left-Edge Drag Affordance for Previous Service (Desktop & Touch) */}
      {!isRevealing && (
        <button
          type="button"
          onPointerDown={(e) => beginHandleDrag(e, 'prev')}
          onClick={() => commitNavigation(prevService, 'prev', 0.12)}
          aria-label={`Drag right or click to switch to previous service: ${prevService.name}`}
          className="group absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 cursor-ew-resize items-center gap-1 rounded-r-full border border-l-0 border-white/70 bg-white/80 py-3 pl-1.5 pr-2.5 text-[#0A1128] shadow-md backdrop-blur-md transition-all hover:bg-white hover:pr-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] md:inline-flex"
        >
          <GripVertical className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap transition-all duration-200 group-hover:max-w-[140px] group-hover:pr-1">
            {prevService.shortName}
          </span>
        </button>
      )}

      {/* 5. Accessible Bottom Service Navigation & Progress Bar (Desktop & Mobile) */}
      <div className="relative z-20 -mt-14 pb-4">
        <div className="apokrin-container">
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 backdrop-blur-xl sm:px-5 ${
              isCurrentDark
                ? 'border-white/18 bg-[#0A1128]/72 text-white shadow-[0_14px_34px_-12px_rgba(0,0,0,0.45)]'
                : 'border-white/95 bg-white/82 text-[#0A1128] shadow-[0_12px_30px_-14px_rgba(37,99,235,0.2)]'
            }`}
          >
            {/* Previous Service Button */}
            <button
              type="button"
              disabled={isTransitioning || Boolean(committingTarget)}
              onClick={() => commitNavigation(prevService, 'prev', 0.12)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                isCurrentDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-[#F1F5F9] text-[#0A1128] hover:bg-[#E2E8F0]'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Previous:</span>
              <span>{prevService.shortName}</span>
            </button>

            {/* Center Service Index + Drag Hint */}
            <div className="hidden items-center gap-2.5 text-xs md:flex">
              <span
                className="font-mono font-bold tabular-nums"
                style={{ color: isCurrentDark ? '#7DD3FC' : 'var(--color-primary-strong)' }}
              >
                0{index + 1} / 0{total}
              </span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span className={isCurrentDark ? 'text-slate-200' : 'text-[#475569]'}>
                Drag divider across hero to preview &amp; switch services
              </span>
            </div>

            {/* Next Service Button */}
            <button
              type="button"
              disabled={isTransitioning || Boolean(committingTarget)}
              onClick={() => commitNavigation(nextService, 'next', 0.12)}
              className="apokrin-btn-primary inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            >
              <span className="hidden sm:inline">Next:</span>
              <span>{nextService.shortName}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
