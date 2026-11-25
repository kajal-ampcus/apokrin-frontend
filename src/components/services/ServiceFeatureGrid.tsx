import { lazy, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { getServiceConfig, ServiceId } from '../../data/servicesConfig';

const LazyDisintegratingFeatureGallery = lazy(() =>
  import('./DisintegratingFeatureGallery').then((mod) => ({
    default: mod.DisintegratingFeatureGallery,
  })),
);

interface ServiceFeatureGridProps {
  serviceId: ServiceId;
}

function GalleryFallbackSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          className="apokrin-clay-panel flex flex-col rounded-[1.85rem] border border-white/95 p-5"
        >
          <div className="aspect-[16/10] w-full animate-pulse rounded-[1.35rem] bg-[#E2E8F0]/70" />
          <div className="mt-5 h-3 w-28 animate-pulse rounded-full bg-[#E2E8F0]" />
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded-lg bg-[#E2E8F0]" />
          <div className="mt-2 h-4 w-full animate-pulse rounded-lg bg-[#E2E8F0]/75" />
        </div>
      ))}
    </div>
  );
}

/**
 * Unified Disintegrating Gallery section shared across all 9 Apokrin service pages.
 * Lazy-loads the canvas particle gallery and strictly scopes cards to the active serviceId.
 */
export function ServiceFeatureGrid({ serviceId }: ServiceFeatureGridProps) {
  const service = getServiceConfig(serviceId);
  const { gallerySection } = service;

  if (!gallerySection.cards.length) return null;

  return (
    <section
      aria-labelledby={`${serviceId}-interactive-gallery-heading`}
      className="apokrin-section apokrin-section-tint border-t border-[#E2E8F0]"
    >
      <div className="apokrin-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="apokrin-badge inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary-strong)]" aria-hidden="true" />
            <span>{gallerySection.badge}</span>
          </span>

          <h2
            id={`${serviceId}-interactive-gallery-heading`}
            className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
          >
            {gallerySection.headingPrefix}
            <span className="apokrin-gradient-text">{gallerySection.headingHighlight}</span>
          </h2>

          <p className="mt-3 text-base leading-relaxed text-[#475569]">
            {gallerySection.subtitle}
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<GalleryFallbackSkeleton />}>
            <LazyDisintegratingFeatureGallery key={serviceId} cards={gallerySection.cards} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
