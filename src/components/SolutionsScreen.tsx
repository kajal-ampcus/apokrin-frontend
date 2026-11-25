import { useMemo, useState } from 'react';
import { ArrowRight, Check, SlidersHorizontal, X } from 'lucide-react';
import {
  PracticeArea,
  SOLUTION_BLUEPRINTS,
  SolutionBlueprint,
} from '../data/apokrinData';

interface SolutionsScreenProps {
  initialPractice?: PracticeArea | 'All';
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const PRACTICE_FILTERS: (PracticeArea | 'All')[] = [
  'All',
  'Applied AI',
  'Cloud Engineering',
  'Data Platforms',
  'Security & FinOps',
];

type ScaleTier = 'Departmental' | 'Enterprise' | 'Global Multi-Region';
type ComplianceTier = 'SOC 2 Type II' | 'HIPAA / HITRUST' | 'FedRAMP / Sovereign';
type DeliveryModel = 'Managed Pod' | 'Staff Augmentation' | 'Architecture Advisory';

export function SolutionsScreen({
  initialPractice = 'All',
  onOpenBriefing,
}: SolutionsScreenProps) {
  const [selectedPractice, setSelectedPractice] = useState<PracticeArea | 'All'>(initialPractice);
  const [scaleTier, setScaleTier] = useState<ScaleTier>('Enterprise');
  const [complianceTier, setComplianceTier] = useState<ComplianceTier>('SOC 2 Type II');
  const [deliveryModel, setDeliveryModel] = useState<DeliveryModel>('Managed Pod');
  const [activeBlueprint, setActiveBlueprint] = useState<SolutionBlueprint | null>(null);

  const filteredBlueprints = useMemo(() => {
    if (selectedPractice === 'All') return SOLUTION_BLUEPRINTS;
    return SOLUTION_BLUEPRINTS.filter((bp) => bp.practice === selectedPractice);
  }, [selectedPractice]);

  const estimate = useMemo(() => {
    const baseMonthly =
      deliveryModel === 'Managed Pod'
        ? 62000
        : deliveryModel === 'Staff Augmentation'
          ? 44000
          : 28000;
    const scaleMultiplier =
      scaleTier === 'Global Multi-Region' ? 1.35 : scaleTier === 'Enterprise' ? 1.0 : 0.72;
    const complianceAdder =
      complianceTier === 'FedRAMP / Sovereign'
        ? 11000
        : complianceTier === 'HIPAA / HITRUST'
          ? 6500
          : 0;
    const monthlyUsd = Math.round((baseMonthly * scaleMultiplier + complianceAdder) / 500) * 500;

    const headcount =
      deliveryModel === 'Architecture Advisory'
        ? '2 Principal Architects'
        : scaleTier === 'Global Multi-Region'
          ? '6 Engineers (1 Principal, 4 Staff, 1 SRE)'
          : scaleTier === 'Enterprise'
            ? '4 Engineers (1 Principal, 2 Staff, 1 SRE)'
            : '2–3 Senior Engineers';

    const weeksToProd =
      scaleTier === 'Global Multi-Region' ? 12 : scaleTier === 'Enterprise' ? 8 : 5;
    const slaTarget =
      scaleTier === 'Global Multi-Region'
        ? '99.99%'
        : scaleTier === 'Enterprise'
          ? '99.95%'
          : '99.90%';

    return { monthlyUsd, headcount, weeksToProd, slaTarget };
  }, [scaleTier, complianceTier, deliveryModel]);

  const handleRequestConfiguredPod = () => {
    const practiceTarget: PracticeArea =
      selectedPractice === 'All' ? 'Applied AI' : selectedPractice;
    const brief = `Configured ${deliveryModel} engagement (${scaleTier}, ${complianceTier}) — estimated ${estimate.headcount}, target ${estimate.weeksToProd}-week production milestone at ${estimate.slaTarget} SLA.`;
    onOpenBriefing(practiceTarget, brief);
  };

  return (
    <div className="apokrin-container py-12">
      {/* Screen Header */}
      <div className="flex flex-col gap-6 border-b border-[#E2E8F0] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--color-secondary-text)]">Solution Architecture &amp; Topology</p>
          <h1
            style={{ textWrap: 'balance' }}
            className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
          >
            Enterprise delivery blueprints and pod configuration.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Filter proven reference architectures by practice or model a custom pod topology,
            compliance posture, and production milestone schedule below.
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div
          role="group"
          aria-label="Filter solutions by practice"
          className="flex flex-wrap items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 self-start lg:self-auto"
        >
          {PRACTICE_FILTERS.map((practice) => {
            const active = selectedPractice === practice;
            return (
              <button
                key={practice}
                type="button"
                onClick={() => setSelectedPractice(practice)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-[var(--color-primary-strong)] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0A1128]'
                }`}
              >
                {practice}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Pod & Topology Estimator */}
      <section className="apokrin-card mt-8 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-4">
          <SlidersHorizontal className="h-4 w-4 text-[var(--color-primary-strong)]" />
          <h2 className="font-display text-lg font-bold text-[#0A1128]">
            Engagement Topology &amp; Budget Estimator
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-5 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold text-[#334155]">Delivery Model</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(['Managed Pod', 'Staff Augmentation', 'Architecture Advisory'] as DeliveryModel[]).map(
                  (model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setDeliveryModel(model)}
                      className={`rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                        deliveryModel === model
                          ? 'border-[var(--color-primary-strong)] bg-[var(--color-surface-soft)] text-[var(--color-primary-strong)]'
                          : 'border-[#CBD5E1] bg-white text-[#475569] hover:border-[var(--color-primary)] hover:text-[#0A1128]'
                      }`}
                    >
                      {model}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="est-scale" className="block text-xs font-semibold text-[#334155]">
                  Workload Scale
                </label>
                <select
                  id="est-scale"
                  value={scaleTier}
                  onChange={(e) => setScaleTier(e.target.value as ScaleTier)}
                  className="apokrin-input mt-2 w-full px-3.5 py-2.5 text-sm"
                >
                  <option value="Departmental">Departmental (Single Region)</option>
                  <option value="Enterprise">Enterprise (High Availability)</option>
                  <option value="Global Multi-Region">Global Multi-Region (Active-Active)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="est-compliance"
                  className="block text-xs font-semibold text-[#334155]"
                >
                  Compliance Posture
                </label>
                <select
                  id="est-compliance"
                  value={complianceTier}
                  onChange={(e) => setComplianceTier(e.target.value as ComplianceTier)}
                  className="apokrin-input mt-2 w-full px-3.5 py-2.5 text-sm"
                >
                  <option value="SOC 2 Type II">SOC 2 Type II / ISO 27001</option>
                  <option value="HIPAA / HITRUST">HIPAA / HITRUST</option>
                  <option value="FedRAMP / Sovereign">FedRAMP / Sovereign Cloud</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Projected Readout */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#E2E8F0] lg:pl-8">
            <p className="text-xs font-semibold text-[var(--color-secondary-text)]">Projected Engagement Envelope</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-[#0A1128] tabular-nums">
                ${estimate.monthlyUsd.toLocaleString()}
              </span>
              <span className="text-xs text-[#64748B]">/ month estimated run-rate</span>
            </div>

            <dl className="mt-5 space-y-3 border-t border-[#E2E8F0] pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#64748B]">Pod Topology</dt>
                <dd className="font-medium text-[#0A1128] text-right">{estimate.headcount}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#64748B]">Production Milestone</dt>
                <dd className="font-mono font-semibold text-[var(--color-secondary-text)] tabular-nums">
                  {estimate.weeksToProd} Weeks
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#64748B]">Contracted Availability</dt>
                <dd className="font-mono font-semibold text-[#0A1128] tabular-nums">
                  {estimate.slaTarget} SLA
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleRequestConfiguredPod}
              className="apokrin-btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              <span>Lock Topology &amp; Request Briefing</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Solution Blueprints Grid */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-[#0A1128]">
            Reference Solution Catalog
          </h2>
          <span className="font-mono text-xs text-[#64748B] tabular-nums">
            Showing {filteredBlueprints.length} of {SOLUTION_BLUEPRINTS.length} blueprints
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlueprints.map((bp) => (
            <article
              key={bp.id}
              className="apokrin-card apokrin-card-interactive rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 text-xs text-[#64748B]">
                  <span className="font-mono font-semibold text-[var(--color-primary-strong)]">{bp.code}</span>
                  <span>{bp.practice}</span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#0A1128]">
                  {bp.title}
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">{bp.targetAudience}</p>

                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  {bp.architectureSummary}
                </p>

                <div className="mt-4 text-xs text-[#64748B]">
                  {bp.compliance.join(' · ')}
                </div>
              </div>

              <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                <div className="flex items-baseline justify-between text-xs tabular-nums">
                  <span className="text-[#64748B]">
                    {bp.durationWeeks} weeks · {bp.slaUptime} SLA
                  </span>
                  <span className="font-mono font-semibold text-[#0A1128]">
                    ${(bp.monthlyEstimateUsd / 1000).toFixed(0)}k/mo
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveBlueprint(bp)}
                    className="apokrin-btn-secondary flex-1 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap"
                  >
                    Inspect Spec
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenBriefing(
                        bp.practice,
                        `Requesting architecture briefing for ${bp.code}: ${bp.title} (${bp.podComposition}).`,
                      )
                    }
                    className="apokrin-btn-primary flex-1 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap"
                  >
                    Deploy Pod
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Slide-Over Architecture Specification Drawer */}
      {activeBlueprint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-bp-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/45 backdrop-blur-sm"
        >
          <div className="apokrin-overlay flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto p-6 sm:p-8">
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                <div>
                  <p className="font-mono text-xs font-semibold text-[var(--color-secondary-text)]">
                    {activeBlueprint.code} · {activeBlueprint.practice}
                  </p>
                  <h3
                    id="drawer-bp-title"
                    className="mt-1.5 font-display text-2xl font-bold text-[#0A1128]"
                  >
                    {activeBlueprint.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBlueprint(null)}
                  aria-label="Close specification drawer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:border-[var(--color-primary-strong)] hover:text-[#0A1128]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-[#64748B]">Architectural Overview</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                    {activeBlueprint.architectureSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-[#E2E8F0] py-4 text-sm tabular-nums">
                  <div>
                    <p className="text-xs text-[#64748B]">Delivery Horizon</p>
                    <p className="mt-1 font-display font-bold text-[#0A1128]">
                      {activeBlueprint.durationWeeks} Weeks
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Target Reliability</p>
                    <p className="mt-1 font-display font-bold text-[var(--color-secondary-text)]">
                      {activeBlueprint.slaUptime}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#64748B]">Assigned Pod Structure</h4>
                  <p className="mt-1.5 text-sm font-medium text-[#0A1128]">
                    {activeBlueprint.podComposition}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#64748B]">Key Production Deliverables</h4>
                  <ul className="mt-3 space-y-2.5">
                    {activeBlueprint.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#334155]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-strong)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#64748B]">Compliance Attestations</h4>
                  <p className="mt-1.5 font-mono text-xs font-semibold text-[var(--color-secondary-text)]">
                    {activeBlueprint.compliance.join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#E2E8F0] pt-5">
              <div>
                <p className="text-xs text-[#64748B]">Estimated Monthly Retainer</p>
                <p className="font-display text-xl font-bold text-[#0A1128] tabular-nums">
                  ${activeBlueprint.monthlyEstimateUsd.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const target = activeBlueprint;
                  setActiveBlueprint(null);
                  onOpenBriefing(
                    target.practice,
                    `Requesting architecture review for ${target.code}: ${target.title}.`,
                  );
                }}
                className="apokrin-btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap"
              >
                Request This Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
