"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Save, Trash2, Lock } from "lucide-react"
import { useNotesStore } from "@/lib/stores/useNotesStore"

export interface NotesPanelProps {
  articleSlug: string
}

export function NotesPanel({ articleSlug }: NotesPanelProps) {
  const { getNote, saveNote, deleteNote } = useNotesStore()
  const [note, setNote] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setNote(getNote(articleSlug))
  }, [articleSlug, getNote])

  const handleSave = () => {
    saveNote(articleSlug, note)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    deleteNote(articleSlug)
    setNote("")
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Personal Lesson Notes
          </CardTitle>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> Private to you
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Record key takeaways, interview soundbites, or objection scripts for reference..."
          rows={4}
          className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground resize-y"
        />
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={!note}
          className="h-8 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!note || saved}
          className="h-8 text-xs gap-1"
        >
          <Save className="h-3.5 w-3.5" />
          {saved ? "Saved!" : "Save Note"}
        </Button>
      </CardFooter>
    </Card>
  )
}
