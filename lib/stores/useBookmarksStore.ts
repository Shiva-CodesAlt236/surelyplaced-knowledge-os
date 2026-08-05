"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface BookmarkItem {
  slug: string
  title: string
  href: string
  category: string
  savedAt: string
}

interface BookmarksState {
  bookmarks: BookmarkItem[]
  toggleBookmark: (item: Omit<BookmarkItem, "savedAt">) => void
  isBookmarked: (slug: string) => boolean
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      toggleBookmark: (item) => {
        const exists = get().bookmarks.some((b) => b.slug === item.slug)
        if (exists) {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.slug !== item.slug),
          }))
        } else {
          set((state) => ({
            bookmarks: [
              ...state.bookmarks,
              { ...item, savedAt: new Date().toISOString() },
            ],
          }))
        }
      },

      isBookmarked: (slug) => {
        return get().bookmarks.some((b) => b.slug === slug)
      },
    }),
    {
      name: "spk-bookmarks-store",
    }
  )
)
