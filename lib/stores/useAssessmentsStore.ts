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
  /** Calendar date (YYYY-MM-DD, local) of the most recent passed assessment. Drives the streak calculation below. */
  lastPassedDate: string | null
  recordResult: (assessmentId: string, score: number, passed: boolean) => void
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export const useAssessmentsStore = create<AssessmentsState>()(
  persist(
    (set, get) => ({
      results: {},
      streakDays: 0,
      lastPassedDate: null,

      recordResult: (assessmentId, score, passed) => {
        set((state) => {
          const results = {
            ...state.results,
            [assessmentId]: {
              score,
              passed,
              completedAt: new Date().toISOString(),
            },
          }

          if (!passed) {
            return { results }
          }

          // Milestone 4E, Priority 5: real consecutive-day streak
          // calculation, replacing `Math.max(state.streakDays, 1)`,
          // which could never exceed 1 regardless of how many days in
          // a row a learner passed a check. Passing again on the same
          // day the streak was already extended leaves it unchanged;
          // passing the day after the last pass extends it by one;
          // any other gap (or a first-ever pass) starts a new streak
          // at 1.
          const today = toDateKey(new Date())
          if (state.lastPassedDate === today) {
            return { results, streakDays: Math.max(state.streakDays, 1), lastPassedDate: today }
          }

          const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000))
          const nextStreak = state.lastPassedDate === yesterday ? state.streakDays + 1 : 1

          return { results, streakDays: nextStreak, lastPassedDate: today }
        })
      },
    }),
    {
      name: "spk-assessments-store",
    }
  )
)
