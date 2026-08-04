'use client';

import { useEffect } from 'react';
import { getSystemTheme, useThemeStore } from '@/hooks/useTheme';

/**
 * Applies the resolved theme to the document root and keeps it in
 * sync with the OS-level color-scheme preference, per
 * docs/DESIGN_SYSTEM_SPEC.md's Dark Mode section. State itself lives
 * in the Zustand store (hooks/useTheme.ts) — this component owns only
 * the DOM side effect of applying that state, per
 * docs/FRONTEND_BUILD_GUIDE.md's separation of hooks from providers.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((state) => state.preference);

  useEffect(() => {
    const applied = preference === 'system' ? getSystemTheme() : preference;
    document.documentElement.classList.toggle('dark', applied === 'dark');
    useThemeStore.setState({ resolvedTheme: applied });
  }, [preference]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function handleSystemChange() {
      if (useThemeStore.getState().preference !== 'system') return;
      const applied = media.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', applied === 'dark');
      useThemeStore.setState({ resolvedTheme: applied });
    }

    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, []);

  return children;
}
