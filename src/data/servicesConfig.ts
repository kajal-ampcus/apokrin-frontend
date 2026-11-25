import { PracticeArea, ScreenId } from './apokrinData';
import staffingHeroBackdropImg from '../assets/images/staffing_hero_backdrop_1794739946704.jpg';
import staffingIntroPlatformImg from '../assets/images/staffing_intro_platform_1794739946943.jpg';
import dataAnalyticsBackdropImg from '../assets/images/data_analytics_hero_backdrop_1794741301398.jpg';
import aboutAnalyticsDashboardImg from '../assets/images/about_analytics_dashboard_1794734042967.jpg';
import aboutImmersiveTechImg from '../assets/images/about_immersive_tech_1794734043239.jpg';
import dbmsInfraImg from '../assets/images/enterprise_database_infrastructure_1794909045366.jpg';
import infraHeroBackdropImg from '../assets/images/infrastructure_hero_backdrop_1794909868591.jpg';
import infraOpsCenterImg from '../assets/images/infrastructure_operations_center_1794909869797.jpg';
import mobilityHeroBackdropImg from '../assets/images/mobility_hero_backdrop_1794910292656.jpg';
import mobilityConnectedImg from '../assets/images/mobility_connected_enterprise_1794910291645.jpg';
import hrmsHeroBackdropImg from '../assets/images/hrms_hero_backdrop_1794911012390.jpg';
import hrmsWorkforceImg from '../assets/images/hrms_workforce_platform_1794911012639.jpg';

export type ServiceId =
  | 'staffing'
  | 'data-analytics'
  | 'application-development'
  | 'big-data'
  | 'database-management'
  | 'infrastructure-management'
  | 'mobility'
  | 'analytics'
  | 'hrms';

export type GalleryVisualPattern =
  | 'pipeline'
  | 'bars'
  | 'network'
  | 'layers'
  | 'streams'
  | 'cluster'
  | 'shield'
  | 'devices'
  | 'hologram'
  | 'workforce';

export interface DisintegratingVisualSlide {
  id: string;
  label: string;
  caption: string;
  pattern: GalleryVisualPattern;
  palette: [string, string, string];
  imageSrc?: string;
}

export interface ServiceFeatureGalleryCard {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  slides: DisintegratingVisualSlide[];
}

export interface ServiceHeroFloatingTag {
  title: string;
  subtitle: string;
}

export interface ServiceHeroCardPillar {
  label: string;
  value: string;
}

export interface ServiceHeroCardConfig {
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  pillars: [ServiceHeroCardPillar, ServiceHeroCardPillar, ServiceHeroCardPillar];
}

export interface ServiceHeroConfig {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  description?: string;
  themeVariant: 'dark' | 'light';
  layoutVariant: 'centered' | 'split';
  backdropImage?: string;
  backdropAlt?: string;
  primaryCtaLabel?: string;
  primaryCtaTargetId?: string;
  secondaryCtaLabel?: string;
  accentGradient: string;
  particleColors: [string, string, string];
  floatingTags?: ServiceHeroFloatingTag[];
  heroCard: ServiceHeroCardConfig;
  previewCard: {
    eyebrow: string;
    heading: string;
    summary: string;
    pillars: string[];
    imageSrc?: string;
  };
}

export interface ServiceConfig {
  id: ServiceId;
  order: number;
  name: string;
  shortName: string;
  route: string;
  seoTitle: string;
  seoDescription: string;
  recommendedPractice: PracticeArea;
  hero: ServiceHeroConfig;
  overview: {
    badge: string;
    heading: string;
    summary: string;
  };
  gallerySection: {
    badge: string;
    headingPrefix: string;
    headingHighlight: string;
    subtitle: string;
    cards: ServiceFeatureGalleryCard[];
  };
  benefits: string[];
  cta: {
    badge: string;
    heading: string;
    description: string;
    buttonLabel: string;
    brief: string;
  };
}

/**
 * Centralized configuration for all 9 Apokrin services.
 * Order matches the exact Services dropdown menu in TopBar & Footer.
 */
export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'staffing',
    order: 1,
    name: 'Staffing',
    shortName: 'Staffing',
    route: '/services/staffing',
    seoTitle: 'Staffing Solutions — End-to-End Recruitment & Vendor Management | Apokrin',
    seoDescription:
      'Apokrin delivers customized staffing frameworks through a modern SaaS platform uniting Recruitment Application and Vendor Management System (VMS) capabilities.',
    recommendedPractice: 'Cloud Engineering',
    hero: {
      badge: 'Apokrin Enterprise Staffing Platform',
      titlePrefix: 'Staffing ',
      titleHighlight: 'Solutions',
      subtitle:
        'Smart hiring meets strategic vendor management through one unified SaaS platform uniting recruitment automation and VMS governance.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: staffingHeroBackdropImg,
      backdropAlt: 'Enterprise technology headquarters and talent collaboration hub',
      primaryCtaLabel: 'Explore Engagement Models',
      primaryCtaTargetId: 'engagement-models',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      particleColors: ['#38BDF8', '#2563EB', '#E0F2FE'],
      heroCard: {
        imageSrc: '/videos/staffing-poster.jpg',
        imageAlt: 'Apokrin animated enterprise recruitment ATS and VMS task-order workflow',
        videoSrc: '/videos/staffing-hero.mp4',
        fallbackTitle: 'Unified Staffing & VMS Platform',
        fallbackSubtitle: 'Centralized recruitment automation, supplier management, and task order governance.',
        pillars: [
          { label: 'Platform', value: 'ATS & VMS Hub' },
          { label: 'Models', value: '7 Delivery Modes' },
          { label: 'Governance', value: 'End-to-End SLA' },
        ],
      },
      previewCard: {
        eyebrow: '01 · Staffing',
        heading: 'Recruitment & Vendor Management',
        summary: 'Customized staffing frameworks through a modern SaaS platform under one roof.',
        pillars: ['RPO, T&M, SOW & SQUADS', 'Recruitment Automation', 'VMS Task Order Control'],
        imageSrc: '/videos/staffing-poster.jpg',
      },
    },
    overview: {
      badge: 'Staffing Solutions',
      heading: 'Smart Hiring Meets Strategic Vendor Management',
      summary:
        'Apokrin brings together Recruitment Application and Vendor Management System (VMS) capabilities into one integrated SaaS platform.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Explore Staffing Capabilities ',
      headingHighlight: 'In Motion',
      subtitle:
        'Select any card to transition through Staffing platform visuals across recruitment automation, VMS governance, and task order execution.',
      cards: [
        {
          id: 'staffing-gal-recruitment',
          index: '01',
          category: 'Recruitment Automation',
          title: 'Smart Sourcing & ATS Workflows',
          description:
            'Manage workforce planning, AI job posting, interview scheduling, digital onboarding, and real-time hiring analytics.',
          slides: [
            {
              id: 'st-rec-1',
              label: 'Integrated SaaS Workspace',
              caption: 'Unified recruitment application and talent collaboration platform',
              pattern: 'pipeline',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
              imageSrc: staffingIntroPlatformImg,
            },
            {
              id: 'st-rec-2',
              label: 'AI Sourcing & Screening',
              caption: 'Automated resume filtering, job distribution, and referral tracking',
              pattern: 'network',
              palette: ['#1D4ED8', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'st-rec-3',
              label: 'Hiring Velocity Analytics',
              caption: 'Real-time visibility into quality-of-hire and time-to-fill metrics',
              pattern: 'bars',
              palette: ['#0284C7', '#06B6D4', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'staffing-gal-vms',
          index: '02',
          category: 'Vendor Management System',
          title: 'VMS & Task Order Lifecycle',
          description:
            'Centralize vendor procurement, compliance tracking, task order execution, and real-time resource utilization.',
          slides: [
            {
              id: 'st-vms-1',
              label: 'Unified Vendor Hub',
              caption: 'Complete oversight across third-party suppliers and contingent staffing',
              pattern: 'layers',
              palette: ['#1E40AF', '#0891B2', '#DBEAFE'],
              imageSrc: staffingHeroBackdropImg,
            },
            {
              id: 'st-vms-2',
              label: 'Task Order Governance',
              caption: 'Plan, collaborate, track, and close every task order with audit readiness',
              pattern: 'pipeline',
              palette: ['#2563EB', '#0EA5E9', '#F0F9FF'],
            },
            {
              id: 'st-vms-3',
              label: 'Resource Utilization Matrix',
              caption: 'Optimize allocation across active projects and engagement models',
              pattern: 'workforce',
              palette: ['#0369A1', '#06B6D4', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'staffing-gal-models',
          index: '03',
          category: 'Engagement Frameworks',
          title: 'Flexible Delivery Models',
          description:
            'Adapt seamlessly across RPO, T&M, SOW, Fixed-Price, Managed Services, ODC, and skill-based SQUADS delivery.',
          slides: [
            {
              id: 'st-mod-1',
              label: 'RPO & SQUADS Pods',
              caption: 'End-to-end hiring programs and skill-based engineering squads',
              pattern: 'workforce',
              palette: ['#2563EB', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'st-mod-2',
              label: 'SOW & Managed SLAs',
              caption: 'Outcome-focused delivery anchored by transparent KPIs and SLAs',
              pattern: 'shield',
              palette: ['#1D4ED8', '#06B6D4', '#DBEAFE'],
            },
            {
              id: 'st-mod-3',
              label: 'Global ODC Scaling',
              caption: 'Offshore Development Center frameworks built for enterprise growth',
              pattern: 'network',
              palette: ['#0284C7', '#38BDF8', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'Reduce hiring time and costs through automation.',
      'Centralize recruitment and vendor operations.',
      'Improve quality and consistency in delivery.',
      'Customize workflows to meet complex project needs.',
      'Ensure compliance, visibility, and audit readiness.',
    ],
    cta: {
      badge: 'Staffing Solutions',
      heading: 'Ready to transform your staffing operations?',
      description:
        'Connect with our team to explore Apokrin’s Recruitment Application, Vendor Management System (VMS), and flexible engagement models.',
      buttonLabel: 'Contact Sales',
      brief: 'Inquiry regarding Apokrin Staffing Solutions, Recruitment Application, and VMS.',
    },
  },
  {
    id: 'data-analytics',
    order: 2,
    name: 'Data Analytics',
    shortName: 'Data Analytics',
    route: '/services/data-analytics',
    seoTitle: 'Data Analytics Solutions Powered by Apokrin | Smarter Insights & Decisions',
    seoDescription:
      'Transform complex enterprise data into actionable intelligence across market analytics, CRM segmentation, risk governance, data visualization, and social media analytics.',
    recommendedPractice: 'Data Platforms',
    hero: {
      badge: 'Data Analytics Solutions',
      titlePrefix: 'Data Analytics ',
      titleHighlight: 'Solutions',
      subtitle:
        'Smarter insights, faster decisions, and real growth across market analytics, predictive CRM, risk governance, and interactive visualization.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: dataAnalyticsBackdropImg,
      backdropAlt: 'Enterprise data analytics intelligence background',
      primaryCtaLabel: 'Explore Our Solutions',
      primaryCtaTargetId: 'analytics-solutions',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 55%, #06B6D4 100%)',
      particleColors: ['#2563EB', '#06B6D4', '#7DD3FC'],
      heroCard: {
        imageSrc: '/videos/data-analytics-poster.jpg',
        imageAlt: 'Animated enterprise data analytics dashboard with predictive ROI forecasting and risk telemetry',
        videoSrc: '/videos/data-analytics-hero.mp4',
        fallbackTitle: 'Enterprise Data Analytics',
        fallbackSubtitle: 'Real-time business intelligence across marketing ROI, CRM, and risk governance.',
        pillars: [
          { label: 'Intelligence', value: 'Real-Time BI' },
          { label: 'Solutions', value: '5 Core Suites' },
          { label: 'Focus', value: 'ROI & Risk' },
        ],
      },
      previewCard: {
        eyebrow: '02 · Data Analytics',
        heading: 'Decision-Ready Business Intelligence',
        summary: 'Market, CRM, risk, visualization, and social analytics united in one architecture.',
        pillars: ['Real-Time Campaign ROI', 'Predictive CRM Modeling', 'Risk Governance Controls'],
        imageSrc: '/videos/data-analytics-poster.jpg',
      },
    },
    overview: {
      badge: 'Analytics Overview',
      heading: 'Convert Complex Data Into Actionable Enterprise Decisions',
      summary:
        'Apokrin unites fragmented business streams into structured intelligence for marketing, customer behavior, and risk governance.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Inspect Analytics Modules ',
      headingHighlight: 'With Live Transitions',
      subtitle:
        'Click any analytics card to cycle through market intelligence, CRM segmentation, and enterprise risk visualization views.',
      cards: [
        {
          id: 'da-gal-market',
          index: '01',
          category: 'Market & CRM Intelligence',
          title: 'Campaign ROI & Customer Segmentation',
          description:
            'Track structured campaign performance, traffic attribution, and predictive customer cohorts in real time.',
          slides: [
            {
              id: 'da-m-1',
              label: 'Executive Intelligence Suite',
              caption: 'Structured campaign dashboards and real-time attribution tracking',
              pattern: 'bars',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
              imageSrc: aboutAnalyticsDashboardImg,
            },
            {
              id: 'da-m-2',
              label: 'CRM Cohort Segmentation',
              caption: 'Segment customers by revenue potential, region, and interaction history',
              pattern: 'network',
              palette: ['#1D4ED8', '#0EA5E9', '#EFF6FF'],
            },
            {
              id: 'da-m-3',
              label: 'Predictive Funnel Forecast',
              caption: 'Forward-looking trend modeling across digital acquisition channels',
              pattern: 'streams',
              palette: ['#0284C7', '#06B6D4', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'da-gal-risk',
          index: '02',
          category: 'Risk & Governance',
          title: 'Risk Data Governance & Audit Controls',
          description:
            'Aggregate risk telemetry, assess IT infrastructure, and enforce strict audit controls across operations.',
          slides: [
            {
              id: 'da-r-1',
              label: 'Risk Telemetry Hub',
              caption: 'Centralized visibility across operational and financial risk signals',
              pattern: 'shield',
              palette: ['#1E3A8A', '#2563EB', '#DBEAFE'],
              imageSrc: dataAnalyticsBackdropImg,
            },
            {
              id: 'da-r-2',
              label: 'IT Infrastructure Audit',
              caption: 'Continuous posture validation and automated compliance trails',
              pattern: 'layers',
              palette: ['#1D4ED8', '#0891B2', '#EFF6FF'],
            },
            {
              id: 'da-r-3',
              label: 'Anomaly Surfacing Engine',
              caption: 'Early detection of variance across multi-source business datasets',
              pattern: 'streams',
              palette: ['#0369A1', '#38BDF8', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'da-gal-viz',
          index: '03',
          category: 'Data Visualization',
          title: 'Interactive Dashboards & Social Analytics',
          description:
            'Build full-scale charts, correlation reports, and mobile-ready visualizations for web and social channels.',
          slides: [
            {
              id: 'da-v-1',
              label: 'Visual Report Studio',
              caption: 'Intuitive drag-and-drop dashboard composition and trend plotting',
              pattern: 'bars',
              palette: ['#2563EB', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'da-v-2',
              label: 'Correlation Matrix View',
              caption: 'Uncover complex multi-variable relationships at enterprise scale',
              pattern: 'hologram',
              palette: ['#0284C7', '#06B6D4', '#E0F2FE'],
            },
            {
              id: 'da-v-3',
              label: 'Social Channel Sentiment',
              caption: 'Monitor brand conversations, reach, and audience engagement',
              pattern: 'network',
              palette: ['#1D4ED8', '#0EA5E9', '#DBEAFE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'Custom-built solutions for your industry.',
      'Real-time dashboards and predictive analytics.',
      'Integrated reporting across marketing, CRM, and risk.',
      'Scalable and secure data infrastructure.',
      'Seamless user experience and data visualization.',
    ],
    cta: {
      badge: 'Data Analytics Solutions',
      heading: 'Turn enterprise data into confident action',
      description:
        'Connect with our analytics architects to design custom dashboards, predictive models, and governed data pipelines.',
      buttonLabel: 'Schedule Analytics Consultation',
      brief: 'Consultation request for Apokrin Data Analytics Solutions.',
    },
  },
  {
    id: 'application-development',
    order: 3,
    name: 'Application Development',
    shortName: 'App Development',
    route: '/services/application-development',
    seoTitle: 'Application Development Services — Custom, Web & Mobile Software | Apokrin',
    seoDescription:
      'Apokrin delivers end-to-end custom application development, consulting, iOS, Android, QA testing, and modern web engineering tailored to your enterprise vision.',
    recommendedPractice: 'Cloud Engineering',
    hero: {
      badge: 'Custom Software & Digital Engineering',
      titlePrefix: 'Application Development ',
      titleHighlight: 'Services',
      subtitle:
        'Empowering your digital vision with scalable, tailored web, native iOS, Android, and enterprise software solutions.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: aboutImmersiveTechImg,
      backdropAlt: 'Modern enterprise software engineering studio and digital product architecture',
      primaryCtaLabel: 'Explore Our Solutions',
      primaryCtaTargetId: 'app-core-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
      particleColors: ['#3B82F6', '#06B6D4', '#93C5FD'],
      heroCard: {
        imageSrc: '/videos/application-development-poster.jpg',
        imageAlt: 'Animated custom software engineering workspace showing live code, CI/CD pipelines, and web/mobile builds',
        videoSrc: '/videos/application-development-hero.mp4',
        fallbackTitle: 'Custom Software & Mobile Engineering',
        fallbackSubtitle: 'Full-lifecycle architecture, web and mobile delivery, and automated QA.',
        pillars: [
          { label: 'Platforms', value: 'Web, iOS & Android' },
          { label: 'Lifecycle', value: '5-Stage Delivery' },
          { label: 'Quality', value: 'Full QA & Support' },
        ],
      },
      previewCard: {
        eyebrow: '03 · Application Development',
        heading: 'Custom, Mobile & Web Engineering',
        summary: 'Full-lifecycle analysis, design, engineering, QA testing, and enterprise integration.',
        pillars: ['Native iOS & Android', 'Modern Web Frameworks', 'End-to-End QA & Support'],
        imageSrc: '/videos/application-development-poster.jpg',
      },
    },
    overview: {
      badge: 'Application Development',
      heading: 'Custom Application Development Solutions',
      summary:
        'We design, build, integrate, and evolve resilient web, mobile, and enterprise software tailored to your complex IT challenges.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Architecture & Delivery ',
      headingHighlight: 'Visual Gallery',
      subtitle:
        'Select a software engineering card to step through architecture layers, mobile/web platforms, and continuous delivery stages.',
      cards: [
        {
          id: 'app-gal-custom',
          index: '01',
          category: 'Custom Applications',
          title: 'Consulting, Architecture & Maintenance',
          description:
            'Strategic guidance from ideation to deployment, backed by long-term enhancements and system optimization.',
          slides: [
            {
              id: 'app-c-1',
              label: 'Layered System Blueprint',
              caption: 'Modular experience, domain integration, and security core layers',
              pattern: 'layers',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
              imageSrc: aboutImmersiveTechImg,
            },
            {
              id: 'app-c-2',
              label: 'Enterprise API Integration',
              caption: 'Clean service boundaries connecting ERP, CRM, and cloud systems',
              pattern: 'network',
              palette: ['#1D4ED8', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'app-c-3',
              label: 'Continuous Maintenance',
              caption: 'Proactive enhancements, modernization, and reliability governance',
              pattern: 'pipeline',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'app-gal-mobile-web',
          index: '02',
          category: 'Mobile & Web Engineering',
          title: 'iOS, Android & Responsive Web Apps',
          description:
            'High-performance native mobile applications and scalable web interfaces built on modern frameworks.',
          slides: [
            {
              id: 'app-mw-1',
              label: 'Multi-Device Experience',
              caption: 'Cohesive native iOS, Android, and responsive web interfaces',
              pattern: 'devices',
              palette: ['#2563EB', '#0EA5E9', '#EFF6FF'],
            },
            {
              id: 'app-mw-2',
              label: 'Cross-Device QA Matrix',
              caption: 'Automated regression, usability, and compatibility validation',
              pattern: 'shield',
              palette: ['#1D4ED8', '#06B6D4', '#DBEAFE'],
            },
            {
              id: 'app-mw-3',
              label: 'Cloud-Ready Web Core',
              caption: 'Accessible component systems powered by resilient APIs',
              pattern: 'layers',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'app-gal-lifecycle',
          index: '03',
          category: 'Development Lifecycle',
          title: 'Discover, Design, Build & Deploy',
          description:
            'Structured five-stage engineering cadence uniting stakeholder workshops, agile sprints, QA validation, and rollout.',
          slides: [
            {
              id: 'app-lc-1',
              label: '01–02 Discover & Plan',
              caption: 'Technical feasibility mapping, UX wireframes, and API blueprints',
              pattern: 'pipeline',
              palette: ['#2563EB', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'app-lc-2',
              label: '03–04 Develop & Validate',
              caption: 'Iterative full-stack sprints paired with security and load QA',
              pattern: 'bars',
              palette: ['#1D4ED8', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'app-lc-3',
              label: '05 Deploy & Evolve',
              caption: 'Controlled production launches and continuous roadmap delivery',
              pattern: 'cluster',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'End-to-end accountability across analysis, design, engineering, QA, and integration.',
      'Collaborative co-delivery aligned closely with internal IT teams.',
      'Long-term support, maintenance, consulting, and advanced customization.',
    ],
    cta: {
      badge: 'Application Development',
      heading: 'Bring your next software initiative to life',
      description:
        'Partner with Apokrin’s engineers for custom web, native mobile, and enterprise modernization programs.',
      buttonLabel: 'Start Your Project',
      brief: 'Inquiry regarding Apokrin Application Development Services.',
    },
  },
  {
    id: 'big-data',
    order: 4,
    name: 'Big Data',
    shortName: 'Big Data',
    route: '/services/big-data',
    seoTitle: 'Big Data Solutions — Enterprise Data Engineering & AI | Apokrin',
    seoDescription:
      'Harness real-time big data ingestion, ETL pipelines, lakehouse architecture, predictive ML, and DSaaS with Apokrin enterprise Big Data solutions.',
    recommendedPractice: 'Data Platforms',
    hero: {
      badge: 'Enterprise Data Engineering & AI',
      titlePrefix: 'Big Data ',
      titleHighlight: 'Solutions',
      subtitle:
        'Empowering businesses with advanced Big Data solutions that drive real-time insights, lakehouse innovation, and intelligent decision-making.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: dataAnalyticsBackdropImg,
      backdropAlt: 'High-scale enterprise big data engineering and streaming pipeline architecture',
      primaryCtaLabel: 'Explore Our Solutions',
      primaryCtaTargetId: 'big-data-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 52%, #06B6D4 100%)',
      particleColors: ['#2563EB', '#38BDF8', '#06B6D4'],
      heroCard: {
        imageSrc: '/videos/big-data-poster.jpg',
        imageAlt: 'Animated Big Data real-time ETL streaming ingestion, lakehouse core, and predictive AI pipelines',
        videoSrc: '/videos/big-data-hero.mp4',
        fallbackTitle: 'Enterprise Big Data & Lakehouse AI',
        fallbackSubtitle: 'Streaming ETL ingestion, multi-cloud lakehouses, and predictive machine learning.',
        pillars: [
          { label: 'Architecture', value: 'Lakehouse & ETL' },
          { label: 'Processing', value: 'Real-Time Streams' },
          { label: 'Intelligence', value: 'AI & DSaaS' },
        ],
      },
      previewCard: {
        eyebrow: '04 · Big Data',
        heading: 'Real-Time Ingestion & Lakehouse AI',
        summary: 'Single source of truth for massive structured and unstructured enterprise datasets.',
        pillars: ['Streaming ETL Pipelines', 'Cloud & Hybrid Lakehouse', 'Predictive AI & DSaaS'],
        imageSrc: '/videos/big-data-poster.jpg',
      },
    },
    overview: {
      badge: 'Real-Time Big Data',
      heading: 'Harness Real-Time Big Data to Drive Smarter, Faster Business Decisions',
      summary:
        'Collect high-volume streams continuously, establish a single source of truth, and operationalize AI models at scale.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Big Data Engineering ',
      headingHighlight: 'Visual Modules',
      subtitle:
        'Select any card to disintegrate and reassemble visual views of Apokrin’s streaming pipelines, lakehouse tiers, and AI model workflows.',
      cards: [
        {
          id: 'bd-gal-ingestion',
          index: '01',
          category: 'Data Engineering',
          title: 'Real-Time Ingestion & ETL Pipelines',
          description:
            'Capture structured and unstructured streams from diverse sources with fault-tolerant automated orchestration.',
          slides: [
            {
              id: 'bd-ing-1',
              label: 'Continuous Stream Capture',
              caption: 'Low-latency ingestion from APIs, event buses, and operational logs',
              pattern: 'streams',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
            },
            {
              id: 'bd-ing-2',
              label: 'Automated ETL Orchestration',
              caption: 'Scalable batch and streaming transformation workflows',
              pattern: 'pipeline',
              palette: ['#1D4ED8', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'bd-ing-3',
              label: 'Data Quality & Lineage',
              caption: 'Enforce schema accuracy, governance, and compliance end-to-end',
              pattern: 'shield',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'bd-gal-lakehouse',
          index: '02',
          category: 'Storage Architecture',
          title: 'Data Lake, Warehouse & Hybrid Cloud',
          description:
            'Deploy unified query layers across AWS, Azure, GCP, or hybrid infrastructure engineered for massive scale.',
          slides: [
            {
              id: 'bd-lh-1',
              label: 'Unified Lakehouse Storage',
              caption: 'Single source of truth uniting raw lakes and curated warehouses',
              pattern: 'cluster',
              palette: ['#1E40AF', '#0891B2', '#DBEAFE'],
              imageSrc: dbmsInfraImg,
            },
            {
              id: 'bd-lh-2',
              label: 'Multi-Cloud Elasticity',
              caption: 'Consistent high-speed querying across AWS, Azure, GCP, and hybrid nodes',
              pattern: 'layers',
              palette: ['#2563EB', '#06B6D4', '#F0F9FF'],
            },
            {
              id: 'bd-lh-3',
              label: 'Zero-Trust Encryption',
              caption: 'Enterprise access governance and regulatory data protection at scale',
              pattern: 'shield',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'bd-gal-ai',
          index: '03',
          category: 'Advanced Analytics & AI',
          title: 'Predictive ML, Dashboards & DSaaS',
          description:
            'Operationalize ML models for fraud detection, forecasting, and personalization with live KPI monitoring.',
          slides: [
            {
              id: 'bd-ai-1',
              label: 'Predictive & Prescriptive ML',
              caption: 'Forecast outcomes and recommend optimal actions using ML pipelines',
              pattern: 'hologram',
              palette: ['#2563EB', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'bd-ai-2',
              label: 'Live Streaming KPIs',
              caption: 'Real-time executive visualizations paired with threshold alerts',
              pattern: 'bars',
              palette: ['#1D4ED8', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'bd-ai-3',
              label: 'Data Science as a Service',
              caption: 'Embedded experimentation pods accelerating production MLOps',
              pattern: 'network',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'End-to-End Big Data Solutions across strategy, architecture, and analytics.',
      'Real-Time Data Capture & Processing for agile decision-making.',
      'Scalable & Secure Data Management across cloud and hybrid environments.',
      'Predictive Analytics & Automation powered by AI and DSaaS.',
    ],
    cta: {
      badge: 'Big Data Solutions',
      heading: 'Scale your enterprise data architecture',
      description:
        'Work with Apokrin’s Big Data engineers to modernize pipelines, build governed lakehouses, and operationalize AI.',
      buttonLabel: 'Speak With a Data Architect',
      brief: 'Inquiry regarding Apokrin Big Data Solutions and Lakehouse Engineering.',
    },
  },
  {
    id: 'database-management',
    order: 5,
    name: 'Database Management System',
    shortName: 'Database Mgmt',
    route: '/services/database-management',
    seoTitle: 'Database Management System Services — 24/7 DBA & Continuity | Apokrin',
    seoDescription:
      'Reliable, secure, and scalable database administration, performance tuning, replication, disaster recovery, and licensing advisory by Apokrin.',
    recommendedPractice: 'Data Platforms',
    hero: {
      badge: 'Enterprise Database Engineering',
      titlePrefix: 'Database Management ',
      titleHighlight: 'Services',
      subtitle:
        'Reliable, secure, and scalable database solutions tailored to power your enterprise’s mission-critical digital backbone.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: dbmsInfraImg,
      backdropAlt: 'High-availability enterprise database cluster and storage infrastructure',
      primaryCtaLabel: 'Explore Capabilities',
      primaryCtaTargetId: 'dbms-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #1D4ED8 0%, #0284C7 55%, #06B6D4 100%)',
      particleColors: ['#1D4ED8', '#0284C7', '#7DD3FC'],
      heroCard: {
        imageSrc: '/videos/database-management-poster.jpg',
        imageAlt: 'Animated high-availability database cluster replication, SQL query tuning, and disaster recovery shield',
        videoSrc: '/videos/database-management-hero.mp4',
        fallbackTitle: 'Enterprise Database Management',
        fallbackSubtitle: '24/7 remote DBA administration, SQL tuning, replication, and disaster recovery.',
        pillars: [
          { label: 'Operations', value: '24/7 Remote DBA' },
          { label: 'Continuity', value: 'HA & Disaster Recovery' },
          { label: 'Environments', value: 'Cloud & On-Prem' },
        ],
      },
      previewCard: {
        eyebrow: '05 · Database Management System',
        heading: '24/7 Remote DBA & High Availability',
        summary: 'Remote administration, SQL tuning, cross-region replication, and disaster recovery.',
        pillars: ['24/7 Remote DBA Ops', 'Backup & DR Continuity', 'Licensing & Architecture'],
        imageSrc: '/videos/database-management-poster.jpg',
      },
    },
    overview: {
      badge: 'Enterprise Database Expertise',
      heading: 'Comprehensive Database Management Solutions',
      summary:
        'Keep mission-critical data platforms fast, resilient, and protected across cloud, hybrid, and on-premises environments.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Database Operations ',
      headingHighlight: 'Visual Blueprints',
      subtitle:
        'Click any database card to cycle through remote DBA administration, cross-region replication, and performance tuning visuals.',
      cards: [
        {
          id: 'db-gal-dba',
          index: '01',
          category: 'Remote DBA & Optimization',
          title: '24/7 Administration & Query Tuning',
          description:
            'Proactive health checks, SQL bottleneck optimization, hardened setups, and application server connectivity.',
          slides: [
            {
              id: 'db-1',
              label: 'Enterprise Server Infrastructure',
              caption: 'High-availability clusters managed across cloud, hybrid, and on-prem',
              pattern: 'cluster',
              palette: ['#1D4ED8', '#06B6D4', '#DBEAFE'],
              imageSrc: dbmsInfraImg,
            },
            {
              id: 'db-2',
              label: 'Workload Diagnostics & Tuning',
              caption: 'Deep index optimization, query plans, and connection pooling efficiency',
              pattern: 'bars',
              palette: ['#2563EB', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'db-3',
              label: 'Hardened HA Configuration',
              caption: 'Role-based security hardening and continuous compliance readiness',
              pattern: 'shield',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'db-gal-continuity',
          index: '02',
          category: 'Integrity & Continuity',
          title: 'Replication, Backup & Disaster Recovery',
          description:
            'Automated snapshots, point-in-time recovery, real-time regional replication, and zero-loss DR planning.',
          slides: [
            {
              id: 'db-c-1',
              label: 'Cross-Region Replication',
              caption: 'Real-time synchronization across global clusters for data consistency',
              pattern: 'network',
              palette: ['#2563EB', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'db-c-2',
              label: 'Automated Recovery Points',
              caption: 'Validated backup snapshots minimizing downtime and operational risk',
              pattern: 'layers',
              palette: ['#1D4ED8', '#0EA5E9', '#DBEAFE'],
            },
            {
              id: 'db-c-3',
              label: 'Failover Architecture',
              caption: 'Tested disaster recovery strategies built for resilient continuity',
              pattern: 'shield',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'db-gal-advisory',
          index: '03',
          category: 'Licensing & Advisory',
          title: 'Cloud Migration & License Optimization',
          description:
            'Cost-effective database procurement advisory paired with low-risk legacy modernization roadmaps.',
          slides: [
            {
              id: 'db-a-1',
              label: 'Legacy-to-Cloud Migration',
              caption: 'Zero-disruption transitions into modern cloud and hybrid data tiers',
              pattern: 'pipeline',
              palette: ['#2563EB', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'db-a-2',
              label: 'Enterprise License Strategy',
              caption: 'Optimize licensing footprint and architecture sizing for growth',
              pattern: 'bars',
              palette: ['#1D4ED8', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'db-a-3',
              label: 'Architecture Governance',
              caption: 'End-to-end consulting on capacity planning and platform reliability',
              pattern: 'cluster',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'End-to-End Database Solutions from remote DBA to disaster recovery.',
      'Modernization & Cloud Integration for smooth legacy transitions.',
      'Performance & Uptime Optimization via proactive monitoring and tuning.',
      'Secure & Scalable Infrastructure built for regulatory compliance.',
    ],
    cta: {
      badge: 'Database Management System',
      heading: 'Strengthen your mission-critical database backbone',
      description:
        'Connect with Apokrin’s database engineers for 24/7 remote DBA coverage, performance audits, or cloud migration.',
      buttonLabel: 'Consult Database Architects',
      brief: 'Inquiry regarding Apokrin Database Management System Services.',
    },
  },
  {
    id: 'infrastructure-management',
    order: 6,
    name: 'Infrastructure Management Systems',
    shortName: 'Infrastructure',
    route: '/services/infrastructure-management',
    seoTitle: 'Infrastructure Management Services — Cloud, Network & Security Ops | Apokrin',
    seoDescription:
      'Scalable, secure, and automated IT operations spanning data centers, SD-WAN networking, 24/7 service desk, managed security, and digital workplaces.',
    recommendedPractice: 'Security & FinOps',
    hero: {
      badge: 'Enterprise IT Infrastructure',
      titlePrefix: 'Infrastructure Management ',
      titleHighlight: 'Services',
      subtitle:
        'Scalable, secure, and automated IT operations spanning on-premise data centers, hybrid environments, and global cloud backbones.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: infraHeroBackdropImg,
      backdropAlt: 'Enterprise IT infrastructure and data center architecture',
      primaryCtaLabel: 'Explore Capabilities',
      primaryCtaTargetId: 'infra-core-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 55%, #38BDF8 100%)',
      particleColors: ['#38BDF8', '#2563EB', '#E0F2FE'],
      heroCard: {
        imageSrc: '/videos/infrastructure-management-poster.jpg',
        imageAlt: 'Animated enterprise IT infrastructure NOC mesh, SOC security radar, and live server cluster telemetry',
        videoSrc: '/videos/infrastructure-management-hero.mp4',
        fallbackTitle: 'Enterprise IT Operations Center',
        fallbackSubtitle: 'Proactive monitoring across networks, servers, storage, and hybrid cloud workloads.',
        pillars: [
          { label: 'Environments', value: 'On-Prem & Cloud' },
          { label: 'Coverage', value: '24/7 Operations' },
          { label: 'Practice', value: '11 Core Services' },
        ],
      },
      previewCard: {
        eyebrow: '06 · Infrastructure Management Systems',
        heading: '24/7 Data Center, Network & Security Ops',
        summary: '11 core infrastructure capabilities across on-premise, hybrid, and cloud ecosystems.',
        pillars: ['Data Center & SD-WAN', '24/7 Service Desk & SOC', 'Digital Workplace & Linux'],
        imageSrc: '/videos/infrastructure-management-poster.jpg',
      },
    },
    overview: {
      badge: 'Infrastructure Overview',
      heading: 'Empowering Resilient Digital Backbones',
      summary:
        'Keep your entire IT ecosystem secure, scalable, and performance-optimized across physical, virtualized, and cloud environments.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Infrastructure Operations ',
      headingHighlight: 'Visual Deck',
      subtitle:
        'Select any infrastructure card to reveal live transitions across operations centers, managed security, and modern digital workplaces.',
      cards: [
        {
          id: 'inf-gal-ops',
          index: '01',
          category: 'Core Infrastructure',
          title: 'Data Centers, Networks & Service Desk',
          description:
            '24/7 server administration, SD-WAN performance engineering, endpoint care, and ITIL multi-tier triage.',
          slides: [
            {
              id: 'inf-1',
              label: '24/7 Operations Center',
              caption: 'Continuous telemetry across servers, storage, and global network links',
              pattern: 'cluster',
              palette: ['#1D4ED8', '#06B6D4', '#DBEAFE'],
              imageSrc: infraOpsCenterImg,
            },
            {
              id: 'inf-2',
              label: 'SD-WAN & Routing Control',
              caption: 'Low-latency LAN, WAN, wireless, and cloud interconnect engineering',
              pattern: 'network',
              palette: ['#2563EB', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'inf-3',
              label: 'ITIL Multi-Tier Desk',
              caption: 'Structured SLA governance, rapid incident triage, and root-cause tracking',
              pattern: 'pipeline',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'inf-gal-security',
          index: '02',
          category: 'Managed Security',
          title: 'SOC Defense & Information Security',
          description:
            'Round-the-clock threat monitoring, firewall defense, vulnerability remediation, and encryption governance.',
          slides: [
            {
              id: 'inf-s-1',
              label: 'Hardened Infrastructure Core',
              caption: 'Defense-in-depth across perimeters, endpoints, and cloud backbones',
              pattern: 'shield',
              palette: ['#1E3A8A', '#2563EB', '#DBEAFE'],
              imageSrc: infraHeroBackdropImg,
            },
            {
              id: 'inf-s-2',
              label: 'Vulnerability & Threat Ops',
              caption: 'Proactive scanning, firewall management, and rapid containment',
              pattern: 'streams',
              palette: ['#1D4ED8', '#0891B2', '#EFF6FF'],
            },
            {
              id: 'inf-s-3',
              label: 'Compliance & Policy Controls',
              caption: 'Access auditing, encryption standards, and risk governance frameworks',
              pattern: 'layers',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'inf-gal-modern',
          index: '03',
          category: 'Modern IT & Workplace',
          title: 'Open Source, Cloud Design & VDI',
          description:
            'Vendor-neutral Linux and container stacks, scalable landing zones, and zero-touch digital workplace provisioning.',
          slides: [
            {
              id: 'inf-m-1',
              label: 'Linux & Container Stacks',
              caption: 'Open-source infrastructure automation without vendor lock-in',
              pattern: 'layers',
              palette: ['#2563EB', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'inf-m-2',
              label: 'Unified Digital Workplace',
              caption: 'Secure VDI, UEM endpoint policies, and anywhere-working productivity',
              pattern: 'devices',
              palette: ['#1D4ED8', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'inf-m-3',
              label: 'Cross-Functional DevOps',
              caption: 'Coordinated delivery uniting infrastructure, databases, and applications',
              pattern: 'pipeline',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'Comprehensive Infrastructure Oversight across networks, servers, and endpoints.',
      'Cloud & Hybrid Expertise ensuring workload portability and performance.',
      'Security-First Approach from endpoint defense to continuous compliance.',
      'Scalable & Automated Operations lowering operational toil as you grow.',
    ],
    cta: {
      badge: 'Infrastructure Management',
      heading: 'Modernize and safeguard your IT backbone',
      description:
        'Partner with Apokrin for 24/7 infrastructure management, network engineering, and managed security operations.',
      buttonLabel: 'Request Infrastructure Review',
      brief: 'Inquiry regarding Apokrin Infrastructure Management Systems.',
    },
  },
  {
    id: 'mobility',
    order: 7,
    name: 'Mobility',
    shortName: 'Mobility',
    route: '/services/mobility',
    seoTitle: 'Enterprise Mobility Services — Strategy, Mobile Apps & MDM | Apokrin',
    seoDescription:
      'Global enterprise mobility strategy, native and cross-platform mobile apps, API integration, BYOD enablement, and Mobile Device Management (MDM) by Apokrin.',
    recommendedPractice: 'Applied AI',
    hero: {
      badge: 'Connected Digital Workforce Solutions',
      titlePrefix: 'Enterprise Mobility ',
      titleHighlight: 'Services',
      subtitle:
        'Global solutions that drive innovation, flexibility, and growth—empowering your business through smart mobility strategies.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: mobilityHeroBackdropImg,
      backdropAlt: 'Connected smart city enterprise skyline symbolizing global enterprise mobility',
      primaryCtaLabel: 'Explore Capabilities',
      primaryCtaTargetId: 'mobility-core-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      particleColors: ['#38BDF8', '#06B6D4', '#E0F2FE'],
      heroCard: {
        imageSrc: '/videos/mobility-poster.jpg',
        imageAlt: 'Animated enterprise mobility cross-platform apps, BYOD separation, and zero-trust MDM security shield',
        videoSrc: '/videos/mobility-hero.mp4',
        fallbackTitle: 'Connected Enterprise Mobility',
        fallbackSubtitle: 'Cross-platform mobile engineering, BYOD enablement, and zero-trust MDM.',
        pillars: [
          { label: 'Platforms', value: 'iOS, Android & RN' },
          { label: 'Security', value: 'BYOD & MDM' },
          { label: 'Integration', value: 'ERP & Cloud APIs' },
        ],
      },
      previewCard: {
        eyebrow: '07 · Mobility',
        heading: 'Connected Mobile Ecosystems & MDM',
        summary: 'From custom iOS/Android apps to BYOD policies and enterprise MDM governance.',
        pillars: ['Mobility Strategy & BYOD', 'iOS, Android, Flutter & RN', 'MDM & API Integration'],
        imageSrc: '/videos/mobility-poster.jpg',
      },
    },
    overview: {
      badge: 'Enterprise Mobility',
      heading: 'Enabling Secure, Scalable Mobility Across Your Organization',
      summary:
        'From designing custom applications to managing mobile ecosystems, we provide end-to-end mobility solutions tailored to your goals.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'Enterprise Mobility ',
      headingHighlight: 'Experience Layers',
      subtitle:
        'Click any mobility card to transition through connected workforce photography, BYOD/MDM security policies, and cross-platform app architectures.',
      cards: [
        {
          id: 'mob-gal-workforce',
          index: '01',
          category: 'Connected Enterprise',
          title: 'Mobile Readiness & Workforce Enablement',
          description:
            'Assess infrastructure, establish platform strategies, and align stakeholders for frictionless mobile adoption.',
          slides: [
            {
              id: 'mob-1',
              label: 'Connected Enterprise Teams',
              caption: 'Empowering distributed workforces with secure mobile-first workflows',
              pattern: 'devices',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
              imageSrc: mobilityConnectedImg,
            },
            {
              id: 'mob-2',
              label: 'Platform & Device Strategy',
              caption: 'Right-sized device ecosystems designed for global enterprise scale',
              pattern: 'network',
              palette: ['#1D4ED8', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'mob-3',
              label: 'Change & Adoption Flows',
              caption: 'Structured rollout, documentation, and stakeholder enablement',
              pattern: 'pipeline',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'mob-gal-apps',
          index: '02',
          category: 'App Engineering',
          title: 'Native & Cross-Platform Delivery',
          description:
            'Build high-speed iOS, Android, Flutter, and React Native apps seamlessly connected to enterprise APIs.',
          slides: [
            {
              id: 'mob-a-1',
              label: 'Global Mobile Architecture',
              caption: 'Responsive cross-platform applications engineered for low latency',
              pattern: 'devices',
              palette: ['#1E40AF', '#0891B2', '#DBEAFE'],
              imageSrc: mobilityHeroBackdropImg,
            },
            {
              id: 'mob-a-2',
              label: 'Back-End API Sync',
              caption: 'Real-time synchronization with ERP, CRM, and enterprise cloud tools',
              pattern: 'streams',
              palette: ['#2563EB', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'mob-a-3',
              label: 'UX & Usage Telemetry',
              caption: 'Continuous optimization driven by performance insights and feedback',
              pattern: 'bars',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'mob-gal-mdm',
          index: '03',
          category: 'Security & Governance',
          title: 'BYOD, COPE & Mobile Device Management',
          description:
            'Protect corporate data on personal and managed devices with zero-trust access controls and MDM policies.',
          slides: [
            {
              id: 'mob-m-1',
              label: 'Zero-Trust MDM Control',
              caption: 'Centralized mobile asset management and automated compliance rules',
              pattern: 'shield',
              palette: ['#2563EB', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'mob-m-2',
              label: 'BYOD & COPE Separation',
              caption: 'Containerized corporate apps preserving employee privacy and security',
              pattern: 'layers',
              palette: ['#1D4ED8', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'mob-m-3',
              label: 'Unified Identity & SSO',
              caption: 'Seamless directory authentication across every mobile endpoint',
              pattern: 'network',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'End-to-End Mobility Solutions from strategy and app builds to MDM.',
      'Secure BYOD Enablement protecting corporate data on every device.',
      'Seamless App Integration with existing ERP, CRM, and cloud back-ends.',
      'Scalable & Future-Ready Platforms supporting rapid cross-platform releases.',
    ],
    cta: {
      badge: 'Enterprise Mobility',
      heading: 'Accelerate your mobile-first roadmap',
      description:
        'Connect with Apokrin to architect secure BYOD policies, custom mobile applications, and enterprise MDM ecosystems.',
      buttonLabel: 'Plan Your Mobility Strategy',
      brief: 'Inquiry regarding Apokrin Enterprise Mobility Services.',
    },
  },
  {
    id: 'analytics',
    order: 8,
    name: 'Analytics',
    shortName: 'Analytics',
    route: '/services/analytics',
    seoTitle: 'Analytics Solutions — Next-Gen Intelligence Platform (Coming Soon) | Apokrin',
    seoDescription:
      'Something intelligent is coming. Apokrin is building next-generation analytics experiences to transform enterprise data into meaningful insights.',
    recommendedPractice: 'Applied AI',
    hero: {
      badge: 'Coming Soon · Next-Gen Intelligence',
      titlePrefix: 'Analytics ',
      titleHighlight: 'Solutions',
      subtitle:
        'Something intelligent is coming—next-generation analytics experiences built to transform enterprise data into meaningful insights.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: dataAnalyticsBackdropImg,
      backdropAlt: 'Next-generation enterprise analytics workspace backdrop',
      primaryCtaLabel: 'Explore Preview',
      primaryCtaTargetId: 'analytics-preview',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 55%, #06B6D4 100%)',
      particleColors: ['#2563EB', '#7C3AED', '#06B6D4'],
      heroCard: {
        imageSrc: '/videos/analytics-poster.jpg',
        imageAlt: 'Animated next-generation holographic analytics workspace and real-time multi-axis telemetry',
        videoSrc: '/videos/analytics-hero.mp4',
        fallbackTitle: 'Next-Gen Analytics Workspace',
        fallbackSubtitle: 'Interactive telemetry visualization and intelligent insight discovery.',
        pillars: [
          { label: 'Status', value: 'Coming Soon' },
          { label: 'Workspace', value: '3D Telemetry' },
          { label: 'Access', value: 'Early Preview' },
        ],
      },
      previewCard: {
        eyebrow: '08 · Analytics',
        heading: 'Next-Gen Analytics Workspace',
        summary: 'Interactive 3D glassmorphic telemetry, holographic cores, and live trend intelligence.',
        pillars: ['3D Charts & Trends', 'Holographic Core Preview', 'Early Access Notifications'],
        imageSrc: '/videos/analytics-poster.jpg',
      },
    },
    overview: {
      badge: 'Coming Soon',
      heading: 'Next-Gen Analytics Workspace',
      summary:
        'Explore our upcoming interactive 3D analytics workspace and request early launch access.',
    },
    gallerySection: {
      badge: 'Upcoming Preview Modules',
      headingPrefix: 'Preview Next-Gen Analytics ',
      headingHighlight: 'Capabilities',
      subtitle:
        'Select any preview card to transition through upcoming visualization, telemetry, and intelligent insight experiences.',
      cards: [
        {
          id: 'an-gal-dash',
          index: '01',
          category: 'Workspace Preview',
          title: 'Unified Intelligence Canvas',
          description:
            'A clean glassmorphic decision canvas designed to bring real-time metrics and interactive exploration together.',
          slides: [
            {
              id: 'an-1',
              label: 'Interactive Telemetry Grid',
              caption: 'Unified executive views built for clarity and zero-latency filtering',
              pattern: 'hologram',
              palette: ['#2563EB', '#7C3AED', '#06B6D4'],
              imageSrc: aboutAnalyticsDashboardImg,
            },
            {
              id: 'an-2',
              label: 'Multi-Axis Trend Layers',
              caption: 'Inspect temporal patterns and metric trajectories smoothly',
              pattern: 'bars',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
            },
            {
              id: 'an-3',
              label: 'Contextual Signal Focus',
              caption: 'Highlight anomalies and key inflection points automatically',
              pattern: 'streams',
              palette: ['#4F46E5', '#38BDF8', '#EFF6FF'],
            },
          ],
        },
        {
          id: 'an-gal-ai',
          index: '02',
          category: 'Intelligent Insights',
          title: 'Automated Pattern Discovery',
          description:
            'Transform complex business data streams into structured narratives and meaningful decision signals.',
          slides: [
            {
              id: 'an-a-1',
              label: 'Holographic Signal Core',
              caption: 'Synthesizing multi-department feeds into crisp operational clarity',
              pattern: 'hologram',
              palette: ['#2563EB', '#06B6D4', '#E0F2FE'],
            },
            {
              id: 'an-a-2',
              label: 'Connected Metric Graph',
              caption: 'Trace upstream drivers and downstream outcomes seamlessly',
              pattern: 'network',
              palette: ['#1D4ED8', '#7C3AED', '#EFF6FF'],
            },
            {
              id: 'an-a-3',
              label: 'Executive Brief Exports',
              caption: 'Share clean visual intelligence across leadership teams effortlessly',
              pattern: 'layers',
              palette: ['#0284C7', '#06B6D4', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'an-gal-access',
          index: '03',
          category: 'Launch Roadmap',
          title: 'Built for Modern IT Enterprises',
          description:
            'Designed to connect seamlessly alongside Apokrin Data Analytics, Big Data, and enterprise cloud platforms.',
          slides: [
            {
              id: 'an-r-1',
              label: 'Ecosystem Integration',
              caption: 'Direct compatibility with Apokrin Data Analytics and Big Data pipelines',
              pattern: 'pipeline',
              palette: ['#2563EB', '#0EA5E9', '#DBEAFE'],
            },
            {
              id: 'an-r-2',
              label: 'Enterprise Governance',
              caption: 'Built from day one with role-based controls and secure telemetry',
              pattern: 'shield',
              palette: ['#1D4ED8', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'an-r-3',
              label: 'Early Access Preview',
              caption: 'Register to receive launch updates and guided walkthrough invites',
              pattern: 'cluster',
              palette: ['#4F46E5', '#06B6D4', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'Next-generation glassmorphic analytics workspace under active development.',
      'Interactive 3D telemetry visualization and multi-preset exploration.',
      'Early access notifications available for enterprise teams.',
    ],
    cta: {
      badge: 'Analytics Solutions',
      heading: 'Get notified when Analytics launches',
      description:
        'Request early access notifications or explore our live Data Analytics Solutions today.',
      buttonLabel: 'Notify Me at Launch',
      brief: 'Early access notification request for upcoming Apokrin Analytics Solutions.',
    },
  },
  {
    id: 'hrms',
    order: 9,
    name: 'HRMS',
    shortName: 'HRMS',
    route: '/services/hrms',
    seoTitle: 'Apokrin HRMS Solution — Intelligent Workforce Platform for IT | Apokrin',
    seoDescription:
      'Streamline HR operations, recruitment, onboarding, payroll, performance, role-based access, and compliance with Apokrin’s intelligent HRMS.',
    recommendedPractice: 'Data Platforms',
    hero: {
      badge: 'Intelligent Workforce Platform',
      titlePrefix: 'Apokrin ',
      titleHighlight: 'HRMS Solution',
      subtitle:
        'Streamline HR operations, enhance employee engagement, and unlock business growth with Apokrin’s intelligent HRMS built for the IT industry.',
      themeVariant: 'dark',
      layoutVariant: 'split',
      backdropImage: hrmsHeroBackdropImg,
      backdropAlt: 'Modern enterprise technology atrium supporting collaborative people-first operations',
      primaryCtaLabel: 'Explore Capabilities',
      primaryCtaTargetId: 'hrms-core-capabilities',
      secondaryCtaLabel: 'Contact Sales',
      accentGradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      particleColors: ['#38BDF8', '#2563EB', '#E0F2FE'],
      heroCard: {
        imageSrc: '/videos/hrms-poster.jpg',
        imageAlt: 'Animated Apokrin HRMS hire-to-retain lifecycle, RBAC access tree, and workforce pulse analytics',
        videoSrc: '/videos/hrms-hero.mp4',
        fallbackTitle: 'Intelligent Workforce Platform',
        fallbackSubtitle: 'Unified HRIS operations, recruitment automation, payroll, and role-based compliance.',
        pillars: [
          { label: 'Operations', value: 'Unified HRIS' },
          { label: 'Access', value: 'Role-Based RBAC' },
          { label: 'Lifecycle', value: 'Hire to Retain' },
        ],
      },
      previewCard: {
        eyebrow: '09 · HRMS',
        heading: 'Automated Workforce Intelligence',
        summary: 'With advanced automation, role-based access, and real-time insights for HR & teams.',
        pillars: ['Payroll, Leave & Attendance', 'ATS & Digital Onboarding', 'Performance & Compliance'],
        imageSrc: '/videos/hrms-poster.jpg',
      },
    },
    overview: {
      badge: 'Human Resource Management',
      heading: 'Intelligent HRMS Solutions for the IT Industry',
      summary:
        'Manage recruitment, onboarding, payroll, performance, and compliance from a single integrated system with role-based access.',
    },
    gallerySection: {
      badge: 'Interactive Visual Showcase',
      headingPrefix: 'HRMS Platform ',
      headingHighlight: 'Interactive Modules',
      subtitle:
        'Select any HRMS card to transition through recruitment automation, unified HRIS records, and real-time compliance analytics.',
      cards: [
        {
          id: 'hrms-gal-talent',
          index: '01',
          category: 'Talent Acquisition',
          title: 'AI Screening, ATS & Digital Onboarding',
          description:
            'Accelerate candidate shortlisting, centralize hiring workflows, and deliver seamless digital onboarding portals.',
          slides: [
            {
              id: 'hr-t-1',
              label: 'People-First Workforce Hub',
              caption: 'Unified platform empowering both HR teams and engineering talent',
              pattern: 'workforce',
              palette: ['#2563EB', '#06B6D4', '#DBEAFE'],
              imageSrc: hrmsWorkforceImg,
            },
            {
              id: 'hr-t-2',
              label: 'Recruitment Automation',
              caption: 'AI-assisted screening, ATS communication, and inclusive hiring flows',
              pattern: 'pipeline',
              palette: ['#1D4ED8', '#38BDF8', '#EFF6FF'],
            },
            {
              id: 'hr-t-3',
              label: 'Multi-Location Onboarding',
              caption: 'Digital documentation, device checklists, and Day-1 readiness',
              pattern: 'devices',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
        {
          id: 'hrms-gal-ops',
          index: '02',
          category: 'Unified HRIS',
          title: 'Payroll, Leave, Attendance & Reviews',
          description:
            'Consolidate core HR administration, automated approvals, goal tracking, and personalized learning paths.',
          slides: [
            {
              id: 'hr-o-1',
              label: 'Centralized HR Operations',
              caption: 'Payroll, benefits, leave, and attendance synchronized in one workspace',
              pattern: 'layers',
              palette: ['#1E40AF', '#0891B2', '#DBEAFE'],
              imageSrc: hrmsHeroBackdropImg,
            },
            {
              id: 'hr-o-2',
              label: 'Performance & L&D Growth',
              caption: 'Continuous feedback cycles paired with upskilling learning paths',
              pattern: 'bars',
              palette: ['#2563EB', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'hr-o-3',
              label: 'Employee Engagement Pulse',
              caption: 'Surveys, recognition tools, and culture-building workflows',
              pattern: 'workforce',
              palette: ['#0369A1', '#38BDF8', '#ECFEFF'],
            },
          ],
        },
        {
          id: 'hrms-gal-gov',
          index: '03',
          category: 'Governance & Insights',
          title: 'Role-Based Access & Compliance Analytics',
          description:
            'Protect sensitive employee records with configurable RBAC while gaining real-time workforce and labor-law visibility.',
          slides: [
            {
              id: 'hr-g-1',
              label: 'Granular Role-Based Access',
              caption: 'Structured permissions tailored to executives, HR, managers, and staff',
              pattern: 'shield',
              palette: ['#2563EB', '#38BDF8', '#DBEAFE'],
            },
            {
              id: 'hr-g-2',
              label: 'Workforce Trend Analytics',
              caption: 'Live retention, capacity, and departmental headcount insights',
              pattern: 'bars',
              palette: ['#1D4ED8', '#06B6D4', '#EFF6FF'],
            },
            {
              id: 'hr-g-3',
              label: 'Audit-Ready Compliance',
              caption: 'Automated policy tracking and labor-law documentation governance',
              pattern: 'network',
              palette: ['#0284C7', '#0EA5E9', '#E0F2FE'],
            },
          ],
        },
      ],
    },
    benefits: [
      'Unified HR Operations across payroll, leave, and attendance.',
      'Strategic HR Enablement focused on culture, engagement, and retention.',
      'Automation & Role-Based Access across roles and departments.',
      'Real-Time Insights & Compliance built for labor laws and company policies.',
    ],
    cta: {
      badge: 'Apokrin HRMS Solution',
      heading: 'Empower your HR teams and workforce',
      description:
        'Connect with our specialists for a tailored walkthrough of Apokrin’s automated HRMS platform.',
      buttonLabel: 'Request HRMS Walkthrough',
      brief: 'Inquiry regarding Apokrin HRMS Solution.',
    },
  },
];

export const SERVICE_ID_SET = new Set<ServiceId>(SERVICES_CONFIG.map((s) => s.id));

export function isServiceScreen(screen: ScreenId): screen is ServiceId {
  return SERVICE_ID_SET.has(screen as ServiceId);
}

export function getServiceConfig(id: ServiceId): ServiceConfig {
  return SERVICES_CONFIG.find((service) => service.id === id) ?? SERVICES_CONFIG[0];
}

/**
 * Returns adjacent previous and next services following the exact Services dropdown order,
 * with intentional circular wraparound so every service hero supports both directions seamlessly.
 */
export function getAdjacentServices(id: ServiceId): {
  prev: ServiceConfig;
  next: ServiceConfig;
  index: number;
  total: number;
} {
  const total = SERVICES_CONFIG.length;
  const idx = SERVICES_CONFIG.findIndex((service) => service.id === id);
  const safeIdx = idx >= 0 ? idx : 0;
  const prev = SERVICES_CONFIG[(safeIdx - 1 + total) % total];
  const next = SERVICES_CONFIG[(safeIdx + 1) % total];
  return { prev, next, index: safeIdx, total };
}

export function getPathForScreen(screen: ScreenId): string {
  if (screen === 'overview') return '/';
  if (screen === 'about') return '/about';
  if (screen === 'contact') return '/contact';
  if (isServiceScreen(screen)) return `/services/${screen}`;
  return `/${screen}`;
}

export function resolveScreenFromPath(pathname: string): ScreenId {
  const cleaned = pathname.replace(/\/+$/, '').replace(/\.html$/i, '').toLowerCase();
  if (!cleaned || cleaned === '' || cleaned === '/index') return 'overview';
  if (cleaned === '/about' || cleaned === '/about-us') return 'about';
  if (cleaned === '/contact' || cleaned === '/contact-us') return 'contact';
  if (cleaned === '/solutions') return 'solutions';
  if (cleaned === '/talent') return 'talent';
  if (cleaned === '/benchmarks') return 'benchmarks';
  if (cleaned === '/engagements') return 'engagements';

  const serviceSlug = cleaned.startsWith('/services/')
    ? cleaned.slice('/services/'.length)
    : cleaned.startsWith('/')
      ? cleaned.slice(1)
      : cleaned;

  const matchedService = SERVICES_CONFIG.find((s) => s.id === serviceSlug);
  if (matchedService) {
    return matchedService.id;
  }

  return 'overview';
}

export const DEFAULT_SITE_SEO = {
  title: 'Apokrin — Advanced IT, Cloud & Digital Transformation Services',
  description:
    'Apokrin LLC delivers innovative IT solutions including staffing, data analytics, application development, big data, database management, infrastructure, mobility, and HRMS.',
};

export const STATIC_SCREEN_SEO: Partial<Record<ScreenId, { title: string; description: string }>> = {
  overview: DEFAULT_SITE_SEO,
  about: {
    title: 'About Us — Empowering Digital Transformation | Apokrin',
    description:
      'Learn about Apokrin LLC, our mission, global presence, and intelligent IT consulting, cloud, data analytics, and scalable infrastructure expertise.',
  },
  contact: {
    title: 'Contact Apokrin — Start Your Digital Transformation',
    description:
      'Connect with Apokrin LLC to discuss enterprise IT consulting, staffing, cloud infrastructure, analytics, and custom application solutions.',
  },
};
