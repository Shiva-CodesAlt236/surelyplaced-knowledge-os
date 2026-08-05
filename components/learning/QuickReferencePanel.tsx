"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pin } from "lucide-react"

export interface QuickReferenceItem {
  label: string
  value: string
}

export interface QuickReferencePanelProps {
  title?: string
  items: QuickReferenceItem[]
}

/**
 * Sticky-positioned cheat-sheet panel for MDX embedding.
 * Renders a list of label-value quick reference pairs that the learner
 * can glance at while reading the main lesson content.
 */
export function QuickReferencePanel({
  title = "Quick Reference",
  items,
}: QuickReferencePanelProps) {
  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm lg:sticky lg:top-20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <Pin className="size-4 text-fd-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="divide-y divide-fd-border">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-sm leading-snug text-fd-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
