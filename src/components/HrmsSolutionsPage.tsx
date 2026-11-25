import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Workflow,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import hrmsHeroBackdropImg from '../assets/images/hrms_hero_backdrop_1794911012390.jpg';
import hrmsWorkforceImg from '../assets/images/hrms_workforce_platform_1794911012639.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

interface HrmsSolutionsPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface WhyChooseHrmsItem {
  id: string;
  number: string;
  title: string;
  description: string;
  blueprintSubtitle: string;
  pillars: string[];
  icon: typeof Layers;
}

const WHY_CHOOSE_HRMS: WhyChooseHrmsItem[] = [
  {
    id: 'unified-hr',
    number: '01',
    title: 'Unified HR Operations',
    description:
      'Apokrin’s HRMS consolidates all core HR functions—like payroll, leave, and attendance—into a single, centralized platform to streamline daily operations.',
    blueprintSubtitle: 'Centralized Workforce Hub',
    pillars: [
      'Integrated payroll, leave & attendance workflows',
      'Unified employee directory & records',
      'Consistent cross-department operations',
    ],
    icon: Layers,
  },
  {
    id: 'strategic-enablement',
    number: '02',
    title: 'Strategic HR Enablement',
    description:
      'Empower your HR teams to shift focus from manual tasks to strategic initiatives like culture building, employee engagement, and talent retention.',
    blueprintSubtitle: 'Culture, Engagement & Retention',
    pillars: [
      'Reduce repetitive manual administration',
      'Support culture & talent retention initiatives',
      'Elevate employee experience across teams',
    ],
    icon: Award,
  },
  {
    id: 'automation-rbac',
    number: '03',
    title: 'Automation & Role-Based Access',
    description:
      'Automate approvals, notifications, and workflows with configurable access controls for different employee roles and departments.',
    blueprintSubtitle: 'Configurable Workflows & Security',
    pillars: [
      'Automated multi-step approvals & alerts',
      'Role-based access across departments',
      'Structured accountability across HR workflows',
    ],
    icon: Lock,
  },
  {
    id: 'insights-compliance',
    number: '04',
    title: 'Real-Time Insights & Compliance',
    description:
      'Make smarter decisions with built-in analytics while ensuring HR compliance with labor laws and company policies.',
    blueprintSubtitle: 'Workforce Intelligence & Governance',
    pillars: [
      'Built-in real-time workforce analytics',
      'Labor law & policy compliance tracking',
      'Audit-ready documentation & reporting',
    ],
    icon: BarChart3,
  },
];

interface HrmsCapabilityItem {
  title: string;
  description: string;
}

const TALENT_ACQUISITION_CAPABILITIES: HrmsCapabilityItem[] = [
  {
    title: 'Recruitment Process Automation',
    description:
      'Leverage AI tools for faster candidate screening, shortlisting, and engagement.',
  },
  {
    title: 'Applicant Tracking Systems (ATS)',
    description: 'Streamline hiring workflows with centralized tracking and communication.',
  },
  {
    title: 'Onboarding Portals',
    description: 'Deliver seamless digital onboarding experiences across devices and locations.',
  },
  {
    title: 'Employer Branding',
    description: 'Strengthen your brand with consistent messaging and candidate experiences.',
  },
  {
    title: 'Diversity & Inclusion',
    description: 'Embed inclusive practices into hiring strategies and team-building efforts.',
  },
];

const LIFECYCLE_CAPABILITIES: HrmsCapabilityItem[] = [
  {
    title: 'HRIS Integration',
    description: 'Centralize employee records, benefits, and payroll with smart HR systems.',
  },
  {
    title: 'Performance Management',
    description: 'Track goals, deliver continuous feedback, and conduct effective reviews.',
  },
  {
    title: 'Learning & Development',
    description: 'Enable upskilling through personalized learning paths and e-learning platforms.',
  },
  {
    title: 'Employee Engagement Tools',
    description:
      'Foster collaboration and satisfaction through surveys, chats, and recognition tools.',
  },
  {
    title: 'Compliance & Workforce Analytics',
    description: 'Ensure labor law adherence while gaining insights into workforce trends and needs.',
  },
];

function SectionBadgeWithDot({ label }: { label: string }) {
  return (
    <span className="apokrin-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ background: 'var(--color-btn-gradient)' }}
      />
      <span>{label}</span>
    </span>
  );
}

export function HrmsSolutionsPage({ onNavigate, onOpenBriefing }: HrmsSolutionsPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [introImgFailed, setIntroImgFailed] = useState(false);
  const [activeWhyIdx, setActiveWhyIdx] = useState<number>(0);

  const activeWhy = WHY_CHOOSE_HRMS[activeWhyIdx] ?? WHY_CHOOSE_HRMS[0];

  const scrollToCapabilities = () => {
    const target = document.getElementById('hrms-core-capabilities');
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white">
      {/* =====================================================================
          SECTION 1: HERO – APOKRIN HRMS SOLUTION (Background Image + Dark Overlay)
         ===================================================================== */}
      <section
        aria-labelledby="hrms-hero-heading"
        className="relative isolate overflow-hidden border-b border-[#E2E8F0] bg-[#0A1128]"
      >
        {!heroImgFailed && (
          <img
            src={hrmsHeroBackdropImg}
            alt="Modern enterprise technology atrium supporting collaborative people-first operations"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55"
          />
        )}

        {/* Dark Scrim + Theme Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,17,40,0.78) 0%, rgba(10,17,40,0.72) 52%, rgba(10,17,40,0.88) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${themeConfig.primary} 0%, transparent 70%)`,
          }}
        />

        <div className="apokrin-container relative py-12 sm:py-16 lg:py-20">
          {/* Floating Left Intelligent HR Cards (Desktop) */}
          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-6 top-10 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.secondary} 100%)`,
              }}
            >
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Unified HR Platform</p>
              <p className="text-[11px] text-slate-300">Payroll · Leave · Attendance</p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="pointer-events-none absolute bottom-10 left-12 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <Workflow className="h-4 w-4" style={{ color: themeConfig.accent }} />
            <span className="text-xs font-semibold">AI Recruitment &amp; ATS</span>
          </motion.div>

          {/* Floating Right Lifecycle & Governance Cards (Desktop) */}
          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="pointer-events-none absolute right-6 top-10 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.secondary} 0%, ${themeConfig.primaryStrong} 100%)`,
              }}
            >
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Role-Based Governance</p>
              <p className="text-[11px] text-slate-300">Compliance &amp; Workforce Analytics</p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="pointer-events-none absolute bottom-10 right-14 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <Award className="h-4 w-4" style={{ color: themeConfig.accent }} />
            <span className="text-xs font-semibold">Engagement &amp; Retention</span>
          </motion.div>

          {/* Centered Hero Typography & Actions */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span
              className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm"
              style={{
                borderColor: `${themeConfig.accent}66`,
                backgroundColor: `${themeConfig.primary}28`,
              }}
            >
              Intelligent Workforce Platform
            </span>

            <h1
              id="hrms-hero-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-hero mt-5 font-display font-extrabold text-white"
            >
              Apokrin{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 48%, ${themeConfig.secondary} 100%)`,
                }}
              >
                HRMS Solution
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
              Streamline HR operations, enhance employee engagement, and unlock business growth with
              Apokrin&apos;s intelligent HRMS built for the IT industry.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={scrollToCapabilities}
                className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
              >
                <span>Explore Capabilities</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: INTRODUCTION – INTELLIGENT HRMS SOLUTIONS FOR THE IT INDUSTRY
         ===================================================================== */}
      <section
        aria-labelledby="hrms-intro-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left 7 Cols: Heading, Copy & Integrated System Highlights */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <div>
                <SectionBadgeWithDot label="Human Resource Management" />
              </div>

              <h2
                id="hrms-intro-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Intelligent HRMS Solutions for the{' '}
                <span className="apokrin-gradient-text">IT Industry</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                Streamline HR operations, enhance employee engagement, and unlock business growth
                with Apokrin&apos;s intelligent HRMS built for the IT industry. Our platform
                empowers businesses to manage recruitment, onboarding, payroll, performance, and
                compliance from a single, integrated system — enabling smarter decision-making and
                a more productive workforce.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {[
                  {
                    title: 'Recruitment & Onboarding',
                    detail: 'Attract, track, and onboard technical talent cleanly.',
                    icon: UserPlus,
                  },
                  {
                    title: 'Payroll & Performance',
                    detail: 'Unified payroll accuracy alongside continuous goal reviews.',
                    icon: ClipboardCheck,
                  },
                  {
                    title: 'Compliance & Analytics',
                    detail: 'Built-in compliance tracking and real-time HR intelligence.',
                    icon: BarChart3,
                  },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon
                          className="h-4 w-4 shrink-0"
                          style={{ color: themeConfig.primaryStrong }}
                          aria-hidden="true"
                        />
                        <p className="font-display text-xs font-extrabold text-[#0A1128] sm:text-sm">
                          {item.title}
                        </p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right 5 Cols: Intelligent Workforce Visual Inside Clay Frame */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="apokrin-clay-panel flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/95 p-3">
                <div className="relative flex-1 overflow-hidden rounded-[1.45rem] bg-[#0A1128]">
                  {introImgFailed ? (
                    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 p-8 text-center text-white">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      >
                        <Users className="h-7 w-7 text-white" aria-hidden="true" />
                      </div>
                      <p className="font-display text-base font-bold">
                        Integrated HR &amp; Workforce Intelligence
                      </p>
                      <p className="max-w-xs text-xs text-slate-300">
                        Unified recruitment, onboarding, payroll, performance, and compliance
                        operations.
                      </p>
                    </div>
                  ) : (
                    <img
                      src={hrmsWorkforceImg}
                      alt="Enterprise HR and IT leadership team reviewing integrated workforce management workflows"
                      referrerPolicy="no-referrer"
                      onError={() => setIntroImgFailed(true)}
                      className="aspect-[4/3] h-full w-full object-cover lg:min-h-[320px]"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 px-3 pb-1.5 pt-3 text-xs font-semibold text-[#475569]">
                  <span>Single Integrated HR System</span>
                  <span className="font-mono text-[11px]" style={{ color: themeConfig.primaryStrong }}>
                    Hire · Onboard · Engage · Retain
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHY CHOOSE US? (4 Pillars + Interactive Blueprint Spotlight)
         ===================================================================== */}
      <section
        aria-labelledby="hrms-why-heading"
        className="apokrin-clay-section border-b border-[#E2E8F0] py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Why Choose Us?" />

            <h2
              id="hrms-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              People-Centric HR Built for{' '}
              <span className="apokrin-gradient-text">Automation, Clarity &amp; Compliance</span>
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: 2x2 Interactive HRMS Feature Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              {WHY_CHOOSE_HRMS.map((item, idx) => {
                const ItemIcon = item.icon;
                const isSelected = activeWhyIdx === idx;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveWhyIdx(idx)}
                    onMouseEnter={() => setActiveWhyIdx(idx)}
                    aria-pressed={isSelected}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    style={{
                      borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                      boxShadow: isSelected
                        ? `0 16px 34px -14px ${themeConfig.glow}`
                        : '0 6px 18px -10px rgba(15,23,42,0.06)',
                    }}
                    className="flex h-full flex-col justify-between rounded-[1.5rem] border bg-white p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] sm:p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl transition-colors"
                          style={
                            isSelected
                              ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                              : {
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: themeConfig.primaryStrong,
                                }
                          }
                        >
                          <ItemIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#64748B]">
                          {item.number}
                        </span>
                      </div>

                      <h3
                        className="mt-4 font-display text-base font-extrabold sm:text-lg"
                        style={{ color: isSelected ? themeConfig.primaryStrong : '#0A1128' }}
                      >
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right 5 Cols: Synchronized HR Architecture Blueprint */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWhy.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="apokrin-clay-panel relative flex h-full flex-col justify-between overflow-hidden rounded-[1.85rem] border border-white/95 p-6 sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="apokrin-badge rounded-full px-3 py-1 text-[11px] font-semibold">
                        Advantage {activeWhy.number} / 04
                      </span>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      >
                        <activeWhy.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>

                    <p
                      className="mt-5 font-mono text-xs font-semibold"
                      style={{ color: themeConfig.primaryStrong }}
                    >
                      {activeWhy.blueprintSubtitle}
                    </p>

                    <h3 className="mt-1.5 font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      {activeWhy.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                      {activeWhy.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-[#E2E8F0] pt-5">
                      {activeWhy.pillars.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-2.5 text-sm font-medium text-[#0A1128]"
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0"
                            style={{ color: themeConfig.primaryStrong }}
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBriefing(
                          'Cloud Engineering',
                          `HRMS consultation focused on: ${activeWhy.title}.`,
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      style={{ color: themeConfig.primaryStrong }}
                    >
                      <span>Schedule an HRMS walkthrough</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: CTA SECTION – READY TO ELEVATE YOUR HR OPERATIONS?
         ===================================================================== */}
      <section aria-labelledby="hrms-mid-cta" className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-10 text-center sm:px-12 sm:py-12"
          >
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
            >
              <Users className="h-5.5 w-5.5" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
            >
              <Sparkles className="h-5.5 w-5.5" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <SectionBadgeWithDot label="Get Started With Apokrin" />

              <h2
                id="hrms-mid-cta"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Ready to elevate your HR operations with{' '}
                <span className="apokrin-gradient-text">Apokrin&apos;s HRMS?</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                Unify talent acquisition, digital onboarding, payroll, performance, and compliance
                inside one intelligent platform built for technical teams.
              </p>

              <div className="mt-7 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="apokrin-btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Contact Sales</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: CORE CAPABILITIES (Two Balanced White Capability Cards)
         ===================================================================== */}
      <section
        id="hrms-core-capabilities"
        aria-labelledby="hrms-capabilities-heading"
        className="apokrin-clay-section py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Core Capabilities" />

            <h2
              id="hrms-capabilities-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Agile, People-Centric{' '}
              <span className="apokrin-gradient-text">Workforce Management</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Streamlining your workforce operations with intelligent, agile, and people-centric HR
              management solutions.
            </p>
          </motion.div>

          {/* Two Visually Balanced White Capability Cards */}
          <div className="mt-9 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            {/* CARD 1: TALENT ACQUISITION & ONBOARDING */}
            <motion.article
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col overflow-hidden rounded-[1.85rem] border border-[#E2E8F0] bg-white shadow-[0_14px_34px_-16px_rgba(15,23,42,0.1)]"
            >
              {/* Gradient Top Border */}
              <div
                aria-hidden="true"
                className="h-1.5 w-full"
                style={{ background: 'var(--color-btn-gradient)' }}
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start gap-4 border-b border-[#E2E8F0] pb-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    <UserPlus className="h-5.5 w-5.5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#64748B]">
                      Category 01
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      Talent Acquisition &amp; Onboarding
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                      Our HR solutions help you attract, hire, and onboard top talent efficiently
                      and at scale.
                    </p>
                  </div>
                </div>

                {/* 5 Clearly Separated Capability Rows */}
                <div className="mt-4 flex-1 divide-y divide-[#F1F5F9]">
                  {TALENT_ACQUISITION_CAPABILITIES.map((cap) => (
                    <div
                      key={cap.title}
                      className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition-colors duration-150 hover:bg-[#F8FAFC]"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]"
                        aria-hidden="true"
                      />
                      <div>
                        <h4 className="font-display text-sm font-extrabold text-[#0A1128] sm:text-[15px]">
                          {cap.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#475569] sm:text-sm">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>

            {/* CARD 2: EMPLOYEE LIFECYCLE MANAGEMENT */}
            <motion.article
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col overflow-hidden rounded-[1.85rem] border border-[#E2E8F0] bg-white shadow-[0_14px_34px_-16px_rgba(15,23,42,0.1)]"
            >
              {/* Gradient Top Border */}
              <div
                aria-hidden="true"
                className="h-1.5 w-full"
                style={{ background: 'var(--color-btn-gradient)' }}
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start gap-4 border-b border-[#E2E8F0] pb-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    <Users className="h-5.5 w-5.5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#64748B]">
                      Category 02
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      Employee Lifecycle Management
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                      Drive engagement, productivity, and retention through holistic HR lifecycle
                      management.
                    </p>
                  </div>
                </div>

                {/* 5 Clearly Separated Capability Rows */}
                <div className="mt-4 flex-1 divide-y divide-[#F1F5F9]">
                  {LIFECYCLE_CAPABILITIES.map((cap) => (
                    <div
                      key={cap.title}
                      className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition-colors duration-150 hover:bg-[#F8FAFC]"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]"
                        aria-hidden="true"
                      />
                      <div>
                        <h4 className="font-display text-sm font-extrabold text-[#0A1128] sm:text-[15px]">
                          {cap.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#475569] sm:text-sm">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </div>
  );
}
