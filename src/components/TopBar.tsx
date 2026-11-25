import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { SERVICES_CONFIG } from '../data/servicesConfig';
import { BRAND_THEME_LIST, useTheme } from '../theme/themeConfig';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

type PrimaryNavKey = 'home' | 'about' | 'services' | 'contact';

interface NavbarServiceOption {
  label: string;
  screen: ScreenId;
  practice?: PracticeArea;
}

const NAVBAR_SERVICES: NavbarServiceOption[] = SERVICES_CONFIG.map((service) => ({
  label: service.name,
  screen: service.id,
}));

/**
 * Exact original Apokrin multicolor logo asset (/assets/aistudio/image_e1054fa1.png).
 * Uses mix-blend-multiply so its white matte blends smoothly over the translucent liquid-glass bar,
 * keeping its authentic Orange, Green, and Blue arrows and wordmark unchanged across all themes.
 */
function ApokrinOriginalNavbarLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <span className="font-display text-[1.35rem] font-extrabold tracking-tight text-[#16689E] leading-none">
        Apokrin
      </span>
    );
  }

  return (
    <img
      src="/assets/aistudio/image_e1054fa1.png"
      alt="Apokrin logo"
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className="h-8.5 w-auto sm:h-9.5 md:h-[40px] object-contain mix-blend-multiply select-none"
    />
  );
}

function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Brand color theme"
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${
        compact ? 'px-2.5 py-1.5' : 'px-2 py-1.5'
      }`}
    >
      {BRAND_THEME_LIST.map((item) => {
        const isActive = theme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            aria-label={item.name}
            aria-pressed={isActive}
            title={item.name}
            className={`group relative flex h-4.5 w-4.5 items-center justify-center rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-1 ${
              isActive
                ? 'scale-110 ring-2 ring-[#0A1128] ring-offset-2 ring-offset-white/80'
                : 'opacity-85 hover:scale-110 hover:opacity-100'
            }`}
            style={{
              background: `linear-gradient(135deg, ${item.primary} 0%, ${item.secondary} 100%)`,
              boxShadow: isActive ? `0 2px 8px ${item.glow}` : undefined,
            }}
          >
            <span
              role="tooltip"
              className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-[#0A1128] px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap z-50"
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function TopBar({ activeScreen, onNavigate, onOpenBriefing }: TopBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeNav, setActiveNav] = useState<PrimaryNavKey>('home');
  const [activeServiceLabel, setActiveServiceLabel] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Track scroll position for subtle floating liquid-glass depth transition
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 14);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync active nav when navigating via Compare Slider, footer, URL history, or cards
  useEffect(() => {
    const matchedService = SERVICES_CONFIG.find((svc) => svc.id === activeScreen);
    if (matchedService || activeScreen === 'solutions' || activeScreen === 'benchmarks') {
      setActiveNav('services');
      setActiveServiceLabel(matchedService ? matchedService.name : null);
    } else if (activeScreen === 'about') {
      setActiveNav('about');
      setActiveServiceLabel(null);
    } else if (activeScreen === 'contact') {
      setActiveNav('contact');
      setActiveServiceLabel(null);
    } else if (activeScreen === 'overview') {
      setActiveServiceLabel(null);
      setActiveNav('home');
    }
  }, [activeScreen]);

  // Close Services dropdown & mobile menu on Escape or outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(target)) {
        setServicesOpen(false);
      }
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openServicesHover = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const closeServicesHover = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setServicesOpen(false);
    }, 140);
  };

  const handleHomeClick = () => {
    setActiveNav('home');
    setActiveServiceLabel(null);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    onNavigate('overview');
  };

  const handleAboutClick = () => {
    setActiveNav('about');
    setActiveServiceLabel(null);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    onNavigate('about');
  };

  const handleContactClick = () => {
    setActiveNav('contact');
    setActiveServiceLabel(null);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    onNavigate('contact');
  };

  const handleServiceSelect = (svc: NavbarServiceOption) => {
    setActiveNav('services');
    setActiveServiceLabel(svc.label);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    onNavigate(svc.screen, svc.practice);
  };

  const isNavActive = (key: PrimaryNavKey) => {
    if (activeScreen === 'about') return key === 'about';
    if (activeScreen === 'contact') return key === 'contact';
    if (activeScreen !== 'overview' && key === 'services') return true;
    return activeNav === key;
  };

  return (
    <header
      ref={mobileDrawerRef}
      className={`relative z-50 transition-all duration-300 ${
        isScrolled ? 'px-2.5 pt-2 sm:px-4 lg:px-6' : 'px-3 pt-2.5 sm:px-5 lg:px-7'
      }`}
    >
      {/* Floating Liquid-Glass Navbar Shell */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`apokrin-liquid-glass-bar relative mx-auto max-w-[var(--apokrin-container-max)] rounded-[1.5rem] md:rounded-full ${
          isScrolled ? 'apokrin-liquid-glass-bar--scrolled' : ''
        }`}
      >
        {/* Clipped Decorative Glass Refraction, Circuit Tint & Subtle Water Droplet Highlights */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          {/* Ultra-Subtle Circuit Refraction Layer */}
          <svg className="h-full w-full opacity-[0.22]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="apokrin-nav-circuit"
                width="140"
                height="72"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 20 H 32 L 44 32 H 86 L 98 20 H 140 M 20 72 V 48 L 32 36 H 62 M 112 72 V 44 L 126 30 H 140"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="0.9"
                />
                <circle cx="32" cy="20" r="1.75" fill="#93C5FD" />
                <circle cx="86" cy="32" r="1.75" fill="#A5B4FC" />
                <circle cx="62" cy="36" r="1.75" fill="#67E8F9" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#apokrin-nav-circuit)" />
          </svg>

          {/* Soft Blue-Purple Ambient Glass Reflection Wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 140% at 18% 0%, rgba(56, 189, 248, 0.16) 0%, transparent 65%), radial-gradient(50% 130% at 85% 100%, rgba(99, 102, 241, 0.14) 0%, transparent 65%)',
            }}
          />

          {/* Top Edge Specular Glass Rim */}
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />

          {/* Subtle Animated Diagonal Specular Sheen */}
          <div className="apokrin-liquid-sheen absolute -inset-y-4 left-0 w-36" />

          {/* Minimal, Tasteful Water Droplet Beads Along Glass Perimeter */}
          <span className="apokrin-water-drop absolute left-[17%] top-1.5 hidden h-2.5 w-2.5 sm:block" />
          <span className="apokrin-water-drop absolute left-[18.8%] top-3.5 hidden h-1.5 w-1.5 opacity-80 sm:block" />
          <span className="apokrin-water-drop absolute bottom-1.5 right-[21%] hidden h-3 w-3 lg:block" />
          <span className="apokrin-water-drop absolute right-[19%] top-2 hidden h-1.5 w-1.5 opacity-85 lg:block" />
        </div>

        {/* Navbar 3-Zone Flex/Grid Content */}
        <div className="relative flex items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-7">
          {/* Left: Original Apokrin Multicolor Logo */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={handleHomeClick}
              className="inline-flex items-center rounded-xl py-0.5 pr-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
              aria-label="Apokrin Home"
            >
              <ApokrinOriginalNavbarLogo />
            </button>
          </div>

          {/* Center: Liquid-Glass Pill Navigation Container (Desktop & Tablet) */}
          <nav
            aria-label="Primary navigation"
            className="apokrin-liquid-pill hidden md:flex items-center justify-center gap-1 rounded-full px-1.5 py-1 lg:gap-1.5 lg:px-2"
          >
            {/* 1. Home */}
            <button
              type="button"
              onClick={handleHomeClick}
              className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:px-4 ${
                isNavActive('home')
                  ? 'bg-white/85 text-[var(--color-primary-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(37,99,235,0.14)]'
                  : 'text-[#0A1128] hover:bg-white/55 hover:text-[var(--color-primary-strong)]'
              }`}
            >
              Home
            </button>

            {/* 2. About Us */}
            <button
              type="button"
              onClick={handleAboutClick}
              className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:px-4 ${
                isNavActive('about')
                  ? 'bg-white/85 text-[var(--color-primary-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(37,99,235,0.14)]'
                  : 'text-[#0A1128] hover:bg-white/55 hover:text-[var(--color-primary-strong)]'
              }`}
            >
              About Us
            </button>

            {/* 3. Services (with Liquid-Glass Dropdown) */}
            <div
              ref={dropdownWrapperRef}
              className="relative"
              onMouseEnter={openServicesHover}
              onMouseLeave={closeServicesHover}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                aria-expanded={servicesOpen}
                aria-haspopup="menu"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:px-4 ${
                  isNavActive('services') || servicesOpen
                    ? 'bg-white/85 text-[var(--color-primary-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(37,99,235,0.14)]'
                    : 'text-[#0A1128] hover:bg-white/55 hover:text-[var(--color-primary-strong)]'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Liquid-Glass Services Dropdown Panel */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    role="menu"
                    aria-label="Apokrin Services"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="apokrin-liquid-dropdown absolute left-1/2 top-full z-[60] mt-3 w-[300px] -translate-x-1/2 origin-top overflow-hidden rounded-2xl p-2"
                  >
                    {/* Subtle Top-Edge Glass Highlight Only */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    />

                    <div className="relative flex flex-col gap-0.5">
                      {NAVBAR_SERVICES.map((svc) => {
                        const isServiceActive = activeServiceLabel === svc.label;
                        return (
                          <button
                            key={svc.label}
                            type="button"
                            role="menuitem"
                            onClick={() => handleServiceSelect(svc)}
                            className={`group flex w-full items-center rounded-xl border px-3.5 py-2 text-left text-[13.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                              isServiceActive
                                ? 'border-[#C7D2FE]/90 bg-[#E0E7FF]/90 font-semibold text-[#1D4ED8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(37,99,235,0.18)]'
                                : 'border-transparent text-[#111827] hover:translate-x-1 hover:border-[#DBEAFE]/90 hover:bg-[#EEF2FF]/95 hover:text-[#1D4ED8] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(79,70,229,0.14)]'
                            }`}
                          >
                            <span>{svc.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Contact */}
            <button
              type="button"
              onClick={handleContactClick}
              className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] lg:px-4 ${
                isNavActive('contact')
                  ? 'bg-white/85 text-[var(--color-primary-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_10px_rgba(37,99,235,0.14)]'
                  : 'text-[#0A1128] hover:bg-white/55 hover:text-[var(--color-primary-strong)]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right: Theme Switcher + Glossy Cyan-Blue Get Started CTA & Mobile Hamburger */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center">
              <ThemeSwitcher />
            </div>

            <button
              type="button"
              onClick={() => onOpenBriefing()}
              className="apokrin-btn-liquid hidden md:inline-flex items-center justify-center rounded-full px-4.5 py-2 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2 lg:px-5"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/85 bg-white/65 text-[#0A1128] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Compact Liquid-Glass Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-liquid-dropdown relative mx-auto mt-2 max-h-[calc(100vh-5.5rem)] max-w-[var(--apokrin-container-max)] overflow-y-auto rounded-2xl px-4 py-3.5 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              <button
                type="button"
                onClick={handleHomeClick}
                className={`rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                  isNavActive('home')
                    ? 'bg-white/80 text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[#0A1128] hover:bg-white/55'
                }`}
              >
                Home
              </button>

              <button
                type="button"
                onClick={handleAboutClick}
                className={`rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                  isNavActive('about')
                    ? 'bg-white/80 text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[#0A1128] hover:bg-white/55'
                }`}
              >
                About Us
              </button>

              {/* Mobile Services Expandable Liquid-Glass Submenu */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  aria-expanded={mobileServicesOpen}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                    isNavActive('services') || mobileServicesOpen
                      ? 'bg-white/80 text-[var(--color-primary-strong)] shadow-xs'
                      : 'text-[#0A1128] hover:bg-white/55'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-200 ${
                      mobileServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/75 pl-3"
                    >
                      {NAVBAR_SERVICES.map((svc) => {
                        const isServiceActive = activeServiceLabel === svc.label;
                        return (
                          <button
                            key={svc.label}
                            type="button"
                            onClick={() => handleServiceSelect(svc)}
                            className={`rounded-lg px-3 py-2 text-left text-[13.5px] font-medium transition-all ${
                              isServiceActive
                                ? 'bg-white/80 font-semibold text-[var(--color-primary-strong)]'
                                : 'text-[#1E293B] hover:translate-x-1 hover:bg-white/60 hover:text-[#1D4ED8]'
                            }`}
                          >
                            {svc.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handleContactClick}
                className={`rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                  isNavActive('contact')
                    ? 'bg-white/80 text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[#0A1128] hover:bg-white/55'
                }`}
              >
                Contact
              </button>

              {/* Mobile Theme Switcher */}
              <div className="mt-2.5 flex items-center justify-between rounded-xl border border-white/75 bg-white/50 px-3.5 py-2.5">
                <span className="text-xs font-semibold text-[#334155]">Brand Theme</span>
                <ThemeSwitcher compact />
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBriefing();
                }}
                className="apokrin-btn-liquid mt-2.5 w-full rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Get Started
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
