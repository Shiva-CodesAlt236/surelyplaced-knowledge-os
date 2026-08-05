'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Personal note state, following the same shape and persistence
 * pattern as components/providers/ProgressProvider.tsx: a client-only
 * Zustand store, persisted to localStorage. Built because
 * components/learning/NotesPanel.tsx previously called `setTimeout`
 * to fake a "Saved!" confirmation without persisting anything —
 * Milestone 4C, Priority 6 replaces that with real, if local-only,
 * persistence.
 */
export interface NoteEntry {
  content: string;
  updatedAt: number;
}

interface NotesState {
  notes: Record<string, NoteEntry>;
  saveNote: (articleSlug: string, content: string) => void;
  clearNote: (articleSlug: string) => void;
  getNote: (articleSlug: string) => string;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},

      saveNote: (articleSlug, content) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [articleSlug]: { content, updatedAt: Date.now() },
          },
        })),

      clearNote: (articleSlug) =>
        set((state) => {
          const next = { ...state.notes };
          delete next[articleSlug];
          return { notes: next };
        }),

      getNote: (articleSlug) => get().notes[articleSlug]?.content ?? '',
    }),
    { name: 'spk-os-notes' },
  ),
);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  return children;
}
