"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ModuleOption {
  id: string
  name: string
  shortName: string
  count: number
}

export interface ModuleSelectorProps {
  modules: ModuleOption[]
  activeModuleId: string
  onSelectModule: (moduleId: string) => void
}

export function ModuleSelector({
  modules,
  activeModuleId,
  onSelectModule,
}: ModuleSelectorProps) {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % modules.length
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + modules.length) % modules.length
    } else if (e.key === "Home") {
      nextIndex = 0
    } else if (e.key === "End") {
      nextIndex = modules.length - 1
    } else {
      return
    }

    e.preventDefault()
    onSelectModule(modules[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
          Select Module
        </span>
        <span className="text-xs text-fd-muted-foreground">
          Showing 1 module at a time
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Sales Academy Modules"
        className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-fd-border/80 bg-fd-card/60 backdrop-blur-xs"
      >
        {modules.map((mod, idx) => {
          const isActive = mod.id === activeModuleId

          return (
            <button
              key={mod.id}
              ref={(el) => {
                tabRefs.current[idx] = el
              }}
              role="tab"
              type="button"
              id={`tab-${mod.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${mod.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectModule(mod.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fd-ring focus:ring-offset-1 select-none",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-500/20 border border-indigo-500/30 font-bold"
                  : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 border border-transparent"
              )}
            >
              <span>{mod.shortName || mod.name}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "px-1.5 py-0 text-[10px] font-extrabold h-4 min-w-5 justify-center",
                  isActive
                    ? "bg-white/20 text-white border-white/20"
                    : "text-fd-muted-foreground border-fd-border"
                )}
              >
                {mod.count}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
