import { lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { PracticeArea, ScreenId } from '../data/apokrinData';

const AboutEcosystem3D = lazy(() =>
  import('./AboutEcosystem3D').then((m) => ({ default: m.AboutEcosystem3D })),
);

interface AboutUsSectionProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea) => void;
  onOpenBriefing?: (practice?: PracticeArea, brief?: string) => void;
}

export function AboutUsSection({ onNavigate }: AboutUsSectionProps) {
  return (
    <section
      id="about-us"
      aria-labelledby="about-us-heading"
      className="border-b border-[#E2E8F0] bg-white py-16 sm:py-20"
    >
      <div className="apokrin-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Original Apokrin About Us Content (Unchanged) */}
          <div className="lg:col-span-6">
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              About Us
            </span>

            <h2
              id="about-us-heading"
              style={{ textWrap: 'balance' }}
              className="mt-4 font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0A1128] sm:text-4xl"
            >
              Empowering Digital Transformation{' '}
              <span className="apokrin-gradient-text">
                Through Intelligent IT Solutions
              </span>
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-base">
              Apokrin LLC delivers innovative IT solutions and intelligent technology services to
              help businesses grow, streamline operations, and stay competitive. We specialize in
              IT consulting, cloud solutions, AI-driven transformation, data analytics,
              cybersecurity, and scalable infrastructure. Our tailored strategies empower
              organizations to solve complex challenges, modernize systems, and embrace digital
              transformation with confidence. With Apokrin LLC as your technology partner, you gain
              future-ready solutions designed to drive sustainable success in today&rsquo;s evolving
              market.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="apokrin-btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-xs font-bold tracking-wider uppercase whitespace-nowrap shrink-0"
              >
                <span>LEARN MORE ABOUT US</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Open 3D Claymorphism Technology Ecosystem */}
          <div className="lg:col-span-6">
            <Suspense
              fallback={
                <div className="flex h-[420px] w-full items-center justify-center sm:h-[460px] lg:h-[500px]">
                  <div
                    className="h-40 w-40 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 70%)',
                    }}
                  />
                </div>
              }
            >
              <AboutEcosystem3D />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
