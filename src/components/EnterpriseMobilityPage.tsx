import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  FileCheck2,
  Gauge,
  Globe,
  Layers,
  Lock,
  MonitorSmartphone,
  Plug,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import mobilityConnectedImg from '../assets/images/mobility_connected_enterprise_1794910291645.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { ServicePageTemplate } from './services/ServicePageTemplate';

interface EnterpriseMobilityPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface WhyChooseMobilityItem {
  id: string;
  number: string;
  title: string;
  description: string;
  blueprintSubtitle: string;
  pillars: string[];
  icon: typeof Smartphone;
}

const WHY_CHOOSE_MOBILITY: WhyChooseMobilityItem[] = [
  {
    id: 'end-to-end',
    number: '01',
    title: 'End-to-End Mobility Solutions',
    description:
      'We deliver comprehensive enterprise mobility services—from app development to MDM integration—tailored to meet evolving business demands.',
    blueprintSubtitle: 'Full Mobile Lifecycle Delivery',
    pillars: [
      'Mobility readiness & platform roadmaps',
      'Native & cross-platform application builds',
      'End-to-end MDM enrollment & support',
    ],
    icon: Workflow,
  },
  {
    id: 'secure-byod',
    number: '02',
    title: 'Secure BYOD Enablement',
    description:
      'Empower your workforce to work from anywhere while maintaining full control, compliance, and security of corporate data on personal devices.',
    blueprintSubtitle: 'Zero-Trust Device & Policy Control',
    pillars: [
      'BYOD & COPE policy enforcement',
      'Containerized corporate data separation',
      'Compliance-aligned device governance',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'seamless-integration',
    number: '03',
    title: 'Seamless App Integration',
    description:
      'Our mobility platforms integrate easily with your existing enterprise systems, ensuring consistent user experiences and data flow.',
    blueprintSubtitle: 'Connected Back-End & API Ecosystem',
    pillars: [
      'Secure ERP, CRM & cloud API sync',
      'Unified single sign-on & directory access',
      'Consistent workflows across endpoints',
    ],
    icon: Layers,
  },
  {
    id: 'scalable-platforms',
    number: '04',
    title: 'Scalable & Future-Ready Platforms',
    description:
      'Build scalable mobile frameworks that support cross-platform development, rapid deployment, and long-term digital transformation goals.',
    blueprintSubtitle: 'Modern Cross-Platform Architecture',
    pillars: [
      'iOS, Android, Flutter & React Native',
      'Rapid CI/CD mobile release velocity',
      'Telemetry-driven continuous improvement',
    ],
    icon: Zap,
  },
];

interface MobilityCapabilityItem {
  number: string;
  title: string;
  description: string;
  icon: typeof Smartphone;
}

interface MobilityCapabilityTrack {
  id: 'strategy' | 'app-dev';
  index: string;
  label: string;
  title: string;
  summary: string;
  icon: typeof Compass;
  capabilities: MobilityCapabilityItem[];
}

const MOBILITY_CAPABILITY_TRACKS: MobilityCapabilityTrack[] = [
  {
    id: 'strategy',
    index: '01',
    label: 'Strategy & Governance',
    title: 'Enterprise Mobility Strategy',
    summary:
      'We help organizations create mobile-first strategies aligned with business goals and user needs.',
    icon: Compass,
    capabilities: [
      {
        number: '01',
        title: 'Mobile Readiness Assessment',
        description:
          'Evaluate your existing infrastructure, workflows, and opportunities for mobility.',
        icon: Activity,
      },
      {
        number: '02',
        title: 'Platform & Device Strategy',
        description:
          'Identify the right platforms and devices for scalable deployment across teams.',
        icon: MonitorSmartphone,
      },
      {
        number: '03',
        title: 'Policy & Compliance Framework',
        description: 'Develop BYOD/COPE policies that prioritize security and productivity.',
        icon: FileCheck2,
      },
      {
        number: '04',
        title: 'Governance & Security Planning',
        description: 'Establish data protection, access control, and governance best practices.',
        icon: Lock,
      },
      {
        number: '05',
        title: 'Change Management Support',
        description:
          'Enable smooth adoption with training, documentation, and stakeholder alignment.',
        icon: Users,
      },
    ],
  },
  {
    id: 'app-dev',
    index: '02',
    label: 'Design & Engineering',
    title: 'Custom Mobile App Development',
    summary:
      'From design to deployment, we build secure and scalable apps that empower your workforce and customers.',
    icon: Smartphone,
    capabilities: [
      {
        number: '01',
        title: 'Native & Cross-Platform Apps',
        description:
          'Develop intuitive applications using platforms like iOS, Android, Flutter, or React Native.',
        icon: Code2,
      },
      {
        number: '02',
        title: 'App Integration Services',
        description: 'Connect mobile apps with back-end systems, APIs, and enterprise tools.',
        icon: Plug,
      },
      {
        number: '03',
        title: 'Mobile Device Management (MDM)',
        description: 'Manage mobile assets, enforce security policies, and ensure compliance.',
        icon: TabletSmartphone,
      },
      {
        number: '04',
        title: 'Performance & UX Optimization',
        description:
          'Enhance user experience with responsive UI, fast load times, and minimal friction.',
        icon: Gauge,
      },
      {
        number: '05',
        title: 'Analytics & Continuous Improvement',
        description:
          'Monitor app usage and iterate based on data-driven insights and user feedback.',
        icon: TrendingUp,
      },
    ],
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

export function EnterpriseMobilityPage({
  onNavigate,
  onOpenBriefing,
}: EnterpriseMobilityPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [introImgFailed, setIntroImgFailed] = useState(false);
  const [activeWhyIdx, setActiveWhyIdx] = useState<number>(0);
  const [activeTrackId, setActiveTrackId] = useState<'strategy' | 'app-dev'>('strategy');

  const activeWhy = WHY_CHOOSE_MOBILITY[activeWhyIdx] ?? WHY_CHOOSE_MOBILITY[0];
  const activeTrack =
    MOBILITY_CAPABILITY_TRACKS.find((track) => track.id === activeTrackId) ??
    MOBILITY_CAPABILITY_TRACKS[0];
  const featuredCapability = activeTrack.capabilities[0];
  const secondaryCapabilities = activeTrack.capabilities.slice(1);
  const ActiveTrackIcon = activeTrack.icon;
  const FeaturedCapIcon = featuredCapability.icon;

  const scrollToCapabilities = () => {
    const target = document.getElementById('mobility-core-capabilities');
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <ServicePageTemplate
      serviceId="mobility"
      onPrimaryCta={scrollToCapabilities}
      onSecondaryCta={() => onNavigate('contact')}
      onOpenBriefing={onOpenBriefing}
    >

      {/* =====================================================================
          SECTION 2: INTRODUCTION – ENABLING SECURE, SCALABLE MOBILITY
         ===================================================================== */}
      <section
        aria-labelledby="mobility-intro-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left 7 Cols: Narrative Copy & Mobility Highlights */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <div>
                <SectionBadgeWithDot label="Enterprise Mobility Services" />
              </div>

              <h2
                id="mobility-intro-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Enabling Secure, Scalable Mobility for the{' '}
                <span className="apokrin-gradient-text">Modern Enterprise</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                At Apokrin, we empower businesses with innovative enterprise mobility solutions
                designed to drive productivity, enhance collaboration, and enable secure access to
                business-critical data—anytime, anywhere. Our mobility services are tailored to meet
                the evolving needs of a modern, mobile-first workforce, helping organizations stay
                connected and agile. Whether you&apos;re deploying mobile apps, managing devices, or
                streamlining workflows, our team ensures seamless integration, security, and
                scalability across all your mobility initiatives.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {[
                  {
                    title: 'Anytime Data Access',
                    detail: 'Productivity and collaboration across distributed mobile teams.',
                    icon: Globe,
                  },
                  {
                    title: 'Device & App Control',
                    detail: 'Unified deployment, MDM governance, and policy compliance.',
                    icon: TabletSmartphone,
                  },
                  {
                    title: 'Agile Workflow Sync',
                    detail: 'Real-time enterprise integration built for scale.',
                    icon: MonitorSmartphone,
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

            {/* Right 5 Cols: Connected Enterprise Mobility Image Inside Clay Frame */}
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
                        <Smartphone className="h-7 w-7 text-white" aria-hidden="true" />
                      </div>
                      <p className="font-display text-base font-bold">
                        Connected Mobile-First Workforce
                      </p>
                      <p className="max-w-xs text-xs text-slate-300">
                        Secure mobile apps, device management, and seamless corporate integration
                        across teams.
                      </p>
                    </div>
                  ) : (
                    <img
                      src={mobilityConnectedImg}
                      alt="Enterprise workforce collaborating across mobile devices and real-time analytics displays"
                      referrerPolicy="no-referrer"
                      onError={() => setIntroImgFailed(true)}
                      className="aspect-[4/3] h-full w-full object-cover lg:min-h-[320px]"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 px-3 pb-1.5 pt-3 text-xs font-semibold text-[#475569]">
                  <span>Mobile-First Collaboration</span>
                  <span className="font-mono text-[11px]" style={{ color: themeConfig.primaryStrong }}>
                    iOS · Android · MDM · APIs
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
        aria-labelledby="mobility-why-heading"
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
            <SectionBadgeWithDot label="Enterprise Advantage" />

            <h2
              id="mobility-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Why <span className="apokrin-gradient-text">Choose Us?</span>
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: 2x2 Interactive Mobility Feature Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              {WHY_CHOOSE_MOBILITY.map((item, idx) => {
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

            {/* Right 5 Cols: Synchronized Mobility Architecture Card */}
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
                          'Applied AI',
                          `Mobility inquiry focused on: ${activeWhy.title}.`,
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      style={{ color: themeConfig.primaryStrong }}
                    >
                      <span>Discuss your mobility roadmap</span>
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
          SECTION 4: CTA SECTION – READY TO ELEVATE YOUR WORKFORCE?
         ===================================================================== */}
      <section aria-labelledby="mobility-mid-cta" className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12">
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
              <Smartphone className="h-5.5 w-5.5" style={{ color: themeConfig.primaryStrong }} />
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
                id="mobility-mid-cta"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Ready to elevate your workforce with{' '}
                <span className="apokrin-gradient-text">Enterprise Mobility?</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                Partner with Apokrin to strategize, build, integrate, and govern secure mobile
                solutions tailored to your distributed workforce.
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
          SECTION 5: CORE CAPABILITIES (Interactive Pillar Switcher + Bento Grid)
         ===================================================================== */}
      <section
        id="mobility-core-capabilities"
        aria-labelledby="mobility-capabilities-heading"
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
              id="mobility-capabilities-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              End-to-End Mobility Strategy &amp;{' '}
              <span className="apokrin-gradient-text">Custom App Engineering</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Apokrin delivers professional, scalable mobility services that enable your business to
              thrive in a mobile-first world. With a holistic approach to mobile transformation, our
              team helps you strategize, implement, and manage enterprise mobility with confidence.
            </p>
          </motion.div>

          {/* Interactive Two-Track Pillar Selector */}
          <div
            role="tablist"
            aria-label="Enterprise mobility capability categories"
            className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {MOBILITY_CAPABILITY_TRACKS.map((track) => {
              const TrackIcon = track.icon;
              const isSelected = track.id === activeTrack.id;

              return (
                <button
                  key={track.id}
                  id={`mobility-tab-${track.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`mobility-panel-${track.id}`}
                  onClick={() => setActiveTrackId(track.id)}
                  style={{
                    borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                    boxShadow: isSelected
                      ? `0 18px 38px -18px ${themeConfig.glow}`
                      : '0 8px 22px -14px rgba(15,23,42,0.08)',
                  }}
                  className={`group relative flex items-start gap-4 overflow-hidden rounded-[1.5rem] border p-5 text-left transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2 sm:p-6 ${
                    isSelected
                      ? 'bg-[#0A1128] text-white'
                      : 'bg-white/95 text-[#0A1128] hover:-translate-y-0.5 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-35 blur-2xl"
                      style={{ background: themeConfig.primary }}
                    />
                  )}

                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
                    style={
                      isSelected
                        ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                        : {
                            backgroundColor: 'var(--color-surface-soft)',
                            color: themeConfig.primaryStrong,
                          }
                    }
                  >
                    <TrackIcon className="h-5.5 w-5.5" aria-hidden="true" />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-semibold tracking-wide ${
                          isSelected ? 'text-[#94A3B8]' : 'text-[#64748B]'
                        }`}
                      >
                        Category {track.index} · {track.capabilities.length} Capabilities
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isSelected
                            ? 'translate-x-0.5 text-white'
                            : 'text-[#94A3B8] group-hover:translate-x-1 group-hover:text-[var(--color-primary-strong)]'
                        }`}
                      />
                    </div>

                    <h3
                      className={`mt-1 font-display text-lg font-extrabold sm:text-xl ${
                        isSelected ? 'text-white' : 'text-[#0A1128]'
                      }`}
                    >
                      {track.title}
                    </h3>

                    <p
                      className={`mt-1.5 line-clamp-2 text-xs leading-relaxed sm:text-sm ${
                        isSelected ? 'text-[#CBD5E1]' : 'text-[#475569]'
                      }`}
                    >
                      {track.summary}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="mobility-active-track-bar"
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1"
                      style={{ background: 'var(--color-btn-gradient)' }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 360, damping: 30 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Asymmetric Architectural Bento Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrack.id}
              id={`mobility-panel-${activeTrack.id}`}
              role="tabpanel"
              aria-labelledby={`mobility-tab-${activeTrack.id}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
            >
              {/* Left 5 Cols: Dark-Navy Architectural Anchor + Featured Capability 01 */}
              <article className="relative flex flex-col justify-between overflow-hidden rounded-[1.85rem] border border-[#1E293B] bg-[#0A1128] p-6 text-white shadow-[0_24px_48px_-22px_rgba(10,17,40,0.45)] sm:p-7 lg:col-span-5">
                {/* Architectural Ambient Glow & Subtle Dot Pattern */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
                  style={{ background: themeConfig.primary }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#E2E8F0]">
                      Category {activeTrack.index} · {activeTrack.label}
                    </span>
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      <ActiveTrackIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white sm:text-[1.65rem]">
                    {activeTrack.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#CBD5E1]">
                    {activeTrack.summary}
                  </p>

                  {/* Featured Capability 01 Spotlight */}
                  <div className="mt-6 border-t border-white/12 pt-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <FeaturedCapIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#94A3B8]">
                          Foundation · {featuredCapability.number}
                        </span>
                      </div>
                      <span
                        className="h-1.5 w-12 rounded-full"
                        style={{ background: 'var(--color-btn-gradient)' }}
                        aria-hidden="true"
                      />
                    </div>

                    <h4 className="mt-4 font-display text-lg font-extrabold text-white">
                      {featuredCapability.title}
                    </h4>

                    <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                      {featuredCapability.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action Link */}
                <div className="relative mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenBriefing(
                        'Applied AI',
                        `Enterprise Mobility inquiry focused on ${activeTrack.title}.`,
                      )
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
                  >
                    <span>Plan your {activeTrack.id === 'strategy' ? 'mobility strategy' : 'mobile application'}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span className="font-mono text-xs text-[#94A3B8]">01 — 05</span>
                </div>
              </article>

              {/* Right 7 Cols: 2x2 Tactile Claymorphism Bento Capability Cards (02 - 05) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                {secondaryCapabilities.map((cap, idx) => {
                  const CapIcon = cap.icon;

                  return (
                    <motion.article
                      key={cap.title}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: prefersReducedMotion ? 0 : idx * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      className="apokrin-clay-card group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[#E2E8F0] bg-white p-5 transition-all duration-200 hover:border-[var(--color-primary)] sm:p-6"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-primary-strong)] transition-all duration-200 group-hover:scale-105 group-hover:bg-[var(--color-primary-strong)] group-hover:text-white">
                            <CapIcon className="h-5 w-5" aria-hidden="true" />
                          </div>

                          <span
                            className="font-mono text-2xl font-bold leading-none tracking-tight text-[#E2E8F0] transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                            aria-hidden="true"
                          >
                            {cap.number}
                          </span>
                        </div>

                        <h4 className="mt-5 font-display text-base font-extrabold leading-snug text-[#0A1128] sm:text-[1.0625rem]">
                          {cap.title}
                        </h4>

                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {cap.description}
                        </p>
                      </div>

                      {/* Subtle Tactile Accent Bar */}
                      <div className="mt-5 pt-3">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                          <div
                            aria-hidden="true"
                            className="h-full w-10 rounded-full transition-all duration-300 group-hover:w-full"
                            style={{ background: 'var(--color-btn-gradient)' }}
                          />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </ServicePageTemplate>
  );
}
