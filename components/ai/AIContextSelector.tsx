"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

export type AIContextScope = "all" | "sales-academy" | "candidate-intelligence" | "recruiter-intelligence"

export interface AIContextSelectorProps {
  currentScope: AIContextScope
  onSelectScope: (scope: AIContextScope) => void
}

const scopes: { id: AIContextScope; label: string }[] = [
  { id: "all", label: "Entire Knowledge OS" },
  { id: "sales-academy", label: "Sales Academy" },
  { id: "candidate-intelligence", label: "Candidate Roles" },
  { id: "recruiter-intelligence", label: "Recruiter Intel" },
]

export function AIContextSelector({
  currentScope,
  onSelectScope,
}: AIContextSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
        <Filter className="h-3 w-3" />
        Scope:
      </span>
      {scopes.map((scope) => {
        const isSelected = currentScope === scope.id
        return (
          <button
            key={scope.id}
            onClick={() => onSelectScope(scope.id)}
            className="focus:outline-none"
          >
            <Badge
              variant={isSelected ? "accent" : "outline"}
              className="cursor-pointer text-[11px] py-0.5 px-2"
            >
              {scope.label}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
