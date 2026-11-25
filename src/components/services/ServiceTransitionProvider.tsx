import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PracticeArea, ScreenId } from '../../data/apokrinData';
import {
  DEFAULT_SITE_SEO,
  getPathForScreen,
  getServiceConfig,
  isServiceScreen,
  resolveScreenFromPath,
  ServiceId,
  STATIC_SCREEN_SEO,
} from '../../data/servicesConfig';

export type ServiceTransitionDirection = 'next' | 'prev' | 'direct';

interface NavigateOptions {
  practice?: PracticeArea;
  sectionId?: string;
  direction?: ServiceTransitionDirection;
  replaceHistory?: boolean;
}

interface ServiceTransitionContextValue {
  activeScreen: ScreenId;
  activeServiceId: ServiceId | null;
  isTransitioning: boolean;
  transitionDirection: ServiceTransitionDirection;
  pendingServiceId: ServiceId | null;
  solutionsPractice: PracticeArea | 'All';
  navigateToScreen: (screen: ScreenId, options?: NavigateOptions) => void;
  navigateToService: (serviceId: ServiceId, direction?: ServiceTransitionDirection) => void;
}

const ServiceTransitionContext = createContext<ServiceTransitionContextValue | null>(null);

function syncDocumentMetadata(screen: ScreenId) {
  if (typeof document === 'undefined') return;

  const meta = isServiceScreen(screen)
    ? (() => {
        const cfg = getServiceConfig(screen);
        return { title: cfg.seoTitle, description: cfg.seoDescription };
      })()
    : STATIC_SCREEN_SEO[screen] ?? DEFAULT_SITE_SEO;

  document.title = meta.title;

  const updateMetaTag = (selector: string, content: string) => {
    const tag = document.querySelector<HTMLMetaElement>(selector);
    if (tag) {
      tag.setAttribute('content', content);
    }
  };

  updateMetaTag('meta[name="description"]', meta.description);
  updateMetaTag('meta[property="og:title"]', meta.title);
  updateMetaTag('meta[property="og:description"]', meta.description);
}

export function ServiceTransitionProvider({ children }: { children: ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    if (typeof window === 'undefined') return 'overview';
    return resolveScreenFromPath(window.location.pathname);
  });
  const [solutionsPractice, setSolutionsPractice] = useState<PracticeArea | 'All'>('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] =
    useState<ServiceTransitionDirection>('direct');
  const [pendingServiceId, setPendingServiceId] = useState<ServiceId | null>(null);

  const lockTimeoutRef = useRef<number | null>(null);
  const activeScreenRef = useRef<ScreenId>(activeScreen);
  activeScreenRef.current = activeScreen;

  // Keep SEO title, meta description, and canonical initial history state synchronized
  useEffect(() => {
    syncDocumentMetadata(activeScreen);
  }, [activeScreen]);

  // Listen to browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const nextScreen = resolveScreenFromPath(window.location.pathname);
      setTransitionDirection('direct');
      setPendingServiceId(null);
      setIsTransitioning(false);
      setActiveScreen(nextScreen);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (lockTimeoutRef.current !== null) {
        window.clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  const navigateToScreen = useCallback((screen: ScreenId, options?: NavigateOptions) => {
    const {
      practice,
      sectionId,
      direction = 'direct',
      replaceHistory = false,
    } = options ?? {};

    if (screen === 'solutions') {
      setSolutionsPractice(practice ?? 'All');
    }

    const isSameScreen = activeScreenRef.current === screen;
    const isServiceSwitch = isServiceScreen(screen) && !isSameScreen;

    // Prevent overlapping transitions during an active service switch
    if (isServiceSwitch && lockTimeoutRef.current !== null) {
      return;
    }

    const nextPath = getPathForScreen(screen);
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      if (replaceHistory) {
        window.history.replaceState({ screen }, '', nextPath);
      } else {
        window.history.pushState({ screen }, '', nextPath);
      }
    }

    if (isServiceSwitch) {
      setTransitionDirection(direction);
      setPendingServiceId(screen);
      setIsTransitioning(true);
      setActiveScreen(screen);

      // Smoothly reset scroll position to top of newly selected service page
      window.scrollTo({ top: 0, behavior: 'smooth' });

      lockTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        setPendingServiceId(null);
        lockTimeoutRef.current = null;
      }, 700);
      return;
    }

    setTransitionDirection('direct');
    setActiveScreen(screen);

    if (sectionId) {
      window.setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else if (!isSameScreen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateToService = useCallback(
    (serviceId: ServiceId, direction: ServiceTransitionDirection = 'direct') => {
      navigateToScreen(serviceId, { direction });
    },
    [navigateToScreen],
  );

  const activeServiceId = isServiceScreen(activeScreen) ? activeScreen : null;

  const value = useMemo<ServiceTransitionContextValue>(
    () => ({
      activeScreen,
      activeServiceId,
      isTransitioning,
      transitionDirection,
      pendingServiceId,
      solutionsPractice,
      navigateToScreen,
      navigateToService,
    }),
    [
      activeScreen,
      activeServiceId,
      isTransitioning,
      transitionDirection,
      pendingServiceId,
      solutionsPractice,
      navigateToScreen,
      navigateToService,
    ],
  );

  return (
    <ServiceTransitionContext.Provider value={value}>
      {children}
    </ServiceTransitionContext.Provider>
  );
}

export function useServiceTransition() {
  const ctx = useContext(ServiceTransitionContext);
  if (!ctx) {
    throw new Error('useServiceTransition must be used within a ServiceTransitionProvider');
  }
  return ctx;
}
