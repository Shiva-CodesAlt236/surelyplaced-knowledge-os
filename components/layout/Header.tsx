'use client';

import Link from 'next/link';
import { Menu, Moon, Sun, Laptop, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { TopNavigation } from './TopNavigation';
import { ROUTES } from '@/lib/routes';
import type { ThemePreference } from '@/types/layout';

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
];

/**
 * The shell's persistent top bar, per docs/APP_LAYOUT_SPEC.md's
 * Header entry: hosts Top Navigation and the account menu, and on
 * mobile, the Sidebar drawer toggle.
 */
export function Header() {
  const { toggleMobile } = useSidebar();
  const { preference, setPreference } = useTheme();
  const ActiveThemeIcon = THEME_OPTIONS.find((option) => option.value === preference)?.icon ?? Laptop;

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-fd-border bg-fd-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-fd-background/80">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={toggleMobile}
      >
        <Menu />
      </Button>

      <Link href={ROUTES.dashboard} className="flex items-center gap-2 font-semibold">
        <span className="bg-gradient-to-r from-fd-primary to-fd-primary/60 bg-clip-text text-transparent">
          Surely Placed
        </span>
        <span className="hidden text-fd-muted-foreground sm:inline">Knowledge OS</span>
      </Link>

      <TopNavigation className="ml-6 hidden md:flex" />

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Change theme">
              <ActiveThemeIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {THEME_OPTIONS.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => setPreference(option.value)}>
                <option.icon className="size-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Account menu">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings}>
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.auth.logout}>
                <LogOut className="size-4" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
