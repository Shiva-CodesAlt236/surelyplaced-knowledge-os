"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

/**
 * Sales Copilot — Level C Auth.js Session Context (Phase 6A)
 *
 * Thin client wrapper around next-auth/react's SessionProvider, matching this
 * repository's existing components/providers/* convention (Theme, Search, AI).
 * Makes useSession()/signIn()/signOut() available to any client component
 * beneath it, notably AskAIPanel.tsx.
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
