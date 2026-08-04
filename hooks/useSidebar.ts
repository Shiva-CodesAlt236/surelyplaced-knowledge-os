'use client';

import { create } from 'zustand';
import type { SidebarMode } from '@/types/navigation';

interface SidebarState {
  /** Whether the mobile Sidebar drawer is open, per docs/APP_LAYOUT_SPEC.md's
   * Mobile Behaviour section. Session-only UI state — never persisted. */
  isMobileOpen: boolean;
  /** Browse (full tree) or Path (active Learning Path only), per
   * docs/NAVIGATION_MANIFEST.md's Sidebar section. */
  mode: SidebarMode;
  /** Which Browse-mode tree branches are currently expanded. */
  expandedIds: ReadonlySet<string>;

  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
  setMode: (mode: SidebarMode) => void;
  toggleMode: () => void;
  toggleExpanded: (id: string) => void;
  isExpanded: (id: string) => boolean;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isMobileOpen: false,
  mode: 'browse',
  expandedIds: new Set<string>(),

  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'browse' ? 'path' : 'browse' })),

  toggleExpanded: (id) =>
    set((state) => {
      const next = new Set(state.expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedIds: next };
    }),
  isExpanded: (id) => get().expandedIds.has(id),
}));

/**
 * Convenience hook mirroring the store directly. Kept as a thin
 * wrapper (rather than exporting the store itself as the public API)
 * so consuming components import `useSidebar` from one place per
 * docs/FRONTEND_BUILD_GUIDE.md's Reusable Hooks conventions.
 */
export function useSidebar() {
  return useSidebarStore();
}
