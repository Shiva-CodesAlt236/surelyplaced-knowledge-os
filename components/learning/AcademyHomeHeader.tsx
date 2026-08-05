"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"
import { useSearchStore } from "@/components/providers/SearchProvider"
import {
  Sparkles, Compass, Play, Bookmark, Search,
  CheckCircle2, Clock, Trophy
} from "lucide-react"

export function AcademyHomeHeader() {
  const lastActiveArticle = useProgressStore((s) => s.lastActiveArticle)
  const completedSlugs = useProgressStore((s) => s.completedSlugs)
  const bookmarks = useBookmarksStore((s) => s.bookmarks)
  const openSearch = useSearchStore((s) => s.open)

  const completedCount = completedSlugs.length
  const totalLessons = 54
  const progressPct = Math.round((completedCount / totalLessons) * 100)

  return (
    <div className="space-y-6 my-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1 font-semibold">
              <Sparkles className="size-3" />
              SurelyPlaced Sales Academy
            </Badge>
            <span className="text-xs font-mono font-bold text-fd-muted-foreground">
              Mastery Track
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fd-foreground">
            Sales Advisor Academy
          </h1>
          <p className="text-xs sm:text-sm text-fd-muted-foreground max-w-xl leading-relaxed">
            Your structured training platform — master discovery, consultative presentations, objection handling, investment psychology, and graduation closing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={openSearch} variant="outline" size="sm" className="gap-2 text-xs font-semibold h-9">
            <Search className="size-3.5 text-primary" />
            <span>Search Academy (Cmd+K)</span>
          </Button>
        </div>
      </div>

      {/* Above-the-fold Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Continue / Resume Card */}
        <Card className="border-fd-border bg-fd-card p-4 sm:col-span-1 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1">
                <Play className="size-3 text-primary" /> Resume Learning
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">Active</Badge>
            </div>
            {lastActiveArticle ? (
              <div>
                <h3 className="text-xs font-bold text-fd-foreground truncate">
                  {lastActiveArticle.title}
                </h3>
                <p className="text-[10px] text-fd-muted-foreground truncate mt-0.5">
                  {lastActiveArticle.moduleName}
                </p>
                <Link href={lastActiveArticle.href} className="inline-block mt-2">
                  <Button size="sm" className="h-7 text-[11px] gap-1 px-3">
                    <span>Resume Lesson</span>
                    <Play className="size-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-fd-foreground">Discovery Calls</h3>
                <p className="text-[10px] text-fd-muted-foreground mt-0.5">Step 1: Opening Discovery</p>
                <Link href="/docs/discovery/opening-the-discovery-call" className="inline-block mt-2">
                  <Button size="sm" className="h-7 text-[11px] gap-1 px-3">
                    <span>Start Step 1</span>
                    <Play className="size-3" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Summary Card */}
        <Card className="border-fd-border bg-fd-card p-4 sm:col-span-1 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1">
                <Trophy className="size-3 text-emerald-500" /> Progress Summary
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {progressPct}%
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-fd-foreground">
                {completedCount} of {totalLessons} Lessons
              </h3>
              <div className="w-full h-1.5 bg-fd-secondary rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-[10px] text-fd-muted-foreground mt-1.5">
                8 Stepper Phases • Complete Call Graduation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks Card */}
        <Card className="border-fd-border bg-fd-card p-4 sm:col-span-1 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1">
                <Bookmark className="size-3 text-amber-500" /> Bookmarked Lessons
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">{bookmarks.length}</Badge>
            </div>
            <div>
              <h3 className="text-xs font-bold text-fd-foreground">
                {bookmarks.length === 0 ? "No Saved Bookmarks" : `${bookmarks.length} Saved Cheat Sheets`}
              </h3>
              <p className="text-[10px] text-fd-muted-foreground mt-0.5">
                Quick access to saved scripts & playbooks.
              </p>
              <Link href="/bookmarks" className="inline-block mt-2">
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-3">
                  <span>View Bookmarks</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
