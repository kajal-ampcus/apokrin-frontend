import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { PracticeArea } from '../../data/apokrinData';
import { getAdjacentServices, getServiceConfig, ServiceId } from '../../data/servicesConfig';
import { useTheme } from '../../theme/themeConfig';
import { useServiceTransition } from './ServiceTransitionProvider';

interface ServiceCTAProps {
  serviceId: ServiceId;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

/**
 * Synchronized bottom service-to-service navigator & briefing bar.
 * Provides accessible Previous / Next service navigation matching the Hero Compare Slider order.
 */
export function ServiceCTA({ serviceId, onOpenBriefing }: ServiceCTAProps) {
  const { themeConfig } = useTheme();
  const { navigateToService, isTransitioning } = useServiceTransition();

  const currentService = getServiceConfig(serviceId);
  const { prev, next, index, total } = getAdjacentServices(serviceId);

  return (
    <section
      aria-labelledby={`${serviceId}-service-switcher-heading`}
      className="border-t border-[#E2E8F0] bg-white py-12 sm:py-16"
    >
      <div className="apokrin-container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="apokrin-badge inline-flex items-center gap-1.5">
              <Compass
                className="h-3.5 w-3.5"
                style={{ color: themeConfig.primaryStrong }}
                aria-hidden="true"
              />
              <span>
                Service 0{index + 1} of 0{total} · Continue Exploring
              </span>
            </span>
            <h2
              id={`${serviceId}-service-switcher-heading`}
              className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl"
            >
              Switch Between Apokrin Services
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenBriefing(currentService.recommendedPractice, currentService.cta.brief)
            }
            className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
          >
            <span>{currentService.cta.buttonLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Previous Service Card */}
          <button
            type="button"
            disabled={isTransitioning}
            onClick={() => navigateToService(prev.id, 'prev')}
            className="apokrin-clay-panel group flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/95 p-5 text-left transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_22px_40px_-18px_var(--color-glow)] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DBEAFE] bg-[var(--color-surface-tint)] text-[var(--color-primary-strong)] transition-transform duration-200 group-hover:-translate-x-1">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-xs font-semibold text-[#64748B]">
                  Previous Service · 0{prev.order}
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-[#0A1128] transition-colors group-hover:text-[var(--color-primary-strong)]">
                  {prev.name}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-[#475569] sm:text-sm">
                  {prev.hero.previewCard.summary}
                </p>
              </div>
            </div>
          </button>

          {/* Next Service Card */}
          <button
            type="button"
            disabled={isTransitioning}
            onClick={() => navigateToService(next.id, 'next')}
            className="apokrin-clay-panel group flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/95 p-5 text-left transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_22px_40px_-18px_var(--color-glow)] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] sm:p-6"
          >
            <div>
              <p className="font-mono text-xs font-semibold text-[var(--color-primary-strong)]">
                Next Service · 0{next.order}
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-[#0A1128] transition-colors group-hover:text-[var(--color-primary-strong)]">
                {next.name}
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-[#475569] sm:text-sm">
                {next.hero.previewCard.summary}
              </p>
            </div>
            <span
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-200 group-hover:translate-x-1"
              style={{ background: 'var(--color-btn-gradient)' }}
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
