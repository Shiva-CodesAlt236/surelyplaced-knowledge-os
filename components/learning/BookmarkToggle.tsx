"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"
import { cn } from "@/lib/utils"

export interface BookmarkToggleProps {
  articleSlug: string
  articleTitle: string
  href?: string
  category?: string
  variant?: "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "icon"
}

export function BookmarkToggle({
  articleSlug,
  articleTitle,
  href,
  category = "Documentation",
  variant = "outline",
  size = "sm",
}: BookmarkToggleProps) {
  const { toggleBookmark, isBookmarked } = useBookmarksStore()
  const active = isBookmarked(articleSlug)

  const handleClick = () => {
    toggleBookmark({
      slug: articleSlug,
      title: articleTitle,
      href: href || `/docs/${articleSlug}`,
      category,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "gap-1.5 transition-colors",
        active && "text-amber-500 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
      )}
      title={active ? "Remove Bookmark" : "Save Bookmark"}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-transform active:scale-125",
          active && "fill-current"
        )}
      />
      {size !== "icon" && (
        <span className="text-xs font-medium">
          {active ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  )
}
