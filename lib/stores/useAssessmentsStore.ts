"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AssessmentResult {
  score: number
  passed: boolean
  completedAt: string
}

interface AssessmentsState {
  results: Record<string, AssessmentResult>
  streakDays: number
  recordResult: (assessmentId: string, score: number, passed: boolean) => void
}

export const useAssessmentsStore = create<AssessmentsState>()(
  persist(
    (set, get) => ({
      results: {},
      streakDays: 0,

      recordResult: (assessmentId, score, passed) => {
        set((state) => ({
          results: {
            ...state.results,
            [assessmentId]: {
              score,
              passed,
              completedAt: new Date().toISOString(),
            },
          },
          streakDays: passed ? Math.max(state.streakDays, 1) : state.streakDays,
        }))
      },
    }),
    {
      name: "spk-assessments-store",
    }
  )
)
