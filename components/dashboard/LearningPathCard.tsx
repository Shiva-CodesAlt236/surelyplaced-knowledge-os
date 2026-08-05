"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Compass, CheckCircle2, ChevronRight } from "lucide-react"

export interface LearningPathCardProps {
  id?: string
  title?: string
  description?: string
  completedSteps?: number
  totalSteps?: number
  badgeText?: string
  href?: string
}

export function LearningPathCard({
  title = "Career Advisor Foundations",
  description = "Complete onboarding path covering Candidate Intelligence, Resume Audits, & Recruiter Scripts.",
  completedSteps = 8,
  totalSteps = 12,
  badgeText = "Assigned Path",
  href = "/docs/candidate-intelligence/cloud-devops",
}: LearningPathCardProps) {
  const percentage = Math.round((completedSteps / totalSteps) * 100)

  return (
    <Card className="group hover:border-primary/50 transition-all duration-200 cursor-pointer">
      <Link href={href} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="info" className="gap-1">
              <Compass className="h-3 w-3" />
              {badgeText}
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
              View Path <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <CardTitle className="mt-2 text-base font-bold group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-xs line-clamp-2 mt-1">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {completedSteps} of {totalSteps} steps completed
            </span>
            <span className="font-mono font-bold text-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </CardContent>
      </Link>
    </Card>
  )
}
