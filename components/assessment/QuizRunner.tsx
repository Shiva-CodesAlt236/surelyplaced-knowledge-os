"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react"

export interface QuizQuestion {
  id: string
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
}

export interface QuizRunnerProps {
  quizTitle?: string
  moduleName?: string
  questions?: QuizQuestion[]
  passScorePercentage?: number
  onFinish?: (score: number) => void
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the mandatory first step when qualifying a DevOps candidate?",
    options: [
      { id: "a", text: "Verify hands-on experience with Kubernetes & IaC tools (Terraform/CloudFormation).", isCorrect: true },
      { id: "b", text: "Ask for target salary before evaluating technical skills.", isCorrect: false },
      { id: "c", text: "Check if they have a computer science degree.", isCorrect: false },
    ],
    explanation: "Candidate qualification starts with verifying real hands-on infrastructure-as-code and orchestration tools.",
  },
  {
    id: "q2",
    question: "When a prospect raises a budget objection, what should you do?",
    options: [
      { id: "a", text: "Offer a 20% discount immediately.", isCorrect: false },
      { id: "b", text: "Re-anchor on quantifiable business ROI and value trade-offs.", isCorrect: true },
      { id: "c", text: "End the call.", isCorrect: false },
    ],
    explanation: "Re-anchoring on quantifiable business ROI preserves margin and establishes value.",
  },
]

export function QuizRunner({
  quizTitle = "Module Competency Quiz",
  moduleName = "Candidate Intelligence Assessment",
  questions = defaultQuestions,
  passScorePercentage = 80,
  onFinish,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setFinished(true)
      if (onFinish) {
        onFinish(calculateScore())
      }
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q) => {
      const selectedId = selectedAnswers[q.id]
      const correctOption = q.options.find((o) => o.isCorrect)
      if (selectedId === correctOption?.id) {
        correct++
      }
    })
    return Math.round((correct / totalQuestions) * 100)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setFinished(false)
  }

  if (finished) {
    const finalScore = calculateScore()
    const passed = finalScore >= passScorePercentage

    return (
      <Card className="max-w-xl mx-auto my-6 border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-2">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-xl font-extrabold">{quizTitle} Results</CardTitle>
          <p className="text-xs text-muted-foreground">{moduleName}</p>
        </CardHeader>
        <CardContent className="text-center space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <span className="text-3xl font-black text-foreground">{finalScore}%</span>
            <div className="mt-1">
              <Badge variant={passed ? "success" : "destructive"}>
                {passed ? "PASSED" : "NEEDS RETAKE"}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {passed
              ? "Congratulations! You have demonstrated core competency for this module."
              : `Passing score is ${passScorePercentage}%. Review lesson content and try again.`}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRestart} className="gap-2 text-xs">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const selectedOptionId = selectedAnswers[currentQuestion.id]

  return (
    <Card className="max-w-2xl mx-auto my-6 border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <Badge variant="accent">{moduleName}</Badge>
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-base font-bold mt-2">
          {currentQuestion.question}
        </CardTitle>
        <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id
          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border bg-card hover:bg-accent/60"
              }`}
            >
              <span className="font-bold text-muted-foreground uppercase">{option.id}.</span>
              <span className="flex-1">{option.text}</span>
            </button>
          )
        })}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t border-border mt-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="text-xs"
        >
          Previous
        </Button>
        <Button
          size="sm"
          disabled={!selectedOptionId}
          onClick={handleNext}
          className="gap-1 text-xs"
        >
          <span>{currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
