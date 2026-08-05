"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon, FileQuestion } from "lucide-react"

export interface MetricEmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  /** Real internal route to navigate to. Preferred over `onAction` for empty states that should link somewhere (e.g. "Browse modules"). */
  actionHref?: string
}

export function MetricEmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: MetricEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="p-3 rounded-full bg-secondary text-muted-foreground mb-3">
          <Icon className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          {description}
        </p>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="mt-4">
            <Button variant="outline" size="sm" className="text-xs">
              {actionLabel}
            </Button>
          </Link>
        )}
        {actionLabel && onAction && !actionHref && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="mt-4 text-xs"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
