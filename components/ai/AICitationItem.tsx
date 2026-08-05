"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText } from "lucide-react"

export interface Citation {
  id: string
  title: string
  href: string
  category?: string
  snippet?: string
}

export interface AICitationItemProps {
  citation: Citation
}

export function AICitationItem({ citation }: AICitationItemProps) {
  return (
    <Link
      href={citation.href}
      className="flex items-center gap-2 p-2 rounded-md border border-border bg-secondary/30 hover:bg-secondary transition-colors group text-xs text-foreground"
    >
      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
      <span className="font-medium truncate flex-1">{citation.title}</span>
      {citation.category && (
        <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
          {citation.category}
        </Badge>
      )}
      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </Link>
  )
}
