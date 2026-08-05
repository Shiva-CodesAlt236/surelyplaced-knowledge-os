"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BookmarkToggleProps {
  initialBookmarked?: boolean
  articleSlug?: string
  articleTitle?: string
  onToggle?: (isBookmarked: boolean) => void
  variant?: "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "icon"
}

export function BookmarkToggle({
  initialBookmarked = false,
  onToggle,
  variant = "outline",
  size = "sm",
}: BookmarkToggleProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)

  const handleClick = () => {
    const nextState = !isBookmarked
    setIsBookmarked(nextState)
    if (onToggle) {
      onToggle(nextState)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "gap-1.5 transition-colors",
        isBookmarked && "text-amber-500 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
      )}
      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-transform active:scale-125",
          isBookmarked && "fill-current"
        )}
      />
      {size !== "icon" && (
        <span className="text-xs font-medium">
          {isBookmarked ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  )
}
