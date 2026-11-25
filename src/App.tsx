/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { OverviewScreen } from './components/OverviewScreen';
import { SolutionsScreen } from './components/SolutionsScreen';
import { TalentScreen } from './components/TalentScreen';
import { BenchmarksScreen } from './components/BenchmarksScreen';
import { EngagementsScreen } from './components/EngagementsScreen';
import { StaffingSolutionsPage } from './components/StaffingSolutionsPage';
import { DataAnalyticsPage } from './components/DataAnalyticsPage';
import { ApplicationDevelopmentPage } from './components/ApplicationDevelopmentPage';
import { BigDataPage } from './components/BigDataPage';
import { DatabaseManagementPage } from './components/DatabaseManagementPage';
import { InfrastructureManagementPage } from './components/InfrastructureManagementPage';
import { EnterpriseMobilityPage } from './components/EnterpriseMobilityPage';
import { AnalyticsServicePage } from './components/AnalyticsServicePage';
import { HrmsSolutionsPage } from './components/HrmsSolutionsPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { BackToTopButton } from './components/BackToTopButton';
import { GlobalAmbient3DBackground } from './components/GlobalAmbient3DBackground';
import { WelcomeIntro } from './components/WelcomeIntro';
import {
  ServiceTransitionProvider,
  useServiceTransition,
} from './components/services/ServiceTransitionProvider';
import { ThemeProvider } from './theme/themeConfig';
import {
  BriefingRequest,
  INITIAL_BRIEFINGS,
  PracticeArea,
  ScreenId,
} from './data/apokrinData';
import { isServiceScreen, resolveScreenFromPath } from './data/servicesConfig';

function AppContent() {
  const prefersReducedMotion = useReducedMotion();
  const {
    activeScreen,
    transitionDirection,
    solutionsPractice,
    navigateToScreen,
  } = useServiceTransition();

  const [showWelcomeIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return resolveScreenFromPath(window.location.pathname) === 'overview';
  });
  const [shortlistIds, setShortlistIds] = useState<string[]>(['tal-1', 'tal-2']);
  const [briefings, setBriefings] = useState<BriefingRequest[]>(INITIAL_BRIEFINGS);

  const handleNavigate = (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => {
    navigateToScreen(screen, { practice, sectionId, direction: 'direct' });
  };

  const handleOpenBriefing = (_practice?: PracticeArea, _brief?: string) => {
    if (activeScreen === 'contact') {
      handleNavigate('contact', undefined, 'contact-form-section');
    } else {
      handleNavigate('contact');
    }
  };

  const handleToggleShortlist = (id: string) => {
    setShortlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCancelBriefing = (id: string) => {
    setBriefings((prev) => prev.filter((item) => item.id !== id));
  };

  const isCurrentService = isServiceScreen(activeScreen);

  const getServiceMotionInitial = () => {
    if (prefersReducedMotion) return { opacity: 1, x: 0 };
    if (transitionDirection === 'next') return { opacity: 0, x: 36 };
    if (transitionDirection === 'prev') return { opacity: 0, x: -36 };
    return { opacity: 0, y: 12 };
  };

  const getServiceMotionExit = () => {
    if (prefersReducedMotion) return { opacity: 1, x: 0 };
    if (transitionDirection === 'next') return { opacity: 0, x: -36 };
    if (transitionDirection === 'prev') return { opacity: 0, x: 36 };
    return { opacity: 0, y: -10 };
  };

  const renderActiveServicePage = () => {
    switch (activeScreen) {
      case 'staffing':
        return (
          <StaffingSolutionsPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'data-analytics':
        return (
          <DataAnalyticsPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'application-development':
        return (
          <ApplicationDevelopmentPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'big-data':
        return (
          <BigDataPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'database-management':
        return (
          <DatabaseManagementPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'infrastructure-management':
        return (
          <InfrastructureManagementPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'mobility':
        return (
          <EnterpriseMobilityPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'analytics':
        return (
          <AnalyticsServicePage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      case 'hrms':
        return (
          <HrmsSolutionsPage
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {showWelcomeIntro && <WelcomeIntro />}
      <div className="apokrin-theme-root apokrin-ambient-host relative isolate min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
        <GlobalAmbient3DBackground />

        <TopBar
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onOpenBriefing={handleOpenBriefing}
        />

        <main className="relative z-10 flex-1 overflow-x-clip">
          {activeScreen === 'overview' && (
            <OverviewScreen
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'about' && (
            <AboutUsPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'contact' && (
            <ContactUsPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'solutions' && (
            <SolutionsScreen
              key={solutionsPractice}
              initialPractice={solutionsPractice}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'talent' && (
            <TalentScreen
              shortlistIds={shortlistIds}
              onToggleShortlist={handleToggleShortlist}
              onClearShortlist={() => setShortlistIds([])}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'benchmarks' && <BenchmarksScreen />}

          {activeScreen === 'engagements' && (
            <EngagementsScreen
              briefings={briefings}
              onCancelBriefing={handleCancelBriefing}
              onContactClick={() => handleNavigate('contact')}
            />
          )}

          {isCurrentService && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={getServiceMotionInitial()}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={getServiceMotionExit()}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.34,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {renderActiveServicePage()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <Footer
          onNavigate={handleNavigate}
          onOpenBriefing={handleOpenBriefing}
        />

        <BackToTopButton />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ServiceTransitionProvider>
        <AppContent />
      </ServiceTransitionProvider>
    </ThemeProvider>
  );
}
