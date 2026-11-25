import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Network,
  Sparkles,
  UserCheck,
  Workflow,
} from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import heroBackdropImg from '../assets/images/staffing_hero_backdrop_1794739946704.jpg';
import introPlatformImg from '../assets/images/staffing_intro_platform_1794739946943.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import {
  BenefitClayIcon3D,
  BenefitIconId,
  CapabilityClayIcon3D,
  EngagementClayIcon3D,
  EngagementModelIconId,
  TaskOrderClayIcon3D,
  TaskOrderIconId,
} from './StaffingClayIcons';

interface StaffingSolutionsPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface EngagementModelItem {
  id: EngagementModelIconId;
  code: string;
  description: string;
  practice: PracticeArea;
}

const ENGAGEMENT_MODELS: EngagementModelItem[] = [
  {
    id: 'rpo',
    code: 'RPO',
    description: 'Recruitment Process Outsourcing for end-to-end hiring solutions.',
    practice: 'Cloud Engineering',
  },
  {
    id: 'tm',
    code: 'T&M',
    description: 'Time and Materials model for flexibility and transparency.',
    practice: 'Cloud Engineering',
  },
  {
    id: 'sow',
    code: 'SOW',
    description: 'Statement of Work-based execution for defined deliverables.',
    practice: 'Applied AI',
  },
  {
    id: 'fixed',
    code: 'Fixed-Price',
    description: 'Fixed-price projects with clear scope and deadlines.',
    practice: 'Data Platforms',
  },
  {
    id: 'managed',
    code: 'Managed Services',
    description: 'Outcome-focused delivery with SLAs and KPIs.',
    practice: 'Security & FinOps',
  },
  {
    id: 'odc',
    code: 'ODC',
    description: 'Offshore Development Center as a scalable service.',
    practice: 'Cloud Engineering',
  },
  {
    id: 'squads',
    code: 'SQUADS Delivery',
    description: 'Skill-based team squads tailored to your project needs.',
    practice: 'Applied AI',
  },
];

const RECRUITMENT_FEATURES = [
  {
    title: 'Workforce Planning',
    detail: 'Build and organize internal and external talent pools.',
  },
  {
    title: 'Smart Sourcing',
    detail: 'Use AI to post jobs, filter resumes, and manage referrals.',
  },
  {
    title: 'ATS',
    detail: 'Streamline communication, interview scheduling, and background checks.',
  },
  {
    title: 'Candidate Onboarding',
    detail: 'Automate orientations, documentation, and training.',
  },
  {
    title: 'Hiring Analytics',
    detail: 'Get real-time insights to improve quality-of-hire and time-to-fill.',
  },
];

const VMS_FEATURES = [
  {
    title: 'Services Procurement & Compliance',
    detail: 'Ensure all vendor services meet regulatory and quality standards.',
  },
  {
    title: 'Task Order Lifecycle Management',
    detail: 'Complete oversight from initiation to closure of all task orders.',
  },
  {
    title: 'Real-Time Resource Utilization',
    detail: 'Monitor and optimize resource allocation across all projects.',
  },
  {
    title: 'Advanced Workforce Analytics',
    detail: 'Data-driven insights for strategic workforce planning.',
  },
  {
    title: 'Secure, Scalable, and Configurable SaaS Platform',
    detail: 'Enterprise-grade security with flexible configuration options.',
  },
];

const WHY_CHOOSE_BENEFITS: { id: BenefitIconId; text: string }[] = [
  {
    id: 'speed',
    text: 'Reduce hiring time and costs through automation.',
  },
  {
    id: 'centralize',
    text: 'Centralize recruitment and vendor operations.',
  },
  {
    id: 'quality',
    text: 'Improve quality and consistency in delivery.',
  },
  {
    id: 'workflows',
    text: 'Customize workflows to meet complex project needs.',
  },
  {
    id: 'compliance',
    text: 'Ensure compliance, visibility, and audit readiness.',
  },
];

const TASK_ORDER_STEPS: {
  id: TaskOrderIconId;
  step: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'plan',
    step: '01',
    title: 'Plan & Define',
    description: 'Set clear project scopes and delivery expectations from the start.',
  },
  {
    id: 'collaborate',
    step: '02',
    title: 'Collaborate & Execute',
    description: 'Work seamlessly with vendors and internal teams to deliver results.',
  },
  {
    id: 'track',
    step: '03',
    title: 'Track & Monitor',
    description: 'Gain real-time visibility into progress, metrics, and resource allocation.',
  },
  {
    id: 'close',
    step: '04',
    title: 'Close & Comply',
    description:
      'Ensure all task orders are closed out with compliance documentation and accountability.',
  },
];

export function StaffingSolutionsPage({
  onOpenBriefing,
}: StaffingSolutionsPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [introImgFailed, setIntroImgFailed] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('RPO');
  const [activeBenefit, setActiveBenefit] = useState<number>(0);
  const [activeTaskStep, setActiveTaskStep] = useState<number>(0);

  const taskSectionRef = useRef<HTMLDivElement | null>(null);
  const isTaskSectionInView = useInView(taskSectionRef, { once: true, amount: 0.25 });

  // Sequentially animate process indicators when Task Order Excellence enters the viewport
  useEffect(() => {
    if (!isTaskSectionInView || prefersReducedMotion) return;

    let step = 0;
    setActiveTaskStep(0);
    const intervalId = window.setInterval(() => {
      step = (step + 1) % TASK_ORDER_STEPS.length;
      setActiveTaskStep(step);
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, [isTaskSectionInView, prefersReducedMotion]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white">
      {/* =====================================================================
          1. STAFFING HERO SECTION
         ===================================================================== */}
      <section
        aria-labelledby="staffing-hero-heading"
        className="relative isolate overflow-hidden border-b border-[#E2E8F0] bg-[#0A1128]"
      >
        {/* Background Visual */}
        {!heroImgFailed && (
          <img
            src={heroBackdropImg}
            alt="Enterprise technology headquarters and talent collaboration hub"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55"
          />
        )}

        {/* Subtle Dark Scrim + Theme Ambient Radial Glow */}
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

        <div className="apokrin-container relative py-14 sm:py-16 lg:py-20">
          {/* Floating Left 3D Recruitment Elements (Desktop) */}
          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-6 top-12 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md xl:flex"
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
              <p className="text-xs font-bold leading-tight">Candidate Profiles</p>
              <p className="text-[11px] text-slate-300">AI-Verified Matching</p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="pointer-events-none absolute bottom-10 left-12 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <Workflow className="h-4 w-4" style={{ color: themeConfig.accent }} />
            <span className="text-xs font-semibold">Digital Hiring Pipeline</span>
          </motion.div>

          {/* Floating Right 3D Talent Network & Vendor Elements (Desktop) */}
          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="pointer-events-none absolute right-6 top-12 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.secondary} 0%, ${themeConfig.primaryStrong} 100%)`,
              }}
            >
              <Network className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Talent &amp; Vendor Hub</p>
              <p className="text-[11px] text-slate-300">Unified VMS Governance</p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="pointer-events-none absolute bottom-10 right-14 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md xl:flex"
          >
            <Sparkles className="h-4 w-4" style={{ color: themeConfig.accent }} />
            <span className="text-xs font-semibold">Task Order Automation</span>
          </motion.div>

          {/* Centered Hero Typography & Actions */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <span
              className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm"
              style={{
                borderColor: `${themeConfig.accent}66`,
                backgroundColor: `${themeConfig.primary}28`,
              }}
            >
              Apokrin Enterprise Staffing Platform
            </span>

            <h1
              id="staffing-hero-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-hero mt-5 font-display font-extrabold text-white"
            >
              Staffing Solutions by Apokrin |{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${themeConfig.accent} 0%, #FFFFFF 48%, ${themeConfig.secondary} 100%)`,
                }}
              >
                End-to-End Recruitment &amp; Vendor Management
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
              Smart Hiring Meets Strategic Vendor Management
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => scrollToSection('engagement-models')}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 whitespace-nowrap shrink-0"
              >
                <span>Explore Engagement Models</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          2. STAFFING INTRODUCTION SECTION (2-Column: Copy Left, Single Visual + Floating Clay Elements Right)
         ===================================================================== */}
      <section className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Side: Badge, Heading, Description */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Staffing Solutions
              </span>

              <h2
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Smart Hiring Meets{' '}
                <span className="apokrin-gradient-text">Strategic Vendor Management</span>
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#475569] sm:text-[15.5px]">
                <p>
                  Apokrin&apos;s Staffing Solutions bring together the power of our Recruitment
                  Application and Vendor Management System (VMS) into one integrated platform
                  designed to support all stages of talent acquisition, workforce augmentation, and
                  vendor collaboration. Whether you&apos;re hiring in-house or managing external
                  partners, our solutions are built to help you scale faster, smarter, and more
                  efficiently.
                </p>
                <p>
                  From startups to global enterprises, Apokrin delivers customized staffing
                  frameworks through a modern SaaS platform enabling businesses to manage
                  everything from candidate sourcing to task order execution under one roof.
                </p>
              </div>
            </motion.div>

            {/* Right Side: Single Large Technology Visual + Floating Claymorphism Elements */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              {/* Soft Ambient Theme Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-60 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
                }}
              />

              {/* Single Large Claymorphism Framed Platform Visual */}
              <div className="apokrin-clay-panel relative overflow-hidden rounded-[2rem] border border-white/95 p-3 sm:p-4">
                {introImgFailed ? (
                  <div
                    className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-[1.5rem] p-8 text-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <CapabilityClayIcon3D id="recruitment-ai" />
                    <p className="mt-4 font-display text-lg font-bold text-[#0A1128]">
                      Integrated Recruitment &amp; VMS Platform
                    </p>
                  </div>
                ) : (
                  <img
                    src={introPlatformImg}
                    alt="Apokrin integrated recruitment application and vendor management workspace"
                    referrerPolicy="no-referrer"
                    onError={() => setIntroImgFailed(true)}
                    className="aspect-[4/3] w-full rounded-[1.45rem] object-cover"
                  />
                )}
              </div>

              {/* Floating 3D Claymorphism Card 1 (Top Left) */}
              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
                className="apokrin-clay-card absolute -left-2 -top-4 hidden items-center gap-3 border border-white/90 px-4 py-3 sm:flex"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ background: 'var(--color-btn-gradient)' }}
                >
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-[#0A1128]">
                    Candidate Sourcing
                  </p>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    AI Screening &amp; ATS Sync
                  </p>
                </div>
              </motion.div>

              {/* Floating 3D Claymorphism Card 2 (Bottom Right) */}
              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 5.0, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                className="apokrin-clay-card absolute -bottom-4 -right-2 hidden items-center gap-3 border border-white/90 px-4 py-3 sm:flex"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-surface-soft)',
                    color: 'var(--color-primary-strong)',
                  }}
                >
                  <Network className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-[#0A1128]">
                    Vendor &amp; Task Orders
                  </p>
                  <p
                    className="text-[11px] font-semibold"
                    style={{ color: 'var(--color-secondary-text)' }}
                  >
                    Unified VMS Workspace
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. FLEXIBLE ENGAGEMENT MODELS (4 Cards Row 1 + 3 Centered Cards Row 2 on Desktop)
         ===================================================================== */}
      <section
        id="engagement-models"
        aria-labelledby="engagement-models-heading"
        className="apokrin-clay-section relative border-b py-14 sm:py-16 lg:py-20"
      >
        {/* Subtle floating claymorphism geometric shapes */}
        <div
          aria-hidden="true"
          className="apokrin-geo-float apokrin-clay-orb pointer-events-none absolute -left-8 top-20 hidden h-16 w-16 rounded-full opacity-75 lg:block"
        />
        <div
          aria-hidden="true"
          className="apokrin-geo-float-delayed apokrin-clay-orb pointer-events-none absolute right-8 bottom-16 hidden h-14 w-14 rotate-12 rounded-2xl opacity-75 lg:block"
        />

        <div className="apokrin-container relative">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Staffing Solutions
            </span>

            <h2
              id="engagement-models-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Flexible Engagement Models{' '}
              <span className="apokrin-gradient-text">We Support</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Choose the perfect engagement model that aligns with your business needs and project
              requirements.
            </p>
          </motion.div>

          {/* 4 cards in Row 1, 3 centered cards in Row 2 on Desktop; 2-col Tablet; 1-col Mobile */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:flex lg:flex-wrap lg:items-stretch lg:justify-center">
            {ENGAGEMENT_MODELS.map((model, idx) => {
              const isSelected = selectedModel === model.code;
              return (
                <motion.button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.code)}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -6, rotateX: 2, rotateY: -2 }
                  }
                  style={{
                    borderColor: isSelected ? themeConfig.primaryStrong : 'rgba(255,255,255,0.9)',
                    boxShadow: isSelected
                      ? `0 18px 36px -10px ${themeConfig.glow}, inset 0 2px 6px rgba(255,255,255,0.95)`
                      : undefined,
                  }}
                  className="apokrin-clay-card group flex h-full w-full flex-col justify-between border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:w-[calc(25%-1.125rem)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${themeConfig.surfaceTint} 0%, ${themeConfig.surfaceSoft} 100%)`
                            : 'var(--color-surface-soft)',
                          boxShadow:
                            'inset 0 2px 5px rgba(255,255,255,0.95), 0 6px 14px var(--color-clay-shadow)',
                        }}
                      >
                        <EngagementClayIcon3D id={model.id} />
                      </div>

                      <span
                        className="font-mono text-xs font-bold tabular-nums"
                        style={{
                          color: isSelected ? themeConfig.primaryStrong : '#94A3B8',
                        }}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    <h3
                      className="mt-5 font-display text-lg font-bold transition-colors"
                      style={{
                        color: isSelected ? themeConfig.primaryStrong : '#0A1128',
                      }}
                    >
                      {model.code}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                      {model.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0]/80 pt-3.5 text-xs font-semibold">
                    <span
                      style={{
                        color: isSelected ? themeConfig.primaryStrong : 'var(--color-secondary-text)',
                      }}
                    >
                      {isSelected ? 'Selected Model' : 'Select Model'}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: themeConfig.primaryStrong }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. CORE CAPABILITIES (2 Side-by-Side Claymorphism Cards)
         ===================================================================== */}
      <section className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Core Capabilities
            </span>

            <h2
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Unified Recruitment &amp;{' '}
              <span className="apokrin-gradient-text">Vendor Management Platform</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Empowering your business with cutting-edge recruitment and vendor management solutions.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Card 1: Recruitment Automation */}
            <motion.article
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              className="apokrin-clay-panel group relative overflow-hidden rounded-[1.75rem] border border-white/95 p-6 sm:p-8"
            >
              {/* Theme-colored top border bar */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: 'var(--color-btn-gradient)' }}
              />

              <div className="flex items-start gap-4 border-b border-[#E2E8F0] pb-5">
                <div
                  className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
                  style={{
                    backgroundColor: 'var(--color-surface-soft)',
                    boxShadow:
                      'inset 0 2px 5px rgba(255,255,255,0.95), 0 8px 18px var(--color-clay-shadow)',
                  }}
                >
                  <CapabilityClayIcon3D id="recruitment-ai" />
                </div>

                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Recruitment Automation
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                    Our end-to-end Recruitment Application empowers you to manage the entire hiring
                    lifecycle.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3.5">
                {RECRUITMENT_FEATURES.map((feat) => (
                  <li key={feat.title} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        color: 'var(--color-primary-strong)',
                      }}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                    <p className="text-sm leading-relaxed text-[#334155]">
                      <strong className="font-semibold text-[#0A1128]">{feat.title}</strong> –{' '}
                      {feat.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.article>

            {/* Card 2: Vendor Management System (VMS) */}
            <motion.article
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              className="apokrin-clay-panel group relative overflow-hidden rounded-[1.75rem] border border-white/95 p-6 sm:p-8"
            >
              {/* Theme-colored top border bar */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: 'var(--color-btn-gradient)' }}
              />

              <div className="flex items-start gap-4 border-b border-[#E2E8F0] pb-5">
                <div
                  className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
                  style={{
                    backgroundColor: 'var(--color-surface-soft)',
                    boxShadow:
                      'inset 0 2px 5px rgba(255,255,255,0.95), 0 8px 18px var(--color-clay-shadow)',
                  }}
                >
                  <CapabilityClayIcon3D id="vms-hub" />
                </div>

                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Vendor Management System (VMS)
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                    Gain full lifecycle visibility and control over third-party vendors and
                    contingent staffing.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3.5">
                {VMS_FEATURES.map((feat) => (
                  <li key={feat.title} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        color: 'var(--color-primary-strong)',
                      }}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                    <p className="text-sm leading-relaxed text-[#334155]">
                      <strong className="font-semibold text-[#0A1128]">{feat.title}</strong> –{' '}
                      {feat.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. WHY CHOOSE APOKRIN? (Large Claymorphism Container + Interactive Rows)
         ===================================================================== */}
      <section
        aria-labelledby="why-choose-heading"
        className="apokrin-surface-soft-gradient border-b border-[#E2E8F0] py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel rounded-[2rem] border border-white/95 p-6 sm:p-10 lg:p-12"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Summary */}
              <div className="lg:col-span-5">
                <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                  Why Choose Us?
                </span>

                <h2
                  id="why-choose-heading"
                  style={{ textWrap: 'balance' }}
                  className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl"
                >
                  Why Choose <span className="apokrin-gradient-text">Apokrin?</span>
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-[15.5px]">
                  We combine cutting-edge technology with deep industry expertise to deliver
                  scalable, efficient, and tailored workforce solutions. With a focus on
                  transparency, speed, and quality, we empower businesses to achieve hiring success
                  and operational excellence.
                </p>
              </div>

              {/* Right Interactive Horizontal Benefit Rows */}
              <div className="space-y-3 lg:col-span-7">
                {WHY_CHOOSE_BENEFITS.map((benefit, idx) => {
                  const isActive = activeBenefit === idx;
                  return (
                    <motion.button
                      key={benefit.id}
                      type="button"
                      onMouseEnter={() => setActiveBenefit(idx)}
                      onClick={() => setActiveBenefit(idx)}
                      whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        borderColor: isActive ? themeConfig.primaryStrong : '#E2E8F0',
                        backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.78)',
                        boxShadow: isActive
                          ? `0 12px 26px -8px ${themeConfig.glow}`
                          : '0 4px 12px rgba(15,23,42,0.03)',
                      }}
                      className="group flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] sm:px-5"
                    >
                      <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <BenefitClayIcon3D id={benefit.id} />
                      </div>

                      <span
                        className="flex-1 font-display text-sm font-bold leading-snug transition-colors sm:text-[15px]"
                        style={{
                          color: isActive ? themeConfig.primaryStrong : '#0A1128',
                        }}
                      >
                        {benefit.text}
                      </span>

                      <CheckCircle2
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 transition-opacity duration-200"
                        style={{
                          color: isActive ? themeConfig.primaryStrong : '#CBD5E1',
                        }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          6. STAFFING CALL-TO-ACTION SECTION
         ===================================================================== */}
      <section className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-12 text-center sm:px-12 sm:py-16"
          >
            {/* Floating 3D Recruitment Elements */}
            <motion.div
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <UserCheck className="h-6 w-6" style={{ color: themeConfig.primaryStrong }} />
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <Network className="h-6 w-6" style={{ color: themeConfig.secondaryText }} />
            </motion.div>

            <div className="relative mx-auto max-w-2xl">
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Staffing Solutions
              </span>

              <h2
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl lg:text-4xl"
              >
                Ready to transform your{' '}
                <span className="apokrin-gradient-text">staffing operations?</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                Connect with our team to explore Apokrin&apos;s Recruitment Application, Vendor
                Management System (VMS), and {selectedModel} engagement framework.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      'Applied AI',
                      `Contact Sales inquiry regarding Apokrin Staffing Solutions and ${selectedModel} model.`,
                    )
                  }
                  className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  <span>Contact Sales</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          7. TASK ORDER EXCELLENCE (4 Equal-Width Process Cards + Animated Connected Line)
         ===================================================================== */}
      <section
        ref={taskSectionRef}
        aria-labelledby="task-order-heading"
        className="apokrin-surface-section py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Task Order Excellence
            </span>

            <h2
              id="task-order-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Precision Execution Across{' '}
              <span className="apokrin-gradient-text">Every Task Order</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Streamline, execute, and deliver with precision. Our platform ensures every task
              order is managed with clarity, speed, and accountability—driving consistent results
              across teams and vendors.
            </p>
          </motion.div>

          {/* Connected Process Line (Desktop) + 4 Equal-Width Cards */}
          <div className="relative mt-12">
            {/* Subtle horizontal track connecting cards on desktop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[54px] hidden h-1 rounded-full lg:block"
              style={{ backgroundColor: 'var(--color-track)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'var(--color-btn-gradient)',
                  boxShadow: '0 0 10px var(--color-glow)',
                }}
                initial={false}
                animate={{
                  width: `${(activeTaskStep / (TASK_ORDER_STEPS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TASK_ORDER_STEPS.map((item, idx) => {
                const isActive = activeTaskStep === idx;
                const isCompletedOrActive = idx <= activeTaskStep;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTaskStep(idx)}
                    onMouseEnter={() => setActiveTaskStep(idx)}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: prefersReducedMotion ? 0 : idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                    style={{
                      borderColor: isActive ? themeConfig.primaryStrong : 'rgba(255,255,255,0.9)',
                      boxShadow: isActive
                        ? `0 18px 36px -10px ${themeConfig.glow}, inset 0 2px 6px rgba(255,255,255,0.96)`
                        : undefined,
                    }}
                    className="apokrin-clay-card group relative flex h-full flex-col justify-between border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: 'var(--color-surface-soft)',
                            boxShadow:
                              'inset 0 2px 5px rgba(255,255,255,0.95), 0 6px 14px var(--color-clay-shadow)',
                          }}
                        >
                          <TaskOrderClayIcon3D id={item.id} active={isActive} />
                        </div>

                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300"
                          style={
                            isCompletedOrActive
                              ? {
                                  background: 'var(--color-btn-gradient)',
                                  color: '#FFFFFF',
                                  boxShadow: '0 4px 12px var(--color-glow)',
                                }
                              : {
                                  backgroundColor: '#F1F5F9',
                                  color: '#64748B',
                                }
                          }
                        >
                          {item.step}
                        </span>
                      </div>

                      <h3
                        className="mt-5 font-display text-lg font-bold transition-colors"
                        style={{
                          color: isActive ? themeConfig.primaryStrong : '#0A1128',
                        }}
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
          </div>
        </div>
      </section>
    </div>
  );
}
