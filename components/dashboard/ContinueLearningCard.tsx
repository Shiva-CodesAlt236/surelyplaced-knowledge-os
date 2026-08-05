"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, Clock } from "lucide-react"

export interface ContinueLearningCardProps {
  title?: string
  moduleTitle?: string
  href?: string
  progressPercentage?: number
  estimatedTimeLeft?: string
  category?: string
}

export function ContinueLearningCard({
  title = "Asking for the Commitment & Closing Techniques",
  moduleTitle = "Closing & Negotiation Academy",
  href = "/docs/closing/asking-for-the-commitment",
  progressPercentage = 65,
  estimatedTimeLeft = "12 min remaining",
  category = "Sales Academy",
}: ContinueLearningCardProps) {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BookOpen className="h-24 w-24 text-primary" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="accent" className="font-medium">
            {category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {estimatedTimeLeft}
          </span>
        </div>
        <CardTitle className="mt-2 text-xl font-bold text-foreground line-clamp-1">
          {title}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {moduleTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Current Module Progress</span>
          <span className="font-mono text-primary font-bold">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2.5" />
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={href} className="w-full">
          <Button className="w-full gap-2 shadow-sm">
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
