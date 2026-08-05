"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AICitationItem } from "@/components/ai/AICitationItem"
import { useAIStore } from "@/components/providers/AIProvider"
import { Sparkles, Send, Bot, User, ShieldAlert, Loader2 } from "lucide-react"

export interface AskAIPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Milestone 4E, Priority 2: purely presentational consumer of
 * `components/providers/AIProvider.tsx`'s `useAIStore` — the single Ask
 * AI system for the application. Previously this component kept its
 * own local message state and, on every submission, fetched
 * `/api/search` and stitched the top result into an answer-shaped
 * sentence ("Based on your query, the Knowledge OS documentation for
 * X provides the authoritative guidelines...") presented as if it were
 * a generated, grounded answer. That was a fabrication: it was a
 * templated re-statement of a keyword search result, not an AI
 * response. This component no longer calls any API and no longer
 * constructs any answer text itself — `sendMessage` (in the store) is
 * the only place a reply is produced, and it always returns the same
 * honest status notice, "Grounded retrieval not yet connected.", until
 * a real retrieval pipeline exists.
 */
export function AskAIPanel({ open, onOpenChange }: AskAIPanelProps) {
  const messages = useAIStore((state) => state.messages)
  const isResponding = useAIStore((state) => state.isResponding)
  const sendMessage = useAIStore((state) => state.sendMessage)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim() || isResponding) return
    sendMessage(input.trim())
    setInput("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full border-l border-border">
        <SheetHeader className="p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">AI Assistant</SheetTitle>
              <p className="text-xs text-muted-foreground">Knowledge OS Copilot</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
          {messages.length === 0 && (
            <div className="text-center py-10 text-xs text-muted-foreground px-4">
              Ask a question below. This assistant is not yet connected to a grounded
              retrieval pipeline over the Knowledge OS documentation, so it will
              confirm that rather than generate an answer.
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user"
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] space-y-2 rounded-lg p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-amber-500/10 border border-amber-500/20 text-foreground"
                  }`}
                >
                  <p>{msg.content}</p>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-border/50 space-y-1.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Sources & Citations:
                      </span>
                      {msg.citations.map((c) => (
                        <AICitationItem key={c.id} citation={c} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {isResponding && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <Bot className="h-4 w-4" />
              Checking retrieval status...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidates, closing, objection scripts..."
              className="flex-1 text-xs h-9"
            />
            <Button type="submit" size="sm" disabled={!input.trim() || isResponding} className="h-9 px-3">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
