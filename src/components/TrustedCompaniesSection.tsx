import { MouseEvent, ReactNode, useState } from 'react';

interface PartnerLogo {
  id: string;
  name: string;
  bobClass: string;
  renderLogo: () => ReactNode;
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: 'citibank',
    name: 'Citibank',
    bobClass: 'apokrin-clay-bob-0',
    renderLogo: () => (
      <svg
        viewBox="0 0 180 48"
        className="h-8 w-auto"
        role="img"
        aria-label="Citibank logo"
      >
        <path
          d="M 52 13 C 62 3, 86 3, 96 13"
          fill="none"
          stroke="#EE1C25"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <text
          x="22"
          y="35"
          fill="#003B70"
          fontFamily="Plus Jakarta Sans, Arial, sans-serif"
          fontWeight="800"
          fontSize="26"
          letterSpacing="-0.5"
        >
          citibank
        </text>
      </svg>
    ),
  },
  {
    id: 'alibris',
    name: 'Alibris',
    bobClass: 'apokrin-clay-bob-1',
    renderLogo: () => (
      <svg
        viewBox="0 0 164 48"
        className="h-8 w-auto"
        role="img"
        aria-label="Alibris logo"
      >
        <path
          d="M 73 7 C 78 5, 83 8, 81 13 C 77 14, 72 11, 73 7 Z"
          fill="#D97706"
        />
        <text
          x="18"
          y="35"
          fill="#6B1D4A"
          fontFamily="Plus Jakarta Sans, Georgia, serif"
          fontWeight="800"
          fontSize="27"
          letterSpacing="-0.4"
        >
          alibris
        </text>
      </svg>
    ),
  },
  {
    id: 'toyota',
    name: 'Toyota',
    bobClass: 'apokrin-clay-bob-2',
    renderLogo: () => (
      <svg
        viewBox="0 0 186 48"
        className="h-8 w-auto"
        role="img"
        aria-label="Toyota logo"
      >
        <g transform="translate(8, 8)">
          <ellipse
            cx="21"
            cy="16"
            rx="19"
            ry="13"
            fill="none"
            stroke="#EB0A1E"
            strokeWidth="2.8"
          />
          <ellipse
            cx="21"
            cy="16"
            rx="6"
            ry="12.5"
            fill="none"
            stroke="#EB0A1E"
            strokeWidth="2.4"
          />
          <ellipse
            cx="21"
            cy="10"
            rx="13.5"
            ry="4.8"
            fill="none"
            stroke="#EB0A1E"
            strokeWidth="2.4"
          />
        </g>
        <text
          x="56"
          y="32"
          fill="#1E293B"
          fontFamily="Plus Jakarta Sans, Arial, sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="1.6"
        >
          TOYOTA
        </text>
      </svg>
    ),
  },
  {
    id: 'ibm',
    name: 'IBM',
    bobClass: 'apokrin-clay-bob-3',
    renderLogo: () => (
      <svg
        viewBox="0 0 116 48"
        className="h-8 w-auto"
        role="img"
        aria-label="IBM logo"
      >
        <defs>
          <pattern
            id="ibm-stripes"
            width="10"
            height="4.4"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="10" height="2.6" fill="#1F70C1" />
          </pattern>
        </defs>
        <text
          x="10"
          y="37"
          fill="url(#ibm-stripes)"
          fontFamily="Plus Jakarta Sans, Impact, Arial Black, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="1.5"
        >
          IBM
        </text>
      </svg>
    ),
  },
  {
    id: 'additech',
    name: 'Additech',
    bobClass: 'apokrin-clay-bob-4',
    renderLogo: () => (
      <svg
        viewBox="0 0 176 48"
        className="h-8 w-auto"
        role="img"
        aria-label="Additech logo"
      >
        <g transform="translate(10, 10)">
          <polygon
            points="14,1 26,8 26,20 14,27 2,20 2,8"
            fill="none"
            stroke="#0F4C81"
            strokeWidth="2.6"
          />
          <polygon points="14,7 20,17 8,17" fill="#0891B2" />
        </g>
        <text
          x="44"
          y="31"
          fill="#0F4C81"
          fontFamily="Plus Jakarta Sans, Arial, sans-serif"
          fontWeight="700"
          fontSize="21"
          letterSpacing="-0.3"
        >
          Additech
        </text>
      </svg>
    ),
  },
];

function ClayLogoCard({ partner }: { partner: PartnerLogo }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 14,
      ry: x * 16,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  return (
    <div className={`${partner.bobClass} py-3`}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tilt.active
            ? `perspective(900px) translate3d(0, -6px, 0) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale(1.03)`
            : 'perspective(900px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)',
        }}
        className="apokrin-clay-card flex h-20 min-w-[184px] sm:min-w-[214px] items-center justify-center px-7 py-4"
      >
        {/* Elevated inner logo layer for realistic 3D depth above clay surface */}
        <div
          style={{
            transform: tilt.active ? 'translateZ(20px)' : 'translateZ(10px)',
            transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="pointer-events-none drop-shadow-[0_4px_10px_rgba(15,23,42,0.06)]"
        >
          {partner.renderLogo()}
        </div>
      </div>
    </div>
  );
}

export function TrustedCompaniesSection() {
  return (
    <section
      aria-labelledby="trusted-companies-heading"
      className="apokrin-clay-section relative overflow-hidden border-y border-[#DBE5F4] py-16 sm:py-20"
    >
      {/* Subtle 3D Clay Geometric Decorative Elements (minimal, peripheral, non-distracting) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto max-w-[var(--apokrin-container-max)] opacity-60"
      >
        {/* Soft Clay 3D Sphere (Upper Left) */}
        <div
          className="apokrin-geo-float hidden sm:block absolute left-8 top-8 h-10 w-10 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #ffffff 0%, var(--color-surface-soft) 60%, var(--color-surface-tint) 100%)',
            boxShadow:
              '6px 10px 18px var(--color-clay-shadow), inset -2px -3px 6px var(--color-clay-inset)',
          }}
        />

        {/* Tilted Soft Clay Cube (Upper Right) */}
        <div
          className="apokrin-geo-float-delayed hidden sm:block absolute right-12 top-10 h-9 w-9 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, var(--color-surface-soft) 100%)',
            transform: 'perspective(400px) rotateX(22deg) rotateY(-24deg) rotateZ(14deg)',
            boxShadow:
              '6px 10px 18px var(--color-clay-shadow), inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 6px var(--color-clay-inset)',
          }}
        />

        {/* Soft Clay Capsule / Geometric Pill (Lower Left) */}
        <div
          className="apokrin-geo-float-delayed hidden md:block absolute bottom-7 left-20 h-5 w-11 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, var(--color-surface-soft) 100%)',
            transform: 'rotate(-18deg)',
            boxShadow:
              '5px 8px 14px var(--color-clay-shadow), inset 1px 2px 3px rgba(255, 255, 255, 0.9), inset -2px -2px 5px var(--color-clay-inset)',
          }}
        />

        {/* Soft Clay Rounded Diamond / Node (Lower Right) */}
        <div
          className="apokrin-geo-float hidden md:block absolute bottom-8 right-24 h-7 w-7 rounded-xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, var(--color-surface-tint) 100%)',
            transform: 'rotate(34deg)',
            boxShadow:
              '5px 8px 14px var(--color-clay-shadow), inset 2px 2px 4px rgba(255, 255, 255, 0.9)',
          }}
        />
      </div>

      {/* Section Heading */}
      <div className="apokrin-container relative z-10">
        <div className="text-center">
          <h2
            id="trusted-companies-heading"
            style={{ textWrap: 'balance' }}
            className="font-display text-xl font-bold tracking-tight text-[#0A1128] sm:text-2xl"
          >
            Trusted by{' '}
            <span style={{ color: 'var(--color-primary-strong)' }}>companies</span>{' '}
            around the world
          </h2>
        </div>
      </div>

      {/* Infinite Claymorphism 3D Carousel */}
      <div className="apokrin-marquee-group relative z-10 mt-8 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-28"
          style={{
            background:
              'linear-gradient(90deg, var(--color-trusted-bg) 0%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-28"
          style={{
            background:
              'linear-gradient(270deg, var(--color-trusted-bg) 0%, transparent 100%)',
          }}
        />

        <div className="apokrin-marquee-track items-center gap-7 px-4">
          {/* Set 1 */}
          <div className="flex items-center gap-7">
            {PARTNER_LOGOS.map((partner) => (
              <ClayLogoCard key={`set1-${partner.id}`} partner={partner} />
            ))}
          </div>

          {/* Duplicate Set for Seamless Infinite Loop */}
          <div className="flex items-center gap-7 motion-reduce:hidden" aria-hidden="true">
            {PARTNER_LOGOS.map((partner) => (
              <ClayLogoCard key={`set2-${partner.id}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
