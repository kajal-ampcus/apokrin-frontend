import { PracticeArea, ScreenId } from '../data/apokrinData';
import { Apokrin3DLogo } from './Apokrin3DLogo';
import { TrustedCompaniesSection } from './TrustedCompaniesSection';
import { AboutUsSection } from './AboutUsSection';
import { ServicesStepperSection } from './ServicesStepperSection';
import { CompanyStatsSection } from './CompanyStatsSection';
import { FaqSection } from './FaqSection';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

export function OverviewScreen({ onNavigate, onOpenBriefing }: OverviewScreenProps) {
  return (
    <div className="relative overflow-x-hidden">
      {/* 1. Light-Theme Hero Section */}
      <section className="apokrin-hero-light border-b border-[#E2E8F0]">
        <div className="apokrin-container py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Proposition Column */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                  Next Generation Technology
                </span>

                <h1
                  style={{ textWrap: 'balance' }}
                  className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
                >
                  Simplifying Staffing Operations Through{' '}
                  <span className="apokrin-gradient-text">
                    Intelligent ATS &amp; VMS Software
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
                  Manage recruitment, candidates, staffing vendors, and workforce operations through
                  Apokrin&apos;s integrated staffing software platform.
                </p>

                <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#475569] sm:text-base">
                  From recruitment management to vendor coordination, Apokrin helps staffing
                  agencies and enterprise organizations streamline workforce operations through
                  Applicant Tracking System (ATS) and Vendor Management System (VMS) solutions.
                </p>
              </div>

              <div className="mt-10 border-t border-[#E2E8F0] pt-5 text-xs text-[#64748B]">
                SOC 2 Type II · HIPAA · ISO 27001 Attested Delivery across New York, London, Zurich,
                and Singapore
              </div>
            </div>

            {/* Right Dominant Anchor: Open 3D Animated Apokrin AI Robot + 3 Intertwined Arrows */}
            <div className="lg:col-span-6">
              <Apokrin3DLogo />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Companies Logo Carousel */}
      <TrustedCompaniesSection />

      {/* 3. About Us Section */}
      <AboutUsSection onNavigate={onNavigate} onOpenBriefing={onOpenBriefing} />

      {/* 4. Interactive 3D Claymorphism Services Stepper */}
      <ServicesStepperSection onNavigateService={(serviceId) => onNavigate(serviceId)} />

      {/* 5. Company Statistics / Our Impact */}
      <CompanyStatsSection />

      {/* 6. Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}
