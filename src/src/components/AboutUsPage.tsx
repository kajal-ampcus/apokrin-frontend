import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Cpu,
  Eye,
  Globe,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import storyTechImg from '../assets/images/about_immersive_tech_1794734043239.jpg';
import leadershipImg from '../assets/images/about_leadership_team_1794740590812.jpg';
import visionBgImg from '../assets/images/about_panel_vision_1794740590122.jpg';
import missionBgImg from '../assets/images/about_panel_mission_1794740591409.jpg';
import conductBgImg from '../assets/images/about_panel_conduct_1794740591453.jpg';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { PhilosophyScrollStack, type PhilosophyPanelItem } from './PhilosophyScrollStack';

interface AboutUsPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface AboutStatItem {
  id: string;
  target: number;
  suffix: '%' | '+';
  label: string;
  icon: typeof Layers;
}

const ABOUT_HERO_STATS: AboutStatItem[] = [
  {
    id: 'industries',
    target: 15,
    suffix: '%',
    label: 'Industries Mastered',
    icon: Layers,
  },
  {
    id: 'evangelists',
    target: 700,
    suffix: '+',
    label: 'Tech Evangelists',
    icon: Users,
  },
  {
    id: 'solutions',
    target: 300,
    suffix: '+',
    label: 'Solutions Designed And Delivered',
    icon: Cpu,
  },
  {
    id: 'legacy',
    target: 150,
    suffix: '+',
    label: 'Legacy Processes Transformed',
    icon: RefreshCw,
  },
];

const CORE_VALUES = [
  {
    id: 'academic-excellence',
    title: 'Academic Excellence',
    description: 'We are committed to delivering quality, building lasting relationships, and creating meaningful experiences for everyone we serve.',
    icon: GraduationCap,
  },
  {
    id: 'community-engagement',
    title: 'Community Engagement',
    description: 'Our focus is on providing innovative solutions, maintaining the highest standards, and ensuring complete customer satisfaction.',
    icon: HeartHandshake,
  },
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'With a strong commitment to excellence, we approach every project with dedication, attention to detail, and a focus on achieving the best results.',
    icon: Lightbulb,
  },
  {
    id: 'global-perspective',
    title: 'Global Perspective',
    description: 'Your satisfaction is our priority. We value your trust, welcome your feedback, and are always ready to assist you with your needs.',
    icon: Globe,
  },
];

const PHILOSOPHY_PANELS: PhilosophyPanelItem[] = [
  {
    id: 'vision',
    number: '01',
    title: 'Vision',
    shortTag: 'Global IT Leadership',
    content:
      'Discover our vision to become a global leader in technology solutions and staffing services, driving innovation, digital transformation, and IT talent excellence.',
    image: visionBgImg,
    alt: 'Connected urban skyline representing global technology innovation and digital transformation',
    icon: Eye,
  },
  {
    id: 'mission',
    number: '02',
    title: 'Mission',
    shortTag: 'Measurable Client Growth',
    content:
      'Discover our mission to provide innovative, cost-effective solutions designed to drive customer growth. We deliver tailored services that exceed expectations and provide measurable results.',
    image: missionBgImg,
    alt: 'Senior engineering team collaborating on enterprise software and cloud delivery',
    icon: Target,
  },
  {
    id: 'conduct',
    number: '03',
    title: 'Code of Conduct',
    shortTag: 'Integrity & Governance',
    content:
      'At Apokrin, we uphold integrity, innovation, and accountability in all IT consulting and staffing services. We deliver cost-effective IT solutions for government and commercial clients, ensuring transparency, data security, and compliance. By promoting diversity, continuous learning, and responsible innovation, we provide trusted technology services, building lasting partnerships based on reliability and excellence.',
    image: conductBgImg,
    alt: 'High-security enterprise governance and operations hub',
    icon: ShieldCheck,
  },
];

export function AboutUsPage({ onOpenBriefing }: AboutUsPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const statsContainerRef = useRef<HTMLDivElement | null>(null);
  const storyVisualRef = useRef<HTMLDivElement | null>(null);
  const leadershipVisualRef = useRef<HTMLDivElement | null>(null);

  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState<number[]>(() => ABOUT_HERO_STATS.map(() => 0));

  const [storyImgError, setStoryImgError] = useState(false);
  const [leadershipImgError, setLeadershipImgError] = useState(false);

  // Subtle image parallax on scroll
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyVisualRef,
    offset: ['start end', 'end start'],
  });
  const storyY = useTransform(storyScroll, [0, 1], prefersReducedMotion ? [0, 0] : [14, -14]);

  const { scrollYProgress: leadershipScroll } = useScroll({
    target: leadershipVisualRef,
    offset: ['start end', 'end start'],
  });
  const leadershipY = useTransform(
    leadershipScroll,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [14, -14],
  );

  // Trigger count-up once when the stats row enters the viewport
  useEffect(() => {
    if (prefersReducedMotion) {
      setCounts(ABOUT_HERO_STATS.map((stat) => stat.target));
      setHasCounted(true);
      return;
    }

    const node = statsContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasCounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!hasCounted || prefersReducedMotion) return;

    let rafId = 0;
    const duration = 2200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(
        ABOUT_HERO_STATS.map((stat) => Math.min(stat.target, Math.round(stat.target * eased))),
      );

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setCounts(ABOUT_HERO_STATS.map((stat) => stat.target));
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [hasCounted, prefersReducedMotion]);

  return (
    <div className="relative overflow-x-clip bg-[#F8FAFC]">
      {/* =====================================================================
          1. HERO SECTION – COMPANY INTRODUCTION + 4 STATISTICS CARDS
         ===================================================================== */}
      <section className="apokrin-hero-light relative border-b border-[#E2E8F0] py-14 sm:py-16 lg:py-20">
        {/* Subtle ambient theme glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-8 h-64 w-[520px] -translate-x-1/2 rounded-full opacity-55 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
          }}
        />

        <div className="apokrin-container relative">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              About Apokrin
            </span>

            <h1
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-hero mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Empowering Digital Transformation Through{' '}
              <span className="apokrin-gradient-text">Intelligent IT Solutions</span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#475569] sm:text-base lg:text-[17px]">
              At Apokrin, we specialize in delivering cutting-edge IT business solutions and
              technology services that empower Commercial and Government organizations to overcome
              today&apos;s operational challenges and embrace innovation.
            </p>
          </motion.div>

          {/* 4 Statistics Cards in One Horizontal Row */}
          <div
            ref={statsContainerRef}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4"
          >
            {ABOUT_HERO_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReducedMotion ? 0 : idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                  className="apokrin-clay-card group flex flex-col items-center justify-center border border-white/95 p-6 text-center transition-all duration-200 hover:border-[var(--color-primary)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: 'var(--color-primary-strong)',
                      boxShadow:
                        'inset 0 2px 4px rgba(255,255,255,0.95), 0 6px 14px var(--color-clay-shadow)',
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="apokrin-gradient-text mt-4 font-display text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">
                    {counts[idx]}
                    {stat.suffix}
                  </p>

                  <p className="mt-2 text-xs font-semibold leading-snug text-[#475569] sm:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. OUR STORY SECTION (Two-Column Layout)
         ===================================================================== */}
      <section className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Side: Badge, Heading & Company Description */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Our Story
              </span>

              <h2
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Empowering Digital Transformation Through{' '}
                <span className="apokrin-gradient-text">Intelligent IT Solutions</span>
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#475569] sm:text-[15.5px]">
                <p>
                  At Apokrin, we specialize in delivering cutting-edge IT business solutions and
                  technology services that empower both Commercial and Government organizations to
                  overcome today&apos;s operational challenges and embrace innovation.
                </p>
                <p>
                  With a strategic focus on Information Management, we help our clients achieve
                  measurable improvements in performance, efficiency, and accountability. From
                  concept to execution, Apokrin has successfully designed and deployed robust IT
                  solutions that promote collaboration, transparency, and long-term value creation.
                </p>
                <p>
                  Driven by deep domain expertise and hands-on experience, our team provides
                  cost-effective, scalable, and future-ready technology strategies. Whether
                  you&apos;re looking to modernize legacy systems or build smarter digital
                  frameworks, Apokrin delivers solutions that are not only innovative, but also
                  faster, cheaper, and smarter.
                </p>
              </div>
            </motion.div>

            {/* Right Side: Large Technology-Related Visual */}
            <motion.div
              ref={storyVisualRef}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-55 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
                }}
              />

              <motion.div
                style={{ y: storyY }}
                className="apokrin-clay-panel group relative overflow-hidden rounded-[2rem] border border-white/95 p-3 sm:p-4"
              >
                {storyImgError ? (
                  <div
                    className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-[1.5rem] p-8 text-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <Cpu className="h-12 w-12" style={{ color: themeConfig.primaryStrong }} />
                    <p className="mt-3 font-display text-lg font-bold text-[#0A1128]">
                      Digital Transformation &amp; IT Consulting
                    </p>
                  </div>
                ) : (
                  <img
                    src={storyTechImg}
                    alt="Enterprise digital transformation strategy and intelligent IT consulting"
                    referrerPolicy="no-referrer"
                    onError={() => setStoryImgError(true)}
                    className="aspect-[4/3] w-full rounded-[1.45rem] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CORE VALUES (4 Cards in One Horizontal Row)
         ===================================================================== */}
      <section
        aria-labelledby="core-values-heading"
        className="apokrin-clay-section border-b py-14 sm:py-16 lg:py-20"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              What Guides Us
            </span>

            <h2
              id="core-values-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
            >
              Core <span className="apokrin-gradient-text">Values</span>
            </h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReducedMotion ? 0 : idx * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.12)] transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-[0_18px_36px_-12px_var(--color-glow)] sm:p-7"
                >
                  <div>
                    <div
                      className="flex h-13 w-13 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        color: 'var(--color-primary-strong)',
                        border: '1px solid var(--color-border-tint)',
                      }}
                    >
                      <Icon className="h-5.5 w-5.5 stroke-[1.9]" />
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-[#0A1128]">
                      {val.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. MEET OUR LEADERSHIP (Two-Column Section)
         ===================================================================== */}
      <section className="border-b border-[#E2E8F0] bg-white py-14 sm:py-16 lg:py-20">
        <div className="apokrin-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Side */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Meet Our Leadership
              </span>

              <h2
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
              >
                Driving Innovation,{' '}
                <span className="apokrin-gradient-text">Leading the Future</span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-[15.5px]">
                At Apokrin, our team members don&apos;t just stay up-to-date with the latest
                technology trends they drive and shape them. Always at the forefront of innovation,
                they are often the first to explore and experiment with the most advanced
                technologies. This hands-on approach sparks groundbreaking ideas that push the
                boundaries of what&apos;s possible, ensuring we stay ahead of the curve and
                continue to deliver exceptional solutions.
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBriefing(
                      'Applied AI',
                      'Requesting executive conversation with Apokrin leadership regarding IT transformation.',
                    )
                  }
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  <span>Connect With Leadership</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* Right Side: Large Leadership Visual */}
            <motion.div
              ref={leadershipVisualRef}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-6"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-50 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
                }}
              />

              <motion.div
                style={{ y: leadershipY }}
                className="apokrin-clay-panel group relative overflow-hidden rounded-[2rem] border border-white/95 p-3 sm:p-4"
              >
                {leadershipImgError ? (
                  <div
                    className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-[1.5rem] p-8 text-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <Users className="h-12 w-12" style={{ color: themeConfig.primaryStrong }} />
                    <p className="mt-3 font-display text-lg font-bold text-[#0A1128]">
                      Apokrin Technology Leadership
                    </p>
                  </div>
                ) : (
                  <img
                    src={leadershipImg}
                    alt="Apokrin senior technology leaders and systems architects collaborating"
                    referrerPolicy="no-referrer"
                    onError={() => setLeadershipImgError(true)}
                    className="aspect-[4/3] w-full rounded-[1.45rem] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. MISSION, VISION & CODE OF CONDUCT (Horizontal Expandable -> Scroll Stack)
         ===================================================================== */}
      <PhilosophyScrollStack panels={PHILOSOPHY_PANELS} />
    </div>
  );
}
