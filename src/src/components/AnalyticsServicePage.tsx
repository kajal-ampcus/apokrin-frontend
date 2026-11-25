import { useState } from 'react';
import { ArrowRight, Bell, Compass, Layers, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { AnalyticsFocusMode, AnalyticsShowcase3D } from './AnalyticsShowcase3D';

interface AnalyticsServicePageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const FOCUS_PRESETS: { id: AnalyticsFocusMode; label: string }[] = [
  { id: 'overview', label: 'Full Dashboard' },
  { id: 'charts', label: '3D Charts & Trends' },
  { id: 'core', label: 'Holographic Core' },
];

export function AnalyticsServicePage({
  onNavigate,
  onOpenBriefing,
}: AnalyticsServicePageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [focusMode, setFocusMode] = useState<AnalyticsFocusMode>('overview');

  return (
    <div className="relative overflow-x-hidden bg-[#F8FAFC]">
      {/* =====================================================================
          SECTION 1: COMPACT HERO BANNER (Preserving Redesigned Apokrin UI)
         ===================================================================== */}
      <section
        aria-labelledby="analytics-coming-soon-heading"
        className="apokrin-hero-light relative overflow-hidden border-b border-[#E2E8F0] py-8 sm:py-10 lg:py-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[620px] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(124,58,237,0.12) 48%, rgba(6,182,212,0.08) 100%)',
          }}
        />

        <div className="apokrin-container relative text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl"
          >
            {/* Gradient COMING SOON Badge */}
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-bold tracking-[0.14em] text-white shadow-[0_6px_18px_-4px_rgba(37,99,235,0.42)]"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #06B6D4 100%)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>COMING SOON</span>
            </span>

            <h1
              id="analytics-coming-soon-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Analytics{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #2563EB 0%, #7C3AED 52%, #06B6D4 100%)',
                }}
              >
                Solutions
              </span>
            </h1>

            <p className="mt-3 font-display text-lg font-bold tracking-tight text-[#1E293B] sm:text-xl">
              Something Intelligent Is Coming.
            </p>

            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
              We&apos;re building smarter analytics experiences to transform your business data into
              meaningful insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: CENTRAL 3D ANIMATED COMING SOON SHOWCASE (Compact & Balanced)
         ===================================================================== */}
      <section
        aria-label="Interactive 3D Analytics Preview"
        className="relative py-8 sm:py-10 lg:py-12"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2.25rem] border border-white/95 bg-gradient-to-br from-white/92 via-[#F4F8FF]/88 to-[#F3F0FF]/85 p-4 shadow-[0_24px_60px_-20px_rgba(37,99,235,0.22),0_8px_24px_-8px_rgba(124,58,237,0.12)] backdrop-blur-xl sm:p-6"
          >
            {/* Subtle Blue / Purple / Cyan Soft Glows Behind 3D Canvas */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full opacity-35 blur-3xl"
              style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 72%)' }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 72%)' }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-6 h-56 w-80 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 72%)' }}
            />

            {/* Top Interactive Controls Strip */}
            <div className="relative z-10 flex flex-col items-start justify-between gap-3 border-b border-[#E2E8F0]/80 pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #06B6D4 100%)',
                  }}
                >
                  <Compass className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold text-[#0A1128]">
                    Next-Gen Analytics Workspace
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Move pointer across the 3D glassmorphic platform to inspect telemetry depth
                  </p>
                </div>
              </div>

              <div
                role="tablist"
                aria-label="3D Analytics focus preset"
                className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white/85 p-1 backdrop-blur-sm"
              >
                {FOCUS_PRESETS.map((preset) => {
                  const isActive = focusMode === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setFocusMode(preset.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                        isActive ? 'text-white shadow-sm' : 'text-[#475569] hover:text-[#0A1128]'
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                'linear-gradient(135deg, #2563EB 0%, #7C3AED 60%, #06B6D4 100%)',
                            }
                          : undefined
                      }
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Central 3D Animated Glassmorphic Dashboard Stage */}
            <div className="relative z-10 mt-4 h-[350px] w-full overflow-hidden rounded-[1.5rem] border border-white/85 bg-gradient-to-b from-[#F8FBFF]/80 to-[#EEF4FF]/70 sm:h-[420px] lg:h-[460px]">
              <AnalyticsShowcase3D
                focusMode={focusMode}
                prefersReducedMotion={Boolean(prefersReducedMotion)}
              />
            </div>

            {/* Bottom Heading / Description & Compact Action Row */}
            <div className="relative z-10 mt-5 flex flex-col items-start justify-between gap-4 border-t border-[#E2E8F0]/80 pt-5 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wider text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #06B6D4 100%)',
                    }}
                  >
                    COMING SOON
                  </span>
                  <h2 className="font-display text-lg font-extrabold text-[#0A1128] sm:text-xl">
                    Analytics Solutions — Something Intelligent Is Coming.
                  </h2>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                  We&apos;re building smarter analytics experiences to transform your business data
                  into meaningful insights.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      'Data Platforms',
                      'Early access notification request for upcoming Apokrin Analytics Solutions.',
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_-6px_rgba(37,99,235,0.45)] transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  style={{
                    background:
                      'linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #06B6D4 100%)',
                  }}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  <span>Notify Me at Launch</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('data-analytics')}
                  className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  <Layers className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span>Explore Data Analytics</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
