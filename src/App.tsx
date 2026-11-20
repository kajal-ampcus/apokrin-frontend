/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
import { ThemeProvider } from './theme/themeConfig';
import {
  BriefingRequest,
  INITIAL_BRIEFINGS,
  PracticeArea,
  ScreenId,
} from './data/apokrinData';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [solutionsPractice, setSolutionsPractice] = useState<PracticeArea | 'All'>('All');
  const [shortlistIds, setShortlistIds] = useState<string[]>(['tal-1', 'tal-2']);
  const [briefings, setBriefings] = useState<BriefingRequest[]>(INITIAL_BRIEFINGS);

  const handleNavigate = (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => {
    if (screen === 'solutions') {
      setSolutionsPractice(practice ?? 'All');
    }
    setActiveScreen(screen);

    if (sectionId) {
      window.setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  return (
    <ThemeProvider>
      <div className="apokrin-theme-root apokrin-ambient-host relative isolate min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
        <GlobalAmbient3DBackground />

        <TopBar
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onOpenBriefing={handleOpenBriefing}
        />

        <main className="relative z-10 flex-1">
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

          {activeScreen === 'staffing' && (
            <StaffingSolutionsPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'data-analytics' && (
            <DataAnalyticsPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'application-development' && (
            <ApplicationDevelopmentPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'big-data' && (
            <BigDataPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'database-management' && (
            <DatabaseManagementPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'infrastructure-management' && (
            <InfrastructureManagementPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'mobility' && (
            <EnterpriseMobilityPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'analytics' && (
            <AnalyticsServicePage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {activeScreen === 'hrms' && (
            <HrmsSolutionsPage
              onNavigate={handleNavigate}
              onOpenBriefing={handleOpenBriefing}
            />
          )}
        </main>

        <Footer
          onNavigate={handleNavigate}
          onOpenBriefing={handleOpenBriefing}
        />

        <BackToTopButton />
      </div>
    </ThemeProvider>
  );
}
