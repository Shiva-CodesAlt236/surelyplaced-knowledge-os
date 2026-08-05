'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { SearchOverlay } from '@/components/search/SearchOverlay';

/**
 * Search state — the single Search system for the application
 * (Milestone 4C, Priority 3/8). Milestone 4A built this store and a
 * bare input-only Dialog. Milestone 4B separately built
 * `components/search/SearchOverlay.tsx` with a nicer UI (facet
 * filters, result list) but wired it to a hardcoded `mockResults`
 * array instead of the real `/api/search` route — a second,
 * disconnected, non-functional Search system.
 *
 * This merges them: this store remains the single source of truth
 * (open/close, query), and `SearchOverlay` — now wired to the real
 * search API — is the one UI that renders it, reachable identically
 * from the Header's Search button, the Cmd/Ctrl+K shortcut, and any
 * other trigger that calls `useSearchStore.getState().open()`.
 */
interface SearchState {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '' }),
  setQuery: (query) => set({ query }),
}));

/**
 * Registers the "open search" keyboard shortcut, guarding against
 * firing while focus is already inside a text input, and hosts the
 * one global `SearchOverlay` instance.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useSearchStore((state) => state.isOpen);
  const open = useSearchStore((state) => state.open);
  const close = useSearchStore((state) => state.close);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingContext =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !isTypingContext) {
        event.preventDefault();
        useSearchStore.getState().open();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {children}
      <SearchOverlay open={isOpen} onOpenChange={(next) => (next ? open() : close())} />
    </>
  );
}
