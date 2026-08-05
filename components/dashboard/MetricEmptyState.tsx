"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon, FileQuestion } from "lucide-react"

export interface MetricEmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function MetricEmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
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
        {actionLabel && onAction && (
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
