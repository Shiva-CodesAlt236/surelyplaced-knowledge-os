'use client';

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { Search as SearchIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Search state, per docs/STATE_MANAGEMENT.md's Search domain: session
 * state for the current query and overlay-open flag. The full ranked
 * result list, facets, and autocomplete this store will eventually
 * drive are specified in docs/SEARCH_COMPONENT_SPEC.md and belong to
 * a future milestone that implements that spec — this provider owns
 * only the overlay's open/close state and query capture, which is
 * what docs/APP_LAYOUT_SPEC.md's Global Application Shell asks the
 * shell to host.
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
 * Hosts the Search Overlay shell (per docs/APP_LAYOUT_SPEC.md's
 * Global Application Shell entry) and registers the "open search"
 * keyboard shortcut, guarding against firing while focus is already
 * inside a text input, per that document's Keyboard Shortcuts
 * section. Search state itself is exposed globally via
 * `useSearchStore` rather than React Context, since Zustand doesn't
 * require a Provider to make state available to consumers — this
 * component's only responsibility is the keyboard shortcut and
 * hosting the overlay markup.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useSearchStore((state) => state.isOpen);
  const query = useSearchStore((state) => state.query);
  const open = useSearchStore((state) => state.open);
  const close = useSearchStore((state) => state.close);
  const setQuery = useSearchStore((state) => state.setQuery);

  const inputRef = useRef<HTMLInputElement>(null);

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
      <Dialog open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="flex-row items-center gap-2 border-b-0 pb-0">
            <SearchIcon className="size-4 text-fd-muted-foreground" />
            <DialogTitle className="sr-only">Search the Knowledge OS</DialogTitle>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the Knowledge OS…"
              className="w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-fd-muted-foreground"
              autoFocus
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
