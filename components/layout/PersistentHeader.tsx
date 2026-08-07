'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Moon, Sun, Laptop, Search, Sparkles, GraduationCap,
  Menu, X, LayoutDashboard, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/useTheme'
import { useSearchStore } from '@/components/providers/SearchProvider'
import { useAIStore } from '@/components/providers/AIProvider'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { ThemePreference } from '@/types/layout'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { href: '/docs', label: 'Academy', id: 'academy', icon: BookOpen },
]

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
]

/**
 * Executive Persistent Header for SurelyPlaced OS
 * Features glassmorphic backdrop-blur, active navigation pills, brand identity badge,
 * and quick Cmd+K / Cmd+J access buttons.
 */
export function PersistentHeader() {
  const pathname = usePathname()
  const { preference, setPreference } = useTheme()
  const openSearch = useSearchStore((s) => s.open)
  const openAI = useAIStore((s) => s.open)
  const ActiveThemeIcon = THEME_OPTIONS.find((o) => o.value === preference)?.icon ?? Laptop
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sp-header sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-fd-border/80 bg-fd-background/85 px-4 sm:px-6 backdrop-blur-md supports-[backdrop-filter]:bg-fd-background/75">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-fd-muted-foreground hover:text-fd-foreground"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {/* Branding */}
      <Link href="/" className="flex items-center gap-2 font-semibold shrink-0 group">
        <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <GraduationCap className="size-4" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold text-fd-foreground tracking-tight">
            SurelyPlaced
          </span>
          <span className="hidden text-[11px] text-indigo-600 dark:text-indigo-400 sm:inline font-bold uppercase tracking-wider">
            Academy
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="ml-6 hidden md:flex items-center gap-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.id === 'academy'
              ? pathname.startsWith('/docs')
              : pathname === item.href

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-150',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs'
                  : 'text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground',
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </Link>
          )
        })}

        <div className="mx-2 h-4 w-px bg-fd-border/60" aria-hidden />

        <button
          type="button"
          onClick={openSearch}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-fd-muted-foreground transition-all duration-150 hover:bg-fd-accent/60 hover:text-fd-foreground"
        >
          <Search className="size-3.5 text-indigo-500/80" />
          <span>Search</span>
          <kbd className="ml-1 hidden lg:inline-flex h-5 items-center rounded border border-fd-border/80 bg-fd-secondary/80 px-1.5 text-[10px] font-mono text-fd-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={openAI}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-fd-muted-foreground transition-all duration-150 hover:bg-fd-accent/60 hover:text-fd-foreground"
        >
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Ask AI</span>
          <kbd className="ml-1 hidden lg:inline-flex h-5 items-center rounded border border-fd-border/80 bg-fd-secondary/80 px-1.5 text-[10px] font-mono text-fd-muted-foreground">
            ⌘J
          </kbd>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Change theme" className="text-fd-muted-foreground hover:text-fd-foreground">
              <ActiveThemeIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuLabel className="text-[10px] font-mono font-bold uppercase tracking-wider text-fd-muted-foreground">
              Theme Mode
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {THEME_OPTIONS.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => setPreference(option.value)} className="gap-2 text-xs font-medium">
                <option.icon className="size-3.5" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="absolute left-0 top-14 z-40 w-full border-b border-fd-border bg-fd-background/95 p-4 shadow-xl backdrop-blur-md md:hidden animate-in fade-in-0 slide-in-from-left">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive =
                item.id === 'academy'
                  ? pathname.startsWith('/docs')
                  : pathname === item.href

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      : 'text-fd-foreground hover:bg-fd-accent',
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}

            <div className="my-1.5 h-px bg-fd-border/60" />

            <button
              type="button"
              onClick={() => { openSearch(); setMobileOpen(false) }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-fd-foreground hover:bg-fd-accent"
            >
              <Search className="size-4 text-indigo-500" />
              Search Academy (Cmd+K)
            </button>

            <button
              type="button"
              onClick={() => { openAI(); setMobileOpen(false) }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-fd-foreground hover:bg-fd-accent"
            >
              <Sparkles className="size-4 text-amber-500" />
              Ask AI Coach (Cmd+J)
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
