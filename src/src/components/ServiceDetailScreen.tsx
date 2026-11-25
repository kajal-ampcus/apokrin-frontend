import { Suspense, lazy } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  APOKRIN_SERVICES,
  type ApokrinServiceItem,
  type PracticeArea,
  type ScreenId,
} from '../data/apokrinData';

const ServiceClayIcon3D = lazy(() =>
  import('./ServiceClayIcon3D').then((mod) => ({ default: mod.ServiceClayIcon3D })),
);

interface ServiceDetailScreenProps {
  serviceId: ApokrinServiceItem['id'];
  onNavigate: (screen: ScreenId, practice?: PracticeArea) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

export function ServiceDetailScreen({
  serviceId,
  onNavigate,
  onOpenBriefing,
}: ServiceDetailScreenProps) {
  const service =
    APOKRIN_SERVICES.find((item) => item.id === serviceId) ?? APOKRIN_SERVICES[0];

  return (
    <div className="bg-white">
      {/* Light-Theme Header Banner */}
      <section className="apokrin-hero-light border-b border-[#E2E8F0]">
        <div className="apokrin-container py-12 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {APOKRIN_SERVICES.map((item) => {
                const isActive = item.id === service.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'text-white'
                        : 'border border-[#CBD5E1] bg-white text-[#475569] hover:border-[var(--color-primary-strong)] hover:text-[#0A1128]'
                    }`}
                    style={
                      isActive
                        ? {
                            background: 'var(--color-btn-gradient)',
                            boxShadow: '0 4px 12px var(--color-glow)',
                          }
                        : undefined
                    }
                  >
                    {item.stepNumber} · {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Apokrin Service {service.stepNumber} · {service.name}
              </span>

              <h1
                style={{ textWrap: 'balance' }}
                className="mt-4 font-display text-4xl font-extrabold tracking-tight text-[#0A1128] sm:text-5xl"
              >
                {service.name}:{' '}
                <span className="apokrin-gradient-text">{service.tagline}</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg">
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      service.recommendedPractice,
                      `Interested in Apokrin ${service.name} (${service.tagline}).`,
                    )
                  }
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  <span>Schedule Service Briefing</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate(service.id === 'staffing' ? 'talent' : 'solutions')
                  }
                  className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  <span>
                    {service.id === 'staffing'
                      ? 'Explore Talent Bench'
                      : 'Explore Architecture Solutions'}
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="apokrin-clay-panel rounded-[2rem] border border-white/90 p-6">
                <Suspense
                  fallback={
                    <div className="flex h-[270px] w-full items-center justify-center sm:h-[310px]">
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: 'var(--color-primary-strong)' }}
                      >
                        {service.name}
                      </span>
                    </div>
                  }
                >
                  <ServiceClayIcon3D activeService={service.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="bg-white">
        <div className="apokrin-container py-16">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold"
              style={{ color: 'var(--color-secondary-text)' }}
            >
              Platform Capabilities
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0A1128] sm:text-3xl">
              How Apokrin {service.name} delivers operational clarity.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {service.highlights.map((item, idx) => (
              <div
                key={item.title}
                className="apokrin-clay-card flex flex-col justify-between p-7"
              >
                <div>
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: 'var(--color-primary-strong)',
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#0A1128]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Stages */}
          <div className="mt-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8">
            <p className="font-display text-sm font-bold text-[#0A1128]">
              Structured Delivery Framework
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.workflowStages.map((stage, idx) => (
                <div
                  key={stage}
                  className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: 'var(--color-primary-strong)' }}
                  />
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-[#64748B]">
                      Stage 0{idx + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-[#0A1128]">{stage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
