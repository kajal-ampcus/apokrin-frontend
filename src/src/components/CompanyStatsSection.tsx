import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { COMPANY_STATISTICS, type CompanyStatItem } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

function StatClayBadgeGlyph({ id }: { id: string }) {
  const { themeConfig } = useTheme();
  const primary = themeConfig.primaryStrong;
  const secondary = themeConfig.secondary;
  const accent = themeConfig.accent;
  const tint = themeConfig.borderTint;

  if (id === 'stat-satisfaction') {
    return (
      <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id={`stat-g-1-${themeConfig.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondary} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="13" fill={`url(#stat-g-1-${themeConfig.id})`} opacity="0.16" />
        <path
          d="M12.5 18.5l3.5 3.5 7.5-8"
          fill="none"
          stroke={`url(#stat-g-1-${themeConfig.id})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === 'stat-projects') {
    return (
      <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id={`stat-g-2-${themeConfig.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        <rect x="8" y="9" width="9" height="9" rx="3" fill={`url(#stat-g-2-${themeConfig.id})`} />
        <rect x="19" y="9" width="9" height="9" rx="3" fill={accent} />
        <rect x="8" y="20" width="9" height="8" rx="3" fill={tint} />
        <rect
          x="19"
          y="20"
          width="9"
          height="8"
          rx="3"
          fill={`url(#stat-g-2-${themeConfig.id})`}
          opacity="0.85"
        />
      </svg>
    );
  }
  if (id === 'stat-countries') {
    return (
      <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id={`stat-g-3-${themeConfig.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondary} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>
        </defs>
        <circle
          cx="18"
          cy="18"
          r="10"
          fill="none"
          stroke={`url(#stat-g-3-${themeConfig.id})`}
          strokeWidth="2.4"
        />
        <ellipse
          cx="18"
          cy="18"
          rx="5"
          ry="10"
          fill="none"
          stroke={accent}
          strokeWidth="2"
        />
        <path d="M8.5 18h19" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
      <defs>
        <linearGradient id={`stat-g-4-${themeConfig.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <path
        d="M18 8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L18 22.2l-5.6 3 1.1-6.2L9 14.6l6.2-.9L18 8z"
        fill={`url(#stat-g-4-${themeConfig.id})`}
      />
    </svg>
  );
}

const COUNT_DURATION_MS = 2400;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedStatCard({
  stat,
  index,
  count,
  prefersReducedMotion,
}: {
  stat: CompanyStatItem;
  index: number;
  count: number;
  prefersReducedMotion: boolean;
}) {
  const bobClass = `apokrin-clay-bob-${index % 4}`;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <div
        className={`${bobClass} apokrin-clay-panel group relative flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-white/90 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1.5`}
      >
        {/* Top Clay Emblem */}
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface-soft) 100%)',
            boxShadow:
              '5px 8px 16px var(--color-clay-shadow), -3px -3px 10px rgba(255,255,255,0.98), inset 0 2px 4px rgba(255,255,255,1)',
          }}
        >
          <StatClayBadgeGlyph id={stat.id} />
        </div>

        {/* Centered Theme-Gradient Count-Up Metric */}
        <div
          aria-label={stat.displayValue}
          className="apokrin-gradient-text font-display text-4xl font-extrabold tracking-tight tabular-nums sm:text-[2.4rem]"
        >
          {count}
          {stat.suffix}
        </div>

        {/* Metric Label */}
        <p className="mt-2.5 font-display text-sm font-bold tracking-tight text-[#0A1128] sm:text-base">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

export function CompanyStatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const [counts, setCounts] = useState<number[]>(() =>
    COMPANY_STATISTICS.map((stat) =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? stat.target
        : 0,
    ),
  );
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    if (mq.matches) {
      hasCompletedRef.current = true;
      setCounts(COMPANY_STATISTICS.map((stat) => stat.target));
    }
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        hasCompletedRef.current = true;
        setCounts(COMPANY_STATISTICS.map((stat) => stat.target));
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasEnteredView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (!hasEnteredView || hasCompletedRef.current) return;

    if (prefersReducedMotion) {
      hasCompletedRef.current = true;
      setCounts(COMPANY_STATISTICS.map((stat) => stat.target));
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, Math.max(0, elapsed / COUNT_DURATION_MS));
      const easedProgress = easeOutCubic(rawProgress);

      setCounts(
        COMPANY_STATISTICS.map((stat) =>
          rawProgress >= 1
            ? stat.target
            : Math.min(stat.target, Math.round(stat.target * easedProgress)),
        ),
      );

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        hasCompletedRef.current = true;
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [hasEnteredView, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="company-impact"
      aria-labelledby="company-impact-heading"
      className="apokrin-surface-stats-section relative overflow-hidden border-t border-[#E2E8F0]"
    >
      {/* Subtle floating 3D clay geometric elements */}
      <div
        aria-hidden="true"
        className="apokrin-geo-float apokrin-clay-orb pointer-events-none absolute -left-6 top-16 hidden h-16 w-16 rounded-2xl rotate-12 opacity-85 lg:block"
      />
      <div
        aria-hidden="true"
        className="apokrin-geo-float-delayed apokrin-clay-orb pointer-events-none absolute bottom-12 right-8 hidden h-14 w-14 rounded-full opacity-85 lg:block"
      />

      <div className="apokrin-container relative py-14 lg:py-20">
        {/* Centered Heading & Description */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
            Our Impact
          </span>

          <h2
            id="company-impact-heading"
            style={{ textWrap: 'balance' }}
            className="mt-3.5 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
          >
            One Platform. Integrated Staffing.{' '}
            <span className="apokrin-gradient-text">Better Workforce Management.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
            Apokrin combines recruitment and vendor management capabilities to support the evolving
            staffing requirements of agencies and enterprise organizations.
          </p>
        </motion.div>

        {/* Four Interconnected Claymorphism Statistics Cards */}
        <div className="relative mt-10 lg:mt-12">
          {/* Subtle desktop connector beam linking the four cards */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <div
              className="h-2.5 w-full rounded-full opacity-75"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-surface-tint) 0%, var(--color-surface-secondary) 50%, var(--color-surface-alt) 100%)',
                boxShadow:
                  'inset 0 1px 3px var(--color-clay-shadow), 0 4px 12px var(--color-glow-soft)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {COMPANY_STATISTICS.map((stat, idx) => (
              <AnimatedStatCard
                key={stat.id}
                stat={stat}
                index={idx}
                count={counts[idx] ?? 0}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
