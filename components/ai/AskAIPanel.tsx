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
import { AICitationItem, Citation } from "@/components/ai/AICitationItem"
import { AIContextSelector, AIContextScope } from "@/components/ai/AIContextSelector"
import { Sparkles, Send, Bot, User, ShieldAlert, Loader2 } from "lucide-react"

export interface AskAIPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  citations?: Citation[]
  isRefusal?: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! I am your SurelyPlaced Knowledge OS Copilot. Ask me questions about candidate role profiles, closing frameworks, objection scripts, or recruiter screens. All answers are strictly grounded in repository documentation.",
  },
]

export function AskAIPanel({ open, onOpenChange }: AskAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [scope, setScope] = useState<AIContextScope>("all")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    }
    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(currentInput)}`)
      const data = await res.json()
      const searchResults: { title: string; url: string; content?: string }[] = Array.isArray(data)
        ? data
        : data?.results || []

      // Filter search results based on selected scope
      const scopedResults = searchResults.filter((item) => {
        if (scope === "all") return true
        if (scope === "sales-academy") return !item.url.includes("candidate-intelligence")
        if (scope === "candidate-intelligence") return item.url.includes("candidate-intelligence")
        if (scope === "recruiter-intelligence") return item.url.includes("recruiter-intelligence")
        return true
      })

      let aiMsg: Message

      if (scopedResults.length > 0) {
        const topDoc = scopedResults[0]
        const citations: Citation[] = scopedResults.slice(0, 3).map((item, idx) => ({
          id: `c-${idx}`,
          title: item.title,
          href: item.url,
          category: item.url.includes("candidate-intelligence") ? "Candidate Role" : "Sales Academy",
          snippet: item.content,
        }))

        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `Based on your query, the Knowledge OS documentation for "${topDoc.title}" provides the authoritative guidelines for this topic. ${
            topDoc.content ? `Key excerpt: "${topDoc.content.slice(0, 180)}..."` : ""
          }`,
          citations,
        }
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I am strictly grounded in SurelyPlaced Knowledge OS documentation. Your query contains concepts not found in current modules. Please consult Sales Leadership or rephrase your prompt.",
          isRefusal: true,
        }
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I am strictly grounded in SurelyPlaced Knowledge OS documentation. Unable to retrieve search index context at this moment.",
          isRefusal: true,
        },
      ])
    } finally {
      setLoading(false)
    }
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
              <p className="text-xs text-muted-foreground">Grounded Knowledge OS Copilot</p>
            </div>
          </div>
          <div className="pt-2">
            <AIContextSelector currentScope={scope} onSelectScope={setScope} />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : msg.isRefusal
                    ? "bg-amber-500/20 text-amber-600"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : msg.isRefusal ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] space-y-2 rounded-lg p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : msg.isRefusal
                    ? "bg-amber-500/10 border border-amber-500/20 text-foreground"
                    : "bg-secondary/60 border border-border text-foreground"
                }`}
              >
                <p>{msg.text}</p>

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
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Retrieving grounded answer from Orama...
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
            <Button type="submit" size="sm" disabled={!input.trim() || loading} className="h-9 px-3">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
