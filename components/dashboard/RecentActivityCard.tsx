"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MetricEmptyState } from "@/components/dashboard/MetricEmptyState"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"
import { History, Bookmark } from "lucide-react"

export function RecentActivityCard() {
  const bookmarks = useBookmarksStore((s) => s.bookmarks)

  if (bookmarks.length === 0) {
    return (
      <MetricEmptyState
        icon={History}
        title="No Saved Bookmarks"
        description="Bookmark role profiles or closing scripts while reading to access quick shortcuts here."
      />
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Saved Bookmarks & Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-border">
        {bookmarks.slice(-5).map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-accent/40 rounded-lg px-2 -mx-2 transition-colors"
          >
            <div className="mt-0.5 p-1.5 rounded-md bg-secondary text-amber-500">
              <Bookmark className="h-4 w-4 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
