"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FileText, ChevronRight } from "lucide-react"

export interface SearchResultItemProps {
  title: string
  href: string
  snippet?: string
  category?: string
  onClick?: () => void
}

export function SearchResultItem({
  title,
  href,
  snippet,
  category = "Documentation",
  onClick,
}: SearchResultItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all"
    >
      <div className="mt-0.5 p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
            {category}
          </Badge>
        </div>
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {title}
        </h4>
        {snippet && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {snippet}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
    </Link>
  )
}
