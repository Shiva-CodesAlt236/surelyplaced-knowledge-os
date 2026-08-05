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
    text: "Hello! I am your SurelyPlaced Knowledge OS Assistant. Ask me anything about candidate role profiles, closing frameworks, objection scripts, or recruiter screens.",
  },
]

export function AskAIPanel({ open, onOpenChange }: AskAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [scope, setScope] = useState<AIContextScope>("all")
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
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

    setTimeout(() => {
      let aiMsg: Message
      if (currentInput.toLowerCase().includes("aws") || currentInput.toLowerCase().includes("devops")) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Based on the AWS Cloud & DevOps Engineering Profile, key competencies include Kubernetes cluster management, Terraform IaC, AWS IAM policy design, and CI/CD pipeline automation.",
          citations: [
            {
              id: "c1",
              title: "AWS Cloud & DevOps Engineering Profile",
              href: "/docs/candidate-intelligence/cloud-devops",
              category: "Candidate Roles",
            },
          ],
        }
      } else if (currentInput.toLowerCase().includes("pricing") || currentInput.toLowerCase().includes("discount")) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Per the Closing & Negotiation Academy standard, never grant price concessions without securing a reciprocal commitment (e.g. multi-year term, upfront payment, or case study agreement).",
          citations: [
            {
              id: "c2",
              title: "Asking for the Commitment & Closing Techniques",
              href: "/docs/closing/asking-for-the-commitment",
              category: "Sales Academy",
            },
          ],
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
      setLoading(false)
    }, 600)
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
              Retrieving grounded answer...
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
