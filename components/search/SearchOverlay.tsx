"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchFacetFilters, SearchFacet } from "@/components/search/SearchFacetFilters"
import { SearchResultItem } from "@/components/search/SearchResultItem"
import { Search, Loader2 } from "lucide-react"

export interface SearchOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResult {
  id: string
  title: string
  href: string
  snippet: string
  category: string
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "AWS Cloud & DevOps Engineering Profile",
    href: "/docs/candidate-intelligence/cloud-devops",
    snippet: "Deep dive into AWS Cloud Architects, DevOps Engineers, Kubernetes operators, and Terraform infrastructure candidates.",
    category: "Candidate Roles",
  },
  {
    id: "2",
    title: "Asking for the Commitment & Closing Techniques",
    href: "/docs/closing/asking-for-the-commitment",
    snippet: "Learn closing frameworks, trial closes, decision-maker alignment, and contract execution scripts.",
    category: "Sales Academy",
  },
  {
    id: "3",
    title: "Technical Recruiter Screen Scripts",
    href: "/docs/recruiter-intelligence/screener-call-script",
    snippet: "Standardized screener questions, candidate qualification benchmarks, and compensation expectation probes.",
    category: "Recruiter Intel",
  },
  {
    id: "4",
    title: "LinkedIn Executive Brand Audit Framework",
    href: "/docs/linkedin-intelligence/profile-audit-framework",
    snippet: "Step-by-step executive profile optimization, headline formulas, and experience section storytelling.",
    category: "LinkedIn Intel",
  },
]

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [facet, setFacet] = useState<SearchFacet>("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      setLoading(true)
      const timer = setTimeout(() => setLoading(false), 200)
      return () => clearTimeout(timer)
    }
  }, [query, facet])

  const filteredResults = mockResults.filter((item) => {
    if (!query) return true
    return item.title.toLowerCase().includes(query.toLowerCase()) ||
           item.snippet.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="sr-only">Search SurelyPlaced Knowledge OS</DialogTitle>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, candidate roles, scripts, or objection handlers..."
              className="pl-9 pr-4 h-11 border-none shadow-none focus-visible:ring-0 text-base"
              autoFocus
            />
          </div>
          <div className="pt-2">
            <SearchFacetFilters selectedFacet={facet} onSelectFacet={setFacet} />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Searching Knowledge OS...
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <SearchResultItem
                key={result.id}
                title={result.title}
                href={result.href}
                snippet={result.snippet}
                category={result.category}
                onClick={() => onOpenChange(false)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No results found for &ldquo;<span className="text-foreground font-medium">{query}</span>&rdquo;.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
