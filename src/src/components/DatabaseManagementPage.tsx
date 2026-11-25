import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Compass,
  Database,
  FileKey2,
  Gauge,
  HardDriveDownload,
  Layers,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import dbmsIntroImg from '../assets/images/enterprise_database_infrastructure_1794909045366.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { ServiceArchitectureDiagram3D } from './ServiceArchitectureDiagram3D';

interface DatabaseManagementPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface WhyChooseDbmsItem {
  id: string;
  number: string;
  title: string;
  description: string;
  blueprintSubtitle: string;
  pillars: string[];
  icon: typeof Workflow;
}

const WHY_CHOOSE_ITEMS: WhyChooseDbmsItem[] = [
  {
    id: 'end-to-end',
    number: '01',
    title: 'End-to-End Database Solutions',
    description:
      'From remote administration to disaster recovery, we offer comprehensive services that ensure the health, performance, and security of your database infrastructure.',
    blueprintSubtitle: 'Full Lifecycle DBA Governance',
    pillars: [
      '24/7 remote administration & maintenance',
      'Hardened installation & proactive health checks',
      'Validated backup & disaster recovery readiness',
    ],
    icon: Workflow,
  },
  {
    id: 'modernization-cloud',
    number: '02',
    title: 'Modernization & Cloud Integration',
    description:
      "Whether you're working with legacy systems or transitioning to the cloud, our team ensures smooth migrations, seamless integration, and future-ready architectures.",
    blueprintSubtitle: 'Cloud & Hybrid Database Evolution',
    pillars: [
      'Low-risk legacy database migrations',
      'Hybrid & multi-cloud workload alignment',
      'Tight integration with modern app tiers',
    ],
    icon: Cloud,
  },
  {
    id: 'performance-uptime',
    number: '03',
    title: 'Performance & Uptime Optimization',
    description:
      'We maximize system availability and efficiency through proactive monitoring, tuning, and real-time issue resolution.',
    blueprintSubtitle: 'Continuous Speed & Availability',
    pillars: [
      'Deep SQL & workload bottleneck tuning',
      'Real-time anomaly & lock detection',
      'Application server connection efficiency',
    ],
    icon: Zap,
  },
  {
    id: 'secure-scalable',
    number: '04',
    title: 'Secure & Scalable Infrastructure',
    description:
      'Our solutions are built to adapt with your business—ensuring data integrity, regulatory compliance, and scalable growth across all environments.',
    blueprintSubtitle: 'Hardened & Compliant Foundation',
    pillars: [
      'Role-based access & compliance hardening',
      'Cross-region replication & data integrity',
      'Capacity planning for enterprise growth',
    ],
    icon: ShieldCheck,
  },
];

type CapabilityCategoryFilter = 'all' | 'remote-dba' | 'continuity' | 'licensing';

interface CapabilityEntry {
  id: string;
  code: string;
  title: string;
  description: string;
  tags: string[];
  icon: typeof Server;
}

const REMOTE_DBA_CAPABILITIES: CapabilityEntry[] = [
  {
    id: 'remote-dba',
    code: '1.01',
    title: 'Remote Database Administration',
    description: '24/7 monitoring, maintenance, and incident response across all environments.',
    tags: ['24/7 Monitoring', 'Proactive Maintenance', 'Incident Response'],
    icon: Server,
  },
  {
    id: 'health-tuning',
    code: '1.02',
    title: 'Health Checks & Performance Tuning',
    description: 'Proactive assessments and optimization to boost database efficiency.',
    tags: ['Workload Diagnostics', 'Index & Query Tuning'],
    icon: Gauge,
  },
  {
    id: 'secure-install',
    code: '1.03',
    title: 'Secure Installation & Configuration',
    description: 'Hardened setups to ensure security, compliance, and high availability.',
    tags: ['Security Hardening', 'HA Configuration'],
    icon: ShieldCheck,
  },
  {
    id: 'app-server-integration',
    code: '1.04',
    title: 'Application Server Integration',
    description: 'Seamless connectivity with application environments for peak performance.',
    tags: ['Connection Pooling', 'API & Middleware Sync'],
    icon: Layers,
  },
];

const CONTINUITY_CAPABILITIES: CapabilityEntry[] = [
  {
    id: 'backup-recovery',
    code: '2.01',
    title: 'Data Backup & Recovery Solutions',
    description: 'Automated backups and rapid recovery strategies to minimize downtime.',
    tags: ['Automated Snapshots', 'Point-in-Time Recovery'],
    icon: HardDriveDownload,
  },
  {
    id: 'replication-sync',
    code: '2.02',
    title: 'Database Replication & Synchronization',
    description: 'Real-time data replication across regions and systems for consistency.',
    tags: ['Cross-Region Sync', 'Consistent Replicas'],
    icon: RefreshCw,
  },
  {
    id: 'disaster-recovery',
    code: '2.03',
    title: 'Disaster Recovery Planning',
    description: 'Robust DR strategies ensuring operational resilience and minimal data loss.',
    tags: ['Failover Architecture', 'Zero-Loss Continuity'],
    icon: ShieldAlert,
  },
];

const LICENSING_CAPABILITIES: CapabilityEntry[] = [
  {
    id: 'software-licensing',
    code: '3.01',
    title: 'Database Software & Licensing Solutions',
    description: 'Advisory and procurement support for cost-effective database licensing.',
    tags: ['License Optimization', 'Enterprise Procurement'],
    icon: FileKey2,
  },
  {
    id: 'professional-consulting',
    code: '3.02',
    title: 'Professional Consulting Services',
    description: 'End-to-end consulting on architecture, scalability, and migration strategies.',
    tags: ['Architecture Advisory', 'Migration Strategy'],
    icon: Compass,
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

export function DatabaseManagementPage({
  onNavigate,
  onOpenBriefing,
}: DatabaseManagementPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [activeWhyIdx, setActiveWhyIdx] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<CapabilityCategoryFilter>('all');
  const [activeContinuityId, setActiveContinuityId] = useState<string>(
    CONTINUITY_CAPABILITIES[0].id,
  );
  const [introImgFailed, setIntroImgFailed] = useState<boolean>(false);

  const activeWhy = WHY_CHOOSE_ITEMS[activeWhyIdx] ?? WHY_CHOOSE_ITEMS[0];
  const activeContinuity =
    CONTINUITY_CAPABILITIES.find((c) => c.id === activeContinuityId) ??
    CONTINUITY_CAPABILITIES[0];

  const featuredDba = REMOTE_DBA_CAPABILITIES[0];
  const secondaryDba = REMOTE_DBA_CAPABILITIES.slice(1);

  const scrollToCapabilities = () => {
    const target = document.getElementById('dbms-capabilities');
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
          SECTION 1: HERO – DATABASE MANAGEMENT SYSTEM SERVICES
         ===================================================================== */}
      <section
        aria-labelledby="dbms-hero-heading"
        className="apokrin-hero-light relative overflow-hidden border-b border-[#E2E8F0] py-10 sm:py-14 lg:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full opacity-45 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
          }}
        />

        <div className="apokrin-container relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Title, Subtitle & Action CTAs */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <SectionBadgeWithDot label="Enterprise Database Engineering" />

              <h1
                id="dbms-hero-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Database Management System{' '}
                <span className="apokrin-gradient-text">Services</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
                Reliable, secure, and scalable database solutions tailored to power your
                enterprise&apos;s digital backbone.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={scrollToCapabilities}
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Explore Our Capabilities</span>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D Database Cluster & Replication Diagram */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              <ServiceArchitectureDiagram3D
                variant="database"
                prefersReducedMotion={Boolean(prefersReducedMotion)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: INTRODUCTION – COMPREHENSIVE DATABASE MANAGEMENT SOLUTIONS
         ===================================================================== */}
      <section
        aria-labelledby="dbms-intro-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left 5 Cols: Enterprise Database Infrastructure Image Inside Clay Frame */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                        <Database className="h-7 w-7 text-white" aria-hidden="true" />
                      </div>
                      <p className="font-display text-base font-bold">
                        Enterprise Database Infrastructure
                      </p>
                      <p className="max-w-xs text-xs text-slate-300">
                        High-availability clusters, proactive DBA monitoring, and hardened data
                        security across cloud and on-premises environments.
                      </p>
                    </div>
                  ) : (
                    <img
                      src={dbmsIntroImg}
                      alt="Enterprise database server racks and relational schema engineering workstation"
                      referrerPolicy="no-referrer"
                      onError={() => setIntroImgFailed(true)}
                      className="aspect-[4/3] h-full w-full object-cover lg:min-h-[320px]"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 px-3 pb-1.5 pt-3 text-xs font-semibold text-[#475569]">
                  <span>Enterprise Data Infrastructure</span>
                  <span className="font-mono text-[11px]" style={{ color: themeConfig.primaryStrong }}>
                    Cloud · Hybrid · On-Premises
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right 7 Cols: Heading, Comprehensive DBMS Narrative & Focus Pillars */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <div>
                <SectionBadgeWithDot label="Enterprise Database Expertise" />
              </div>

              <h2
                id="dbms-intro-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Comprehensive Database{' '}
                <span className="apokrin-gradient-text">Management Solutions</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                Apokrin delivers comprehensive database management expertise engineered to keep your
                mission-critical data platforms fast, resilient, and protected. From foundational
                database infrastructure architecture and 24/7 remote administration to continuous
                performance optimization, hardened security governance, and high-availability
                continuity, we help enterprises modernize and manage complex data estates with
                confidence.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {[
                  {
                    title: 'Infrastructure & HA',
                    detail: 'Resilient architecture across cloud, hybrid, and on-prem deployments.',
                    icon: Server,
                  },
                  {
                    title: 'Performance Tuning',
                    detail: 'Proactive diagnostics, indexing, and query optimization at scale.',
                    icon: Gauge,
                  },
                  {
                    title: 'Security & Compliance',
                    detail: 'Hardened configurations, encryption controls, and audit readiness.',
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const PillarIcon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                    >
                      <div className="flex items-center gap-2">
                        <PillarIcon
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHY CHOOSE US? (4 Pillars + Interactive Blueprint Panel)
         ===================================================================== */}
      <section
        aria-labelledby="dbms-why-heading"
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
              id="dbms-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Engineered for{' '}
              <span className="apokrin-gradient-text">
                Uptime, Modernization &amp; Enterprise Security
              </span>
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: 2x2 Interactive Feature Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              {WHY_CHOOSE_ITEMS.map((item, idx) => {
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

            {/* Right 5 Cols: Dynamic Blueprint Card */}
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
                          'Data Platforms',
                          `Database inquiry focused on: ${activeWhy.title}.`,
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      style={{ color: themeConfig.primaryStrong }}
                    >
                      <span>Consult with our database architects</span>
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
          SECTION 4: CORE CAPABILITIES (3 Major Categories · 9 Capabilities)
         ===================================================================== */}
      <section
        id="dbms-capabilities"
        aria-labelledby="dbms-capabilities-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          {/* Header & Interactive Category Switcher */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <SectionBadgeWithDot label="Core Capabilities" />

              <h2
                id="dbms-capabilities-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Enterprise Database{' '}
                <span className="apokrin-gradient-text">Administration, Continuity &amp; Advisory</span>
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filter database capability categories"
              className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5"
            >
              {(
                [
                  { id: 'all', label: 'All Categories' },
                  { id: 'remote-dba', label: 'Remote DBA & Optimization' },
                  { id: 'continuity', label: 'Data Integrity & Continuity' },
                  { id: 'licensing', label: 'Licensing & Services' },
                ] as { id: CapabilityCategoryFilter; label: string }[]
              ).map((tab) => {
                const isActive = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                      isActive ? 'text-white shadow-sm' : 'text-[#475569] hover:text-[#0A1128]'
                    }`}
                    style={
                      isActive ? { background: 'var(--color-btn-gradient)' } : undefined
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-10">
            {/* CATEGORY 1: REMOTE DBA & OPTIMIZATION (4 Capabilities) */}
            {(categoryFilter === 'all' || categoryFilter === 'remote-dba') && (
              <div>
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      01
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      Remote DBA &amp; Optimization
                    </h3>
                  </div>
                  <p className="text-sm text-[#475569]">
                    Expert database management and performance tuning tailored to your
                    infrastructure.
                  </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                  {/* Featured Dark Anchor Card (1.01 Remote Database Administration) */}
                  <motion.article
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#0A1128] p-6 text-white shadow-[0_20px_42px_-16px_rgba(10,17,40,0.45)] sm:p-7 lg:col-span-5"
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
                          <featuredDba.icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          {featuredDba.code}
                        </span>
                      </div>

                      <h4 className="mt-6 font-display text-xl font-extrabold text-white sm:text-2xl">
                        {featuredDba.title}
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                        {featuredDba.description}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center text-[11px] font-semibold text-slate-300">
                      {featuredDba.tags.map((tag) => (
                        <div key={tag} className="rounded-xl bg-white/8 px-2 py-2">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </motion.article>

                  {/* 3 Scannable Claymorphism Capability Cards (1.02 - 1.04) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
                    {secondaryDba.map((cap, idx) => {
                      const CapIcon = cap.icon;
                      return (
                        <motion.article
                          key={cap.id}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.4,
                            delay: idx * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                          className="apokrin-clay-card flex flex-col justify-between border border-white/95 p-5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: themeConfig.primaryStrong,
                                  border: '1px solid var(--color-border-tint)',
                                }}
                              >
                                <CapIcon className="h-4.5 w-4.5" aria-hidden="true" />
                              </div>
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                {cap.code}
                              </span>
                            </div>

                            <h4 className="mt-4 font-display text-base font-extrabold text-[#0A1128]">
                              {cap.title}
                            </h4>

                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                              {cap.description}
                            </p>
                          </div>

                          <div className="mt-4 border-t border-[#E2E8F0] pt-3 text-[11px] font-medium text-[#64748B]">
                            <span>{cap.tags[0]}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{cap.tags[1]}</span>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 2: DATA INTEGRITY & CONTINUITY (3 Capabilities + Interactive Preview) */}
            {(categoryFilter === 'all' || categoryFilter === 'continuity') && (
              <div>
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      02
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      Data Integrity &amp; Continuity
                    </h3>
                  </div>
                  <p className="text-sm text-[#475569]">
                    Reliable systems to protect your critical data and ensure business continuity.
                  </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                  {/* Left 7 Cols: 3 Interactive Continuity Cards */}
                  <div className="flex flex-col gap-3.5 lg:col-span-7">
                    {CONTINUITY_CAPABILITIES.map((cap) => {
                      const CapIcon = cap.icon;
                      const isActive = activeContinuityId === cap.id;

                      return (
                        <motion.button
                          key={cap.id}
                          type="button"
                          onClick={() => setActiveContinuityId(cap.id)}
                          onMouseEnter={() => setActiveContinuityId(cap.id)}
                          aria-pressed={isActive}
                          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                          style={{
                            borderColor: isActive ? themeConfig.primaryStrong : '#E2E8F0',
                            boxShadow: isActive
                              ? `0 16px 34px -14px ${themeConfig.glow}`
                              : '0 6px 18px -10px rgba(15,23,42,0.06)',
                          }}
                          className="flex items-start gap-4 rounded-[1.5rem] border bg-white p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                        >
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors"
                            style={
                              isActive
                                ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                                : {
                                    backgroundColor: 'var(--color-surface-soft)',
                                    color: themeConfig.primaryStrong,
                                  }
                            }
                          >
                            <CapIcon className="h-5 w-5" aria-hidden="true" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-display text-base font-extrabold text-[#0A1128] sm:text-lg">
                                {cap.title}
                              </h4>
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                {cap.code}
                              </span>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                              {cap.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Right 5 Cols: Interactive Resilience Spotlight */}
                  <div className="lg:col-span-5">
                    <div className="apokrin-clay-panel flex h-full flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="apokrin-badge rounded-full px-3 py-1 text-[11px] font-semibold">
                            {activeContinuity.code} · Resilience Blueprint
                          </span>
                          <RefreshCw
                            className="h-5 w-5"
                            style={{ color: themeConfig.primaryStrong }}
                            aria-hidden="true"
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeContinuity.id}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-5"
                          >
                            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                                  style={{ background: 'var(--color-btn-gradient)' }}
                                >
                                  <activeContinuity.icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-display text-base font-extrabold text-[#0A1128]">
                                    {activeContinuity.title}
                                  </h4>
                                  <p className="text-xs font-medium text-[#64748B]">
                                    Data Integrity &amp; Continuity
                                  </p>
                                </div>
                              </div>

                              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                                {activeContinuity.description}
                              </p>

                              <ul className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4">
                                {activeContinuity.tags.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-center gap-2 text-xs font-semibold text-[#334155]"
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
                        Select any continuity safeguard on the left to inspect its operational
                        coverage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: LICENSING & PROFESSIONAL SERVICES (2 Capabilities) */}
            {(categoryFilter === 'all' || categoryFilter === 'licensing') && (
              <div>
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      03
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      Licensing &amp; Professional Services
                    </h3>
                  </div>
                  <p className="text-sm text-[#475569]">
                    Strategic consulting and licensing support for enterprise-grade database
                    solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {LICENSING_CAPABILITIES.map((cap, idx) => {
                    const CapIcon = cap.icon;
                    return (
                      <motion.article
                        key={cap.id}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.4,
                          delay: idx * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                        className="apokrin-clay-panel flex flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-7"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                            style={{ background: 'var(--color-btn-gradient)' }}
                          >
                            <CapIcon className="h-5 w-5" aria-hidden="true" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                {cap.code}
                              </span>
                            </div>

                            <h4 className="mt-1 font-display text-lg font-extrabold text-[#0A1128] sm:text-xl">
                              {cap.title}
                            </h4>

                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                              {cap.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                            <span>{cap.tags[0]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{cap.tags[1]}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenBriefing(
                                'Data Platforms',
                                `Inquiry regarding ${cap.title}.`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                            style={{ color: themeConfig.primaryStrong }}
                          >
                            <span>Request Advisory</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: FINAL CTA (Claymorphism Banner)
         ===================================================================== */}
      <section
        aria-labelledby="dbms-final-cta"
        className="apokrin-clay-section py-10 sm:py-14 lg:py-16"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-10 text-center sm:px-12 sm:py-14"
          >
            {/* Subtle Floating 3D Clay Accents */}
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <Database className="h-6 w-6" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <Sparkles className="h-6 w-6" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <SectionBadgeWithDot label="Get Started With Apokrin" />

              <h2
                id="dbms-final-cta"
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl lg:text-4xl"
              >
                Ready to Transform Your{' '}
                <span className="apokrin-gradient-text">Database Infrastructure?</span>
              </h2>

              <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Partner with Apokrin for 24/7 remote database administration, cloud migrations, high
                availability continuity, and strategic enterprise licensing advisory.
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
    </div>
  );
}
