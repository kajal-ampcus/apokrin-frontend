export type ScreenId =
  | 'overview'
  | 'about'
  | 'contact'
  | 'solutions'
  | 'talent'
  | 'benchmarks'
  | 'engagements'
  | 'staffing'
  | 'data-analytics'
  | 'application-development'
  | 'big-data'
  | 'database-management'
  | 'infrastructure-management'
  | 'mobility'
  | 'analytics'
  | 'hrms';

export interface ApokrinServiceItem {
  id: 'staffing' | 'mobility' | 'hrms';
  stepNumber: string;
  name: string;
  routeSlug: string;
  description: string;
  tagline: string;
  recommendedPractice: PracticeArea;
  highlights: {
    title: string;
    detail: string;
  }[];
  workflowStages: string[];
}

export const APOKRIN_SERVICES: ApokrinServiceItem[] = [
  {
    id: 'staffing',
    stepNumber: '01',
    name: 'Staffing',
    routeSlug: 'staffing.html',
    tagline: 'Customized Staffing Frameworks Under One Roof',
    description:
      'Apokrin delivers customized staffing frameworks through a modern SaaS platform enabling businesses to manage everything under one roof.',
    recommendedPractice: 'Cloud Engineering',
    highlights: [
      {
        title: 'Unified SaaS Staffing Workspace',
        detail:
          'Centralize requisition intake, candidate evaluation, onboarding workflows, and team deployment within a single operational hub.',
      },
      {
        title: 'Tailored Technical Alignment',
        detail:
          'Match engineering and domain specialists directly to your architecture stack, compliance standards, and delivery cadence.',
      },
      {
        title: 'Lifecycle Workforce Visibility',
        detail:
          'Coordinate active placements, contract renewals, and cross-functional pods without fragmented spreadsheets or disconnected vendors.',
      },
    ],
    workflowStages: [
      'Requirements & Stack Mapping',
      'Curated Technical Shortlisting',
      'Unified SaaS Onboarding',
      'Continuous Engagement Governance',
    ],
  },
  {
    id: 'mobility',
    stepNumber: '02',
    name: 'Mobility',
    routeSlug: 'mobility.html',
    tagline: 'End-to-End Enterprise Mobile Ecosystems',
    description:
      'From designing custom applications to managing mobile ecosystems, we provide end-to-end mobility solutions tailored to your goals.',
    recommendedPractice: 'Applied AI',
    highlights: [
      {
        title: 'Custom Application Engineering',
        detail:
          'Design and build resilient native and cross-platform mobile experiences engineered for enterprise security and responsiveness.',
      },
      {
        title: 'Connected Device Ecosystems',
        detail:
          'Synchronize smartphones, tablets, edge terminals, and cloud APIs into cohesive real-time workflows across distributed teams.',
      },
      {
        title: 'Managed Mobility Lifecycle',
        detail:
          'Oversee release pipelines, telemetry monitoring, device posture policies, and ongoing platform evolution aligned to business objectives.',
      },
    ],
    workflowStages: [
      'Mobile Experience Architecture',
      'Cross-Platform App Delivery',
      'API & Edge Synchronization',
      'Ecosystem Management & Governance',
    ],
  },
  {
    id: 'hrms',
    stepNumber: '03',
    name: 'HRMS',
    routeSlug: 'hrms.html',
    tagline: 'Automated Workforce Intelligence & Self-Service',
    description:
      'With advanced automation, role-based access, and real-time insights, our HRMS empowers both HR teams and employees.',
    recommendedPractice: 'Data Platforms',
    highlights: [
      {
        title: 'Intelligent Process Automation',
        detail:
          'Streamline onboarding, attendance, time tracking, and approvals through configurable rules that eliminate repetitive manual tasks.',
      },
      {
        title: 'Granular Role-Based Access',
        detail:
          'Protect sensitive organizational and employee records with structured permissions tailored to executives, HR administrators, managers, and staff.',
      },
      {
        title: 'Real-Time Workforce Insights',
        detail:
          'Equip leadership and HR teams with live visibility across organizational structure, resource allocation, and employee engagement.',
      },
    ],
    workflowStages: [
      'Role & Policy Configuration',
      'Automated HR Workflows',
      'Employee Self-Service Portal',
      'Real-Time Organizational Analytics',
    ],
  },
];

export interface CompanyStatItem {
  id: string;
  target: number;
  suffix: '%' | '+';
  displayValue: string;
  label: string;
}

export const COMPANY_STATISTICS: CompanyStatItem[] = [
  {
    id: 'stat-satisfaction',
    target: 98,
    suffix: '%',
    displayValue: '98%',
    label: 'Client Satisfaction',
  },
  {
    id: 'stat-projects',
    target: 200,
    suffix: '+',
    displayValue: '200+',
    label: 'Projects Completed',
  },
  {
    id: 'stat-countries',
    target: 120,
    suffix: '+',
    displayValue: '120+',
    label: 'Countries Served',
  },
  {
    id: 'stat-experience',
    target: 100,
    suffix: '+',
    displayValue: '100+',
    label: 'Years Experience',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const APOKRIN_FAQS: FaqItem[] = [
  {
    id: 'faq-services',
    question: 'What services does Apokrin offer?',
    answer:
      'Apokrin provides a wide range of IT and business solutions including staffing, Data Analytics, application development, big data solutions, infrastructure management, and HRMS.',
  },
  {
    id: 'faq-technologies',
    question: 'What technologies does Apokrin specialize in?',
    answer:
      'We specialize in modern cloud, analytics, and mobile-first technologies tailored for business needs.',
  },
  {
    id: 'faq-industries',
    question: 'What industries does Apokrin serve?',
    answer:
      'We specialize in modern cloud, analytics, and mobile-first technologies tailored for business needs.',
  },
  {
    id: 'faq-government',
    question: 'Is Apokrin involved in government contracting?',
    answer:
      'We specialize in modern cloud, analytics, and mobile-first technologies tailored for business needs.',
  },
  {
    id: 'faq-careers',
    question: 'How do I apply for a job at Apokrin?',
    answer:
      'We specialize in modern cloud, analytics, and mobile-first technologies tailored for business needs.',
  },
];

export type PracticeArea =
  | 'Cloud Engineering'
  | 'Applied AI'
  | 'Data Platforms'
  | 'Security & FinOps';

export interface HeroMetric {
  id: string;
  value: string;
  label: string;
  delta: string;
  tone: 'positive' | 'urgent';
  context: string;
}

export interface ArchitectureLayer {
  id: string;
  order: string;
  name: string;
  practice: PracticeArea;
  summary: string;
  slaTarget: string;
  latencyBudget: string;
  technologies: string[];
  deliverables: string[];
}

export interface CapabilityBentoItem {
  id: string;
  number: string;
  title: string;
  practice: PracticeArea;
  span: 'wide' | 'standard';
  description: string;
  outcomeMetric: string;
  outcomeContext: string;
  stackSummary: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  practice: PracticeArea;
  headlineMetric: string;
  timeframe: string;
  summary: string;
  quote: string;
  executiveName: string;
  executiveTitle: string;
}

export interface SolutionBlueprint {
  id: string;
  code: string;
  title: string;
  practice: PracticeArea;
  targetAudience: string;
  durationWeeks: number;
  slaUptime: string;
  podComposition: string;
  compliance: string[];
  monthlyEstimateUsd: number;
  architectureSummary: string;
  deliverables: string[];
}

export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  practice: PracticeArea;
  region: 'North America' | 'EMEA' | 'APAC';
  city: string;
  availability: 'Immediate (48h)' | '2 Weeks' | 'Scheduled';
  yearsExperience: number;
  systemsDelivered: number;
  uptimeRecord: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  dailyRateUsd: number;
  stack: string[];
  summary: string;
  recentEngagement: string;
}

export interface BenchmarkRecord {
  id: string;
  engagementName: string;
  clientSector: string;
  practice: PracticeArea;
  region: string;
  teamSize: number;
  leadTimeDays: number;
  costDeltaPct: number;
  uptimePct: number;
  status: 'Active' | 'Completed' | 'At Risk';
  quarter: string;
}

export interface VelocityPoint {
  period: string;
  apokrinDays: number;
  baselineDays: number;
  savingsPct: number;
}

export interface BriefingRequest {
  id: string;
  executiveName: string;
  workEmail: string;
  organization: string;
  role: string;
  practice: PracticeArea;
  timeline: string;
  brief: string;
  submittedAt: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed';
}

export const HERO_METRICS: HeroMetric[] = [
  {
    id: 'shortlist-sla',
    value: '48 hr',
    label: 'Principal Shortlist Turnaround',
    delta: 'Rapid Staffing SLA',
    tone: 'urgent',
    context: 'Vetted Staff & Principal engineers matched to production stack',
  },
  {
    id: 'prod-uptime',
    value: '99.98%',
    label: 'Managed Cluster Availability',
    delta: '+0.14% vs industry SLA',
    tone: 'positive',
    context: 'Multi-region Kubernetes & inference workloads over 12 months',
  },
  {
    id: 'cloud-savings',
    value: '$14.2M',
    label: 'Annualized Cloud Spend Reduced',
    delta: '-31% average unit cost',
    tone: 'positive',
    context: 'Verified FinOps & GPU reservation restructuring across 28 clients',
  },
  {
    id: 'engineers-placed',
    value: '340+',
    label: 'Principal Engineers Deployed',
    delta: '96% 18-month retention',
    tone: 'positive',
    context: 'Embedded across Fortune 500 financial, health, and logistics teams',
  },
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'ai-inference',
    order: '01',
    name: 'AI Inference & Model Routing Plane',
    practice: 'Applied AI',
    summary:
      'Low-latency vLLM and TensorRT-LLM serving clusters with deterministic fallback routing, semantic caching, and token-level cost attribution.',
    slaTarget: '99.95% Availability',
    latencyBudget: '< 140 ms TTFT',
    technologies: ['vLLM', 'Ray Serve', 'Kubernetes', 'OpenTelemetry'],
    deliverables: [
      'Multi-model canary router & evaluation harness',
      'GPU autoscale policy & spot-capacity fallback',
      'Prompt-injection guardrails & PII redaction proxy',
    ],
  },
  {
    id: 'data-fabric',
    order: '02',
    name: 'Real-Time Data & Vector Fabric',
    practice: 'Data Platforms',
    summary:
      'Streaming ingestion pipelines uniting transactional CDC events with hybrid vector-relational retrieval indexes under strict lineage auditing.',
    slaTarget: '99.99% Durability',
    latencyBudget: '< 85 ms P99 Query',
    technologies: ['Apache Iceberg', 'Kafka', 'pgvector', 'dbt Core'],
    deliverables: [
      'Zero-downtime warehouse-to-lakehouse migration',
      'Incremental embedding sync & freshness monitors',
      'Column-level RBAC & audit trail enforcement',
    ],
  },
  {
    id: 'cloud-foundation',
    order: '03',
    name: 'Multi-Region Cloud Foundation',
    practice: 'Cloud Engineering',
    summary:
      'Immutable Infrastructure-as-Code landing zones across AWS and GCP with automated drift remediation and zero-downtime blue/green rollouts.',
    slaTarget: '99.98% Control Plane',
    latencyBudget: '< 12 min Recovery RTO',
    technologies: ['Terraform', 'EKS / GKE', 'Cilium eBPF', 'ArgoCD'],
    deliverables: [
      'Signed container supply chain & SLSA Level 3',
      'Automated disaster recovery chaos drills',
      'Service mesh mTLS & egress policy automation',
    ],
  },
  {
    id: 'finops-security',
    order: '04',
    name: 'FinOps & Zero-Trust Governance',
    practice: 'Security & FinOps',
    summary:
      'Continuous cloud unit-economics telemetry paired with automated IAM least-privilege enforcement for SOC 2, HIPAA, and ISO 27001 audits.',
    slaTarget: '100% Policy Coverage',
    latencyBudget: '< 24 hr Audit Export',
    technologies: ['OPA Gatekeeper', 'Kubecost', 'Vault', 'AWS Organizations'],
    deliverables: [
      'Per-team GPU & compute chargeback ledger',
      'Continuous compliance posture evidence pipeline',
      'Automated idle-cluster & commitment optimization',
    ],
  },
];

export const CAPABILITIES: CapabilityBentoItem[] = [
  {
    id: 'cap-ai',
    number: '01.',
    title: 'Production AI & Inference Engineering',
    practice: 'Applied AI',
    span: 'wide',
    description:
      'We take enterprise models from fragile notebook prototypes to deterministic, multi-region inference systems with automated evaluation gates and per-tenant cost controls.',
    outcomeMetric: '-42% Inference Latency',
    outcomeContext: 'Measured across 180M monthly requests over 9 weeks',
    stackSummary: 'PyTorch · vLLM · Ray · Kubernetes · OpenTelemetry',
  },
  {
    id: 'cap-talent',
    number: '02.',
    title: 'Principal Engineering Pods',
    practice: 'Cloud Engineering',
    span: 'standard',
    description:
      'Pre-vetted Staff and Principal engineers embedded directly inside your sprint cadence within 48 hours—never junior bench rotation.',
    outcomeMetric: '48 hr Shortlist SLA',
    outcomeContext: '96% retention across 18-month client engagements',
    stackSummary: 'Rust · Go · TypeScript · Terraform · EKS',
  },
  {
    id: 'cap-data',
    number: '03.',
    title: 'Lakehouse & Streaming Data Platforms',
    practice: 'Data Platforms',
    span: 'standard',
    description:
      'Consolidate fragmented warehouse silos onto open Iceberg table formats and sub-second Kafka streaming architectures built for analytical and AI workloads.',
    outcomeMetric: '3.1x Query Throughput',
    outcomeContext: 'Verified across 45 TB daily financial telemetry',
    stackSummary: 'Iceberg · Kafka · Flink · Snowflake · dbt',
  },
  {
    id: 'cap-finops',
    number: '04.',
    title: 'Cloud FinOps & Zero-Trust Compliance',
    practice: 'Security & FinOps',
    span: 'wide',
    description:
      'Eliminate runaway GPU and compute spend while enforcing continuous SOC 2 Type II, HIPAA, and FedRAMP policy guardrails directly in CI/CD pipelines.',
    outcomeMetric: '-31% Annual Cloud Spend',
    outcomeContext: 'Average savings realized within first 120 days',
    stackSummary: 'OPA · Vault · AWS FinOps · Cilium · Terraform',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-meridian',
    client: 'Meridian Clearing Corp',
    sector: 'Institutional Capital Markets',
    practice: 'Applied AI',
    headlineMetric: '-42% Inference Latency in 9 Weeks',
    timeframe: 'Q1–Q2 2026',
    summary:
      'Replaced single-region monolithic model endpoints with quantized vLLM pools and semantic prefix caching across us-east and eu-central.',
    quote:
      'Before Apokrin, our risk-summarization pipeline timed out during market open spikes. Their principal pod re-architected our serving tier in nine weeks and cut GPU burn by 37%.',
    executiveName: 'Elena Rostova',
    executiveTitle: 'SVP of Platform Engineering, Meridian Clearing Corp',
  },
  {
    id: 'cs-northstar',
    client: 'Northstar Freight Systems',
    sector: 'Global Logistics & Supply Chain',
    practice: 'Cloud Engineering',
    headlineMetric: '18 Principal Engineers Placed in 11 Days',
    timeframe: 'Q4 2025 – Q2 2026',
    summary:
      'Assembled three autonomous Rust and Kubernetes delivery pods to modernize customs telemetry ingestion across 14 international port hubs.',
    quote:
      'Traditional staffing agencies sent us unvetted resumes for two months. Apokrin delivered an 18-person principal pod in eleven days that shipped zero-downtime failover ahead of peak season.',
    executiveName: 'Marcus Vance',
    executiveTitle: 'Chief Technology Officer, Northstar Freight Systems',
  },
  {
    id: 'cs-kestrel',
    client: 'Kestrel BioDiagnostics',
    sector: 'Clinical Genomics',
    practice: 'Security & FinOps',
    headlineMetric: '$3.8M Annual Compute Reduction',
    timeframe: '6-Month Transformation',
    summary:
      'Implemented spot-aware batch orchestration and automated HIPAA policy-as-code enforcement across 1,400 genomic analysis nodes.',
    quote:
      'We cut $3.8M in annualized cloud waste without slowing down a single research pipeline, and passed our external HIPAA audit with zero findings.',
    executiveName: 'Dr. Priya Ramanathan',
    executiveTitle: 'VP of Infrastructure & Security, Kestrel BioDiagnostics',
  },
];

export const SOLUTION_BLUEPRINTS: SolutionBlueprint[] = [
  {
    id: 'bp-llm-mesh',
    code: 'SOL-AI-01',
    title: 'Enterprise AI Gateway & Inference Mesh',
    practice: 'Applied AI',
    targetAudience: 'AI Platform & Product Engineering Leaders',
    durationWeeks: 10,
    slaUptime: '99.95%',
    podComposition: '1 Principal AI Architect · 2 ML Systems Engineers · 1 SRE',
    compliance: ['SOC 2 Type II', 'ISO 27001', 'PII Redaction'],
    monthlyEstimateUsd: 68000,
    architectureSummary:
      'Unified model gateway routing between private weights and frontier APIs with automated eval regression gates, token quotas, and deterministic audit logging.',
    deliverables: [
      'Multi-region vLLM cluster with prefix caching',
      'Automated golden-dataset eval CI gate',
      'Tenant token metering & cost attribution dashboard',
    ],
  },
  {
    id: 'bp-cloud-lz',
    code: 'SOL-CLD-02',
    title: 'Zero-Downtime Multi-Region Kubernetes Landing Zone',
    practice: 'Cloud Engineering',
    targetAudience: 'VP of Infrastructure & Platform Teams',
    durationWeeks: 8,
    slaUptime: '99.99%',
    podComposition: '1 Principal Cloud Architect · 2 Platform Engineers',
    compliance: ['SOC 2 Type II', 'HIPAA', 'SLSA Level 3'],
    monthlyEstimateUsd: 54000,
    architectureSummary:
      'Terraform-governed multi-account cloud foundation featuring Cilium eBPF networking, ArgoCD GitOps delivery, and automated regional failover.',
    deliverables: [
      'Modular Terraform landing zone repository',
      'GitOps deployment pipeline with canary rollback',
      'Automated DR failover runbook & game-day report',
    ],
  },
  {
    id: 'bp-lakehouse',
    code: 'SOL-DAT-03',
    title: 'Open Iceberg Lakehouse & Streaming CDC',
    practice: 'Data Platforms',
    targetAudience: 'Chief Data Officers & Data Engineering Directors',
    durationWeeks: 12,
    slaUptime: '99.98%',
    podComposition: '1 Staff Data Architect · 2 Streaming Engineers · 1 Analytics Engineer',
    compliance: ['GDPR', 'SOC 2 Type II', 'Column-Level RBAC'],
    monthlyEstimateUsd: 62000,
    architectureSummary:
      'Event-driven Debezium/Kafka ingestion feeding Apache Iceberg tables with unified SQL and vector retrieval access for BI and RAG systems.',
    deliverables: [
      'Zero-loss CDC replication pipelines',
      'Partitioned Iceberg catalog & compaction jobs',
      'Automated data contract & freshness SLAs',
    ],
  },
  {
    id: 'bp-finops',
    code: 'SOL-FIN-04',
    title: 'FinOps Unit-Economics & Guardrail Remediation',
    practice: 'Security & FinOps',
    targetAudience: 'CIOs, Procurement Directors & Cloud Finance Leads',
    durationWeeks: 6,
    slaUptime: '100% Policy Audit',
    podComposition: '1 Principal FinOps Lead · 1 Cloud Security Architect',
    compliance: ['FedRAMP Moderate', 'HIPAA', 'CIS Benchmarks'],
    monthlyEstimateUsd: 38000,
    architectureSummary:
      'Rapid 6-week cloud spend and posture compression combining compute rightsizing, GPU reservation strategy, and OPA policy-as-code.',
    deliverables: [
      'Cost-per-transaction telemetry & allocation tags',
      'Automated idle workload & GPU reclamation',
      'Executive commitment & reservation roadmap',
    ],
  },
  {
    id: 'bp-pod-scale',
    code: 'SOL-TAL-05',
    title: 'Dedicated Principal Product Engineering Pod',
    practice: 'Cloud Engineering',
    targetAudience: 'VPs of Engineering & CTOs Scaling Core Roadmaps',
    durationWeeks: 16,
    slaUptime: '48h Onboarding',
    podComposition: '1 Tech Lead · 3 Senior/Staff Full-Stack & Distributed Engineers',
    compliance: ['IP Assignment', 'NDA / Background Screened'],
    monthlyEstimateUsd: 72000,
    architectureSummary:
      'Cross-functional principal engineering squad embedded into your Jira/Linear rituals with full architectural ownership and zero agency handoffs.',
    deliverables: [
      'Production-hardened service delivery every sprint',
      'Architecture decision records (ADRs) & runbooks',
      'Full knowledge transfer & hiring calibration support',
    ],
  },
  {
    id: 'bp-rag-eval',
    code: 'SOL-AI-06',
    title: 'Regulated Knowledge Retrieval & Audit Platform',
    practice: 'Applied AI',
    targetAudience: 'Legal, Financial & Healthcare Engineering Leaders',
    durationWeeks: 10,
    slaUptime: '99.95%',
    podComposition: '1 Principal ML Engineer · 2 Backend Engineers · 1 Security Engineer',
    compliance: ['HIPAA', 'FINRA Audit Trail', 'Zero Data Retention'],
    monthlyEstimateUsd: 64000,
    architectureSummary:
      'Permission-aware hybrid retrieval architecture enforcing document-level ACLs at index query time with verifiable inline citation provenance.',
    deliverables: [
      'ACL-enforced hybrid dense/BM25 retrieval engine',
      'Hallucination & groundedness automated test suite',
      'Immutable query-to-citation compliance archive',
    ],
  },
];

export const TALENT_PROFILES: TalentProfile[] = [
  {
    id: 'tal-1',
    name: 'Henrik Lindqvist',
    role: 'Principal Distributed Systems & AI Infrastructure Architect',
    practice: 'Applied AI',
    region: 'EMEA',
    city: 'Zurich, CH',
    availability: 'Immediate (48h)',
    yearsExperience: 13,
    systemsDelivered: 24,
    uptimeRecord: '99.99%',
    primaryMetricLabel: 'Inference Cost Cut',
    primaryMetricValue: '-44% / 1M req',
    dailyRateUsd: 1650,
    stack: ['Rust', 'vLLM', 'Kubernetes', 'CUDA', 'Go'],
    summary:
      'Former Staff Infrastructure Lead specializing in multi-region GPU scheduling, custom TensorRT serving pipelines, and deterministic failover under peak load.',
    recentEngagement: 'Led 140-GPU inference cluster migration for a Tier-1 European clearing house.',
  },
  {
    id: 'tal-2',
    name: 'Maya Krishnan',
    role: 'Staff Cloud Platform & Reliability Director',
    practice: 'Cloud Engineering',
    region: 'North America',
    city: 'New York, US',
    availability: 'Immediate (48h)',
    yearsExperience: 11,
    systemsDelivered: 19,
    uptimeRecord: '99.98%',
    primaryMetricLabel: 'Deploy Frequency',
    primaryMetricValue: '4.6x Faster',
    dailyRateUsd: 1520,
    stack: ['Terraform', 'AWS EKS', 'Cilium', 'ArgoCD', 'Go'],
    summary:
      'Designs regulated multi-region Kubernetes landing zones and automated disaster recovery drills for high-throughput fintech and clearing platforms.',
    recentEngagement: 'Reduced regional failover RTO from 47 minutes to 8 minutes across 22 microservices.',
  },
  {
    id: 'tal-3',
    name: 'David Chen',
    role: 'Principal Streaming Data & Lakehouse Architect',
    practice: 'Data Platforms',
    region: 'North America',
    city: 'San Francisco, US',
    availability: '2 Weeks',
    yearsExperience: 12,
    systemsDelivered: 21,
    uptimeRecord: '99.97%',
    primaryMetricLabel: 'Daily Volume',
    primaryMetricValue: '65 TB / day',
    dailyRateUsd: 1580,
    stack: ['Apache Iceberg', 'Kafka', 'Flink', 'Snowflake', 'Python'],
    summary:
      'Architects low-latency CDC ingestion and open lakehouse platforms uniting analytical BI queries with real-time feature stores.',
    recentEngagement: 'Migrated 180 TB legacy Teradata estate to Iceberg on S3 with 58% storage reduction.',
  },
  {
    id: 'tal-4',
    name: 'Nadia Al-Mansoor',
    role: 'Principal Cloud Security & FinOps Strategist',
    practice: 'Security & FinOps',
    region: 'EMEA',
    city: 'London, UK',
    availability: 'Immediate (48h)',
    yearsExperience: 10,
    systemsDelivered: 27,
    uptimeRecord: '100% Audit Pass',
    primaryMetricLabel: 'Verified Savings',
    primaryMetricValue: '$6.4M / yr',
    dailyRateUsd: 1490,
    stack: ['OPA Gatekeeper', 'HashiCorp Vault', 'AWS FinOps', 'Kubecost', 'Terraform'],
    summary:
      'Combines zero-trust policy-as-code enforcement with granular unit-economics engineering for enterprises preparing for SOC 2, HIPAA, and DORA audits.',
    recentEngagement: 'Consolidated 42 AWS accounts under automated SCP guardrails and saved $2.1M in Q1.',
  },
  {
    id: 'tal-5',
    name: 'Kenji Takahashi',
    role: 'Staff Applied ML & Evaluation Systems Lead',
    practice: 'Applied AI',
    region: 'APAC',
    city: 'Singapore, SG',
    availability: 'Immediate (48h)',
    yearsExperience: 9,
    systemsDelivered: 16,
    uptimeRecord: '99.96%',
    primaryMetricLabel: 'Eval Precision',
    primaryMetricValue: '98.4% Grounded',
    dailyRateUsd: 1460,
    stack: ['PyTorch', 'Ray Serve', 'pgvector', 'TypeScript', 'FastAPI'],
    summary:
      'Builds permission-aware enterprise RAG systems and automated LLM regression pipelines tailored for legal, wealth management, and clinical operations.',
    recentEngagement: 'Shipped multilingual compliance copilot serving 14,000 institutional analysts.',
  },
  {
    id: 'tal-6',
    name: 'Rachel Morales',
    role: 'Principal Site Reliability & Chaos Engineering Lead',
    practice: 'Cloud Engineering',
    region: 'North America',
    city: 'Austin, US',
    availability: '2 Weeks',
    yearsExperience: 14,
    systemsDelivered: 31,
    uptimeRecord: '99.99%',
    primaryMetricLabel: 'MTTR Reduction',
    primaryMetricValue: '-74% Incident',
    dailyRateUsd: 1550,
    stack: ['Kubernetes', 'OpenTelemetry', 'Prometheus', 'Rust', 'GCP'],
    summary:
      'Leads observability consolidation, SLO error-budget governance, and production chaos automation for mission-critical SaaS and payment rails.',
    recentEngagement: 'Cut Sev-1 incident mean-time-to-resolution from 52 min to 13 min across 90 teams.',
  },
];

export const BENCHMARK_RECORDS: BenchmarkRecord[] = [
  {
    id: 'bm-01',
    engagementName: 'Multi-Region vLLM Inference Mesh',
    clientSector: 'Capital Markets',
    practice: 'Applied AI',
    region: 'US-East / EU-Central',
    teamSize: 5,
    leadTimeDays: 11,
    costDeltaPct: -37,
    uptimePct: 99.98,
    status: 'Active',
    quarter: '2026 Q3',
  },
  {
    id: 'bm-02',
    engagementName: 'Customs Telemetry Rust Modernization',
    clientSector: 'Global Logistics',
    practice: 'Cloud Engineering',
    region: 'Global Multi-Hub',
    teamSize: 18,
    leadTimeDays: 11,
    costDeltaPct: -24,
    uptimePct: 99.99,
    status: 'Active',
    quarter: '2026 Q3',
  },
  {
    id: 'bm-03',
    engagementName: 'Genomic Batch FinOps & HIPAA Guardrails',
    clientSector: 'Clinical BioTech',
    practice: 'Security & FinOps',
    region: 'US-West',
    teamSize: 4,
    leadTimeDays: 8,
    costDeltaPct: -41,
    uptimePct: 99.97,
    status: 'Completed',
    quarter: '2026 Q2',
  },
  {
    id: 'bm-04',
    engagementName: 'Iceberg Lakehouse & Flink CDC Migration',
    clientSector: 'Retail Banking',
    practice: 'Data Platforms',
    region: 'EMEA (Zurich)',
    teamSize: 6,
    leadTimeDays: 14,
    costDeltaPct: -29,
    uptimePct: 99.98,
    status: 'Active',
    quarter: '2026 Q3',
  },
  {
    id: 'bm-05',
    engagementName: 'Zero-Trust EKS Landing Zone Rollout',
    clientSector: 'Enterprise Insurance',
    practice: 'Cloud Engineering',
    region: 'US-East',
    teamSize: 4,
    leadTimeDays: 9,
    costDeltaPct: -19,
    uptimePct: 99.99,
    status: 'Completed',
    quarter: '2026 Q2',
  },
  {
    id: 'bm-06',
    engagementName: 'Permission-Aware Contract Retrieval Engine',
    clientSector: 'Legal & Advisory',
    practice: 'Applied AI',
    region: 'EMEA (London)',
    teamSize: 4,
    leadTimeDays: 10,
    costDeltaPct: -33,
    uptimePct: 99.95,
    status: 'Active',
    quarter: '2026 Q3',
  },
  {
    id: 'bm-07',
    engagementName: 'Legacy Monolith Containerization Wave 2',
    clientSector: 'Industrial Manufacturing',
    practice: 'Cloud Engineering',
    region: 'APAC (Tokyo)',
    teamSize: 7,
    leadTimeDays: 16,
    costDeltaPct: -12,
    uptimePct: 99.91,
    status: 'At Risk',
    quarter: '2026 Q3',
  },
  {
    id: 'bm-08',
    engagementName: 'Automated GPU Reservation & Chargeback',
    clientSector: 'Autonomous Mobility',
    practice: 'Security & FinOps',
    region: 'US-West',
    teamSize: 3,
    leadTimeDays: 6,
    costDeltaPct: -38,
    uptimePct: 99.99,
    status: 'Completed',
    quarter: '2026 Q1',
  },
];

export const VELOCITY_SERIES: Record<'6M' | '12M' | '24M', VelocityPoint[]> = {
  '6M': [
    { period: 'Jun', apokrinDays: 14, baselineDays: 42, savingsPct: 18 },
    { period: 'Jul', apokrinDays: 12, baselineDays: 41, savingsPct: 22 },
    { period: 'Aug', apokrinDays: 11, baselineDays: 44, savingsPct: 26 },
    { period: 'Sep', apokrinDays: 10, baselineDays: 43, savingsPct: 29 },
    { period: 'Oct', apokrinDays: 9, baselineDays: 45, savingsPct: 31 },
    { period: 'Nov', apokrinDays: 8, baselineDays: 44, savingsPct: 34 },
  ],
  '12M': [
    { period: 'Q1 Early', apokrinDays: 16, baselineDays: 46, savingsPct: 14 },
    { period: 'Q1 Late', apokrinDays: 14, baselineDays: 45, savingsPct: 19 },
    { period: 'Q2 Early', apokrinDays: 13, baselineDays: 44, savingsPct: 23 },
    { period: 'Q2 Late', apokrinDays: 11, baselineDays: 43, savingsPct: 27 },
    { period: 'Q3 Early', apokrinDays: 10, baselineDays: 45, savingsPct: 30 },
    { period: 'Q4 Current', apokrinDays: 8, baselineDays: 44, savingsPct: 34 },
  ],
  '24M': [
    { period: '2025 H1', apokrinDays: 19, baselineDays: 49, savingsPct: 12 },
    { period: '2025 H2', apokrinDays: 15, baselineDays: 47, savingsPct: 20 },
    { period: '2026 Q1', apokrinDays: 13, baselineDays: 45, savingsPct: 25 },
    { period: '2026 Q2', apokrinDays: 11, baselineDays: 44, savingsPct: 29 },
    { period: '2026 Q3', apokrinDays: 9, baselineDays: 45, savingsPct: 32 },
    { period: '2026 Q4', apokrinDays: 8, baselineDays: 44, savingsPct: 34 },
  ],
};

export const INITIAL_BRIEFINGS: BriefingRequest[] = [
  {
    id: 'brf-2041',
    executiveName: 'Claire Sterling',
    workEmail: 'c.sterling@vantagelabs.io',
    organization: 'Vantage Institutional Systems',
    role: 'VP of Engineering',
    practice: 'Applied AI',
    timeline: 'Immediate (Within 2 Weeks)',
    brief: 'Need 4-person Principal AI Inference pod to cut P99 latency on multi-tenant RAG gateway ahead of Q1 enterprise rollout.',
    submittedAt: '2026-11-12 09:30 UTC',
    status: 'Confirmed',
  },
  {
    id: 'brf-2038',
    executiveName: 'Jonas Lindholm',
    workEmail: 'jlindholm@nordicrail.eu',
    organization: 'Nordic Rail Telemetry',
    role: 'Chief Information Officer',
    practice: 'Cloud Engineering',
    timeline: 'Next Quarter (30–60 Days)',
    brief: 'Multi-region Kubernetes landing zone modernization with strict EU data residency and automated disaster recovery validation.',
    submittedAt: '2026-11-08 14:15 UTC',
    status: 'Pending Review',
  },
];
