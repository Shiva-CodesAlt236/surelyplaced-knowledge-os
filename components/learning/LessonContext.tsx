"use client"

import React, { createContext, useContext } from "react"

interface LessonContextValue {
  articleSlug: string
}

const LessonContext = createContext<LessonContextValue | null>(null)

export function LessonContextProvider({
  articleSlug,
  children,
}: {
  articleSlug: string
  children: React.ReactNode
}) {
  return (
    <LessonContext.Provider value={{ articleSlug }}>
      {children}
    </LessonContext.Provider>
  )
}

export function useLessonContext(): LessonContextValue | null {
  return useContext(LessonContext)
}
