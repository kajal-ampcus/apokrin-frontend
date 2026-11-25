import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  FileCheck2,
  GitBranch,
  Layers,
  Lock,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { ServiceArchitectureDiagram3D } from './ServiceArchitectureDiagram3D';

interface BigDataPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const INTRO_LAYERS = [
  {
    id: 'collect',
    step: '01',
    title: 'Real-Time Big Data Collection',
    detail: 'Capture high-volume structured and unstructured raw data streams continuously as events occur.',
    icon: Radio,
  },
  {
    id: 'truth',
    step: '02',
    title: 'Single Source of Truth',
    detail: 'Ensure data security, consistency, and centralized governance across even the largest datasets.',
    icon: Database,
  },
  {
    id: 'decide',
    step: '03',
    title: 'Actionable Insights & Speed',
    detail: 'Extract clear, decision-ready intelligence so your business stays ahead of shifting market demands.',
    icon: TrendingUp,
  },
];

interface WhyChooseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  architectureFocus: string;
  deliverables: string[];
  icon: typeof Workflow;
}

const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: 'end-to-end',
    number: '01',
    title: 'End-to-End Big Data Solutions',
    description:
      'From strategy and architecture to deployment and analytics, we deliver tailored services across the entire Big Data lifecycle.',
    architectureFocus: 'Full Lifecycle Engineering & Strategy',
    deliverables: [
      'Architecture roadmaps & platform selection',
      'Pipeline & lakehouse implementation',
      'Analytics rollout & long-term optimization',
    ],
    icon: Workflow,
  },
  {
    id: 'real-time',
    number: '02',
    title: 'Real-Time Data Capture & Processing',
    description:
      'Leverage advanced technologies for immediate data collection, processing, and analysis to support agile decision-making.',
    architectureFocus: 'Low-Latency Stream Processing',
    deliverables: [
      'Continuous multi-source event ingestion',
      'Stream transformation & enrichment workflows',
      'Immediate operational visibility & alerts',
    ],
    icon: Zap,
  },
  {
    id: 'scalable-secure',
    number: '03',
    title: 'Scalable & Secure Data Management',
    description:
      'Manage massive datasets confidently with enterprise-grade security and scalable storage architectures.',
    architectureFocus: 'Governed High-Volume Storage',
    deliverables: [
      'Cloud, multi-cloud & hybrid storage scaling',
      'Encryption, access governance & audit readiness',
      'Consistent single-source-of-truth lineage',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'predictive-ai',
    number: '04',
    title: 'Predictive Analytics & Automation',
    description:
      'Transform raw data into actionable insights through AI-driven analytics and intelligent automation.',
    architectureFocus: 'Automated Intelligence & Forecasting',
    deliverables: [
      'Predictive & prescriptive ML modeling',
      'Automated anomaly detection & workflows',
      'Executive decision dashboards & DSaaS',
    ],
    icon: BrainCircuit,
  },
];

type CapabilityGroupFilter = 'all' | 'engineering' | 'analytics';

interface CapabilityItem {
  id: string;
  code: string;
  title: string;
  description: string;
  focusLabel: string;
  tags: string[];
  icon: typeof Database;
}

const ENGINEERING_CAPABILITIES: CapabilityItem[] = [
  {
    id: 'data-ingestion',
    code: 'A.01',
    title: 'Data Ingestion',
    description: 'Integrate structured and unstructured data from diverse sources in real time.',
    focusLabel: 'Streaming & Batch Connectors',
    tags: ['Real-Time Streams', 'Unstructured Raw Data', 'API & DB Sync'],
    icon: Radio,
  },
  {
    id: 'etl-pipelines',
    code: 'A.02',
    title: 'ETL & Data Pipelines',
    description: 'Design and implement scalable pipelines for processing and transformation.',
    focusLabel: 'Automated Orchestration',
    tags: ['Batch & Streaming ETL', 'Fault-Tolerant Flows'],
    icon: GitBranch,
  },
  {
    id: 'lake-warehouse',
    code: 'A.03',
    title: 'Data Lake & Warehouse Architecture',
    description: 'Build unified storage and access layers for optimized querying and analytics.',
    focusLabel: 'Unified Query Layer',
    tags: ['Lakehouse Tiers', 'High-Speed Querying'],
    icon: Database,
  },
  {
    id: 'cloud-hybrid',
    code: 'A.04',
    title: 'Cloud & Hybrid Deployments',
    description: 'Deploy across AWS, Azure, GCP, or hybrid infrastructure with enterprise scalability.',
    focusLabel: 'Multi-Environment Infrastructure',
    tags: ['AWS / Azure / GCP', 'Hybrid Cloud Scale'],
    icon: Cloud,
  },
  {
    id: 'quality-governance',
    code: 'A.05',
    title: 'Data Quality & Governance',
    description: 'Enforce data accuracy, consistency, and compliance across all environments.',
    focusLabel: 'Lineage & Validation',
    tags: ['Schema Validation', 'Enterprise Governance'],
    icon: FileCheck2,
  },
];

const ANALYTICS_AI_CAPABILITIES: CapabilityItem[] = [
  {
    id: 'predictive-prescriptive',
    code: 'B.01',
    title: 'Predictive & Prescriptive Analytics',
    description: 'Forecast outcomes and recommend optimal actions using ML models.',
    focusLabel: 'Forward-Looking Decision Models',
    tags: ['Demand & Risk Forecasting', 'Prescriptive Recommendations', 'Automated Scoring'],
    icon: TrendingUp,
  },
  {
    id: 'realtime-dashboards',
    code: 'B.02',
    title: 'Real-Time Dashboards',
    description: 'Monitor KPIs and key trends with live visualizations and alerts.',
    focusLabel: 'Live Executive Visibility',
    tags: ['Streaming KPI Views', 'Threshold Alerting'],
    icon: BarChart3,
  },
  {
    id: 'ai-model-deployment',
    code: 'B.03',
    title: 'AI Model Deployment',
    description: 'Operationalize AI/ML models for fraud detection, personalization, and more.',
    focusLabel: 'Production MLOps Pipelines',
    tags: ['Fraud Detection', 'Personalization Engines'],
    icon: Cpu,
  },
  {
    id: 'dsaas',
    code: 'B.04',
    title: 'Data Science as a Service (DSaaS)',
    description: 'On-demand data science support for fast experimentation and insights.',
    focusLabel: 'Embedded Data Science Pods',
    tags: ['Rapid Prototyping', 'Dedicated Experimentation'],
    icon: Sparkles,
  },
  {
    id: 'security-compliance',
    code: 'B.05',
    title: 'Security & Compliance',
    description: 'Ensure data protection, encryption, and regulatory compliance at scale.',
    focusLabel: 'Zero-Trust Data Protection',
    tags: ['End-to-End Encryption', 'Regulatory Controls'],
    icon: Lock,
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

export function BigDataPage({ onNavigate, onOpenBriefing }: BigDataPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [activeIntroLayer, setActiveIntroLayer] = useState<number>(0);
  const [activeWhyIdx, setActiveWhyIdx] = useState<number>(0);
  const [capabilityFilter, setCapabilityFilter] = useState<CapabilityGroupFilter>('all');
  const [activeAnalyticsId, setActiveAnalyticsId] = useState<string>(
    ANALYTICS_AI_CAPABILITIES[0].id,
  );

  const activeWhy = WHY_CHOOSE_ITEMS[activeWhyIdx] ?? WHY_CHOOSE_ITEMS[0];
  const activeAnalyticsCap =
    ANALYTICS_AI_CAPABILITIES.find((c) => c.id === activeAnalyticsId) ??
    ANALYTICS_AI_CAPABILITIES[0];

  const featuredEngineering = ENGINEERING_CAPABILITIES[0];
  const gridEngineering = ENGINEERING_CAPABILITIES.slice(1);

  const scrollToCapabilities = () => {
    const target = document.getElementById('big-data-capabilities');
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
          SECTION 1: HERO – BIG DATA SOLUTIONS + INTERACTIVE PIPELINE STUDIO
         ===================================================================== */}
      <section
        aria-labelledby="big-data-hero-heading"
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
              <SectionBadgeWithDot label="Enterprise Data Engineering & AI" />

              <h1
                id="big-data-hero-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Big Data <span className="apokrin-gradient-text">Solutions</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
                Empowering businesses with advanced Big Data solutions that drive insights,
                innovation, and intelligent decision-making.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
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

            {/* Right Column: Interactive 3D Big Data Lakehouse Diagram */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              <ServiceArchitectureDiagram3D
                variant="big-data"
                prefersReducedMotion={Boolean(prefersReducedMotion)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: INTRODUCTION – HARNESS REAL-TIME BIG DATA
         ===================================================================== */}
      <section
        aria-labelledby="big-data-intro-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Interactive Single-Source-of-Truth Stack */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="apokrin-clay-panel rounded-[2rem] border border-white/95 p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Data Lifecycle Flow
                    </p>
                    <h3 className="font-display text-sm font-extrabold text-[#0A1128]">
                      Raw Data to Single Source of Truth
                    </h3>
                  </div>
                  <Layers
                    className="h-5 w-5"
                    style={{ color: themeConfig.primaryStrong }}
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-4 space-y-2.5">
                  {INTRO_LAYERS.map((layer, idx) => {
                    const LayerIcon = layer.icon;
                    const isSelected = activeIntroLayer === idx;

                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setActiveIntroLayer(idx)}
                        onMouseEnter={() => setActiveIntroLayer(idx)}
                        aria-pressed={isSelected}
                        style={{
                          borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                          backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                          boxShadow: isSelected
                            ? `0 12px 26px -12px ${themeConfig.glow}`
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
                                  color: themeConfig.primaryStrong,
                                }
                          }
                        >
                          <LayerIcon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-bold text-[#0A1128]">
                              {layer.title}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#64748B]">
                              {layer.step}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                            {layer.detail}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Core Introduction Narrative */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <SectionBadgeWithDot label="Real-Time Big Data" />

              <h2
                id="big-data-intro-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Harness Real-Time Big Data to Drive{' '}
                <span className="apokrin-gradient-text">
                  Smarter, Faster Business Decisions
                </span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                Make quick, informed decisions to stay ahead of the competition by leveraging
                real-time big data collection and extracting actionable insights from unstructured
                raw data. Ensure data security with a single source of truth and efficiently manage
                even the largest datasets with the expertise of a big data development company.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2.5">
                    <Server
                      className="h-4.5 w-4.5 shrink-0"
                      style={{ color: themeConfig.primaryStrong }}
                      aria-hidden="true"
                    />
                    <p className="font-display text-sm font-bold text-[#0A1128]">
                      Unstructured &amp; Massive Datasets
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                    Extract structured clarity from raw logs, streams, documents, and high-volume
                    enterprise repositories.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck
                      className="h-4.5 w-4.5 shrink-0"
                      style={{ color: themeConfig.primaryStrong }}
                      aria-hidden="true"
                    />
                    <p className="font-display text-sm font-bold text-[#0A1128]">
                      Single Source of Truth
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                    Maintain strict data security, unified access governance, and dependable audit
                    integrity across teams.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHY CHOOSE US (4 Differentiators + Interactive Architecture View)
         ===================================================================== */}
      <section
        aria-labelledby="big-data-why-heading"
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
            <SectionBadgeWithDot label="Why Choose Us" />

            <h2
              id="big-data-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Enterprise Big Data Engineered for{' '}
              <span className="apokrin-gradient-text">Agility, Scale &amp; Security</span>
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: 2x2 Scannable Claymorphism Differentiator Cards */}
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

            {/* Right 5 Cols: Interactive Differentiator Blueprint Spotlight */}
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
                      {activeWhy.architectureFocus}
                    </p>

                    <h3 className="mt-1.5 font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                      {activeWhy.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                      {activeWhy.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-[#E2E8F0] pt-5">
                      {activeWhy.deliverables.map((point) => (
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
                          `Architecture inquiry focused on: ${activeWhy.title}.`,
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      style={{ color: themeConfig.primaryStrong }}
                    >
                      <span>Discuss this architecture with our team</span>
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
          SECTION 4: CORE CAPABILITIES (10 Capabilities Across 2 Structured Groups)
         ===================================================================== */}
      <section
        id="big-data-capabilities"
        aria-labelledby="big-data-capabilities-heading"
        className="border-b border-[#E2E8F0] bg-white py-10 sm:py-12 lg:py-16"
      >
        <div className="apokrin-container">
          {/* Header & Interactive Group Filter */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <SectionBadgeWithDot label="Core Capabilities" />

              <h2
                id="big-data-capabilities-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Full-Stack Big Data{' '}
                <span className="apokrin-gradient-text">Engineering &amp; AI Capabilities</span>
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filter Big Data capability groups"
              className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5"
            >
              {(
                [
                  { id: 'all', label: 'All Capabilities' },
                  { id: 'engineering', label: 'Data Engineering & Processing' },
                  { id: 'analytics', label: 'Advanced Analytics & AI' },
                ] as { id: CapabilityGroupFilter; label: string }[]
              ).map((tab) => {
                const isActive = capabilityFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setCapabilityFilter(tab.id)}
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
            {/* GROUP A: DATA ENGINEERING & PROCESSING (5 Capabilities) */}
            {(capabilityFilter === 'all' || capabilityFilter === 'engineering') && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    A
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Data Engineering &amp; Processing
                  </h3>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                  {/* Featured Dark Anchor Card (A.01 Data Ingestion) */}
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
                          <featuredEngineering.icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          {featuredEngineering.code}
                        </span>
                      </div>

                      <p
                        className="mt-5 font-mono text-xs font-semibold"
                        style={{ color: themeConfig.accent }}
                      >
                        {featuredEngineering.focusLabel}
                      </p>

                      <h4 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
                        {featuredEngineering.title}
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                        {featuredEngineering.description}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center text-[11px] font-semibold text-slate-300">
                      {featuredEngineering.tags.map((tag) => (
                        <div key={tag} className="rounded-xl bg-white/8 px-2 py-2">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </motion.article>

                  {/* 2x2 Scannable Claymorphism Grid for A.02 - A.05 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                    {gridEngineering.map((cap, idx) => {
                      const CapIcon = cap.icon;
                      return (
                        <motion.article
                          key={cap.id}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.4,
                            delay: idx * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                          className="apokrin-clay-card flex flex-col justify-between border border-white/95 p-5 sm:p-6"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <div
                                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                                style={{
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: themeConfig.primaryStrong,
                                  border: '1px solid var(--color-border-tint)',
                                }}
                              >
                                <CapIcon className="h-5 w-5" aria-hidden="true" />
                              </div>
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                {cap.code}
                              </span>
                            </div>

                            <h4 className="mt-4 font-display text-base font-extrabold text-[#0A1128] sm:text-lg">
                              {cap.title}
                            </h4>

                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                              {cap.description}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] pt-3 text-[11px] font-medium text-[#64748B]">
                            <span>{cap.tags[0]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{cap.tags[1]}</span>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* GROUP B: ADVANCED ANALYTICS & AI (5 Capabilities with Interactive Spotlight) */}
            {(capabilityFilter === 'all' || capabilityFilter === 'analytics') && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    B
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    Advanced Analytics &amp; AI
                  </h3>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                  {/* Left 5 Cols: Interactive Analytics & AI Architecture Spotlight */}
                  <div className="lg:col-span-5">
                    <div className="apokrin-clay-panel flex h-full flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="apokrin-badge rounded-full px-3 py-1 text-[11px] font-semibold">
                            {activeAnalyticsCap.code} · {activeAnalyticsCap.focusLabel}
                          </span>
                          <BrainCircuit
                            className="h-5 w-5"
                            style={{ color: themeConfig.primaryStrong }}
                            aria-hidden="true"
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeAnalyticsCap.id}
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
                                  <activeAnalyticsCap.icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-display text-base font-extrabold text-[#0A1128]">
                                    {activeAnalyticsCap.title}
                                  </h4>
                                  <p className="text-xs font-medium text-[#64748B]">
                                    {activeAnalyticsCap.focusLabel}
                                  </p>
                                </div>
                              </div>

                              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                                {activeAnalyticsCap.description}
                              </p>

                              <ul className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4">
                                {activeAnalyticsCap.tags.map((item) => (
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
                        Select any Advanced Analytics &amp; AI capability tile to inspect its
                        operational focus.
                      </p>
                    </div>
                  </div>

                  {/* Right 7 Cols: Clean Scannable Selectable Tiles for All 5 Group B Capabilities */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                    {ANALYTICS_AI_CAPABILITIES.map((cap, idx) => {
                      const CapIcon = cap.icon;
                      const isActive = activeAnalyticsId === cap.id;
                      const isFirstWide = idx === 0;

                      return (
                        <motion.button
                          key={cap.id}
                          type="button"
                          onClick={() => setActiveAnalyticsId(cap.id)}
                          onMouseEnter={() => setActiveAnalyticsId(cap.id)}
                          aria-pressed={isActive}
                          whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                          style={{
                            borderColor: isActive ? themeConfig.primaryStrong : '#E2E8F0',
                            boxShadow: isActive
                              ? `0 16px 34px -14px ${themeConfig.glow}`
                              : '0 6px 18px -10px rgba(15,23,42,0.06)',
                          }}
                          className={`flex h-full flex-col justify-between rounded-[1.5rem] border bg-white p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                            isFirstWide ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-2xl transition-colors"
                                style={
                                  isActive
                                    ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                                    : {
                                        backgroundColor: 'var(--color-surface-soft)',
                                        color: themeConfig.primaryStrong,
                                      }
                                }
                              >
                                <CapIcon className="h-4.5 w-4.5" aria-hidden="true" />
                              </div>
                              <span className="font-mono text-xs font-semibold text-[#64748B]">
                                {cap.code}
                              </span>
                            </div>

                            <h4 className="mt-3.5 font-display text-base font-extrabold text-[#0A1128] sm:text-lg">
                              {cap.title}
                            </h4>

                            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
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
          SECTION 5: FINAL CTA (Claymorphism Banner)
         ===================================================================== */}
      <section
        aria-labelledby="big-data-final-cta"
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
              <BrainCircuit className="h-6 w-6" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <SectionBadgeWithDot label="Get Started With Apokrin" />

              <h2
                id="big-data-final-cta"
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl lg:text-4xl"
              >
                Ready to transform your{' '}
                <span className="apokrin-gradient-text">Big Data operations?</span>
              </h2>

              <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Partner with Apokrin to unify unstructured raw streams, scalable lakehouse
                architecture, and AI-driven insights into one secure platform.
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
