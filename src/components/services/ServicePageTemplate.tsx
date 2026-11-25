import { ReactNode } from 'react';
import { PracticeArea } from '../../data/apokrinData';
import { ServiceId } from '../../data/servicesConfig';
import { ServiceCTA } from './ServiceCTA';
import { ServiceHeroCompareSlider } from './ServiceHeroCompareSlider';

interface ServicePageTemplateProps {
  serviceId: ServiceId;
  heroVisual?: ReactNode;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
  children: ReactNode;
}

/**
 * Shared Apokrin Service Page Template unifying:
 * 1. Compare Slider Hero Service Switcher (preserving each service's hero layout, theme & 3D visual)
 * 2. Complete original service-specific content (Overview, Capabilities, Why Choose, CTA, unique sections)
 * 3. Synchronized bottom Previous / Next Service navigation
 */
export function ServicePageTemplate({
  serviceId,
  heroVisual,
  onPrimaryCta,
  onSecondaryCta,
  onOpenBriefing,
  children,
}: ServicePageTemplateProps) {
  return (
    <div className="bg-white text-[#0A1128]" data-service-page={serviceId}>
      <ServiceHeroCompareSlider
        serviceId={serviceId}
        heroVisual={heroVisual}
        onPrimaryCta={onPrimaryCta}
        onSecondaryCta={onSecondaryCta}
      />

      {children}

      <ServiceCTA serviceId={serviceId} onOpenBriefing={onOpenBriefing} />
    </div>
  );
}
