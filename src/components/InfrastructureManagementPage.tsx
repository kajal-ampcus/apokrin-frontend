import { useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Blocks,
  Cloud,
  Compass,
  Cpu,
  HardDrive,
  Headphones,
  Laptop,
  Lock,
  MonitorSmartphone,
  Network,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import heroBackdropImg from '../assets/images/infrastructure_hero_backdrop_1794909868591.jpg';
import operationsCenterImg from '../assets/images/infrastructure_operations_center_1794909869797.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

interface InfrastructureManagementPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface WhyChooseInfraItem {
  id: string;
  number: string;
  title: string;
  description: string;
  highlight: string;
  icon: typeof Server;
}

const WHY_CHOOSE_ITEMS: WhyChooseInfraItem[] = [
  {
    id: 'oversight',
    number: '01',
    title: 'Comprehensive Infrastructure Oversight',
    description:
      'We manage networks, servers, storage, and endpoints with proactive monitoring and rapid triage to minimize downtime.',
    highlight: 'Unified telemetry & lifecycle continuity',
    icon: Server,
  },
  {
    id: 'cloud-hybrid',
    number: '02',
    title: 'Cloud & Hybrid Expertise',
    description:
      'Seamless integration, workload portability, and consistent performance across on-premise, cloud, and hybrid environments.',
    highlight: 'Adaptive multi-environment operations',
    icon: Cloud,
  },
  {
    id: 'security-first',
    number: '03',
    title: 'Security-First Approach',
    description:
      'Layered protection from endpoint defense and hardened firewalls to identity governance and continuous compliance.',
    highlight: 'Defense-in-depth & audit readiness',
    icon: ShieldCheck,
  },
  {
    id: 'scalable-automated',
    number: '04',
    title: 'Scalable & Automated Operations',
    description:
      'Automate routine patching and provisioning so IT scales smoothly alongside business growth with lower operational toil.',
    highlight: 'Automated runbooks & cost efficiency',
    icon: Zap,
  },
];

const BACKBONE_PILLARS = [
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    detail: 'Modernizing legacy backbones into agile, programmable enterprise environments.',
    icon: Sparkles,
  },
  {
    id: 'cloud',
    title: 'Cloud & Hybrid Platforms',
    detail: 'Scalable multi-cloud and on-premise foundations built for global growth.',
    icon: Cloud,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Compliance',
    detail: 'Continuous monitoring, hardened perimeters, and regulatory governance.',
    icon: Lock,
  },
  {
    id: 'mobility',
    title: 'Enterprise Mobility',
    detail: 'Reliable connectivity and endpoint governance for distributed teams.',
    icon: MonitorSmartphone,
  },
  {
    id: 'analytics',
    title: 'Data Analytics Readiness',
    detail: 'High-throughput compute and storage engineered for real-time insights.',
    icon: Activity,
  },
];

type CapabilityCategory = 'infrastructure' | 'modern-security';

interface InfraServiceItem {
  id: string;
  number: string;
  category: CapabilityCategory;
  title: string;
  shortTag: string;
  description: string;
  highlights: string[];
  icon: typeof Server;
}

const INFRASTRUCTURE_SERVICES: InfraServiceItem[] = [
  {
    id: 'data-center',
    number: '01',
    category: 'infrastructure',
    title: 'Data Center Services',
    shortTag: 'Compute, Storage & Availability',
    description:
      'Comprehensive management of physical and virtualized data centers—covering server administration, storage optimization, capacity planning, and high-availability operations for dependable continuity.',
    highlights: ['Server & Storage Ops', 'High-Availability Clusters', 'Capacity & Lifecycle Control'],
    icon: HardDrive,
  },
  {
    id: 'end-user-support',
    number: '02',
    category: 'infrastructure',
    title: 'End-User Support Services',
    shortTag: 'Desktop, Device & Workforce Care',
    description:
      'Responsive technical support across workstations, laptops, mobile devices, and collaboration tools—delivering endpoint provisioning, OS patching, and fast issue resolution.',
    highlights: ['Device Provisioning', 'OS & Software Patching', 'Rapid Incident Resolution'],
    icon: Laptop,
  },
  {
    id: 'it-service-desk',
    number: '03',
    category: 'infrastructure',
    title: 'IT Service Desk Operations',
    shortTag: '24/7 Multi-Tier Triage & SLAs',
    description:
      'Centralized, ITIL-aligned multi-tier service desk providing continuous incident intake, intelligent routing, root-cause escalation, and transparent SLA governance across global teams.',
    highlights: ['Multi-Tier Ticket Triage', 'ITIL Process Governance', 'SLA Tracking & Escalation'],
    icon: Headphones,
  },
  {
    id: 'network-management',
    number: '04',
    category: 'infrastructure',
    title: 'Network Management Services',
    shortTag: 'LAN, WAN, SD-WAN & Connectivity',
    description:
      'End-to-end administration and performance engineering across enterprise LAN, WAN, SD-WAN, wireless, and cloud interconnects for low-latency, resilient traffic flow.',
    highlights: ['24/7 Traffic Telemetry', 'SD-WAN & Routing Control', 'Bandwidth & QoS Tuning'],
    icon: Network,
  },
  {
    id: 'managed-security',
    number: '05',
    category: 'modern-security',
    title: 'Managed Security Services',
    shortTag: 'SOC Monitoring & Threat Defense',
    description:
      'Continuous threat detection, firewall administration, vulnerability remediation, and endpoint defense built to safeguard enterprise environments around the clock.',
    highlights: ['24/7 Threat Monitoring', 'Firewall & Endpoint Defense', 'Vulnerability Remediation'],
    icon: ShieldAlert,
  },
  {
    id: 'system-integration',
    number: '06',
    category: 'modern-security',
    title: 'System Integration & Management',
    shortTag: 'Unified Systems & Middleware',
    description:
      'Cohesive integration and administration of enterprise applications, middleware, identity directories, and hybrid stacks so disparate platforms operate as one unified ecosystem.',
    highlights: ['Cross-Platform Integration', 'Identity & Directory Sync', 'Unified Stack Operations'],
    icon: Blocks,
  },
  {
    id: 'open-source-infra',
    number: '07',
    category: 'modern-security',
    title: 'Open Source Infrastructure',
    shortTag: 'Linux, Containers & Automation',
    description:
      'Architecture, hardening, and lifecycle support for enterprise Linux environments, container orchestration, and open-source automation platforms without vendor lock-in.',
    highlights: ['Enterprise Linux Systems', 'Container & Automation Stacks', 'Vendor-Neutral Architecture'],
    icon: Terminal,
  },
  {
    id: 'infra-engineering-design',
    number: '08',
    category: 'modern-security',
    title: 'Infrastructure Engineering & Design',
    shortTag: 'Scalable Blueprints & Architecture',
    description:
      'Custom architectural blueprints covering network topology, compute sizing, cloud landing zones, and disaster recovery frameworks tailored for resilient enterprise growth.',
    highlights: ['Architecture Blueprints', 'Cloud & Hybrid Landing Zones', 'Resilience & DR Design'],
    icon: Compass,
  },
  {
    id: 'digital-workplace',
    number: '09',
    category: 'modern-security',
    title: 'Digital Workplace Services',
    shortTag: 'Modern Endpoint, VDI & UEM',
    description:
      'Secure anywhere-working capabilities powered by virtual desktop infrastructure (VDI), unified endpoint management (UEM), cloud productivity suites, and zero-touch onboarding.',
    highlights: ['Unified Endpoint Management', 'VDI & Cloud Workspaces', 'Zero-Touch Onboarding'],
    icon: MonitorSmartphone,
  },
  {
    id: 'information-security',
    number: '10',
    category: 'modern-security',
    title: 'Information Security Services',
    shortTag: 'Compliance, Encryption & Risk',
    description:
      'Strategic security governance encompassing data protection, encryption controls, access auditing, regulatory compliance alignment, and enterprise risk frameworks.',
    highlights: ['Compliance & Audit Readiness', 'Access & Encryption Governance', 'Security Policy Frameworks'],
    icon: Lock,
  },
  {
    id: 'cross-functional-it',
    number: '11',
    category: 'modern-security',
    title: 'Cross-Functional IT Services',
    shortTag: 'Integrated Delivery Across Teams',
    description:
      'Coordinated IT delivery uniting infrastructure, application operations, database platforms, and DevOps workflows to accelerate cross-departmental initiatives seamlessly.',
    highlights: ['DevOps & Ops Alignment', 'Cross-Team Service Delivery', 'Continuous Improvement'],
    icon: Workflow,
  },
];

const CAPABILITY_TRACKS: {
  id: CapabilityCategory;
  index: string;
  title: string;
  subtitle: string;
  count: number;
}[] = [
  {
    id: 'infrastructure',
    index: '01',
    title: 'Core Infrastructure Services',
    subtitle: 'Data centers, endpoints, service desk & networking',
    count: 4,
  },
  {
    id: 'modern-security',
    index: '02',
    title: 'Modern IT & Security Services',
    subtitle: 'Managed security, open source, workplace & architecture',
    count: 7,
  },
];

function SectionBadgeWithDot({ label }: { label: string }) {
  return (
    <span className="apokrin-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ background: 'var(--color-btn-gradient)' }}
      />
      <span>{label}</span>
    </span>
  );
}

export function InfrastructureManagementPage({
  onNavigate,
  onOpenBriefing,
}: InfrastructureManagementPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [opsImgFailed, setOpsImgFailed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CapabilityCategory>('infrastructure');
  const [activeServiceId, setActiveServiceId] = useState<string>(INFRASTRUCTURE_SERVICES[0].id);

  const visibleServices = INFRASTRUCTURE_SERVICES.filter((s) => s.category === activeCategory);
  const activeService =
    visibleServices.find((s) => s.id === activeServiceId) ?? visibleServices[0];
  const activeGlobalIndex = INFRASTRUCTURE_SERVICES.findIndex((s) => s.id === activeService.id);
  const ActiveServiceIcon = activeService.icon;

  const handleCategoryChange = (category: CapabilityCategory) => {
    setActiveCategory(category);
    const firstInCategory = INFRASTRUCTURE_SERVICES.find((s) => s.category === category);
    if (firstInCategory) {
      setActiveServiceId(firstInCategory.id);
    }
  };

  const handleStepService = (direction: -1 | 1) => {
    const nextIdx =
      (activeGlobalIndex + direction + INFRASTRUCTURE_SERVICES.length) %
      INFRASTRUCTURE_SERVICES.length;
    const nextService = INFRASTRUCTURE_SERVICES[nextIdx];
    setActiveCategory(nextService.category);
    setActiveServiceId(nextService.id);
  };

  const scrollToCapabilities = () => {
    const target = document.getElementById('infra-core-capabilities');
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* =====================================================================
          SECTION 1: EXECUTIVE HERO – INFRASTRUCTURE MANAGEMENT SERVICES
         ===================================================================== */}
      <section
        aria-labelledby="infra-hero-heading"
        className="relative isolate overflow-hidden border-b border-[#1E293B] bg-[#0A1128] py-12 text-white sm:py-16 lg:py-20"
      >
        {/* Subtle Architectural Background Image + Dark Scrim */}
        {!heroImgFailed && (
          <img
            src={heroBackdropImg}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-35"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(105deg, rgba(10,17,40,0.95) 0%, rgba(10,17,40,0.84) 52%, rgba(10,17,40,0.72) 100%)',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: themeConfig.primary }}
        />

        <div className="apokrin-container relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left 6 Cols: Crisp Value Proposition */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold text-slate-100 backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: 'var(--color-btn-gradient)' }}
                />
                <span>Enterprise IT Infrastructure</span>
              </span>

              <h1
                id="infra-hero-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-hero mt-5 font-display font-extrabold text-white"
              >
                Infrastructure Management{' '}
                <span style={{ color: themeConfig.accent }}>Services</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Scalable, secure, and automated IT operations spanning on-premise data centers,
                hybrid environments, and global cloud backbones.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={scrollToCapabilities}
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
                >
                  <span>Explore Capabilities</span>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
                >
                  <span>Contact Sales</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Right 6 Cols: Clean Framed Operations Visual */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="overflow-hidden rounded-[1.85rem] border border-white/15 bg-white/6 p-2.5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md">
                <div className="relative overflow-hidden rounded-[1.35rem] bg-[#0F172A]">
                  {opsImgFailed ? (
                    <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 p-8 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                        style={{ background: 'var(--color-btn-gradient)' }}
                      >
                        <Server className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <p className="font-display text-base font-bold text-white">
                        Enterprise IT Operations Center
                      </p>
                      <p className="max-w-xs text-xs text-slate-300">
                        Proactive monitoring across networks, servers, storage, and hybrid cloud
                        workloads.
                      </p>
                    </div>
                  ) : (
                    <img
                      src={operationsCenterImg}
                      alt="Enterprise IT infrastructure and network operations center with engineering specialists"
                      referrerPolicy="no-referrer"
                      onError={() => setOpsImgFailed(true)}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  )}
                </div>

                {/* Clean 3-Pillar Architectural Caption Strip */}
                <div className="grid grid-cols-3 divide-x divide-white/10 px-2 pb-1.5 pt-3 text-center">
                  <div className="px-2">
                    <p className="font-mono text-[11px] font-semibold text-slate-400">Environments</p>
                    <p className="mt-0.5 font-display text-xs font-bold text-white sm:text-sm">
                      On-Prem &amp; Cloud
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-mono text-[11px] font-semibold text-slate-400">Coverage</p>
                    <p className="mt-0.5 font-display text-xs font-bold text-white sm:text-sm">
                      24/7 Operations
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-mono text-[11px] font-semibold text-slate-400">Practice</p>
                    <p className="mt-0.5 font-display text-xs font-bold text-white sm:text-sm">
                      11 Core Services
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: STRATEGIC OVERVIEW – RESILIENT DIGITAL BACKBONES
         ===================================================================== */}
      <section
        aria-labelledby="infra-overview-heading"
        className="border-b border-[#E2E8F0] bg-white py-12 sm:py-14 lg:py-16"
      >
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left 6 Cols: Concise Editorial Narrative */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <SectionBadgeWithDot label="Infrastructure Overview" />

              <h2
                id="infra-overview-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Empowering Resilient{' '}
                <span className="apokrin-gradient-text">Digital Backbones</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                At Apokrin, our Infrastructure Management Services keep your entire IT ecosystem
                secure, scalable, and performance-optimized—from on-premise data centers to hybrid
                and global cloud environments.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base sm:leading-7">
                Spanning networks, servers, storage, cybersecurity, and proactive monitoring, we
                embed automation and compliance into every layer so your infrastructure evolves
                seamlessly alongside business innovation.
              </p>
            </motion.div>

            {/* Right 6 Cols: Clean 5-Domain Alignment List (Zero Clutter) */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="apokrin-clay-panel rounded-[1.75rem] border border-white/95 p-5 sm:p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Cross-Domain Infrastructure Alignment
                </p>

                <ul className="mt-4 divide-y divide-[#E2E8F0]">
                  {BACKBONE_PILLARS.map((pillar) => {
                    const PillarIcon = pillar.icon;
                    return (
                      <li
                        key={pillar.id}
                        className="flex items-start gap-3.5 py-3.5 first:pt-1 last:pb-1"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-primary-strong)]">
                          <PillarIcon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-sm font-extrabold text-[#0A1128]">
                            {pillar.title}
                          </h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#475569] sm:text-sm">
                            {pillar.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHY CHOOSE US? (Clean 4-Card Claymorphism Grid)
         ===================================================================== */}
      <section
        aria-labelledby="infra-why-heading"
        className="apokrin-clay-section border-b border-[#E2E8F0] py-12 sm:py-14 lg:py-16"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Why Choose Apokrin" />

            <h2
              id="infra-why-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Built for{' '}
              <span className="apokrin-gradient-text">
                Reliability, Security &amp; Automated Scale
              </span>
            </h2>
          </motion.div>

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_ITEMS.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <motion.article
                  key={item.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  className="apokrin-clay-card group flex flex-col justify-between rounded-[1.5rem] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:border-[var(--color-primary)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-primary-strong)] transition-all duration-200 group-hover:scale-105 group-hover:bg-[var(--color-primary-strong)] group-hover:text-white">
                        <ItemIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span
                        className="font-mono text-2xl font-bold leading-none text-[#E2E8F0] transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                        aria-hidden="true"
                      >
                        {item.number}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-base font-extrabold leading-snug text-[#0A1128] sm:text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                      {item.description}
                    </p>
                  </div>

                  <p
                    className="mt-5 border-t border-[#F1F5F9] pt-3.5 font-mono text-xs font-semibold"
                    style={{ color: themeConfig.primaryStrong }}
                  >
                    {item.highlight}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: CORE CAPABILITIES – INTERACTIVE SERVICE EXPLORER (11 Services)
         ===================================================================== */}
      <section
        id="infra-core-capabilities"
        aria-labelledby="infra-capabilities-heading"
        className="border-b border-[#E2E8F0] bg-white py-12 sm:py-14 lg:py-16"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionBadgeWithDot label="Core Capabilities" />

            <h2
              id="infra-capabilities-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Integrated Infrastructure &amp;{' '}
              <span className="apokrin-gradient-text">Modern IT Security Services</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
              Explore all 11 specialized infrastructure disciplines organized across core operations
              and modern security engineering.
            </p>
          </motion.div>

          {/* Clean Two-Track Category Selector */}
          <div
            role="tablist"
            aria-label="Infrastructure service categories"
            className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {CAPABILITY_TRACKS.map((track) => {
              const isSelected = activeCategory === track.id;
              return (
                <button
                  key={track.id}
                  id={`infra-track-tab-${track.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`infra-track-panel-${track.id}`}
                  onClick={() => handleCategoryChange(track.id)}
                  style={{
                    borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                    boxShadow: isSelected
                      ? `0 16px 34px -18px ${themeConfig.glow}`
                      : '0 6px 18px -12px rgba(15,23,42,0.06)',
                  }}
                  className={`group relative flex items-center justify-between gap-4 overflow-hidden rounded-[1.4rem] border px-5 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2 sm:px-6 ${
                    isSelected
                      ? 'bg-[#0A1128] text-white'
                      : 'bg-[#F8FAFC] text-[#0A1128] hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isSelected ? 'text-slate-400' : 'text-[#64748B]'
                      }`}
                    >
                      Track {track.index} · {track.count} Services
                    </span>
                    <h3
                      className={`mt-0.5 font-display text-base font-extrabold sm:text-lg ${
                        isSelected ? 'text-white' : 'text-[#0A1128]'
                      }`}
                    >
                      {track.title}
                    </h3>
                    <p
                      className={`mt-0.5 text-xs sm:text-sm ${
                        isSelected ? 'text-slate-300' : 'text-[#475569]'
                      }`}
                    >
                      {track.subtitle}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'bg-white text-[var(--color-primary-strong)] shadow-xs'
                    }`}
                    style={isSelected ? { background: 'var(--color-btn-gradient)' } : undefined}
                  >
                    {track.index}
                  </span>

                  {isSelected && (
                    <motion.div
                      layoutId="infra-active-category-bar"
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1"
                      style={{ background: 'var(--color-btn-gradient)' }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 360, damping: 30 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Master-Detail Explorer */}
          <div
            id={`infra-track-panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={`infra-track-tab-${activeCategory}`}
            className="mt-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
          >
            {/* Left 5 Cols: Compact Scannable Service Selector List */}
            <div className="flex flex-col gap-2.5 lg:col-span-5">
              {visibleServices.map((service) => {
                const ServiceIcon = service.icon;
                const isSelected = service.id === activeService.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveServiceId(service.id)}
                    aria-pressed={isSelected}
                    style={{
                      borderColor: isSelected ? themeConfig.primaryStrong : '#E2E8F0',
                      boxShadow: isSelected
                        ? `0 12px 26px -14px ${themeConfig.glow}`
                        : 'none',
                    }}
                    className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                      isSelected
                        ? 'bg-white'
                        : 'bg-[#F8FAFC]/80 hover:bg-white'
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                      style={
                        isSelected
                          ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                          : {
                              backgroundColor: 'var(--color-surface-soft)',
                              color: themeConfig.primaryStrong,
                            }
                      }
                    >
                      <ServiceIcon className="h-4.5 w-4.5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[11px] font-bold"
                          style={{
                            color: isSelected ? themeConfig.primaryStrong : '#64748B',
                          }}
                        >
                          {service.number}
                        </span>
                        <span className="truncate font-display text-sm font-extrabold text-[#0A1128]">
                          {service.title}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#64748B]">
                        {service.shortTag}
                      </p>
                    </div>

                    <ArrowRight
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                        isSelected
                          ? 'translate-x-0.5 text-[var(--color-primary-strong)]'
                          : 'text-[#CBD5E1] group-hover:translate-x-0.5 group-hover:text-[#64748B]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right 7 Cols: Spacious Dark-Navy Architectural Detail Spotlight */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeService.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.85rem] border border-[#1E293B] bg-[#0A1128] p-6 text-white shadow-[0_24px_50px_-22px_rgba(10,17,40,0.45)] sm:p-8"
                >
                  {/* Subtle Ambient Glow & Architectural Grid */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
                    style={{ background: themeConfig.primary }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                      backgroundSize: '22px 22px',
                    }}
                  />

                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                          style={{ background: 'var(--color-btn-gradient)' }}
                        >
                          <ActiveServiceIcon className="h-5.5 w-5.5" aria-hidden="true" />
                        </div>
                        <div>
                          <p
                            className="font-mono text-xs font-semibold"
                            style={{ color: themeConfig.accent }}
                          >
                            Service {activeService.number} / 11 · {activeService.shortTag}
                          </p>
                          <h3 className="mt-0.5 font-display text-xl font-extrabold text-white sm:text-2xl">
                            {activeService.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7">
                      {activeService.description}
                    </p>

                    {/* Structured Key Deliverables */}
                    <div className="mt-7 border-t border-white/12 pt-6">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Key Deliverables
                      </p>

                      <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {activeService.highlights.map((highlight, idx) => (
                          <div
                            key={highlight}
                            className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                          >
                            <span
                              className="font-mono text-xs font-bold"
                              style={{ color: themeConfig.accent }}
                            >
                              0{idx + 1}
                            </span>
                            <p className="mt-1.5 font-display text-sm font-bold leading-snug text-white">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA + Sequential Service Navigation */}
                  <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBriefing(
                          'Cloud Engineering',
                          `Infrastructure inquiry focused on: ${activeService.title}.`,
                        )
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
                    >
                      <span>Discuss {activeService.title}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStepService(-1)}
                        aria-label="Previous infrastructure service"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:bg-white/16 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="min-w-[3.2rem] text-center font-mono text-xs text-slate-400">
                        {activeService.number} / 11
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStepService(1)}
                        aria-label="Next infrastructure service"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:bg-white/16 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: CONVERSION CTA – MODERNIZE YOUR IT INFRASTRUCTURE
         ===================================================================== */}
      <section aria-labelledby="infra-cta-heading" className="apokrin-clay-section py-12 sm:py-14">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2.25rem] border border-white/95 px-6 py-10 text-center sm:px-12 sm:py-12"
          >
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-8 hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
            >
              <Server className="h-5.5 w-5.5" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-8 right-8 hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
            >
              <Cpu className="h-5.5 w-5.5" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <SectionBadgeWithDot label="Modernize With Apokrin" />

              <h2
                id="infra-cta-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Ready to modernize your{' '}
                <span className="apokrin-gradient-text">IT Infrastructure?</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                Partner with Apokrin to architect, secure, and automate a resilient enterprise
                backbone engineered for global scale.
              </p>

              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="apokrin-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Contact Sales</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
