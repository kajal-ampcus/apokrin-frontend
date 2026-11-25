import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import type { Eye } from 'lucide-react';
import { useTheme } from '../theme/themeConfig';

export interface PhilosophyPanelItem {
  id: 'vision' | 'mission' | 'conduct';
  number: string;
  title: string;
  shortTag: string;
  content: string;
  image: string;
  alt: string;
  icon: typeof Eye;
}

interface PhilosophyScrollStackProps {
  panels: PhilosophyPanelItem[];
}

const CARD_GAP = 16;
const CARD_HEIGHT = 430;
const EXPANDED_FLEX = 2.4;
const COLLAPSED_FLEX = 1;
const TOTAL_FLEX = EXPANDED_FLEX + COLLAPSED_FLEX * 2; // 4.4

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function computeHorizontalSlots(stageWidth: number, activeIndex: number) {
  const usable = Math.max(stageWidth - CARD_GAP * 2, 300);
  const widths = [0, 1, 2].map((i) =>
    (usable * (i === activeIndex ? EXPANDED_FLEX : COLLAPSED_FLEX)) / TOTAL_FLEX,
  );
  const lefts = [0, widths[0] + CARD_GAP, widths[0] + CARD_GAP + widths[1] + CARD_GAP];
  return { lefts, widths };
}

/**
 * Mobile / Tablet sticky scroll-stack card (< 1024px) with subtle scale & depth
 * on scroll while preserving exact card styling and click-to-expand behavior.
 */
function MobileScrollStackCard({
  panel,
  index,
  isExpanded,
  onSelect,
  prefersReducedMotion,
}: {
  panel: PhilosophyPanelItem;
  index: number;
  isExpanded: boolean;
  onSelect: () => void;
  prefersReducedMotion: boolean;
}) {
  const { themeConfig } = useTheme();
  const cardWrapRef = useRef<HTMLDivElement | null>(null);
  const Icon = panel.icon;

  const { scrollYProgress } = useScroll({
    target: cardWrapRef,
    offset: ['start 20%', 'end 10%'],
  });

  const [depthFactor, setDepthFactor] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (prefersReducedMotion) return;
    // Only cards behind the last card subtly scale back as the next card stacks over them
    if (index < 2) {
      setDepthFactor(clamp01(v));
    }
  });

  const scale = prefersReducedMotion || index === 2 ? 1 : lerp(1, 0.94, depthFactor);
  const stickyTopPx = 88 + index * 18;

  return (
    <div
      ref={cardWrapRef}
      className="sticky"
      style={{
        top: `${stickyTopPx}px`,
        zIndex: 10 + index * 10,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={isExpanded}
        style={{
          borderColor: isExpanded ? themeConfig.primary : 'rgba(255,255,255,0.22)',
          boxShadow: isExpanded
            ? `0 22px 46px -14px ${themeConfig.glow}`
            : '0 10px 28px -12px rgba(10,17,40,0.2)',
          transform: `scale(${scale.toFixed(4)})`,
          filter:
            prefersReducedMotion || index === 2
              ? undefined
              : `brightness(${lerp(1, 0.86, depthFactor).toFixed(3)})`,
          transformOrigin: 'top center',
        }}
        className="group relative isolate flex min-h-[240px] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] border-2 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
      >
        {/* Panel Background Image */}
        <img
          src={panel.image}
          alt={panel.alt}
          referrerPolicy="no-referrer"
          className={`pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out ${
            isExpanded ? 'scale-105' : 'scale-100 group-hover:scale-105'
          }`}
        />

        {/* Dark Scrim for High Readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
          style={{
            background: isExpanded
              ? 'linear-gradient(180deg, rgba(10,17,40,0.42) 0%, rgba(10,17,40,0.74) 45%, rgba(10,17,40,0.94) 100%)'
              : 'linear-gradient(180deg, rgba(10,17,40,0.52) 0%, rgba(10,17,40,0.78) 55%, rgba(10,17,40,0.92) 100%)',
          }}
        />

        {/* Theme Accent Top Bar on Active Panel */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-1.5 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
          }`}
          style={{ background: 'var(--color-btn-gradient)' }}
        />

        {/* Top Row: Icon + Number + Action Indicator */}
        <div className="flex w-full items-center justify-between gap-3 p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
              style={{
                background: isExpanded ? 'var(--color-btn-gradient)' : 'rgba(255,255,255,0.14)',
                color: '#FFFFFF',
              }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-mono text-xs font-bold tracking-wider text-white/80">
              {panel.number}
            </span>
          </div>

          <span
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm whitespace-nowrap"
            style={
              isExpanded
                ? {
                    borderColor: `${themeConfig.accent}88`,
                    backgroundColor: `${themeConfig.primary}44`,
                  }
                : undefined
            }
          >
            {isExpanded ? 'Active' : 'Click to Expand'}
          </span>
        </div>

        {/* Bottom Content Area */}
        <div className="w-full p-6 pt-0 sm:p-7 sm:pt-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: themeConfig.accent }}
          >
            {panel.shortTag}
          </p>

          <h3 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
            {panel.title}
          </h3>

          <div
            className={`grid transition-all duration-400 ease-out ${
              isExpanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                {panel.content}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function PhilosophyScrollStack({ panels }: PhilosophyScrollStackProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [activePanelId, setActivePanelId] = useState<PhilosophyPanelItem['id']>('vision');
  const [scrollMode, setScrollMode] = useState<'horizontal' | 'stacked'>('horizontal');
  const [stackedTopIdx, setStackedTopIdx] = useState<number>(0);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageWidthRef = useRef<number>(1120);
  const activePanelIdxRef = useRef<number>(0);
  const latestProgressRef = useRef<number>(0);

  const activeHorizontalIdx = Math.max(
    0,
    panels.findIndex((p) => p.id === activePanelId),
  );
  activePanelIdxRef.current = activeHorizontalIdx;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 12%', 'end 92%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 28,
    mass: 0.35,
  });

  // Apply GPU transforms for a given scroll progress p ∈ [0, 1] with zero React re-renders
  const applyDesktopFrame = useCallback(
    (p: number) => {
      if (prefersReducedMotion) return;
      const stageW = stageWidthRef.current;
      if (!stageW) return;

      const { lefts, widths } = computeHorizontalSlots(stageW, activePanelIdxRef.current);
      const stackW = Math.min(stageW, 960);
      const stackLeft = (stageW - stackW) / 2;

      // Phase 1 (0.04 -> 0.28): Morph smoothly from horizontal expandable row to centered Vision base card
      const morphT = easeInOutCubic((p - 0.04) / 0.24);
      // Phase 2 (0.32 -> 0.62): Mission rises and stacks cleanly onto Vision
      const missionT = easeOutCubic((p - 0.32) / 0.3);
      // Phase 3 (0.64 -> 0.94): Code of Conduct rises and stacks cleanly onto Mission
      const conductT = easeOutCubic((p - 0.64) / 0.3);

      const isScrollingStack = p >= 0.035;

      // Card 0: Vision (Base of stack: scales subtly & recedes as Mission and Code of Conduct stack over it)
      const c0 = cardRefs.current[0];
      if (c0) {
        const x0 = lerp(lefts[0], stackLeft, morphT);
        const w0 = lerp(widths[0], stackW, morphT);
        const y0 = -18 * missionT - 18 * conductT;
        const scale0 = 1 - 0.055 * missionT - 0.055 * conductT;
        const bright0 = 1 - 0.14 * missionT - 0.14 * conductT;

        c0.style.transition = isScrollingStack
          ? 'border-color 300ms ease, box-shadow 300ms ease'
          : 'transform 480ms cubic-bezier(0.16,1,0.3,1), width 480ms cubic-bezier(0.16,1,0.3,1), border-color 300ms ease, box-shadow 300ms ease';
        c0.style.width = `${w0.toFixed(1)}px`;
        c0.style.transform = `translate3d(${x0.toFixed(1)}px, ${y0.toFixed(1)}px, 0) scale(${scale0.toFixed(4)})`;
        c0.style.opacity = '1';
        c0.style.filter = bright0 < 0.995 ? `brightness(${bright0.toFixed(3)})` : 'none';
        c0.style.zIndex = '10';
        c0.style.pointerEvents = 'auto';
      }

      // Card 1: Mission (Glides from horizontal middle column into bottom stack queue, then rises onto Vision, then recedes for Conduct)
      const c1 = cardRefs.current[1];
      if (c1) {
        const x1 = lerp(lefts[1], stackLeft, morphT);
        const w1 = lerp(widths[1], stackW, morphT);

        // Queue downward during morph, then glide upward to stack at +18px, then recede to 0px as Conduct arrives
        const queueY = 390 * morphT;
        const riseY = lerp(queueY, 18, missionT);
        const y1 = riseY - 18 * conductT;

        // Fade down smoothly while queuing below fold, fade cleanly back in as it rises onto stack
        const exitAlpha = 1 - clamp01((morphT - 0.22) / 0.58);
        const enterAlpha = clamp01(missionT / 0.35);
        const opacity1 = p < 0.3 ? exitAlpha : Math.max(exitAlpha, enterAlpha);

        const enterScale = lerp(0.96, 1, missionT);
        const scale1 = p < 0.3 ? lerp(1, 0.96, morphT) : enterScale - 0.055 * conductT;
        const bright1 = 1 - 0.14 * conductT;

        c1.style.transition = isScrollingStack
          ? 'border-color 300ms ease, box-shadow 300ms ease'
          : 'transform 480ms cubic-bezier(0.16,1,0.3,1), width 480ms cubic-bezier(0.16,1,0.3,1), border-color 300ms ease, box-shadow 300ms ease';
        c1.style.width = `${w1.toFixed(1)}px`;
        c1.style.transform = `translate3d(${x1.toFixed(1)}px, ${y1.toFixed(1)}px, 0) scale(${scale1.toFixed(4)})`;
        c1.style.opacity = opacity1.toFixed(3);
        c1.style.filter = bright1 < 0.995 ? `brightness(${bright1.toFixed(3)})` : 'none';
        c1.style.zIndex = '20';
        c1.style.pointerEvents = opacity1 > 0.15 ? 'auto' : 'none';
      }

      // Card 2: Code of Conduct (Glides from right horizontal column into queue, then rises cleanly on top of Mission)
      const c2 = cardRefs.current[2];
      if (c2) {
        const x2 = lerp(lefts[2], stackLeft, morphT);
        const w2 = lerp(widths[2], stackW, morphT);

        const queueY = 440 * morphT;
        const y2 = lerp(queueY, 36, conductT);

        const exitAlpha = 1 - clamp01((morphT - 0.12) / 0.52);
        const enterAlpha = clamp01(conductT / 0.35);
        const opacity2 = p < 0.62 ? exitAlpha : Math.max(exitAlpha, enterAlpha);

        const scale2 = p < 0.62 ? lerp(1, 0.96, morphT) : lerp(0.96, 1, conductT);

        c2.style.transition = isScrollingStack
          ? 'border-color 300ms ease, box-shadow 300ms ease'
          : 'transform 480ms cubic-bezier(0.16,1,0.3,1), width 480ms cubic-bezier(0.16,1,0.3,1), border-color 300ms ease, box-shadow 300ms ease';
        c2.style.width = `${w2.toFixed(1)}px`;
        c2.style.transform = `translate3d(${x2.toFixed(1)}px, ${y2.toFixed(1)}px, 0) scale(${scale2.toFixed(4)})`;
        c2.style.opacity = opacity2.toFixed(3);
        c2.style.filter = 'none';
        c2.style.zIndex = '30';
        c2.style.pointerEvents = opacity2 > 0.15 ? 'auto' : 'none';
      }
    },
    [prefersReducedMotion],
  );

  // Sync smooth scroll progress to GPU transforms and discrete active-card state
  useMotionValueEvent(smoothProgress, 'change', (p) => {
    latestProgressRef.current = p;
    applyDesktopFrame(p);

    const nextMode = p >= 0.08 ? 'stacked' : 'horizontal';
    setScrollMode((prev) => (prev === nextMode ? prev : nextMode));

    const nextTop = p >= 0.72 ? 2 : p >= 0.4 ? 1 : 0;
    setStackedTopIdx((prev) => (prev === nextTop ? prev : nextTop));
  });

  // Measure desktop stage width synchronously before paint & keep responsive on resize
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const updateWidth = () => {
      const w = stageEl.clientWidth;
      if (w > 0) {
        stageWidthRef.current = w;
        applyDesktopFrame(latestProgressRef.current);
      }
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(stageEl);
    return () => ro.disconnect();
  }, [applyDesktopFrame, prefersReducedMotion]);

  // Re-apply horizontal widths smoothly when user clicks a card in horizontal mode
  useEffect(() => {
    if (prefersReducedMotion) return;
    applyDesktopFrame(latestProgressRef.current);
  }, [activePanelId, applyDesktopFrame, prefersReducedMotion]);

  // Click-to-expand handler: expands horizontally at rest, or smoothly scrolls to focus that card in stack mode
  const handleDesktopCardClick = (panel: PhilosophyPanelItem, idx: number) => {
    setActivePanelId(panel.id);

    if (scrollMode === 'stacked' && !prefersReducedMotion && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const trackTopDoc = window.scrollY + rect.top;
      const vh = window.innerHeight || 800;
      const startScroll = trackTopDoc - vh * 0.12;
      const endScroll = trackTopDoc + trackRef.current.offsetHeight - vh * 0.92;
      const travel = Math.max(endScroll - startScroll, 1);

      const targetProgress = idx === 0 ? 0.27 : idx === 1 ? 0.61 : 0.95;
      window.scrollTo({
        top: startScroll + travel * targetProgress,
        behavior: 'smooth',
      });
    }
  };

  // Reduced-motion static fallback (exact original 3 horizontal expandable panels)
  if (prefersReducedMotion) {
    return (
      <section
        aria-labelledby="philosophy-heading"
        className="apokrin-surface-section py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Our Mission, Vision &amp; Code of Conduct
            </span>

            <h2
              id="philosophy-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Our Mission Is To Make Your Business{' '}
              <span className="apokrin-gradient-text">Better Through Technology</span>
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-4 lg:h-[430px] lg:flex-row">
            {panels.map((panel) => {
              const isExpanded = activePanelId === panel.id;
              const Icon = panel.icon;

              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => setActivePanelId(panel.id)}
                  aria-expanded={isExpanded}
                  style={{
                    borderColor: isExpanded ? themeConfig.primary : 'rgba(255,255,255,0.22)',
                    boxShadow: isExpanded
                      ? `0 22px 46px -14px ${themeConfig.glow}`
                      : '0 10px 28px -12px rgba(10,17,40,0.2)',
                  }}
                  className={`group relative isolate flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[1.75rem] border-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:min-h-0 ${
                    isExpanded ? 'lg:flex-[2.4]' : 'lg:flex-[1]'
                  }`}
                >
                  <img
                    src={panel.image}
                    alt={panel.alt}
                    referrerPolicy="no-referrer"
                    className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                      background: isExpanded
                        ? 'linear-gradient(180deg, rgba(10,17,40,0.42) 0%, rgba(10,17,40,0.74) 45%, rgba(10,17,40,0.94) 100%)'
                        : 'linear-gradient(180deg, rgba(10,17,40,0.52) 0%, rgba(10,17,40,0.78) 55%, rgba(10,17,40,0.92) 100%)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1.5 ${
                      isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ background: 'var(--color-btn-gradient)' }}
                  />
                  <div className="flex w-full items-center justify-between gap-3 p-6 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/25 backdrop-blur-md"
                        style={{
                          background: isExpanded
                            ? 'var(--color-btn-gradient)'
                            : 'rgba(255,255,255,0.14)',
                          color: '#FFFFFF',
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-wider text-white/80">
                        {panel.number}
                      </span>
                    </div>
                    <span
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm whitespace-nowrap"
                      style={
                        isExpanded
                          ? {
                              borderColor: `${themeConfig.accent}88`,
                              backgroundColor: `${themeConfig.primary}44`,
                            }
                          : undefined
                      }
                    >
                      {isExpanded ? 'Active' : 'Click to Expand'}
                    </span>
                  </div>
                  <div className="w-full p-6 pt-0 sm:p-7 sm:pt-0">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: themeConfig.accent }}
                    >
                      {panel.shortTag}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
                      {panel.title}
                    </h3>
                    {isExpanded && (
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                        {panel.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="philosophy-heading"
      className="apokrin-surface-section py-14 sm:py-16 lg:py-0"
    >
      {/* Mobile & Tablet (< lg): Sticky Scroll Stack with Click-to-Expand */}
      <div className="apokrin-container lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
            Our Mission, Vision &amp; Code of Conduct
          </span>

          <h2
            id="philosophy-heading-mobile"
            style={{ textWrap: 'balance' }}
            className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
          >
            Our Mission Is To Make Your Business{' '}
            <span className="apokrin-gradient-text">Better Through Technology</span>
          </h2>
        </motion.div>

        <div className="relative mt-10 flex flex-col gap-6 pb-8">
          {panels.map((panel, idx) => (
            <MobileScrollStackCard
              key={panel.id}
              panel={panel}
              index={idx}
              isExpanded={activePanelId === panel.id}
              onSelect={() => setActivePanelId(panel.id)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>

      {/* Desktop (>= lg): Horizontal Expandable Cards -> React Bits Scroll Stack (Vision -> Mission -> Code of Conduct) */}
      <div ref={trackRef} className="relative hidden lg:block lg:h-[265vh]">
        <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12">
          <div className="apokrin-container">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Our Mission, Vision &amp; Code of Conduct
              </span>

              <h2
                id="philosophy-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Our Mission Is To Make Your Business{' '}
                <span className="apokrin-gradient-text">Better Through Technology</span>
              </h2>
            </motion.div>

            {/* Stage holding the 3 cards: starts horizontal expandable, stacks Vision -> Mission -> Code of Conduct on scroll */}
            <div
              ref={stageRef}
              className="relative mt-12 w-full"
              style={{ height: `${CARD_HEIGHT + 44}px` }}
            >
              {panels.map((panel, idx) => {
                const isExpanded =
                  scrollMode === 'stacked' ? true : activePanelId === panel.id;
                const isFrontCard =
                  scrollMode === 'stacked'
                    ? stackedTopIdx === idx
                    : activePanelId === panel.id;
                const Icon = panel.icon;

                return (
                  <button
                    key={panel.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleDesktopCardClick(panel, idx)}
                    aria-expanded={isExpanded}
                    style={{
                      height: `${CARD_HEIGHT}px`,
                      borderColor: isFrontCard ? themeConfig.primary : 'rgba(255,255,255,0.22)',
                      boxShadow: isFrontCard
                        ? `0 22px 46px -14px ${themeConfig.glow}`
                        : '0 14px 32px -12px rgba(10,17,40,0.28)',
                      transformOrigin: 'top center',
                      willChange: 'transform, opacity, width',
                    }}
                    className="group absolute left-0 top-0 isolate flex flex-col justify-between overflow-hidden rounded-[1.75rem] border-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                  >
                    {/* Panel Background Image */}
                    <img
                      src={panel.image}
                      alt={panel.alt}
                      referrerPolicy="no-referrer"
                      className={`pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isFrontCard ? 'scale-105' : 'scale-100 group-hover:scale-105'
                      }`}
                    />

                    {/* Dark Scrim for High Readability */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
                      style={{
                        background: isFrontCard
                          ? 'linear-gradient(180deg, rgba(10,17,40,0.42) 0%, rgba(10,17,40,0.74) 45%, rgba(10,17,40,0.94) 100%)'
                          : 'linear-gradient(180deg, rgba(10,17,40,0.52) 0%, rgba(10,17,40,0.78) 55%, rgba(10,17,40,0.92) 100%)',
                      }}
                    />

                    {/* Theme Accent Top Bar on Active Panel */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-1.5 transition-opacity duration-300 ${
                        isFrontCard ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                      }`}
                      style={{ background: 'var(--color-btn-gradient)' }}
                    />

                    {/* Top Row: Icon + Number + Action Indicator */}
                    <div className="flex w-full items-center justify-between gap-3 p-6 sm:p-7">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: isFrontCard
                              ? 'var(--color-btn-gradient)'
                              : 'rgba(255,255,255,0.14)',
                            color: '#FFFFFF',
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-xs font-bold tracking-wider text-white/80">
                          {panel.number}
                        </span>
                      </div>

                      <span
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm whitespace-nowrap"
                        style={
                          isFrontCard
                            ? {
                                borderColor: `${themeConfig.accent}88`,
                                backgroundColor: `${themeConfig.primary}44`,
                              }
                            : undefined
                        }
                      >
                        {isFrontCard ? 'Active' : 'Click to Expand'}
                      </span>
                    </div>

                    {/* Bottom Content Area (Clean Horizontal Readable Typography) */}
                    <div className="w-full p-6 pt-0 sm:p-7 sm:pt-0">
                      <p
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: themeConfig.accent }}
                      >
                        {panel.shortTag}
                      </p>

                      <h3 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
                        {panel.title}
                      </h3>

                      <div
                        className={`grid transition-all duration-400 ease-out ${
                          isExpanded
                            ? 'mt-3 grid-rows-[1fr] opacity-100'
                            : 'mt-0 grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                            {panel.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
