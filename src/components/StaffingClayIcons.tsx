import { useTheme } from '../theme/themeConfig';

export type EngagementModelIconId =
  | 'rpo'
  | 'tm'
  | 'sow'
  | 'fixed'
  | 'managed'
  | 'odc'
  | 'squads';

export type CapabilityIconId = 'recruitment-ai' | 'vms-hub';

export type BenefitIconId = 'speed' | 'centralize' | 'quality' | 'workflows' | 'compliance';

export type TaskOrderIconId = 'plan' | 'collaborate' | 'track' | 'close';

/**
 * Unique 3D Claymorphism SVG icons for each of the 7 Flexible Engagement Models.
 * Dynamically uses the active global Apokrin theme (Blue, Green, Orange).
 */
export function EngagementClayIcon3D({ id }: { id: EngagementModelIconId }) {
  const { themeConfig } = useTheme();
  const uid = `${id}-${themeConfig.id}`;

  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`clay-pri-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeConfig.secondary} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </linearGradient>
        <linearGradient id={`clay-soft-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor={themeConfig.surfaceSoft} />
          <stop offset="100%" stopColor={themeConfig.borderTint} />
        </linearGradient>
        <radialGradient id={`clay-orb-${uid}`} cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor={themeConfig.accent} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </radialGradient>
        <filter id={`clay-sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor={themeConfig.primaryStrong}
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {id === 'rpo' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Funnel & Talent Sphere */}
          <path
            d="M12 16 C12 13, 52 13, 52 16 L38 35 L38 49 C38 51, 26 53, 26 49 L26 35 Z"
            fill={`url(#clay-pri-${uid})`}
          />
          <ellipse cx="32" cy="16" rx="20" ry="4.5" fill={`url(#clay-soft-${uid})`} />
          <circle cx="24" cy="14" r="5" fill={`url(#clay-orb-${uid})`} />
          <circle cx="38" cy="12" r="4.2" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1" />
          <circle cx="32" cy="24" r="3.8" fill="#FFFFFF" opacity="0.9" />
        </g>
      )}

      {id === 'tm' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Stopwatch / Time & Meter Block */}
          <rect x="26" y="8" width="12" height="6" rx="3" fill={`url(#clay-pri-${uid})`} />
          <circle cx="32" cy="35" r="19" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <circle cx="32" cy="35" r="13.5" fill={`url(#clay-pri-${uid})`} />
          <circle cx="32" cy="35" r="10.5" fill="#FFFFFF" opacity="0.95" />
          <path
            d="M32 28 V35 L37.5 38.5"
            fill="none"
            stroke={themeConfig.primaryStrong}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="47" cy="20" r="4.5" fill={`url(#clay-orb-${uid})`} />
        </g>
      )}

      {id === 'sow' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Contract / Statement of Work Tablet */}
          <rect x="14" y="10" width="32" height="44" rx="8" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <rect x="21" y="19" width="18" height="4" rx="2" fill={`url(#clay-pri-${uid})`} />
          <rect x="21" y="27" width="14" height="3.5" rx="1.75" fill={themeConfig.borderTint} />
          <rect x="21" y="34" width="16" height="3.5" rx="1.75" fill={themeConfig.borderTint} />
          <circle cx="44" cy="44" r="9.5" fill={`url(#clay-orb-${uid})`} />
          <path
            d="M40 44 L43 47 L48.5 41"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {id === 'fixed' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Locked Target / Price Cube */}
          <rect x="13" y="18" width="38" height="34" rx="10" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <path
            d="M23 18 V15 C23 10.5, 41 10.5, 41 15 V18"
            fill="none"
            stroke={themeConfig.primaryStrong}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="35" r="9.5" fill={`url(#clay-pri-${uid})`} />
          <path
            d="M32 29.5 V40.5 M29.5 32.5 C29.5 31.2, 34.5 31.2, 34.5 32.8 C34.5 34.5, 29.5 34.8, 29.5 36.8 C29.5 38.5, 34.5 38.5, 34.5 37"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}

      {id === 'managed' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Shield & Telemetry Pulse */}
          <path
            d="M32 10 L50 17 V32 C50 43.5, 41.5 51.5, 32 55 C22.5 51.5, 14 43.5, 14 32 V17 Z"
            fill={`url(#clay-pri-${uid})`}
          />
          <path
            d="M32 15 L45 20.5 V31.5 C45 40.5, 38.8 46.5, 32 49.5 C25.2 46.5, 19 40.5, 19 31.5 V20.5 Z"
            fill={`url(#clay-soft-${uid})`}
          />
          <path
            d="M23 33 H27.5 L30.2 27.5 L33.8 37.5 L36.5 33 H41"
            fill="none"
            stroke={themeConfig.primaryStrong}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {id === 'odc' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Global Offshore Hub */}
          <circle cx="32" cy="32" r="19" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <ellipse cx="32" cy="32" rx="19" ry="7.5" fill="none" stroke={themeConfig.primary} strokeWidth="2.2" />
          <ellipse cx="32" cy="32" rx="8.5" ry="19" fill="none" stroke={themeConfig.secondary} strokeWidth="2.2" />
          <circle cx="17" cy="24" r="4.5" fill={`url(#clay-orb-${uid})`} />
          <circle cx="47" cy="40" r="4.5" fill={`url(#clay-orb-${uid})`} />
          <circle cx="32" cy="32" r="5" fill={`url(#clay-pri-${uid})`} />
        </g>
      )}

      {id === 'squads' && (
        <g filter={`url(#clay-sh-${uid})`}>
          {/* 3D Clay Interconnected Squad Nodes */}
          <path
            d="M20 42 L32 20 L44 42 Z"
            fill="none"
            stroke={themeConfig.primary}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="20" r="8.5" fill={`url(#clay-orb-${uid})`} />
          <circle cx="19" cy="43" r="7.5" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <circle cx="45" cy="43" r="7.5" fill={`url(#clay-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <circle cx="19" cy="43" r="3" fill={themeConfig.primaryStrong} />
          <circle cx="45" cy="43" r="3" fill={themeConfig.secondary} />
          <circle cx="32" cy="20" r="3" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  );
}

/**
 * 3D Claymorphism header icons for Core Capabilities (AI Recruitment Robot & Connected VMS Gears).
 */
export function CapabilityClayIcon3D({ id }: { id: CapabilityIconId }) {
  const { themeConfig } = useTheme();
  const uid = `${id}-${themeConfig.id}`;

  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`cap-pri-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeConfig.secondary} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </linearGradient>
        <linearGradient id={`cap-soft-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor={themeConfig.surfaceSoft} />
          <stop offset="100%" stopColor={themeConfig.borderTint} />
        </linearGradient>
        <radialGradient id={`cap-orb-${uid}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor={themeConfig.accent} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </radialGradient>
      </defs>

      {id === 'recruitment-ai' ? (
        <g>
          {/* Floating Clay Orbit Halo */}
          <ellipse
            cx="36"
            cy="38"
            rx="28"
            ry="11"
            transform="rotate(-14 36 38)"
            fill="none"
            stroke={themeConfig.borderTint}
            strokeWidth="2.4"
          />
          {/* Antenna */}
          <line x1="36" y1="12" x2="36" y2="19" stroke={themeConfig.primaryStrong} strokeWidth="3" strokeLinecap="round" />
          <circle cx="36" cy="11" r="4" fill={`url(#cap-orb-${uid})`} />
          {/* Robot Clay Head */}
          <rect
            x="17"
            y="19"
            width="38"
            height="27"
            rx="11"
            fill={`url(#cap-soft-${uid})`}
            stroke={themeConfig.borderTint}
            strokeWidth="1.5"
          />
          {/* Visor */}
          <rect x="22" y="25.5" width="28" height="13" rx="6" fill="#0F172A" />
          {/* Glowing Eyes */}
          <circle cx="30" cy="32" r="2.7" fill={themeConfig.accent} />
          <circle cx="42" cy="32" r="2.7" fill={themeConfig.secondary} />
          {/* Clay Body Pill */}
          <rect x="23" y="48.5" width="26" height="12" rx="6" fill={`url(#cap-pri-${uid})`} />
          <circle cx="56" cy="22" r="4.5" fill={`url(#cap-orb-${uid})`} />
        </g>
      ) : (
        <g>
          {/* Large Connected Vendor Clay Gear */}
          <circle cx="31" cy="37" r="18" fill={`url(#cap-pri-${uid})`} />
          <rect x="28" y="14" width="6" height="46" rx="3" fill={`url(#cap-pri-${uid})`} />
          <rect x="8" y="34" width="46" height="6" rx="3" fill={`url(#cap-pri-${uid})`} />
          <rect
            x="28"
            y="14"
            width="6"
            height="46"
            rx="3"
            transform="rotate(45 31 37)"
            fill={`url(#cap-pri-${uid})`}
          />
          <rect
            x="28"
            y="14"
            width="6"
            height="46"
            rx="3"
            transform="rotate(-45 31 37)"
            fill={`url(#cap-pri-${uid})`}
          />
          <circle cx="31" cy="37" r="13" fill={`url(#cap-soft-${uid})`} />
          <circle cx="31" cy="37" r="5.5" fill={themeConfig.primaryStrong} />
          {/* Secondary Vendor Node */}
          <circle cx="53" cy="21" r="10.5" fill={`url(#cap-soft-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <circle cx="53" cy="21" r="4.8" fill={`url(#cap-orb-${uid})`} />
          {/* Connector Beam */}
          <line x1="39" y1="31" x2="46" y2="25" stroke={themeConfig.secondary} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/**
 * Unique 3D Claymorphism icons for the 5 "Why Choose Apokrin?" benefit rows.
 */
export function BenefitClayIcon3D({ id }: { id: BenefitIconId }) {
  const { themeConfig } = useTheme();
  const uid = `ben-${id}-${themeConfig.id}`;

  return (
    <svg viewBox="0 0 56 56" className="h-11 w-11 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`bp-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeConfig.secondary} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </linearGradient>
        <linearGradient id={`bs-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={themeConfig.surfaceTint} />
        </linearGradient>
      </defs>

      <rect
        x="4"
        y="4"
        width="48"
        height="48"
        rx="16"
        fill={`url(#bs-${uid})`}
        stroke={themeConfig.borderTint}
        strokeWidth="1.4"
      />

      {id === 'speed' && (
        <path
          d="M31 13 L18 30 H27 L25 43 L38 26 H29 Z"
          fill={`url(#bp-${uid})`}
        />
      )}

      {id === 'centralize' && (
        <g>
          <circle cx="28" cy="28" r="7" fill={`url(#bp-${uid})`} />
          <circle cx="16" cy="18" r="3.8" fill={themeConfig.primary} />
          <circle cx="40" cy="18" r="3.8" fill={themeConfig.secondary} />
          <circle cx="16" cy="38" r="3.8" fill={themeConfig.secondary} />
          <circle cx="40" cy="38" r="3.8" fill={themeConfig.primary} />
          <path d="M19 20 L24 24 M37 20 L32 24 M19 36 L24 32 M37 36 L32 32" stroke={themeConfig.primaryStrong} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {id === 'quality' && (
        <g>
          <circle cx="28" cy="28" r="13" fill={`url(#bp-${uid})`} />
          <path
            d="M22 28.5 L26 32.5 L34.5 23.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {id === 'workflows' && (
        <g>
          <rect x="14" y="17" width="28" height="5" rx="2.5" fill={themeConfig.borderTint} />
          <circle cx="22" cy="19.5" r="4.5" fill={`url(#bp-${uid})`} />
          <rect x="14" y="26" width="28" height="5" rx="2.5" fill={themeConfig.borderTint} />
          <circle cx="34" cy="28.5" r="4.5" fill={`url(#bp-${uid})`} />
          <rect x="14" y="35" width="28" height="5" rx="2.5" fill={themeConfig.borderTint} />
          <circle cx="25" cy="37.5" r="4.5" fill={`url(#bp-${uid})`} />
        </g>
      )}

      {id === 'compliance' && (
        <g>
          <path
            d="M28 13 L41 18.5 V28.5 C41 36.2, 35.5 41.5, 28 44 C20.5 41.5, 15 36.2, 15 28.5 V18.5 Z"
            fill={`url(#bp-${uid})`}
          />
          <path
            d="M23 28.5 L26.5 32 L33.5 24.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/**
 * Unique 3D Claymorphism icons for the 4 Task Order Excellence steps.
 */
export function TaskOrderClayIcon3D({ id, active }: { id: TaskOrderIconId; active: boolean }) {
  const { themeConfig } = useTheme();
  const uid = `to-${id}-${themeConfig.id}-${active ? 'a' : 'i'}`;

  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`top-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={themeConfig.secondary} />
          <stop offset="100%" stopColor={themeConfig.primaryStrong} />
        </linearGradient>
        <linearGradient id={`tos-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={themeConfig.surfaceTint} />
        </linearGradient>
      </defs>

      {id === 'plan' && (
        <g>
          <rect x="13" y="12" width="38" height="40" rx="10" fill={`url(#tos-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <rect x="21" y="21" width="22" height="5" rx="2.5" fill={`url(#top-${uid})`} />
          <rect x="21" y="30" width="16" height="4" rx="2" fill={themeConfig.borderTint} />
          <rect x="21" y="38" width="19" height="4" rx="2" fill={themeConfig.borderTint} />
          <circle cx="46" cy="18" r="6" fill={`url(#top-${uid})`} />
        </g>
      )}

      {id === 'collaborate' && (
        <g>
          <circle cx="24" cy="27" r="9.5" fill={`url(#top-${uid})`} />
          <circle cx="41" cy="27" r="9.5" fill={`url(#tos-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <rect x="13" y="38" width="22" height="12" rx="6" fill={`url(#top-${uid})`} />
          <rect x="29" y="38" width="22" height="12" rx="6" fill={`url(#tos-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
        </g>
      )}

      {id === 'track' && (
        <g>
          <rect x="10" y="14" width="44" height="36" rx="10" fill={`url(#tos-${uid})`} stroke={themeConfig.borderTint} strokeWidth="1.5" />
          <rect x="18" y="32" width="6" height="11" rx="3" fill={themeConfig.borderTint} />
          <rect x="29" y="25" width="6" height="18" rx="3" fill={`url(#top-${uid})`} />
          <rect x="40" y="20" width="6" height="23" rx="3" fill={`url(#top-${uid})`} />
        </g>
      )}

      {id === 'close' && (
        <g>
          <circle cx="32" cy="32" r="20" fill={`url(#top-${uid})`} />
          <circle cx="32" cy="32" r="14" fill={`url(#tos-${uid})`} />
          <path
            d="M24 32.5 L29.5 38 L40 26.5"
            fill="none"
            stroke={themeConfig.primaryStrong}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}
