"use client"

import * as React from "react"
import { BookOpen, SearchX, BookmarkCheck, Sparkles } from "lucide-react"
import { SCRIPTS_REGISTRY, getObjectionScripts, getScriptsByModule, type ScriptEntry, type ScriptType } from "@/lib/scripts-registry"
import { ModuleSelector, type ModuleOption } from "@/components/scripts/ModuleSelector"
import { ScriptFilterBar } from "@/components/scripts/ScriptFilterBar"
import { ScriptCard } from "@/components/scripts/ScriptCard"
import { ScriptDetailDialog } from "@/components/scripts/ScriptDetailDialog"
import { Button } from "@/components/ui/button"
import { MetricEmptyState } from "@/components/dashboard/MetricEmptyState"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"

// ─── Module Definitions ──────────────────────────────────────────

const MODULE_DEFINITIONS: { id: string; name: string; shortName: string }[] = [
  { id: "discovery",          name: "Discovery Calls",          shortName: "Discovery" },
  { id: "discussion",         name: "Discussion Calls",         shortName: "Discussion" },
  { id: "closing",            name: "Closing Calls",            shortName: "Closing" },
  { id: "objections",         name: "Objection Handling",       shortName: "Objections" },
  { id: "pricing",            name: "Pricing & Value",          shortName: "Pricing" },
  { id: "sales-coaching",     name: "Sales Coaching",           shortName: "Coaching" },
  { id: "sales-constitution", name: "Sales Constitution",       shortName: "Constitution" },
  { id: "complete-call",      name: "Sales Academy Graduation", shortName: "Graduation" },
  { id: "objection-response", name: "Objection Responses",      shortName: "Objection Responses" },
]

export function ScriptsLibraryView() {
  const [activeModuleId, setActiveModuleId] = React.useState<string>("discovery")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedType, setSelectedType] = React.useState<ScriptType | "all">("all")
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string | "all">("all")
  const [selectedScriptForDetail, setSelectedScriptForDetail] = React.useState<ScriptEntry | null>(null)
  const [showOnlyBookmarks, setShowOnlyBookmarks] = React.useState<boolean>(false)

  const { bookmarks } = useBookmarksStore()

  // Reset sub-filters when changing active module
  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId)
    setSelectedDifficulty("all")
    setShowOnlyBookmarks(false)
  }

  // 1. Calculate script counts per module for selector tabs
  const moduleOptions: ModuleOption[] = React.useMemo(() => {
    return MODULE_DEFINITIONS.map((def) => {
      let count = 0
      if (def.id === "objection-response") {
        count = getObjectionScripts().length
      } else {
        count = getScriptsByModule(def.id).length
      }
      return {
        id: def.id,
        name: def.name,
        shortName: def.shortName,
        count,
      }
    })
  }, [])

  // 2. Base scripts for the currently active module/view
  const baseModuleScripts = React.useMemo(() => {
    if (activeModuleId === "objection-response") {
      return getObjectionScripts()
    }
    return getScriptsByModule(activeModuleId)
  }, [activeModuleId])

  // 3. Extract available difficulty levels for current module
  const availableDifficulties = React.useMemo(() => {
    const set = new Set<string>()
    for (const s of baseModuleScripts) {
      if (s.difficulty) set.add(s.difficulty)
    }
    const order = ["Foundational", "Intermediate", "Advanced", "Expert"]
    return order.filter((d) => set.has(d))
  }, [baseModuleScripts])

  // 4. Filter scripts by searchQuery, selectedType, selectedDifficulty, and bookmarks
  const filteredScripts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return baseModuleScripts.filter((script) => {
      // Type filter
      if (selectedType !== "all" && script.type !== selectedType) {
        return false
      }

      // Difficulty filter
      if (selectedDifficulty !== "all" && script.difficulty !== selectedDifficulty) {
        return false
      }

      // Bookmarks filter
      if (showOnlyBookmarks && !bookmarks.some((b) => b.slug === script.id)) {
        return false
      }

      // Search query filter
      if (q) {
        const scenario = (script.scenario || "").toLowerCase()
        const prompt = (script.prompt || "").toLowerCase()
        const answer = (script.recommendedAnswer || "").toLowerCase()
        const title = (script.lessonTitle || "").toLowerCase()
        const tags = (script.tags || []).join(" ").toLowerCase()
        const quickRef = script.quickRefTitle ? script.quickRefTitle.toLowerCase() : ""

        const matches =
          scenario.includes(q) ||
          prompt.includes(q) ||
          answer.includes(q) ||
          title.includes(q) ||
          tags.includes(q) ||
          quickRef.includes(q)

        if (!matches) return false
      }

      return true
    })
  }, [baseModuleScripts, searchQuery, selectedType, selectedDifficulty, showOnlyBookmarks, bookmarks])

  const hasActiveFilters =
    searchQuery !== "" || selectedType !== "all" || selectedDifficulty !== "all" || showOnlyBookmarks

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedDifficulty("all")
    setShowOnlyBookmarks(false)
  }

  const activeModuleMeta = MODULE_DEFINITIONS.find((m) => m.id === activeModuleId)

  return (
    <div className="space-y-6">
      {/* Header Banner & Reference Tool Disclaimer */}
      <div className="rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card via-fd-card to-indigo-500/5 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BookOpen className="size-5 sm:size-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-fd-foreground">
                Premium Scripts Library
              </h1>
              <p className="text-xs sm:text-sm text-fd-muted-foreground">
                376 verbatim roleplay scenarios, objection responses, practice exercises & quick references.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyBookmarks ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowOnlyBookmarks((prev) => !prev)}
              className="gap-1.5 text-xs"
            >
              <BookmarkCheck className="size-4 text-amber-500" />
              <span>Bookmarked ({bookmarks.length})</span>
            </Button>
          </div>
        </div>

        {/* Reference Tool Design Principle Notice */}
        <div className="flex items-start gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-fd-foreground leading-relaxed">
          <Sparkles className="size-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1">Reference Tool Design:</span>
            Instant script copy is intentional for live call reference. The Scripts Library is designed as a fast verbatim lookup tool — not a substitute for completing interactive lesson walkthroughs.
          </div>
        </div>
      </div>

      {/* Module Selector (Tab Bar) */}
      <ModuleSelector
        modules={moduleOptions}
        activeModuleId={activeModuleId}
        onSelectModule={handleSelectModule}
      />

      {/* Filter Bar */}
      <ScriptFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        availableDifficulties={availableDifficulties}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        totalMatching={filteredScripts.length}
      />

      {/* Module Content Tab Panel */}
      <div
        id={`panel-${activeModuleId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeModuleId}`}
        className="space-y-4"
      >
        {/* Module Heading */}
        <div className="flex items-center justify-between border-b border-fd-border/60 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-fd-foreground flex items-center gap-2">
            <span>{activeModuleMeta?.name}</span>
            <span className="text-xs font-normal text-fd-muted-foreground">
              ({filteredScripts.length} scripts)
            </span>
          </h2>
        </div>

        {/* Script List Grid */}
        {filteredScripts.length > 0 ? (
          <div
            role="list"
            aria-label={`${activeModuleMeta?.name} Scripts`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onOpenDetail={(s) => setSelectedScriptForDetail(s)}
            />
          ))}
        </div>
      ) : (
        /* Empty State using MetricEmptyState */
        <MetricEmptyState
          icon={SearchX}
          title={showOnlyBookmarks ? "No bookmarked scripts found" : "No scripts match your filters"}
          description={
            showOnlyBookmarks
              ? "You haven't bookmarked any scripts in this module yet. Click the bookmark icon on any script card to save it."
              : `We couldn't find any scripts in ${activeModuleMeta?.name} matching your search or selected filters.`
          }
          actionLabel={hasActiveFilters ? "Reset All Filters" : undefined}
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      )}
      </div>

      {/* Detail Modal Dialog */}
      <ScriptDetailDialog
        script={selectedScriptForDetail}
        isOpen={Boolean(selectedScriptForDetail)}
        onClose={() => setSelectedScriptForDetail(null)}
      />
    </div>
  )
}
