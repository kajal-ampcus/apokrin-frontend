import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SparklesCore } from './ui/SparklesCore';

const SESSION_STORAGE_KEY = 'apokrin-welcome-intro-v2';
const AUTO_EXIT_DELAY_MS = 3200;

const FOCAL_SPARKLE_COLORS = ['#2563EB', '#06B6D4', '#38BDF8', '#16A34A', '#F97316'];
const AMBIENT_SPARKLE_COLORS = ['#2563EB', '#06B6D4', '#16A34A', '#F59E0B'];

interface RisingArrowSpec {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startRotate: number;
  endRotate: number;
  scale: number;
  delay: number;
  duration: number;
  gradStart: string;
  gradEnd: string;
  glowColor: string;
  pathD: string;
  headD: string;
  trailD: string;
}

/**
 * Three curved rising arrows inspired directly by the Apokrin logo's signature
 * Blue, Green, and Orange interlocking directional arcs.
 * These remain hidden during idle display and emerge exclusively as the
 * welcome curtain lifts upward.
 */
const RISING_LOGO_ARROWS: RisingArrowSpec[] = [
  {
    // Left-flank Emerald Green upward sweeping arc
    id: 'arrow-green',
    startX: -148,
    startY: 36,
    endX: -178,
    endY: -270,
    startRotate: -16,
    endRotate: -6,
    scale: 1,
    delay: 0.02,
    duration: 0.92,
    gradStart: '#65A30D',
    gradEnd: '#16A34A',
    glowColor: 'rgba(22, 163, 74, 0.38)',
    pathD: 'M 42 114 C 14 78, 18 42, 46 18',
    headD: 'M 33 14 L 54 11 L 47 32 Z',
    trailD: 'M 50 132 C 22 96, 20 62, 36 34',
  },
  {
    // Center-right Electric Blue -> Cyan upward sweeping arc
    id: 'arrow-blue',
    startX: 18,
    startY: 52,
    endX: 34,
    endY: -310,
    startRotate: 4,
    endRotate: 12,
    scale: 1.08,
    delay: 0.08,
    duration: 0.96,
    gradStart: '#2563EB',
    gradEnd: '#06B6D4',
    glowColor: 'rgba(37, 99, 235, 0.42)',
    pathD: 'M 28 118 C 52 84, 54 46, 36 16',
    headD: 'M 24 26 L 35 7 L 48 25 Z',
    trailD: 'M 20 136 C 44 102, 50 68, 42 34',
  },
  {
    // Right-flank Warm Orange -> Amber upward sweeping arc
    id: 'arrow-orange',
    startX: 158,
    startY: 34,
    endX: 194,
    endY: -265,
    startRotate: 14,
    endRotate: 4,
    scale: 0.98,
    delay: 0.14,
    duration: 0.92,
    gradStart: '#F59E0B',
    gradEnd: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.38)',
    pathD: 'M 24 112 C 54 78, 52 42, 26 18',
    headD: 'M 19 31 L 18 11 L 39 16 Z',
    trailD: 'M 18 130 C 48 96, 52 60, 36 34',
  },
];

function shouldShowWelcomeOnLoad(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    // Allow explicit page reloads to replay the welcome animation
    if (navEntry?.type === 'reload') {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return true;
    }
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) !== '1';
  } catch {
    return true;
  }
}

function markWelcomeSeenInSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, '1');
  } catch {
    // Ignore storage access restrictions (e.g., strict privacy mode)
  }
}

function RisingLogoArrows({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
    >
      {RISING_LOGO_ARROWS.map((arrow) => (
        <motion.svg
          key={arrow.id}
          width="76"
          height="148"
          viewBox="0 0 76 148"
          fill="none"
          className="absolute overflow-visible will-change-transform"
          style={{
            filter: `drop-shadow(0 8px 18px ${arrow.glowColor})`,
          }}
          initial={{
            opacity: 0,
            x: arrow.startX,
            y: arrow.startY,
            rotate: arrow.startRotate,
            scale: arrow.scale * 0.72,
          }}
          animate={
            prefersReducedMotion
              ? {
                  opacity: [0, 0.9, 0],
                  x: arrow.startX,
                  y: arrow.startY - 40,
                  scale: arrow.scale,
                }
              : {
                  opacity: [0, 0.96, 0.92, 0],
                  x: [
                    arrow.startX,
                    (arrow.startX + arrow.endX) * 0.5 + (arrow.startX < 0 ? -16 : 16),
                    arrow.endX,
                  ],
                  y: [arrow.startY, arrow.startY - 120, arrow.endY],
                  rotate: [arrow.startRotate, (arrow.startRotate + arrow.endRotate) * 0.5, arrow.endRotate],
                  scale: [arrow.scale * 0.76, arrow.scale * 1.04, arrow.scale * 0.94],
                }
          }
          transition={{
            duration: prefersReducedMotion ? 0.45 : arrow.duration,
            delay: prefersReducedMotion ? 0 : arrow.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <defs>
            <linearGradient id={`${arrow.id}-stroke`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={arrow.gradStart} stopOpacity="0.15" />
              <stop offset="55%" stopColor={arrow.gradStart} stopOpacity="0.95" />
              <stop offset="100%" stopColor={arrow.gradEnd} stopOpacity="1" />
            </linearGradient>
            <linearGradient id={`${arrow.id}-trail`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={arrow.gradStart} stopOpacity="0" />
              <stop offset="100%" stopColor={arrow.gradEnd} stopOpacity="0.42" />
            </linearGradient>
          </defs>

          {/* Soft luminous motion trail */}
          <path
            d={arrow.trailD}
            stroke={`url(#${arrow.id}-trail)`}
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: 'blur(3.5px)' }}
          />

          {/* Primary curved arrow shaft */}
          <path
            d={arrow.pathD}
            stroke={`url(#${arrow.id}-stroke)`}
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Crisp tapered arrowhead */}
          <path d={arrow.headD} fill={arrow.gradEnd} />
        </motion.svg>
      ))}
    </div>
  );
}

export function WelcomeIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(() => shouldShowWelcomeOnLoad());
  const [isExiting, setIsExiting] = useState(false);

  const hasTriggeredRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const triggerExit = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    markWelcomeSeenInSession();
    setIsExiting(true);
  }, []);

  // Lock background page scroll while welcome overlay is active
  useEffect(() => {
    if (!isVisible) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
    };
  }, [isVisible]);

  // Automatic ~3-second transition timer (starts only once tab/iframe is visible)
  useEffect(() => {
    if (!isVisible || hasTriggeredRef.current) return;

    const delay = prefersReducedMotion ? 1600 : AUTO_EXIT_DELAY_MS;

    const startTimer = () => {
      if (hasTriggeredRef.current || autoTimerRef.current !== null) return;
      autoTimerRef.current = window.setTimeout(() => {
        triggerExit();
      }, delay);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimer();
      }
    };

    if (document.visibilityState === 'visible') {
      startTimer();
    } else {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isVisible, prefersReducedMotion, triggerExit]);

  // Scroll, touch swipe, and keyboard listeners to trigger upward exit
  useEffect(() => {
    if (!isVisible) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY > 6) {
        triggerExit();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (touchStartYRef.current === null) return;
      const currentY = event.touches[0]?.clientY;
      if (typeof currentY === 'number' && touchStartYRef.current - currentY > 24) {
        triggerExit();
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'PageDown' ||
        event.key === ' ' ||
        event.key === 'Enter' ||
        event.key === 'Escape'
      ) {
        event.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, triggerExit]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Apokrin"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden border-b border-[#DCE8F8] bg-gradient-to-b from-[#FFFFFF] via-[#F5F9FF] to-[#ECF4FF] px-6 py-10 shadow-[0_24px_64px_-12px_rgba(10,17,40,0.16)] will-change-transform sm:py-12"
      initial={{ y: '0%' }}
      animate={isExiting ? { y: '-104%' } : { y: '0%' }}
      transition={{
        duration: prefersReducedMotion ? 0.55 : 1.12,
        delay: isExiting && !prefersReducedMotion ? 0.14 : 0,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={() => {
        if (isExiting) {
          setIsVisible(false);
        }
      }}
    >
      {/* Subtle Light-Theme Ambient Lighting & Brand Color Wash */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[44%] h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.10) 0%, rgba(6, 182, 212, 0.08) 42%, rgba(255, 255, 255, 0) 74%)',
          }}
        />
        <div
          className="absolute left-[22%] top-[34%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(22, 163, 74, 0.075) 0%, rgba(255, 255, 255, 0) 70%)',
          }}
        />
        <div
          className="absolute left-[78%] top-[38%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(249, 115, 22, 0.075) 0%, rgba(255, 255, 255, 0) 70%)',
          }}
        />

        {/* Delicate Full-Viewport Ambient Sparkles */}
        <div className="absolute inset-0 opacity-55">
          <SparklesCore
            id="apokrin-welcome-ambient"
            minSize={0.55}
            maxSize={1.35}
            speed={0.45}
            particleDensity={32}
            particleColors={AMBIENT_SPARKLE_COLORS}
          />
        </div>
      </div>

      {/* Top Spacer for Visual Centering */}
      <div className="h-8 shrink-0" aria-hidden="true" />

      {/* Center Stage: Apokrin Wordmark + Aceternity UI Sparkles Beam + Rising Exit Arrows */}
      <div className="relative z-10 flex w-full max-w-[44rem] flex-col items-center justify-center text-center">
        {/* Brand-colored Rising Arrows (emerge exclusively during upward exit) */}
        <RisingLogoArrows active={isExiting} />

        {/* Subtle Brand Monogram Mark + Prominent "Apokrin" Wordmark */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={
            isExiting
              ? { opacity: 1, scale: 1.03, y: -14 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{
            duration: isExiting ? 0.5 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h1 className="font-display text-6xl font-extrabold tracking-[-0.04em] text-[#0A1128] select-none sm:text-7xl md:text-8xl lg:text-[6.25rem] leading-none">
            <span className="bg-gradient-to-r from-[#0A1128] via-[#1D4ED8] to-[#0891B2] bg-clip-text text-transparent">
              Apokrin
            </span>
          </h1>
        </motion.div>

        {/* Aceternity UI Signature Horizontal Light Beams & Radial-Masked Sparkles Curtain */}
        <motion.div
          className="relative mt-4 h-36 w-full max-w-[38rem] sm:mt-5 sm:h-44"
          initial={{ opacity: 0, scaleX: 0.88 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Wide soft luminous beam (blue -> cyan -> emerald -> orange hint) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-[3px] w-auto bg-gradient-to-r from-transparent via-[#2563EB] to-transparent blur-sm sm:inset-x-16"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px w-auto bg-gradient-to-r from-transparent via-[#2563EB] to-transparent sm:inset-x-16"
          />

          {/* Focused bright cyan/green/orange core line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-24 top-0 h-[5px] w-auto bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent blur-sm sm:inset-x-36"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-24 top-0 h-[1.5px] w-auto bg-gradient-to-r from-[#16A34A]/0 via-[#06B6D4] to-[#F97316]/0 sm:inset-x-36"
          />

          {/* Aceternity Sparkles Core Particle Field */}
          <div
            className="relative h-full w-full"
            style={{
              WebkitMaskImage:
                'radial-gradient(320px 155px at top center, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
              maskImage:
                'radial-gradient(320px 155px at top center, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
            }}
          >
            <SparklesCore
              id="apokrin-welcome-focal"
              minSize={0.85}
              maxSize={2.25}
              speed={0.85}
              particleDensity={135}
              particleColors={FOCAL_SPARKLE_COLORS}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Area: "Explore Website" CTA + Quiet Scroll Hint */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-3 pb-2"
        initial={{ opacity: 0, y: 14 }}
        animate={isExiting ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{
          duration: isExiting ? 0.35 : 0.55,
          delay: isExiting ? 0 : 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <button
          type="button"
          onClick={triggerExit}
          disabled={isExiting}
          className="group inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-full px-7 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:brightness-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECF4FF] disabled:pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            boxShadow:
              '0 4px 16px -2px rgba(37, 99, 235, 0.34), 0 1px 2px rgba(37, 99, 235, 0.25)',
          }}
        >
          <span>Explore Website</span>
          <motion.span
            aria-hidden="true"
            className="inline-flex items-center justify-center"
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, 2.5, 0], y: [0, -2.5, 0] }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.span>
        </button>

        <span className="text-xs font-medium tracking-wide text-[#64748B] select-none">
          Scroll down to enter
        </span>
      </motion.div>
    </motion.div>
  );
}
