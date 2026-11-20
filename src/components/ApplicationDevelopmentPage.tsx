import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Blocks,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Globe,
  Layers,
  Laptop,
  LifeBuoy,
  MonitorSmartphone,
  PenTool,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  TestTube2,
  Users,
  Wrench,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

interface ApplicationDevelopmentPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

type HeroTabId = 'web' | 'mobile' | 'pipeline';

interface HeroWorkspaceConfig {
  id: HeroTabId;
  label: string;
  fileName: string;
  codeLines: string[];
  mobileTitle: string;
  mobileTagline: string;
  componentCards: [string, string];
}

const HERO_WORKSPACES: HeroWorkspaceConfig[] = [
  {
    id: 'web',
    label: 'Web App',
    fileName: 'src/modules/OrderPortal.tsx',
    codeLines: [
      'export async function syncEnterpriseOrder(ctx: AppContext) {',
      '  const session = await verifyTenantBoundary(ctx.token);',
      '  const workflow = buildModularPipeline(session.orgId);',
      '  return workflow.dispatch({ resilient: true });',
      '}',
    ],
    mobileTitle: 'Enterprise Web Portal',
    mobileTagline: 'Responsive UI & API Sync',
    componentCards: ['Modular UI Architecture', 'Type-Safe Data Contracts'],
  },
  {
    id: 'mobile',
    label: 'Mobile API',
    fileName: 'mobile/NativeGateway.swift',
    codeLines: [
      'struct NativeSyncCoordinator: PlatformBridge {',
      '  func hydrateOfflineQueue(device: DeviceProfile) {',
      '    let policy = SecurityPolicy.enforced(device)',
      '    apiClient.streamEncryptedEvents(policy: policy)',
      '  }',
      '}',
    ],
    mobileTitle: 'iOS & Android Native',
    mobileTagline: 'Cross-Device Experience',
    componentCards: ['Native iOS & Android', 'Cross-Device QA Ready'],
  },
  {
    id: 'pipeline',
    label: 'CI/CD Pipeline',
    fileName: 'deploy/release-checks.yml',
    codeLines: [
      'stages: [build, unit_qa, security_scan, deploy]',
      'qa_matrix: [ios_arm64, android_api35, web_chromium]',
      'rollout_strategy: zero_downtime_canary',
      'post_release: continuous_telemetry_active',
    ],
    mobileTitle: 'Automated Delivery',
    mobileTagline: 'Validated Release Gate',
    componentCards: ['Automated QA Gates', 'Zero-Downtime Rollout'],
  },
];

const ARCH_STACK_LAYERS = [
  {
    id: 'experience',
    number: '01',
    title: 'Experience Layer',
    subtitle: 'Web, iOS & Android Interfaces',
    detail:
      'Accessible, responsive web applications and native mobile experiences tailored to your users and workflows.',
    icon: MonitorSmartphone,
  },
  {
    id: 'integration',
    number: '02',
    title: 'Integration & Domain Logic',
    subtitle: 'Custom APIs & Enterprise Services',
    detail:
      'Clean service boundaries connecting greenfield applications with ERP, CRM, and legacy enterprise platforms.',
    icon: Blocks,
  },
  {
    id: 'foundation',
    number: '03',
    title: 'Reliability & Security Core',
    subtitle: 'Automated QA, Compliance & Scale',
    detail:
      'Engineered with thorough testing, security governance, and maintainable architectures built to evolve.',
    icon: ShieldCheck,
  },
];

const WHY_CHOOSE_STORIES = [
  {
    id: 'ownership',
    step: '01',
    heading: 'End-to-End Accountability',
    badge: 'Full Lifecycle Ownership',
    content:
      "We understand how critical the right application is to your business success. That's why we offer end-to-end application development services, taking full responsibility for the analysis, design, development, testing, and integration of robust software solutions.",
    highlight: 'Analysis · Design · Engineering · QA · Integration',
    icon: Layers,
  },
  {
    id: 'collaboration',
    step: '02',
    heading: 'Internal Team Alignment',
    badge: 'Collaborative Co-Delivery',
    content:
      'When preferred, we also collaborate closely with your internal IT teams to ensure seamless coordination and knowledge transfer throughout the project lifecycle.',
    highlight: 'Shared Rituals · Architecture Docs · Knowledge Transfer',
    icon: Users,
  },
  {
    id: 'evolution',
    step: '03',
    heading: 'Long-Term Evolution',
    badge: 'Support & Modernization',
    content:
      "We don't just build applications; we support and evolve them. Whether you need ongoing maintenance, consulting, or advanced customization, Apokrin is your long-term technology partner.",
    highlight: 'Maintenance · Consulting · Advanced Customization',
    icon: LifeBuoy,
  },
];

type CapabilityGroupFilter = 'all' | 'custom' | 'mobile-web';

interface PlatformCapability {
  id: 'ios' | 'android' | 'qa' | 'web';
  title: string;
  description: string;
  previewBadge: string;
  previewHeader: string;
  previewSub: string;
  previewBullets: string[];
  icon: typeof Smartphone;
}

const MOBILE_WEB_CAPABILITIES: PlatformCapability[] = [
  {
    id: 'ios',
    title: 'iOS Application Development',
    description: 'Native iOS apps designed for performance, security, and user engagement.',
    previewBadge: 'Apple Ecosystem',
    previewHeader: 'Native iOS Experience',
    previewSub: 'SwiftUI · Keychain Security · Smooth 120Hz Motion',
    previewBullets: ['Hardware-backed security', 'Fluid native navigation', 'App Store readiness'],
    icon: Smartphone,
  },
  {
    id: 'android',
    title: 'Android Application Development',
    description:
      'Custom Android solutions optimized for a wide range of devices and use cases.',
    previewBadge: 'Android Ecosystem',
    previewHeader: 'Adaptive Android Delivery',
    previewSub: 'Kotlin · Material Design · Multi-Form-Factor Optimization',
    previewBullets: ['Phones, tablets & field gear', 'Offline-resilient sync', 'Consistent UI scaling'],
    icon: TabletSmartphone,
  },
  {
    id: 'qa',
    title: 'Mobile Application Testing Services',
    description:
      'Thorough QA testing to ensure usability, stability, and cross-device compatibility.',
    previewBadge: 'Quality Assurance',
    previewHeader: 'Cross-Device QA Matrix',
    previewSub: 'Automated Regression · Usability Validation · Stress Testing',
    previewBullets: ['OS & viewport matrix checks', 'Performance & memory profiling', 'Zero-regression CI gates'],
    icon: TestTube2,
  },
  {
    id: 'web',
    title: 'Web Application Development',
    description:
      'Responsive and scalable web applications built using modern frameworks and standards.',
    previewBadge: 'Modern Web',
    previewHeader: 'Scalable Web Architecture',
    previewSub: 'React & TypeScript · Accessible UI · Cloud-Ready APIs',
    previewBullets: ['Responsive across viewports', 'WCAG-aligned usability', 'Modular component design'],
    icon: Globe,
  },
];

interface LifecycleStage {
  id: string;
  step: string;
  title: string;
  description: string;
  outputs: string[];
  icon: typeof Compass;
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover & Consult',
    description: 'Understand business requirements and project objectives.',
    outputs: ['Stakeholder discovery workshops', 'Technical feasibility & scope map', 'Success criteria alignment'],
    icon: Compass,
  },
  {
    id: 'plan',
    step: '02',
    title: 'Plan & Design',
    description: 'Define architecture, workflows, and user experiences.',
    outputs: ['System & API blueprints', 'Interactive UX wireframes', 'Security & data modeling'],
    icon: PenTool,
  },
  {
    id: 'develop',
    step: '03',
    title: 'Develop & Integrate',
    description: 'Build scalable applications and integrate required systems.',
    outputs: ['Modular frontend & backend code', 'Enterprise ERP/CRM integrations', 'Iterative sprint reviews'],
    icon: Code2,
  },
  {
    id: 'test',
    step: '04',
    title: 'Test & Validate',
    description: 'Ensure performance, quality, security, and reliability.',
    outputs: ['Cross-device & browser QA', 'Security & load validation', 'User acceptance sign-off'],
    icon: TestTube2,
  },
  {
    id: 'deploy',
    step: '05',
    title: 'Deploy & Maintain',
    description: 'Launch applications and provide continuous improvements.',
    outputs: ['Controlled production rollout', 'Ongoing enhancements & monitoring', 'Long-term team enablement'],
    icon: Rocket,
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

export function ApplicationDevelopmentPage({
  onOpenBriefing,
}: ApplicationDevelopmentPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [activeHeroTab, setActiveHeroTab] = useState<HeroTabId>('web');
  const [activeArchLayer, setActiveArchLayer] = useState<number>(0);
  const [activeWhyIndex, setActiveWhyIndex] = useState<number>(0);
  const [capabilityFilter, setCapabilityFilter] = useState<CapabilityGroupFilter>('all');
  const [activePlatformId, setActivePlatformId] = useState<PlatformCapability['id']>('ios');
  const [activeLifecycleIdx, setActiveLifecycleIdx] = useState<number>(0);

  const heroWorkspace =
    HERO_WORKSPACES.find((item) => item.id === activeHeroTab) ?? HERO_WORKSPACES[0];
  const activePlatform =
    MOBILE_WEB_CAPABILITIES.find((item) => item.id === activePlatformId) ??
    MOBILE_WEB_CAPABILITIES[0];
  const activeStage = LIFECYCLE_STAGES[activeLifecycleIdx] ?? LIFECYCLE_STAGES[0];

  const scrollToCapabilities = () => {
    const target = document.getElementById('app-core-capabilities');
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
          SECTION 1: HERO SECTION (Light Theme + Interactive Software Composition)
         ===================================================================== */}
      <section
        aria-labelledby="app-dev-hero-heading"
        className="apokrin-hero-light relative overflow-hidden border-b border-[#E2E8F0] py-12 sm:py-16 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full opacity-45 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
          }}
        />

        <div className="apokrin-container relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Title, Subtitle & Primary CTA */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <SectionBadgeWithDot label="Custom Software & Digital Engineering" />

              <h1
                id="app-dev-hero-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Application Development{' '}
                <span className="apokrin-gradient-text">Services</span>
              </h1>

              <p className="mt-4 max-w-xl font-display text-lg font-bold tracking-tight text-[#1E293B] sm:text-xl">
                Empowering Your Digital Vision with Scalable, Tailored Applications.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#475569] sm:text-base">
                From strategic architecture consulting to native iOS, Android, and modern web
                engineering, Apokrin builds resilient software tailored to your enterprise goals.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={scrollToCapabilities}
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Explore Our Solutions</span>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Right Column: Interactive Code Window + Floating UI & Mobile Mockup */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              {/* Floating Top-Left UI Component Block */}
              <div
                aria-hidden="true"
                className="apokrin-clay-bob-1 pointer-events-none absolute -left-3 -top-5 z-20 hidden rounded-2xl border border-white/95 bg-white/92 px-3.5 py-2.5 shadow-[0_14px_32px_-10px_rgba(15,23,42,0.16)] backdrop-blur-md sm:flex sm:items-center sm:gap-2.5"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                  style={{ background: 'var(--color-btn-gradient)' }}
                >
                  <Blocks className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-[#0A1128]">
                    {heroWorkspace.componentCards[0]}
                  </p>
                  <p className="text-[11px] text-[#64748B]">{heroWorkspace.componentCards[1]}</p>
                </div>
              </div>

              {/* Main Software Workbench Canvas */}
              <div className="apokrin-clay-panel relative rounded-[2rem] border border-white/95 p-5 sm:p-7">
                {/* Interactive Target Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-2">
                    <Code2
                      className="h-4.5 w-4.5"
                      style={{ color: themeConfig.primaryStrong }}
                      aria-hidden="true"
                    />
                    <span className="font-display text-sm font-bold text-[#0A1128]">
                      Engineering Studio
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Preview application engineering layer"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1"
                  >
                    {HERO_WORKSPACES.map((ws) => {
                      const active = ws.id === activeHeroTab;
                      return (
                        <button
                          key={ws.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setActiveHeroTab(ws.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                            active ? 'bg-white shadow-sm' : 'text-[#64748B] hover:text-[#0A1128]'
                          }`}
                          style={active ? { color: themeConfig.primaryStrong } : undefined}
                        >
                          {ws.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Code Snippet Panel + Embedded Device Preview */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Dark IDE Snippet Frame */}
                  <div className="rounded-2xl bg-[#0F172A] p-4 text-slate-200 shadow-inner sm:col-span-8">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {heroWorkspace.fileName}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.pre
                        key={heroWorkspace.id}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-slate-200"
                      >
                        {heroWorkspace.codeLines.map((line, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="select-none text-slate-500 tabular-nums">{i + 1}</span>
                            <code className="whitespace-pre">{line}</code>
                          </div>
                        ))}
                      </motion.pre>
                    </AnimatePresence>
                  </div>

                  {/* Floating-Feel Responsive Device Preview */}
                  <div className="apokrin-clay-bob-0 flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm sm:col-span-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: 'var(--color-surface-soft)',
                          color: themeConfig.primaryStrong,
                        }}
                      >
                        Preview
                      </span>
                      <Smartphone
                        className="h-4 w-4"
                        style={{ color: themeConfig.secondaryText }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="my-3 space-y-2">
                      <div
                        className="h-2.5 w-4/5 rounded-full"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      />
                      <div className="h-2 w-full rounded-full bg-[#E2E8F0]" />
                      <div className="h-2 w-2/3 rounded-full bg-[#E2E8F0]" />
                      <div
                        className="mt-2 grid grid-cols-2 gap-1.5 pt-1"
                        aria-hidden="true"
                      >
                        <div
                          className="h-7 rounded-lg"
                          style={{ backgroundColor: 'var(--color-surface-soft)' }}
                        />
                        <div
                          className="h-7 rounded-lg"
                          style={{ backgroundColor: 'var(--color-surface-tint)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="font-display text-xs font-bold text-[#0A1128]">
                        {heroWorkspace.mobileTitle}
                      </p>
                      <p className="text-[11px] text-[#64748B]">{heroWorkspace.mobileTagline}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Stack Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-[#475569]">
                  {['Custom Consulting', 'iOS & Android', 'Modern Web', 'Cross-Device QA'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: INTRODUCTION (Asymmetric Split Layout)
         ===================================================================== */}
      <section
        aria-labelledby="app-dev-intro-heading"
        className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Side: Interactive Layered Software Architecture Diagram */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 lg:col-span-5"
            >
              <div className="apokrin-clay-panel rounded-[2rem] border border-white/95 p-6 sm:p-7">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <p className="font-display text-sm font-bold text-[#0A1128]">
                    Layered Application Architecture
                  </p>
                  <span className="font-mono text-[11px] text-[#64748B]">Interactive Stack</span>
                </div>

                <div className="mt-5 space-y-3">
                  {ARCH_STACK_LAYERS.map((layer, idx) => {
                    const LayerIcon = layer.icon;
                    const isSelected = activeArchLayer === idx;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setActiveArchLayer(idx)}
                        onMouseEnter={() => setActiveArchLayer(idx)}
                        aria-pressed={isSelected}
                        style={{
                          borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                          backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                          boxShadow: isSelected
                            ? `0 12px 26px -10px ${themeConfig.glow}`
                            : 'none',
                        }}
                        className="flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                          style={
                            isSelected
                              ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                              : {
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: 'var(--color-primary-strong)',
                                }
                          }
                        >
                          <LayerIcon className="h-5 w-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-display text-sm font-bold text-[#0A1128]">
                              {layer.title}
                            </p>
                            <span className="font-mono text-[11px] font-semibold text-[#64748B]">
                              {layer.number}
                            </span>
                          </div>
                          <p
                            className="mt-0.5 text-xs font-semibold"
                            style={{ color: themeConfig.secondaryText }}
                          >
                            {layer.subtitle}
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                            {layer.detail}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Badge, Heading & Exact Introduction Content */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 lg:col-span-7"
            >
              <SectionBadgeWithDot label="Application Development" />

              <h2
                id="app-dev-intro-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Custom Application Development{' '}
                <span className="apokrin-gradient-text">Solutions</span>
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#475569] sm:text-base">
                <p>
                  At Apokrin, we specialize in delivering custom application development solutions
                  that address your most complex IT challenges. As a leading application
                  development company, our mission is to design and build applications that not
                  only meet your needs but elevate your entire digital experience.
                </p>
                <p>
                  Whether you&apos;re starting from scratch or optimizing an existing system, our
                  team brings deep industry expertise and a collaborative approach to every project.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0A1128]">
                    Greenfield Digital Builds
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                    Architect and launch new web and mobile applications aligned with business goals.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="font-display text-sm font-bold text-[#0A1128]">
                    Legacy System Optimization
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                    Modernize workflows, enhance maintainability, and eliminate operational bottlenecks.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHY CHOOSE US? (Connected Horizontal Storytelling Layout)
         ===================================================================== */}
      <section
        aria-labelledby="app-dev-why-heading"
        className="apokrin-clay-section border-b py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Why Choose Us?" />

            <h2
              id="app-dev-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              A Collaborative Engineering Model{' '}
              <span className="apokrin-gradient-text">Built Around Your Team</span>
            </h2>
          </motion.div>

          {/* Horizontal Connected Storytelling Track */}
          <div className="relative mt-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-1 rounded-full lg:block"
              style={{ backgroundColor: 'var(--color-track)' }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={false}
                animate={{ width: `${(activeWhyIndex / (WHY_CHOOSE_STORIES.length - 1)) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'var(--color-btn-gradient)' }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {WHY_CHOOSE_STORIES.map((story, idx) => {
                const Icon = story.icon;
                const isSelected = activeWhyIndex === idx;

                return (
                  <motion.button
                    key={story.id}
                    type="button"
                    onClick={() => setActiveWhyIndex(idx)}
                    onMouseEnter={() => setActiveWhyIndex(idx)}
                    aria-pressed={isSelected}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: prefersReducedMotion ? 0 : idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      borderColor: isSelected ? themeConfig.primaryStrong : 'rgba(255,255,255,0.95)',
                      boxShadow: isSelected
                        ? `0 20px 38px -14px ${themeConfig.glow}`
                        : undefined,
                    }}
                    className="apokrin-clay-panel group relative flex h-full flex-col justify-between rounded-[1.85rem] border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] sm:p-7"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
                          style={
                            isSelected
                              ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                              : {
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: 'var(--color-primary-strong)',
                                }
                          }
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>

                        <span
                          className="rounded-full px-3 py-1 font-mono text-xs font-bold"
                          style={{
                            backgroundColor: 'var(--color-surface-soft)',
                            color: themeConfig.primaryStrong,
                          }}
                        >
                          {story.step} · {story.badge}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-lg font-extrabold text-[#0A1128] sm:text-xl">
                        {story.heading}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                        {story.content}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-xs font-semibold text-[#64748B]">
                      {story.highlight}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: CORE CAPABILITIES (Asymmetric Bento + Interactive Platform Preview)
         ===================================================================== */}
      <section
        id="app-core-capabilities"
        aria-labelledby="app-core-capabilities-heading"
        className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          {/* Header + Capability Group Switcher */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <SectionBadgeWithDot label="Core Capabilities" />

              <h2
                id="app-core-capabilities-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Full-Stack Engineering Across{' '}
                <span className="apokrin-gradient-text">Custom, Mobile &amp; Web</span>
              </h2>

              <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Delivering future-ready, scalable, and efficient software solutions tailored to your
                business needs.
              </p>
            </motion.div>

            {/* Interactive Group Filter */}
            <div
              role="group"
              aria-label="Filter core capabilities group"
              className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5"
            >
              {(
                [
                  { id: 'all', label: 'All Capabilities' },
                  { id: 'custom', label: 'A. Custom Applications' },
                  { id: 'mobile-web', label: 'B. Mobile & Web' },
                ] as { id: CapabilityGroupFilter; label: string }[]
              ).map((item) => {
                const active = capabilityFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCapabilityFilter(item.id)}
                    aria-pressed={active}
                    style={
                      active
                        ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                        : undefined
                    }
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                      active ? 'shadow-sm' : 'text-[#475569] hover:text-[#0A1128]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 space-y-12">
            {/* GROUP A: CUSTOM APPLICATION DEVELOPMENT (Asymmetric 5 / 7 Bento) */}
            {(capabilityFilter === 'all' || capabilityFilter === 'custom') && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    A
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Custom Application Development
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Feature A1: Consulting (Featured Dark-Slate Architectural Bento Block) */}
                  <motion.article
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-[1.85rem] bg-[#0A1128] p-7 text-white shadow-[0_20px_42px_-16px_rgba(10,17,40,0.45)] sm:p-8 lg:col-span-5"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-35 blur-2xl"
                      style={{ background: themeConfig.primary }}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                          style={{ background: 'var(--color-btn-gradient)' }}
                        >
                          <Compass className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          A.01
                        </span>
                      </div>

                      <h4 className="mt-6 font-display text-xl font-extrabold text-white sm:text-2xl">
                        Application Development Consulting
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                        Strategic guidance from ideation to deployment for optimal results.
                      </p>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center text-[11px] font-semibold text-slate-300">
                      <div className="rounded-xl bg-white/8 px-2 py-2">Ideation</div>
                      <div className="rounded-xl bg-white/8 px-2 py-2">Architecture</div>
                      <div className="rounded-xl bg-white/8 px-2 py-2">Deployment</div>
                    </div>
                  </motion.article>

                  {/* Features A2 & A3: Stacked Horizontal Claymorphism Cards */}
                  <div className="flex flex-col gap-6 lg:col-span-7">
                    <motion.article
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      className="apokrin-clay-card flex flex-1 flex-col justify-between border border-white/95 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            backgroundColor: 'var(--color-surface-soft)',
                            color: 'var(--color-primary-strong)',
                          }}
                        >
                          <Wrench className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-semibold text-[#64748B]">
                            A.02
                          </span>
                          <h4 className="font-display text-lg font-extrabold text-[#0A1128] sm:text-xl">
                            Application Maintenance &amp; Support
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                            Ongoing support, enhancements, and issue resolution to keep your apps
                            performing.
                          </p>
                        </div>
                      </div>
                    </motion.article>

                    <motion.article
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      className="apokrin-clay-card flex flex-1 flex-col justify-between border border-white/95 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                          style={{ background: 'var(--color-btn-gradient)' }}
                        >
                          <Cpu className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-semibold text-[#64748B]">
                            A.03
                          </span>
                          <h4 className="font-display text-lg font-extrabold text-[#0A1128] sm:text-xl">
                            Advanced Software Solutions
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                            Innovative software built using the latest technologies to drive digital
                            growth.
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP B: MOBILE & WEB APPLICATION DEVELOPMENT (Interactive Preview + 2x2 Matrix) */}
            {(capabilityFilter === 'all' || capabilityFilter === 'mobile-web') && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    B
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Mobile &amp; Web Application Development
                  </h3>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                  {/* Left: Interactive Platform Showcase Frame */}
                  <div className="lg:col-span-5">
                    <div className="apokrin-clay-panel flex h-full flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="apokrin-badge rounded-full px-3 py-1 text-[11px] font-semibold">
                            {activePlatform.previewBadge}
                          </span>
                          <Laptop
                            className="h-5 w-5"
                            style={{ color: themeConfig.primaryStrong }}
                            aria-hidden="true"
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activePlatform.id}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-6"
                          >
                            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                                  style={{ background: 'var(--color-btn-gradient)' }}
                                >
                                  <activePlatform.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                  <h4 className="font-display text-base font-extrabold text-[#0A1128]">
                                    {activePlatform.previewHeader}
                                  </h4>
                                  <p className="text-xs font-medium text-[#64748B]">
                                    {activePlatform.previewSub}
                                  </p>
                                </div>
                              </div>

                              <ul className="mt-5 space-y-2.5 border-t border-[#E2E8F0] pt-4">
                                {activePlatform.previewBullets.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-center gap-2.5 text-xs font-semibold text-[#334155]"
                                  >
                                    <CheckCircle2
                                      className="h-4 w-4 shrink-0"
                                      style={{ color: themeConfig.primaryStrong }}
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <p className="mt-5 text-xs text-[#64748B]">
                        Select any capability tile to inspect its platform engineering focus.
                      </p>
                    </div>
                  </div>

                  {/* Right: 4-Tile Interactive Mobile & Web Capability Grid */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
                    {MOBILE_WEB_CAPABILITIES.map((cap, idx) => {
                      const CapIcon = cap.icon;
                      const isActive = activePlatformId === cap.id;

                      return (
                        <motion.button
                          key={cap.id}
                          type="button"
                          onClick={() => setActivePlatformId(cap.id)}
                          onMouseEnter={() => setActivePlatformId(cap.id)}
                          aria-pressed={isActive}
                          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                          style={{
                            borderColor: isActive ? themeConfig.primaryStrong : '#E2E8F0',
                            boxShadow: isActive
                              ? `0 16px 34px -14px ${themeConfig.glow}`
                              : '0 6px 20px -10px rgba(15,23,42,0.06)',
                          }}
                          className="flex h-full flex-col justify-between rounded-[1.5rem] border bg-white p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <div
                                className="flex h-11 w-11 items-center justify-center rounded-2xl transition-colors"
                                style={
                                  isActive
                                    ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                                    : {
                                        backgroundColor: 'var(--color-surface-soft)',
                                        color: 'var(--color-primary-strong)',
                                      }
                                }
                              >
                                <CapIcon className="h-5 w-5" aria-hidden="true" />
                              </div>
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                B.0{idx + 1}
                              </span>
                            </div>

                            <h4 className="mt-4 font-display text-base font-extrabold text-[#0A1128] sm:text-lg">
                              {cap.title}
                            </h4>

                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                              {cap.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: DEVELOPMENT LIFECYCLE (Interactive Horizontal 5-Stage Journey)
         ===================================================================== */}
      <section
        aria-labelledby="app-lifecycle-heading"
        className="apokrin-surface-section border-b border-[#E2E8F0] py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Development Lifecycle" />

            <h2
              id="app-lifecycle-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              A Proven Path From Concept to{' '}
              <span className="apokrin-gradient-text">Continuous Delivery</span>
            </h2>
          </motion.div>

          {/* Horizontal Connected Timeline */}
          <div className="relative mt-12">
            {/* Desktop Horizontal Track */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[10%] right-[10%] top-[46px] hidden h-1 rounded-full lg:block"
              style={{ backgroundColor: 'var(--color-track)' }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={false}
                animate={{
                  width: `${(activeLifecycleIdx / (LIFECYCLE_STAGES.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'var(--color-btn-gradient)' }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {LIFECYCLE_STAGES.map((stage, idx) => {
                const StageIcon = stage.icon;
                const isCurrent = activeLifecycleIdx === idx;
                const isCompletedOrCurrent = idx <= activeLifecycleIdx;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveLifecycleIdx(idx)}
                    onMouseEnter={() => setActiveLifecycleIdx(idx)}
                    aria-pressed={isCurrent}
                    style={{
                      borderColor: isCurrent ? themeConfig.primaryStrong : '#E2E8F0',
                      backgroundColor: isCurrent ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
                      boxShadow: isCurrent
                        ? `0 16px 32px -12px ${themeConfig.glow}`
                        : '0 4px 12px rgba(15,23,42,0.03)',
                    }}
                    className="relative z-10 flex h-full flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
                          style={
                            isCompletedOrCurrent
                              ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                              : {
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: themeConfig.primaryStrong,
                                }
                          }
                        >
                          <StageIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#64748B]">
                          {stage.step}
                        </span>
                      </div>

                      <h3
                        className="mt-4 font-display text-base font-extrabold"
                        style={{ color: isCurrent ? themeConfig.primaryStrong : '#0A1128' }}
                      >
                        {stage.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-relaxed text-[#475569] sm:text-[13px]">
                        {stage.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Lifecycle Stage Deliverable Strip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="apokrin-clay-panel mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/95 p-5 sm:flex-row sm:items-center sm:p-6"
              >
                <div>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: themeConfig.primaryStrong }}
                  >
                    Stage {activeStage.step} · {activeStage.title}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#0A1128]">
                    {activeStage.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeStage.outputs.map((out) => (
                    <span
                      key={out}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155]"
                    >
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: themeConfig.primaryStrong }}
                        aria-hidden="true"
                      />
                      <span>{out}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: FINAL CTA (Claymorphism Banner)
         ===================================================================== */}
      <section aria-labelledby="app-dev-final-cta" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-12 text-center sm:px-12 sm:py-16"
          >
            {/* Subtle Floating Clay Engineering Accents */}
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <Code2 className="h-6 w-6" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <Sparkles className="h-6 w-6" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <SectionBadgeWithDot label="Start Your Build" />

              <h2
                id="app-dev-final-cta"
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl lg:text-4xl"
              >
                Ready to Transform Your{' '}
                <span className="apokrin-gradient-text">Application Development?</span>
              </h2>

              <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Partner with Apokrin to architect, build, test, and evolve custom web and mobile
                applications tailored to your business goals.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      'Cloud Engineering',
                      'Contact Sales inquiry regarding Apokrin Application Development Services.',
                    )
                  }
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
    </div>
  );
}
