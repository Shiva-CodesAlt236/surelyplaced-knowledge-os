"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { History, FileText, CheckCircle, Bookmark } from "lucide-react"

export interface ActivityItem {
  id: string
  title: string
  href: string
  type: "article" | "completed" | "bookmark"
  timestamp: string
}

export interface RecentActivityCardProps {
  activities?: ActivityItem[]
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    title: "AWS Cloud & DevOps Engineering Profile",
    href: "/docs/candidate-intelligence/cloud-devops",
    type: "completed",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Technical Recruiter Screen Scripts",
    href: "/docs/recruiter-intelligence/screener-call-script",
    type: "article",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    title: "LinkedIn Executive Brand Audit Framework",
    href: "/docs/linkedin-intelligence/profile-audit-framework",
    type: "bookmark",
    timestamp: "2 days ago",
  },
]

export function RecentActivityCard({
  activities = defaultActivities,
}: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-border">
        {activities.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-accent/40 rounded-lg px-2 -mx-2 transition-colors"
          >
            <div className="mt-0.5 p-1.5 rounded-md bg-secondary text-secondary-foreground">
              {item.type === "completed" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
              {item.type === "bookmark" && <Bookmark className="h-4 w-4 text-amber-500" />}
              {item.type === "article" && <FileText className="h-4 w-4 text-sky-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
