"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type SearchFacet = "all" | "modules" | "roles" | "interview" | "resume" | "linkedin" | "recruiter"

export interface SearchFacetFiltersProps {
  selectedFacet: SearchFacet
  onSelectFacet: (facet: SearchFacet) => void
}

const facets: { id: SearchFacet; label: string }[] = [
  { id: "all", label: "All Content" },
  { id: "modules", label: "Sales Academy" },
  { id: "roles", label: "Candidate Roles" },
  { id: "interview", label: "Interview Intel" },
  { id: "resume", label: "Resume Intel" },
  { id: "linkedin", label: "LinkedIn Intel" },
  { id: "recruiter", label: "Recruiter Intel" },
]

export function SearchFacetFilters({
  selectedFacet,
  onSelectFacet,
}: SearchFacetFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {facets.map((facet) => {
        const isSelected = selectedFacet === facet.id
        return (
          <button
            key={facet.id}
            onClick={() => onSelectFacet(facet.id)}
            className="focus:outline-none"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap transition-colors text-xs py-1 px-2.5",
                !isSelected && "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              )}
            >
              {facet.label}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
