"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface LastActiveArticle {
  title: string
  href: string
  moduleName: string
  /**
   * Omitted when a real per-module completion ratio isn't available to
   * the caller — no fixed fallback is shown, since one would be
   * fabricated (Milestone 4E, Priority 3).
   */
  progressPercentage?: number
  /**
   * Omitted when a real time estimate isn't available — this codebase
   * has no per-article duration data yet.
   */
  estimatedTimeLeft?: string
}

interface ProgressState {
  completedSlugs: string[]
  lastActiveArticle: LastActiveArticle | null
  markComplete: (slug: string) => void
  markIncomplete: (slug: string) => void
  setLastActiveArticle: (article: LastActiveArticle) => void
  isCompleted: (slug: string) => boolean
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSlugs: [],
      lastActiveArticle: null,

      markComplete: (slug) => {
        set((state) => ({
          completedSlugs: state.completedSlugs.includes(slug)
            ? state.completedSlugs
            : [...state.completedSlugs, slug],
        }))
      },

      markIncomplete: (slug) => {
        set((state) => ({
          completedSlugs: state.completedSlugs.filter((s) => s !== slug),
        }))
      },

      setLastActiveArticle: (article) => {
        set({ lastActiveArticle: article })
      },

      isCompleted: (slug) => {
        return get().completedSlugs.includes(slug)
      },
    }),
    {
      name: "spk-progress-store",
    }
  )
)
