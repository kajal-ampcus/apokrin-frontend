import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Layers,
  LineChart,
  Lock,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { ServicePageTemplate } from './services/ServicePageTemplate';

interface DataAnalyticsPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const OVERVIEW_PIPELINE_STEPS = [
  {
    id: 'ingest',
    title: 'Multi-Source Ingestion',
    detail: 'Unify marketing, CRM, web, mobile, and operational databases cleanly.',
    icon: Database,
  },
  {
    id: 'model',
    title: 'Predictive Modeling',
    detail: 'Structure segments, correlations, and risk indicators in real time.',
    icon: Workflow,
  },
  {
    id: 'visualize',
    title: 'Visual Intelligence',
    detail: 'Interactive dashboards and full-scale reports built for clarity.',
    icon: LineChart,
  },
  {
    id: 'act',
    title: 'Decisive Execution',
    detail: 'Align decentralized teams around fast, confident business decisions.',
    icon: Target,
  },
];

type SolutionFilterId = 'all' | 'market' | 'crm' | 'risk' | 'visualization' | 'social';

const SOLUTION_FILTERS: { id: SolutionFilterId; label: string }[] = [
  { id: 'all', label: 'All Solutions' },
  { id: 'market', label: 'Market Analytics' },
  { id: 'crm', label: 'CRM Analytics' },
  { id: 'risk', label: 'Risk Management' },
  { id: 'visualization', label: 'Data Visualization' },
  { id: 'social', label: 'Social Media' },
];

type VizMode = 'trend' | 'correlation' | 'comparison';

interface DifferentiatorItem {
  id: string;
  number: string;
  title: string;
  blueprintTitle: string;
  summary: string;
  pillars: string[];
  icon: typeof Zap;
}

const WHY_APOKRIN_ITEMS: DifferentiatorItem[] = [
  {
    id: 'custom-built',
    number: '01',
    title: 'Custom-built solutions for your industry.',
    blueprintTitle: 'Industry-Aligned Architecture',
    summary:
      'Every analytics framework is engineered around your domain workflows, regulatory requirements, and decision cadence rather than generic one-size templates.',
    pillars: ['Domain-specific KPI modeling', 'Custom reporting sequences', 'Flexible enterprise taxonomy'],
    icon: Zap,
  },
  {
    id: 'real-time',
    number: '02',
    title: 'Real-time dashboards and predictive analytics.',
    blueprintTitle: 'Live Streaming & Forecasting',
    summary:
      'Move beyond retrospective spreadsheets with continuous event ingestion, predictive CRM modeling, and instant trend visibility across leadership and operations.',
    pillars: ['Low-latency executive dashboards', 'Forward-looking cohort forecasting', 'Automated anomaly surfacing'],
    icon: Target,
  },
  {
    id: 'integrated-reporting',
    number: '03',
    title: 'Integrated reporting across marketing, CRM, and risk.',
    blueprintTitle: 'Unified Cross-Domain Intelligence',
    summary:
      'Bridge campaign ROI, customer lifecycle segmentation, and risk compliance telemetry inside one coherent analytical foundation.',
    pillars: ['Shared source of truth', 'Cross-functional visibility', 'Eliminates decentralized silos'],
    icon: BarChart3,
  },
  {
    id: 'scalable-infrastructure',
    number: '04',
    title: 'Scalable and secure data infrastructure.',
    blueprintTitle: 'Enterprise Governance & Scale',
    summary:
      'Built on resilient cloud foundations with strict audit controls, role-based access governance, and reliable horizontal scaling as data volumes expand.',
    pillars: ['Strict audit & compliance readiness', 'High-throughput data pipelines', 'Hardened infrastructure controls'],
    icon: ShieldCheck,
  },
  {
    id: 'seamless-ux',
    number: '05',
    title: 'Seamless user experience and data visualization.',
    blueprintTitle: 'Intuitive Decision Workflows',
    summary:
      'Empower analysts and business leaders alike with drag-and-drop report building, clear visual hierarchies, and embeddable multi-channel outputs.',
    pillars: ['Drag-and-drop dashboard workflows', 'Interactive correlation charts', 'Publishable web & social views'],
    icon: CheckCircle2,
  },
];

export function DataAnalyticsPage({ onNavigate, onOpenBriefing }: DataAnalyticsPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [activePipelineIdx, setActivePipelineIdx] = useState<number>(0);
  const [solutionFilter, setSolutionFilter] = useState<SolutionFilterId>('all');
  const [marketViewMode, setMarketViewMode] = useState<'roi' | 'traffic'>('roi');
  const [vizMode, setVizMode] = useState<VizMode>('trend');
  const [activeWhyIdx, setActiveWhyIdx] = useState<number>(0);

  const activeWhy = WHY_APOKRIN_ITEMS[activeWhyIdx] ?? WHY_APOKRIN_ITEMS[0];

  const scrollToSolutions = () => {
    const target = document.getElementById('analytics-solutions');
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const showSolution = (id: Exclude<SolutionFilterId, 'all'>) =>
    solutionFilter === 'all' || solutionFilter === id;

  return (
    <ServicePageTemplate
      serviceId="data-analytics"
      onPrimaryCta={scrollToSolutions}
      onSecondaryCta={() => onNavigate('contact')}
      onOpenBriefing={onOpenBriefing}
    >

      {/* =====================================================================
          SECTION 2: ANALYTICS OVERVIEW (Asymmetric Bento Grid)
         ===================================================================== */}
      <section
        aria-labelledby="analytics-overview-heading"
        className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Analytics Overview
            </span>

            <h2
              id="analytics-overview-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Convert Complex Data Into{' '}
              <span className="apokrin-gradient-text">Actionable Enterprise Decisions</span>
            </h2>

            <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
              Apokrin unites fragmented business streams into structured intelligence—helping teams
              understand performance, sharpen marketing execution, segment customers accurately,
              and govern risk with confidence.
            </p>
          </motion.div>

          {/* Asymmetric 12-Column Bento Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Wide Left Bento Feature: Business Performance + Complex Data Conversion */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="apokrin-clay-panel flex flex-col justify-between rounded-[1.75rem] border border-white/95 p-6 sm:p-8 lg:col-span-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                    End-to-End Decision Architecture
                  </h3>
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: 'var(--color-primary-strong)',
                    }}
                  >
                    Interactive Flow
                  </span>
                </div>

                {/* Interactive 4-Step Pipeline Selector */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {OVERVIEW_PIPELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = activePipelineIdx === idx;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setActivePipelineIdx(idx)}
                        onMouseEnter={() => setActivePipelineIdx(idx)}
                        aria-pressed={isActive}
                        style={{
                          borderColor: isActive ? themeConfig.primary : '#E2E8F0',
                          backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.68)',
                          boxShadow: isActive
                            ? `0 12px 26px -10px ${themeConfig.glow}`
                            : 'none',
                        }}
                        className="flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                          style={
                            isActive
                              ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                              : {
                                  backgroundColor: 'var(--color-surface-soft)',
                                  color: 'var(--color-primary-strong)',
                                }
                          }
                        >
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-[#0A1128]">
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                            {step.detail}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explicit Overview Outcomes */}
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Activity
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: themeConfig.primaryStrong }}
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-[#0A1128]">
                      Understand Business Performance
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                      Track operational velocity, revenue drivers, and departmental KPIs in one
                      structured view.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: themeConfig.secondaryText }}
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-[#0A1128]">
                      Convert Complex Data into Actionable Insights
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                      Replace fragmented spreadsheets with visual correlations and clear next steps.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Asymmetric Stack: Marketing Decisions, Customer Behavior, Risk Governance */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {/* Block 1: Improve Marketing Decisions */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className="apokrin-clay-card flex items-center justify-between gap-4 border border-white/95 p-5"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A1128]">
                    Improve Marketing Decisions
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                    Measure campaign ROI, traffic sources, and engagement breakdowns across channels.
                  </p>
                </div>
                <div className="flex h-14 w-20 shrink-0 items-end gap-1.5 rounded-xl bg-white p-2.5 shadow-inner">
                  <span
                    className="w-1/4 rounded-t"
                    style={{ height: '42%', backgroundColor: themeConfig.surfaceTint }}
                  />
                  <span
                    className="w-1/4 rounded-t"
                    style={{ height: '68%', backgroundColor: themeConfig.accent }}
                  />
                  <span
                    className="w-1/4 rounded-t"
                    style={{ height: '55%', backgroundColor: themeConfig.secondary }}
                  />
                  <span
                    className="w-1/4 rounded-t"
                    style={{ height: '90%', backgroundColor: themeConfig.primaryStrong }}
                  />
                </div>
              </motion.div>

              {/* Block 2: Understand Customer Behavior */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className="apokrin-clay-card flex items-center justify-between gap-4 border border-white/95 p-5"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A1128]">
                    Understand Customer Behavior
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                    Segment audiences by revenue potential, region, and interaction history.
                  </p>
                </div>
                <div
                  className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-inner"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 64 36" className="h-full w-full">
                    <path
                      d="M 4 28 Q 20 26 30 16 T 60 8"
                      fill="none"
                      stroke={themeConfig.primaryStrong}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="30" cy="16" r="3" fill={themeConfig.secondary} />
                    <circle cx="60" cy="8" r="3" fill={themeConfig.primaryStrong} />
                  </svg>
                </div>
              </motion.div>

              {/* Block 3: Identify and Manage Risks */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className="apokrin-clay-card flex items-center justify-between gap-4 border border-white/95 p-5"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A1128]">
                    Identify and Manage Risks
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                    Aggregate risk telemetry, assess IT infrastructure, and enforce audit controls.
                  </p>
                </div>
                <div
                  className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-white shadow-inner"
                  style={{ color: themeConfig.primaryStrong }}
                >
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: OUR ANALYTICS SOLUTIONS (Asymmetric Interactive Bento Showcases)
         ===================================================================== */}
      <section
        id="analytics-solutions"
        aria-labelledby="our-analytics-solutions-heading"
        className="apokrin-clay-section border-b py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          {/* Header + Interactive Filter Controls */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Our Analytics Solutions
              </span>

              <h2
                id="our-analytics-solutions-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Specialized Platforms for{' '}
                <span className="apokrin-gradient-text">Every Decision Layer</span>
              </h2>
            </motion.div>

            {/* Interactive Solution Filter Bar */}
            <div
              role="group"
              aria-label="Filter analytics solutions"
              className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E2E8F0] bg-white/85 p-1.5 backdrop-blur-sm"
            >
              {SOLUTION_FILTERS.map((tab) => {
                const active = solutionFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSolutionFilter(tab.id)}
                    aria-pressed={active}
                    style={
                      active
                        ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                        : undefined
                    }
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                      active ? 'shadow-sm' : 'text-[#475569] hover:text-[#0A1128]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asymmetric Multi-Span Showcase Grid (7/5 -> 5/7 -> 12 Split) */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* 01. MARKET ANALYTICS (Wide 7-Col Bento with Interactive ROI / Traffic Switcher) */}
            {showSolution('market') && (
              <motion.article
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className={`apokrin-clay-panel flex flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-8 ${
                  solutionFilter === 'market' ? 'lg:col-span-12' : 'lg:col-span-7'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      >
                        <BarChart3 className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#64748B]">01</p>
                        <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                          Market Analytics
                        </h3>
                      </div>
                    </div>

                    <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                      <button
                        type="button"
                        onClick={() => setMarketViewMode('roi')}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                          marketViewMode === 'roi'
                            ? 'bg-white text-[#0A1128] shadow-sm'
                            : 'text-[#64748B]'
                        }`}
                      >
                        Campaign ROI
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarketViewMode('traffic')}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                          marketViewMode === 'traffic'
                            ? 'bg-white text-[#0A1128] shadow-sm'
                            : 'text-[#64748B]'
                        }`}
                      >
                        Traffic Sources
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                    Unlock the full value of your marketing efforts through real-time reporting and
                    detailed marketing ROI analysis. Apokrin&apos;s market analytics software offers
                    structured reporting through campaign performance dashboards, engagement
                    tracking, and traffic source breakdowns. This helps marketing teams overcome
                    decentralized decision-making and scale their efforts efficiently.
                  </p>
                </div>

                {/* Bespoke Market Analytics Dashboard Mockup */}
                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#334155]">
                    <span>
                      {marketViewMode === 'roi'
                        ? 'Structured Campaign ROI Sequence'
                        : 'Traffic Source Attribution Breakdown'}
                    </span>
                    <span style={{ color: themeConfig.primaryStrong }}>Real-Time Reporting</span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {(marketViewMode === 'roi'
                      ? [
                          { label: 'Enterprise Search Campaigns', width: '88%' },
                          { label: 'Account-Based Content Funnels', width: '74%' },
                          { label: 'Partner Referral Sequences', width: '61%' },
                        ]
                      : [
                          { label: 'Organic & Direct Channels', width: '84%' },
                          { label: 'Paid Acquisition Sources', width: '70%' },
                          { label: 'Cross-Campaign Engagement', width: '64%' },
                        ]
                    ).map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-[11px] font-medium text-[#475569]">
                          <span>{bar.label}</span>
                        </div>
                        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                          <motion.div
                            className="h-full rounded-full"
                            initial={false}
                            animate={{ width: bar.width }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            style={{ background: 'var(--color-btn-gradient)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            )}

            {/* 02. CRM ANALYTICS (5-Col Segmentation Showcase Card) */}
            {showSolution('crm') && (
              <motion.article
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className={`apokrin-clay-panel flex flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-8 ${
                  solutionFilter === 'crm' ? 'lg:col-span-12' : 'lg:col-span-5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        color: 'var(--color-primary-strong)',
                        border: '1px solid var(--color-border-tint)',
                      }}
                    >
                      <Users className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#64748B]">02</p>
                      <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                        CRM Analytics
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                    Redefine how your business connects with customers using CRM analytics tools.
                    Apokrin enables smarter customer segmentation based on revenue potential,
                    regional performance, and interaction history. Our solution delivers predictive
                    CRM analytics, visual dashboards, and real-time insights to improve customer
                    relationships.
                  </p>
                </div>

                {/* Bespoke Customer Segmentation Matrix Mockup */}
                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <p className="text-xs font-semibold text-[#334155]">
                    Customer Segmentation Dimensions
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { title: 'Revenue', sub: 'Potential' },
                      { title: 'Regional', sub: 'Performance' },
                      { title: 'History', sub: 'Interactions' },
                    ].map((seg) => (
                      <div
                        key={seg.title}
                        className="rounded-xl border border-[#E2E8F0] p-2.5 text-center"
                        style={{ backgroundColor: 'var(--color-surface-soft)' }}
                      >
                        <p
                          className="font-display text-xs font-bold"
                          style={{ color: themeConfig.primaryStrong }}
                        >
                          {seg.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#64748B]">{seg.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            )}

            {/* 03. RISK MANAGEMENT ANALYTICS (5-Col Governance & Audit Control Panel) */}
            {showSolution('risk') && (
              <motion.article
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className={`apokrin-clay-panel flex flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-8 ${
                  solutionFilter === 'risk' ? 'lg:col-span-12' : 'lg:col-span-5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#64748B]">03</p>
                      <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                        Risk Management Analytics
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                    Stay ahead of threats with Apokrin&apos;s risk analytics software, designed for
                    precise risk data governance and compliance. We aggregate risk data, assess IT
                    infrastructure, and support strict audit controls to help manage operational and
                    financial risks with confidence.
                  </p>
                </div>

                {/* Bespoke Risk Governance & Audit Controls Visual */}
                <div className="mt-6 space-y-2 rounded-2xl border border-[#E2E8F0] bg-[#0A1128] p-4 text-white">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>Risk Data Governance &amp; Controls</span>
                    <Lock className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/8 px-3 py-2 text-xs text-slate-200">
                      IT Infrastructure Assessment
                    </div>
                    <div className="rounded-xl bg-white/8 px-3 py-2 text-xs text-slate-200">
                      Strict Audit Trail Controls
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* 04. ADVANCED DATA VISUALIZATION (Wide 7-Col Interactive Chart Canvas Showcase) */}
            {showSolution('visualization') && (
              <motion.article
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className={`apokrin-clay-panel flex flex-col justify-between rounded-[1.85rem] border border-white/95 p-6 sm:p-8 ${
                  solutionFilter === 'visualization' ? 'lg:col-span-12' : 'lg:col-span-7'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: 'var(--color-surface-soft)',
                          color: 'var(--color-primary-strong)',
                          border: '1px solid var(--color-border-tint)',
                        }}
                      >
                        <TrendingUp className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#64748B]">04</p>
                        <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                          Advanced Data Visualization
                        </h3>
                      </div>
                    </div>

                    {/* Interactive Chart Type Selector */}
                    <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                      {(
                        [
                          { id: 'trend', label: 'Trend Line' },
                          { id: 'comparison', label: 'Bar Graph' },
                          { id: 'correlation', label: 'Correlation' },
                        ] as { id: VizMode; label: string }[]
                      ).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setVizMode(mode.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                            vizMode === mode.id
                              ? 'bg-white text-[#0A1128] shadow-sm'
                              : 'text-[#64748B]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                    Turn data into decisions with Apokrin&apos;s data visualization tools. Build
                    interactive dashboards, analyze complex data relationships, track trends, and
                    create full-scale charts, graphs, and visual reports through intuitive
                    workflows.
                  </p>
                </div>

                {/* Interactive Visualization Canvas Mockup */}
                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#334155]">
                    <span>Interactive Chart &amp; Report Studio</span>
                    <span className="text-[11px] text-[#64748B]">Click modes above to preview</span>
                  </div>

                  <div className="mt-3 h-28 w-full rounded-xl bg-[#F8FAFC] p-3">
                    <AnimatePresence mode="wait">
                      {vizMode === 'trend' && (
                        <motion.svg
                          key="trend"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          viewBox="0 0 320 84"
                          className="h-full w-full"
                          aria-hidden="true"
                        >
                          <path
                            d="M 10 68 C 60 58, 95 40, 150 42 C 205 44, 250 18, 308 14"
                            fill="none"
                            stroke={themeConfig.primaryStrong}
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 74 C 68 68, 125 60, 178 48 C 232 36, 268 38, 308 26"
                            fill="none"
                            stroke={themeConfig.secondary}
                            strokeWidth="2.2"
                            strokeDasharray="5 4"
                            strokeLinecap="round"
                          />
                        </motion.svg>
                      )}

                      {vizMode === 'comparison' && (
                        <motion.div
                          key="comparison"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex h-full items-end gap-3 px-2"
                        >
                          {[48, 72, 60, 88, 76, 95, 68].map((val, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-lg"
                              style={{
                                height: `${val}%`,
                                background:
                                  i % 2 === 0
                                    ? 'var(--color-btn-gradient)'
                                    : themeConfig.surfaceTint,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}

                      {vizMode === 'correlation' && (
                        <motion.svg
                          key="correlation"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          viewBox="0 0 320 84"
                          className="h-full w-full"
                          aria-hidden="true"
                        >
                          {[
                            { x: 38, y: 64, r: 5 },
                            { x: 76, y: 52, r: 6 },
                            { x: 118, y: 58, r: 4.5 },
                            { x: 158, y: 38, r: 7 },
                            { x: 198, y: 42, r: 5 },
                            { x: 240, y: 24, r: 6.5 },
                            { x: 282, y: 18, r: 7.5 },
                          ].map((pt, idx) => (
                            <circle
                              key={idx}
                              cx={pt.x}
                              cy={pt.y}
                              r={pt.r}
                              fill={idx % 2 === 0 ? themeConfig.primaryStrong : themeConfig.secondary}
                              opacity="0.85"
                            />
                          ))}
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            )}

            {/* 05. SOCIAL MEDIA ANALYTICS (Full-Width Horizontal Split Showcase Banner) */}
            {showSolution('social') && (
              <motion.article
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className="apokrin-clay-panel rounded-[1.85rem] border border-white/95 p-6 sm:p-8 lg:col-span-12"
              >
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      >
                        <Smartphone className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#64748B]">05</p>
                        <h3 className="font-display text-xl font-extrabold text-[#0A1128] sm:text-2xl">
                          Social Media Analytics
                        </h3>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15.5px]">
                      Gain a competitive edge with Apokrin&apos;s social media analytics tools.
                      Access real-time insights from web, mobile, and social platforms. Monitor
                      content engagement, measure campaign success, and publish data visualizations
                      to improve reporting and audience engagement.
                    </p>
                  </div>

                  {/* Multi-Platform Web / Mobile / Social Stream Visual */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5">
                    {[
                      {
                        label: 'Web Platforms',
                        desc: 'Live content telemetry',
                        icon: Layers,
                      },
                      {
                        label: 'Mobile Channels',
                        desc: 'Audience reach signals',
                        icon: Smartphone,
                      },
                      {
                        label: 'Social Publishing',
                        desc: 'Embeddable visual reports',
                        icon: Share2,
                      },
                    ].map((ch) => {
                      const ChIcon = ch.icon;
                      return (
                        <div
                          key={ch.label}
                          className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center shadow-sm"
                        >
                          <div
                            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: 'var(--color-surface-soft)',
                              color: 'var(--color-primary-strong)',
                            }}
                          >
                            <ChIcon className="h-4.5 w-4.5" aria-hidden="true" />
                          </div>
                          <p className="mt-3 font-display text-xs font-bold text-[#0A1128]">
                            {ch.label}
                          </p>
                          <p className="mt-1 text-[11px] text-[#64748B]">{ch.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: WHY CHOOSE APOKRIN? (Interactive Timeline + Dynamic Blueprint Panel)
         ===================================================================== */}
      <section
        aria-labelledby="why-choose-analytics-heading"
        className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20"
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
              Why Choose Apokrin?
            </span>

            <h2
              id="why-choose-analytics-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Built With <span className="apokrin-gradient-text">Transparency, Speed &amp; Quality</span>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base">
              We combine cutting-edge technology with deep industry expertise to deliver scalable,
              efficient, and tailored workforce solutions. With a focus on transparency, speed, and
              quality, we empower businesses to achieve hiring success and operational excellence.
            </p>
          </motion.div>

          {/* Two-Column Interactive Differentiator Showcase */}
          <div className="mt-11 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left: Vertical Interactive Timeline Steps */}
            <div className="relative space-y-3 lg:col-span-6">
              {/* Vertical rail behind circular numbers */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-8 left-[2.05rem] top-8 hidden w-0.5 sm:block"
                style={{ backgroundColor: 'var(--color-track)' }}
              />

              {WHY_APOKRIN_ITEMS.map((item, idx) => {
                const isSelected = activeWhyIdx === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveWhyIdx(idx)}
                    onMouseEnter={() => setActiveWhyIdx(idx)}
                    aria-pressed={isSelected}
                    style={{
                      borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                      backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                      boxShadow: isSelected
                        ? `0 14px 30px -12px ${themeConfig.glow}`
                        : '0 2px 6px rgba(15,23,42,0.03)',
                    }}
                    className="relative z-10 flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-200"
                      style={
                        isSelected
                          ? {
                              background: 'var(--color-btn-gradient)',
                              color: '#FFFFFF',
                              boxShadow: `0 6px 14px -4px ${themeConfig.glow}`,
                            }
                          : {
                              backgroundColor: 'var(--color-surface-soft)',
                              color: 'var(--color-primary-strong)',
                            }
                      }
                    >
                      {item.number}
                    </span>

                    <span
                      className="flex-1 font-display text-sm font-bold leading-snug sm:text-[15px]"
                      style={{ color: isSelected ? themeConfig.primaryStrong : '#0A1128' }}
                    >
                      {item.title}
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-35'
                      }`}
                      style={{ color: isSelected ? themeConfig.primaryStrong : '#64748B' }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right: Dynamic Claymorphism Differentiator Blueprint Card */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWhy.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="apokrin-clay-panel relative overflow-hidden rounded-[2rem] border border-white/95 p-7 sm:p-9"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      <activeWhy.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#64748B]">
                      Differentiator {activeWhy.number} / 05
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-extrabold text-[#0A1128]">
                    {activeWhy.blueprintTitle}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                    {activeWhy.summary}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-[#E2E8F0] pt-5">
                    {activeWhy.pillars.map((pillar) => (
                      <li key={pillar} className="flex items-center gap-2.5 text-sm font-medium text-[#0A1128]">
                        <CheckCircle2
                          className="h-4 w-4 shrink-0"
                          style={{ color: themeConfig.primaryStrong }}
                          aria-hidden="true"
                        />
                        <span>{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: FINAL CTA (Claymorphism Banner)
         ===================================================================== */}
      <section
        aria-labelledby="data-analytics-final-cta"
        className="apokrin-surface-section py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-12 text-center sm:px-12 sm:py-16"
          >
            {/* Subtle Floating 3D Clay Accents */}
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <BarChart3 className="h-6 w-6" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
            >
              <TrendingUp className="h-6 w-6" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Get Started With Apokrin
              </span>

              <h2
                id="data-analytics-final-cta"
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl lg:text-4xl"
              >
                Ready to Transform Your{' '}
                <span className="apokrin-gradient-text">Data Analytics?</span>
              </h2>

              <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Turn complex business data into meaningful insights and make smarter decisions with
                Apokrin.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      'Data Platforms',
                      'Contact Sales inquiry regarding Apokrin Data Analytics Solutions.',
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
    </ServicePageTemplate>
  );
}
