import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { APOKRIN_SERVICES, type ApokrinServiceItem } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

const ServiceClayIcon3D = lazy(() =>
  import('./ServiceClayIcon3D').then((mod) => ({ default: mod.ServiceClayIcon3D })),
);

interface ServicesStepperSectionProps {
  onNavigateService?: (serviceId: ApokrinServiceItem['id']) => void;
}

function MiniClayStepGlyph({
  serviceId,
  isActive,
}: {
  serviceId: ApokrinServiceItem['id'];
  isActive: boolean;
}) {
  const { themeConfig } = useTheme();
  const accent = isActive ? themeConfig.primaryStrong : '#64748B';
  const secondary = isActive ? themeConfig.secondary : '#94A3B8';
  const softFill = isActive ? themeConfig.surfaceTint : '#CBD5E1';
  const accentSoft = isActive ? themeConfig.accent : '#CBD5E1';

  if (serviceId === 'staffing') {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true">
        <defs>
          <radialGradient
            id={`clay-head-${themeConfig.id}-${isActive}`}
            cx="35%"
            cy="30%"
            r="70%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor={themeConfig.surfaceSoft} />
            <stop offset="100%" stopColor={themeConfig.borderTint} />
          </radialGradient>
          <linearGradient
            id={`clay-body-${themeConfig.id}-${isActive}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={secondary} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <circle cx="13" cy="18" r="4.2" fill={`url(#clay-head-${themeConfig.id}-${isActive})`} />
        <rect x="7.5" y="23.5" width="11" height="10.5" rx="5.5" fill={accentSoft} />
        <circle cx="35" cy="18" r="4.2" fill={`url(#clay-head-${themeConfig.id}-${isActive})`} />
        <rect x="29.5" y="23.5" width="11" height="10.5" rx="5.5" fill={softFill} />
        <circle cx="24" cy="14" r="5.5" fill={`url(#clay-head-${themeConfig.id}-${isActive})`} />
        <rect
          x="16"
          y="21"
          width="16"
          height="14.5"
          rx="7.5"
          fill={`url(#clay-body-${themeConfig.id}-${isActive})`}
        />
        <path
          d="M 13 11 Q 24 4 35 11"
          fill="none"
          stroke={secondary}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (serviceId === 'mobility') {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true">
        <defs>
          <linearGradient
            id={`clay-phone-${themeConfig.id}-${isActive}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={themeConfig.surfaceTint} />
          </linearGradient>
        </defs>
        <rect x="6" y="24" width="11" height="9" rx="3" fill={softFill} />
        <rect
          x="15"
          y="8"
          width="18"
          height="32"
          rx="5"
          fill={`url(#clay-phone-${themeConfig.id}-${isActive})`}
          stroke={isActive ? themeConfig.borderTint : '#CBD5E1'}
          strokeWidth="1.2"
        />
        <rect x="17.5" y="11.5" width="13" height="23" rx="2.5" fill="#0F172A" />
        <rect x="19.5" y="14" width="4" height="4" rx="1" fill={accent} />
        <rect x="24.5" y="14" width="4" height="4" rx="1" fill={secondary} />
        <rect x="19.5" y="20" width="9" height="2.4" rx="1.2" fill={accentSoft} />
        <rect x="19.5" y="24" width="9" height="2.4" rx="1.2" fill={softFill} />
        <circle cx="38" cy="15" r="4.5" fill={softFill} />
        <circle cx="38" cy="15" r="2.2" fill={secondary} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true">
      <defs>
        <linearGradient
          id={`clay-case-${themeConfig.id}-${isActive}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={secondary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      <path
        d="M 18 16 V 13 A 6 6 0 0 1 30 13 V 16"
        fill="none"
        stroke={isActive ? themeConfig.accent : '#94A3B8'}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="9"
        y="16"
        width="30"
        height="21"
        rx="6"
        fill={`url(#clay-case-${themeConfig.id}-${isActive})`}
      />
      <rect
        x="9"
        y="16"
        width="30"
        height="9"
        rx="4.5"
        fill={isActive ? themeConfig.surfaceTint : '#E2E8F0'}
        opacity="0.92"
      />
      <rect x="21" y="22.5" width="6" height="5" rx="2.5" fill="#FFFFFF" />
      <circle cx="24" cy="25" r="1.4" fill={secondary} />
      <circle cx="10" cy="11" r="2.6" fill={secondary} />
      <circle cx="38" cy="12" r="2.6" fill={softFill} />
    </svg>
  );
}

export function ServicesStepperSection(_props: ServicesStepperSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeService = APOKRIN_SERVICES[activeIndex];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isHovered || hasInteracted || prefersReducedMotion) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % APOKRIN_SERVICES.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isVisible, isHovered, hasInteracted, prefersReducedMotion]);

  const handleSelectStep = (idx: number) => {
    setHasInteracted(true);
    setActiveIndex(idx);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % APOKRIN_SERVICES.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + APOKRIN_SERVICES.length) % APOKRIN_SERVICES.length;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      handleSelectStep(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  const railFillPercent = activeIndex === 0 ? 12 : activeIndex === 1 ? 52 : 100;

  return (
    <section
      ref={sectionRef}
      id="services-stepper"
      aria-labelledby="services-heading"
      className="apokrin-surface-stepper-section relative overflow-hidden border-t border-[#E2E8F0]"
    >
      {/* Subtle 3D Claymorphism floating geometric accents */}
      <div
        aria-hidden="true"
        className="apokrin-geo-float apokrin-clay-orb pointer-events-none absolute -left-8 top-16 hidden h-20 w-20 rounded-full opacity-80 lg:block"
      />
      <div
        aria-hidden="true"
        className="apokrin-geo-float-delayed apokrin-clay-orb pointer-events-none absolute right-10 top-14 hidden h-14 w-14 rotate-12 rounded-2xl opacity-80 lg:block"
      />
      <div
        aria-hidden="true"
        className="apokrin-geo-float apokrin-clay-orb pointer-events-none absolute bottom-10 right-[6%] hidden h-11 w-22 -rotate-6 rounded-full opacity-75 lg:block"
      />

      <div className="apokrin-container relative py-12 lg:py-16">
        {/* Centered Section Heading */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
            Our Services
          </span>

          <h2
            id="services-heading"
            style={{ textWrap: 'balance' }}
            className="apokrin-heading-section mt-3 font-display font-extrabold text-[#0A1128]"
          >
            Our Mission Is to Make Staffing Operations{' '}
            <span className="apokrin-gradient-text">Simpler Through Technology</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
            Apokrin brings essential staffing technology together to help businesses manage
            recruitment, vendor relationships, and workforce operations more effectively.
          </p>
        </motion.div>

        {/* Two-Column Layout: 35% Vertical Stepper (Left) + 65% Active Service Card (Right) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-8 grid grid-cols-1 items-center gap-6 md:grid-cols-[38%_minmax(0,1fr)] md:gap-7 lg:mt-10 lg:grid-cols-[35%_minmax(0,1fr)] lg:gap-8"
        >
          {/* Left Column (35%): Vertical Connected Stepper */}
          <div
            role="tablist"
            aria-label="Apokrin Services"
            aria-orientation="vertical"
            className="relative flex flex-col justify-between gap-4 pl-8 sm:pl-9"
          >
            {/* Continuous Vertical Clay Track */}
            <div
              aria-hidden="true"
              className="absolute bottom-10 left-[15px] top-10 w-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-track)',
                boxShadow: 'inset 1px 1px 3px var(--color-clay-shadow)',
              }}
            >
              {/* Animated Progress Line */}
              <motion.div
                className="w-full rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  boxShadow: '0 0 12px var(--color-glow)',
                }}
                initial={false}
                animate={{ height: `${railFillPercent}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                }
              />
            </div>

            {APOKRIN_SERVICES.map((service, idx) => {
              const isActive = idx === activeIndex;
              const isCompletedOrActive = idx <= activeIndex;

              return (
                <motion.button
                  key={service.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`service-tab-${service.id}`}
                  aria-selected={isActive}
                  aria-controls={`service-panel-${service.id}`}
                  onClick={() => handleSelectStep(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group relative rounded-[1.4rem] p-[2px] text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2 ${
                    isActive ? '-translate-y-0.5' : 'hover:-translate-y-0.5'
                  }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, var(--color-track) 100%)',
                    boxShadow: isActive
                      ? '10px 16px 32px var(--color-clay-shadow-strong), -4px -4px 16px rgba(255,255,255,0.96)'
                      : '7px 10px 22px var(--color-clay-shadow), -4px -4px 12px rgba(255,255,255,0.92)',
                  }}
                >
                  {/* Numbered Circular Indicator anchored on the vertical line */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[34px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-all duration-300 ${
                      isActive ? 'scale-110 text-white ring-4 ring-white' : 'ring-4'
                    }`}
                    style={
                      isActive
                        ? {
                            background: 'var(--color-btn-gradient)',
                            boxShadow: '0 6px 16px var(--color-glow)',
                          }
                        : isCompletedOrActive
                          ? {
                              backgroundColor: 'var(--color-surface-tint)',
                              color: 'var(--color-primary-strong)',
                              boxShadow: '0 3px 10px var(--color-clay-shadow)',
                            }
                          : {
                              backgroundColor: '#FFFFFF',
                              color: '#64748B',
                              border: '1px solid var(--color-track)',
                              boxShadow: '0 3px 10px var(--color-clay-shadow)',
                            }
                    }
                  >
                    {service.stepNumber}
                  </span>

                  {/* Inner Clay Step Surface */}
                  <div
                    className="flex items-center gap-4 rounded-[calc(1.4rem-2px)] px-4 py-3.5 transition-colors duration-300 sm:px-5 sm:py-4"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 52%, var(--color-surface-soft) 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 100%)',
                      boxShadow: isActive
                        ? 'inset 0 2px 6px rgba(255,255,255,1), inset -3px -4px 10px var(--color-clay-inset)'
                        : 'inset 0 2px 4px rgba(255,255,255,0.98), inset -2px -4px 8px var(--color-clay-inset)',
                    }}
                  >
                    {/* 3D Claymorphism Icon Container */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive ? 'scale-105' : 'group-hover:scale-105'
                      }`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface-soft) 50%, var(--color-surface-tint) 100%)'
                          : 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 100%)',
                        boxShadow: isActive
                          ? '6px 10px 18px var(--color-clay-shadow-strong), -3px -3px 10px rgba(255,255,255,0.98), inset 0 2px 4px rgba(255,255,255,1)'
                          : '5px 8px 14px var(--color-clay-shadow), -3px -3px 10px rgba(255,255,255,0.95), inset 0 2px 4px rgba(255,255,255,0.96)',
                      }}
                    >
                      <MiniClayStepGlyph serviceId={service.id} isActive={isActive} />
                    </div>

                    {/* Step Title & Sub-label beside the icon */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-[11px] font-bold uppercase tracking-wider transition-colors"
                          style={{
                            color: isActive ? 'var(--color-primary-strong)' : '#64748B',
                          }}
                        >
                          Step {service.stepNumber}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            background: isActive
                              ? 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
                              : 'transparent',
                          }}
                        />
                      </div>
                      <p
                        className={`mt-0.5 font-display text-lg font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[#0A1128]'
                            : 'text-[#334155] group-hover:text-[#0A1128]'
                        }`}
                      >
                        {service.name}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Column (65%): Large White Claymorphism Active Service Card */}
          <div
            role="tabpanel"
            id={`service-panel-${activeService.id}`}
            aria-labelledby={`service-tab-${activeService.id}`}
            className="apokrin-clay-panel group relative rounded-[2rem] border border-white/90 p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Subtle Theme Ambient Glow inside Card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, var(--color-glow-soft) 0%, var(--color-glow-secondary) 50%, transparent 72%)',
              }}
            />

            <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-12 lg:gap-8">
              {/* Text Side (Left inside Card) */}
              <div className="sm:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold text-white"
                        style={{
                          background: 'var(--color-btn-gradient)',
                          boxShadow: '0 6px 16px var(--color-glow)',
                        }}
                      >
                        {activeService.stepNumber}
                      </span>
                      <span
                        className="font-mono text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--color-primary-strong)' }}
                      >
                        Step {activeService.stepNumber} · {activeService.name}
                      </span>
                    </div>

                    <h3 className="apokrin-heading-card mt-4 font-display font-extrabold text-[#0A1128]">
                      {activeService.name}
                    </h3>

                    <p className="mt-3.5 text-base leading-relaxed text-[#475569]">
                      {activeService.description}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        {APOKRIN_SERVICES.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectStep(idx)}
                            aria-label={`Select Step ${item.stepNumber}: ${item.name}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              idx === activeIndex ? 'w-8' : 'w-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                            }`}
                            style={
                              idx === activeIndex
                                ? {
                                    background:
                                      'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Large 3D Claymorphism Visual Side (Right inside Card) */}
              <div className="sm:col-span-5">
                <div
                  className="relative rounded-[1.75rem] p-3"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-surface-soft) 0%, var(--color-surface) 52%, var(--color-surface-alt) 100%)',
                    boxShadow:
                      'inset 4px 6px 16px var(--color-clay-inset), inset -4px -4px 14px rgba(255,255,255,0.96)',
                  }}
                >
                  <Suspense
                    fallback={
                      <div className="flex h-[240px] w-full items-center justify-center sm:h-[260px]">
                        <div className="apokrin-clay-card flex h-36 w-36 items-center justify-center rounded-3xl">
                          <span
                            className="font-display text-lg font-bold"
                            style={{ color: 'var(--color-primary-strong)' }}
                          >
                            {activeService.name}
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <ServiceClayIcon3D activeService={activeService.id} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
