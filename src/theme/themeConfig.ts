import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

export type BrandThemeId = 'blue' | 'green' | 'orange';

export interface BrandThemeConfig {
  id: BrandThemeId;
  name: string;
  label: string;
  primary: string;
  primaryStrong: string;
  secondary: string;
  secondaryText: string;
  accent: string;
  surface: string;
  surfaceSoft: string;
  surfaceTint: string;
  borderTint: string;
  glow: string;
  three: {
    primaryHex: number;
    secondaryHex: number;
    accentHex: number;
    softTintHex: number;
    lavenderTintHex: number;
    emissivePrimaryHex: number;
    emissiveSecondaryHex: number;
  };
}

export const THEME_STORAGE_KEY = 'apokrin-theme';

export const BRAND_THEMES: Record<BrandThemeId, BrandThemeConfig> = {
  blue: {
    id: 'blue',
    name: 'Blue Theme',
    label: 'Blue',
    primary: '#2563EB',
    primaryStrong: '#1D4ED8',
    secondary: '#06B6D4',
    secondaryText: '#0891B2',
    accent: '#38BDF8',
    surface: '#F4F8FF',
    surfaceSoft: '#EFF6FF',
    surfaceTint: '#DBEAFE',
    borderTint: '#BFDBFE',
    glow: 'rgba(37, 99, 235, 0.22)',
    three: {
      primaryHex: 0x2563eb,
      secondaryHex: 0x06b6d4,
      accentHex: 0x38bdf8,
      softTintHex: 0xb9dcff,
      lavenderTintHex: 0xdcd9ff,
      emissivePrimaryHex: 0x1e40af,
      emissiveSecondaryHex: 0x0891b2,
    },
  },
  green: {
    id: 'green',
    name: 'Green Theme',
    label: 'Green',
    primary: '#65A30D',
    primaryStrong: '#4D7C0F',
    secondary: '#16A34A',
    secondaryText: '#15803D',
    accent: '#84CC16',
    surface: '#F4FBF1',
    surfaceSoft: '#F0FDF4',
    surfaceTint: '#DCFCE7',
    borderTint: '#BBF7D0',
    glow: 'rgba(101, 163, 13, 0.22)',
    three: {
      primaryHex: 0x65a30d,
      secondaryHex: 0x16a34a,
      accentHex: 0x84cc16,
      softTintHex: 0xc8f0c2,
      lavenderTintHex: 0xdcfce7,
      emissivePrimaryHex: 0x3f6212,
      emissiveSecondaryHex: 0x15803d,
    },
  },
  orange: {
    id: 'orange',
    name: 'Orange Theme',
    label: 'Orange',
    primary: '#F59E0B',
    primaryStrong: '#EA580C',
    secondary: '#F97316',
    secondaryText: '#C2410C',
    accent: '#FDBA74',
    surface: '#FFFBF3',
    surfaceSoft: '#FFF7ED',
    surfaceTint: '#FFEDD5',
    borderTint: '#FED7AA',
    glow: 'rgba(249, 115, 22, 0.22)',
    three: {
      primaryHex: 0xf59e0b,
      secondaryHex: 0xf97316,
      accentHex: 0xfdba74,
      softTintHex: 0xfed7aa,
      lavenderTintHex: 0xffedd5,
      emissivePrimaryHex: 0xb45309,
      emissiveSecondaryHex: 0xc2410c,
    },
  },
};

export const BRAND_THEME_LIST: BrandThemeConfig[] = [
  BRAND_THEMES.blue,
  BRAND_THEMES.green,
  BRAND_THEMES.orange,
];

export function isValidBrandTheme(value: string | null): value is BrandThemeId {
  return value === 'blue' || value === 'green' || value === 'orange';
}

function getInitialTheme(): BrandThemeId {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (isValidBrandTheme(attr)) return attr;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isValidBrandTheme(saved)) return saved;
    } catch {
      // Ignore storage access restrictions
    }
  }
  return 'blue';
}

interface ThemeContextValue {
  theme: BrandThemeId;
  setTheme: (next: BrandThemeId) => void;
  themeConfig: BrandThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'blue',
  setTheme: () => {},
  themeConfig: BRAND_THEMES.blue,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<BrandThemeId>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access restrictions
    }
  }, [theme]);

  const setTheme = (next: BrandThemeId) => {
    setThemeState(next);
  };

  return createElement(
    ThemeContext.Provider,
    {
      value: {
        theme,
        setTheme,
        themeConfig: BRAND_THEMES[theme],
      },
    },
    children,
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
