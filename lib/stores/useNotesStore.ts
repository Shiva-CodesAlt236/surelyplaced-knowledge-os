"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotesState {
  notes: Record<string, string>
  saveNote: (slug: string, content: string) => void
  getNote: (slug: string) => string
  deleteNote: (slug: string) => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},

      saveNote: (slug, content) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [slug]: content,
          },
        }))
      },

      getNote: (slug) => {
        return get().notes[slug] || ""
      },

      deleteNote: (slug) => {
        set((state) => {
          const newNotes = { ...state.notes }
          delete newNotes[slug]
          return { notes: newNotes }
        })
      },
    }),
    {
      name: "spk-notes-store",
    }
  )
)
