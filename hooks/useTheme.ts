'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResolvedTheme, ThemePreference } from '@/types/layout';

interface ThemeState {
  /** The learner's stored preference, per docs/DESIGN_SYSTEM_SPEC.md's
   * Dark Mode section — persisted across sessions via localStorage,
   * distinct from the session-only UI state in useSidebar. */
  preference: ThemePreference;
  /** The actual light/dark value currently applied to the document,
   * resolved from `preference` (and the OS setting, when preference
   * is "system"). */
  resolvedTheme: ResolvedTheme;

  setPreference: (preference: ThemePreference) => void;
  setResolvedTheme: (resolvedTheme: ResolvedTheme) => void;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      resolvedTheme: 'light',
      setPreference: (preference) =>
        set({
          preference,
          resolvedTheme: preference === 'system' ? getSystemTheme() : preference,
        }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: 'spk-os-theme',
      partialize: (state) => ({ preference: state.preference }),
    },
  ),
);

/**
 * Convenience hook exposing the current preference/resolved theme and
 * the action to change it. `components/providers/ThemeProvider.tsx`
 * is responsible for applying `resolvedTheme` to the document root
 * and for keeping it in sync with the OS setting when `preference`
 * is "system" — this hook only exposes state, per
 * docs/FRONTEND_BUILD_GUIDE.md's separation of hooks (state access)
 * from providers (side effects).
 */
export function useTheme() {
  const preference = useThemeStore((state) => state.preference);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setPreference = useThemeStore((state) => state.setPreference);
  return { preference, resolvedTheme, setPreference };
}
