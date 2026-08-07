import type { Metadata } from "next"
import { ScriptsLibraryView } from "@/components/scripts/ScriptsLibraryView"

export const metadata: Metadata = {
  title: "Scripts Library | SurelyPlaced OS",
  description:
    "Comprehensive repository of 376 verbatim sales scripts, roleplay scenarios, objection handling scripts, practice exercises, and quick reference panels.",
}

export default function ScriptsLibraryPage() {
  return (
    <main className="container max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <ScriptsLibraryView />
    </main>
  )
}
