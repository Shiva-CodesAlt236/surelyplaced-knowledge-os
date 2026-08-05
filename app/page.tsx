import React from "react"
import { AppShell } from "@/components/layout/AppShell"
import { DashboardView } from "@/components/dashboard/DashboardView"

export default async function HomePage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  )
}
