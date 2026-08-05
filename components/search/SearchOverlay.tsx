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

interface ApiSearchResult {
  id: string
  title: string
  url: string
  content?: string
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [facet, setFacet] = useState<SearchFacet>("all")
  const [results, setResults] = useState<ApiSearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    fetch(`/api/search?query=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResults(data)
        } else if (data && Array.isArray(data.results)) {
          setResults(data.results)
        } else {
          setResults([])
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setResults([])
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [query])

  const filteredResults = results.filter((item) => {
    if (facet === "all") return true
    if (facet === "modules") return !item.url.includes("candidate-intelligence")
    if (facet === "roles") return item.url.includes("candidate-intelligence")
    if (facet === "interview") return item.url.includes("interview-intelligence")
    if (facet === "resume") return item.url.includes("resume-intelligence")
    if (facet === "linkedin") return item.url.includes("linkedin-intelligence")
    if (facet === "recruiter") return item.url.includes("recruiter-intelligence")
    return true
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
              Searching Orama Index...
            </div>
          ) : query.trim() === "" ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              Type a search query to query the Knowledge OS Orama index.
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result, idx) => (
              <SearchResultItem
                key={result.id || idx}
                title={result.title}
                href={result.url}
                snippet={result.content}
                category={result.url.includes("candidate-intelligence") ? "Candidate Role" : "Documentation"}
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
