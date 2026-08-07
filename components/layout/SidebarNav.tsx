'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProgressStore } from '@/lib/stores/useProgressStore'
import { ACADEMY_LESSON_SEQUENCE } from '@/lib/academy-sequence'
import {
  BookOpen, FileText, Shield, LayoutTemplate,
  Target, Bot, BarChart2, Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarCategory {
  label: string
  items: {
    href: string
    label: string
    icon: React.ElementType
    enabled: boolean
  }[]
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    label: 'LEARN',
    items: [
      { href: '/docs', label: 'Academy Home', icon: BookOpen, enabled: true },
    ],
  },
  {
    label: 'EXECUTE',
    items: [
      { href: '/docs/scripts', label: 'Scripts Library', icon: FileText, enabled: true },
      { href: '#', label: 'Objection Library', icon: Shield, enabled: false },
      { href: '#', label: 'Playbooks', icon: LayoutTemplate, enabled: false },
    ],
  },
  {
    label: 'IMPROVE',
    items: [
      { href: '#', label: 'Roleplay', icon: Target, enabled: false },
      { href: '#', label: 'AI Coach', icon: Bot, enabled: false },
    ],
  },
  {
    label: 'TRACK',
    items: [
      { href: '#', label: 'Progress', icon: BarChart2, enabled: false },
      { href: '#', label: 'Certification', icon: Award, enabled: false },
    ],
  },
]

/**
 * Executive Sidebar Banner Navigation
 * Features uppercase category labels, active indicator pill, progress counter, and "Soon" badges.
 */
export function SidebarNav() {
  const pathname = usePathname()
  const completedSlugs = useProgressStore((s) => s.completedSlugs)
  const completedCount = completedSlugs.length
  const totalLessons = ACADEMY_LESSON_SEQUENCE.length

  return (
    <div className="space-y-3 pb-3 border-b border-fd-border/70 mb-3 px-1">
      {SIDEBAR_CATEGORIES.map((category) => (
        <div key={category.label}>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-fd-muted-foreground/80">
              {category.label}
            </span>
            {category.label === 'LEARN' && completedCount > 0 && (
              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {completedCount}/{totalLessons} Done
              </span>
            )}
          </div>
          <div className="space-y-0.5">
            {category.items.map((item) => {
              const Icon = item.icon
              const isActive = item.enabled && (pathname === item.href || (item.href === '/docs' && pathname === '/docs'))

              if (!item.enabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-fd-muted-foreground/40 cursor-default select-none"
                  >
                    <Icon className="size-3.5 opacity-40 shrink-0" />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded bg-fd-secondary/80 border border-fd-border/40 px-1.5 py-0.5 text-[9px] font-mono font-semibold leading-none text-fd-muted-foreground/60">
                      Soon
                    </span>
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold transition-all duration-150',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs'
                      : 'text-fd-foreground hover:bg-fd-accent/70 hover:text-fd-accent-foreground',
                  )}
                >
                  <Icon className="size-3.5 text-indigo-500 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
