"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles, Search, Bookmark, HelpCircle, Zap } from "lucide-react"

export interface QuickActionsCardProps {
  onOpenSearch?: () => void
  onOpenAI?: () => void
}

export function QuickActionsCard({
  onOpenSearch,
  onOpenAI,
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={onOpenAI}
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors text-center group"
        >
          <Sparkles className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-foreground">Ask AI Assistant</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-center group"
        >
          <Search className="h-5 w-5 text-muted-foreground mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-foreground">Search Knowledge</span>
        </button>

        <Link
          href="/docs/candidate-intelligence/cloud-devops"
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-center group"
        >
          <Bookmark className="h-5 w-5 text-muted-foreground mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-foreground">Role Profiles</span>
        </Link>

        <Link
          href="/docs/interview-intelligence/question-bank"
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-center group"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-foreground">Question Bank</span>
        </Link>
      </CardContent>
    </Card>
  )
}
