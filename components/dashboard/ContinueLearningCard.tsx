"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MetricEmptyState } from "@/components/dashboard/MetricEmptyState"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { BookOpen, ArrowRight, Clock, Compass } from "lucide-react"

export function ContinueLearningCard() {
  const lastActiveArticle = useProgressStore((s) => s.lastActiveArticle)

  if (!lastActiveArticle) {
    return (
      <MetricEmptyState
        icon={Compass}
        title="No Active Learning Session"
        description="Select any lesson from the Sales Academy or Candidate Intelligence collections to begin tracking your active progress."
        actionLabel="Explore Modules"
        onAction={() => {
          window.location.href = "/docs/candidate-intelligence/cloud-devops"
        }}
      />
    )
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BookOpen className="h-24 w-24 text-primary" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="accent" className="font-medium">
            Active Lesson
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {lastActiveArticle.estimatedTimeLeft}
          </span>
        </div>
        <CardTitle className="mt-2 text-xl font-bold text-foreground line-clamp-1">
          {lastActiveArticle.title}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {lastActiveArticle.moduleName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Current Module Progress</span>
          <span className="font-mono text-primary font-bold">{lastActiveArticle.progressPercentage}%</span>
        </div>
        <Progress value={lastActiveArticle.progressPercentage} className="h-2.5" />
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={lastActiveArticle.href} className="w-full">
          <Button className="w-full gap-2 shadow-sm">
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
