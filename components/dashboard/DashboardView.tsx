"use client"

import React from "react"
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard"
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard"
import { KnowledgeCheckSummaryCard } from "@/components/dashboard/KnowledgeCheckSummaryCard"
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard"
import { MetricEmptyState } from "@/components/dashboard/MetricEmptyState"
import { KnowledgeCheckCard } from "@/components/assessment/KnowledgeCheckCard"
import { Sparkles, Compass } from "lucide-react"
import { useSearchStore } from "@/components/providers/SearchProvider"
import { useAIStore } from "@/components/providers/AIProvider"

/**
 * Milestone 4C, Priority 2/5/8: Search and Ask AI are now each a
 * single global system (SearchProvider / AIProvider, mounted once in
 * app/layout.tsx) — this view opens them via their shared Zustand
 * stores instead of mounting its own local `SearchOverlay`/`AskAIPanel`
 * instances with local open/close state, which produced two
 * disconnected Search and AI experiences depending on which button a
 * user clicked. The two hardcoded "Active Learning Paths" cards
 * Milestone 4B shipped (fabricated completion counts, and one linking
 * to a route that doesn't resolve) are removed — there is no Learning
 * Paths data model in this codebase yet, so an honest empty state
 * replaces them rather than inventing progress numbers for paths that
 * don't exist.
 */
export function DashboardView() {
  const openSearch = useSearchStore((state) => state.open)
  const openAI = useAIStore((state) => state.open)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-8 px-4 sm:px-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Career Advisor Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            SurelyPlaced Knowledge OS
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Your intelligent sales copilot — role profiles, interview scripts, objection handling, and closing frameworks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openAI}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <ContinueLearningCard />

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              Learning Paths
            </h3>
            <MetricEmptyState
              icon={Compass}
              title="No learning paths assigned yet"
              description="Structured learning paths aren't set up yet. In the meantime, browse the full module library directly."
              actionLabel="Browse Modules"
              actionHref="/browse"
            />
          </div>

          {/* Featured Knowledge Check — real, static practice content (not fabricated user data). */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">Featured Knowledge Check</h3>
            <KnowledgeCheckCard
              id="dashboard-featured-check"
              question="When dealing with a prospect raising budget objections, what is the primary recommended approach?"
              options={[
                { id: "a", text: "Immediately grant a 15% discount to keep the deal moving.", isCorrect: false },
                { id: "b", text: "Re-anchor on quantifiable business value & ROI before discussing pricing adjustments.", isCorrect: true },
                { id: "c", text: "Escalate immediately to the VP of Sales without probing further.", isCorrect: false },
                { id: "d", text: "Pause all communication until the prospect's new fiscal year.", isCorrect: false },
              ]}
              explanation="Standard closing protocol dictates re-anchoring on quantifiable business value & ROI before entertaining any price adjustments. Concessions without value trade-offs degrade margin."
            />
          </div>
        </div>

        {/* Right Sidebar Column (1 Col) */}
        <div className="space-y-6">
          <QuickActionsCard
            onOpenSearch={openSearch}
            onOpenAI={openAI}
          />
          <KnowledgeCheckSummaryCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  )
}
