"use client"

import React, { useState, useEffect } from "react"
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
import { CopilotInput } from "@/components/copilot/CopilotInput"
import { CopilotResponseCard } from "@/components/copilot/CopilotResponseCard"
import { OutcomeRecorder } from "@/components/copilot/OutcomeRecorder"
import type { CopilotResponse, OutcomeStatus, LostReason } from "@/lib/copilot/types"
import {
  SESSION_STORAGE_KEY,
  isStaleSessionError,
} from "@/lib/copilot/session"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  MessageSquare,
  Headphones,
  AlertCircle,
  RefreshCw,
  UserCheck,
  LogOut,
} from "lucide-react"

export interface AskAIPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AskAIPanel({ open, onOpenChange }: AskAIPanelProps) {
  // Mode selection: 'copilot' (Sales Copilot MVP) | 'qa' (General Knowledge Assistant)
  const [mode, setMode] = useState<"copilot" | "qa">("copilot")

  // General Q&A state from useAIStore
  const messages = useAIStore((state) => state.messages)
  const isResponding = useAIStore((state) => state.isResponding)
  const sendMessage = useAIStore((state) => state.sendMessage)
  const [qaInput, setQaInput] = useState("")

  // Sales Copilot State
  const [copilotResponse, setCopilotResponse] = useState<CopilotResponse | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [lastInput, setLastInput] = useState<string>("")

  // Phase 6A: authenticated advisor identity (Level C). Replaces the former
  // self-entered/localStorage advisor attribution — identity now comes exclusively
  // from the server-verified Auth.js session; the client never supplies or edits it.
  const { data: session, status: sessionStatus } = useSession()
  const advisorEmail = session?.user?.email || null

  // Shared session boundary reset helper
  const clearCopilotSessionBoundary = () => {
    setCopilotResponse(null)
    setAnalysisError(null)
    setSessionId(null)
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Ignore sessionStorage write error
    }
  }

  // Initialize Session ID from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (storedSession) {
          setSessionId(storedSession)
        }
      } catch (err) {
        console.error("[AskAIPanel] Storage initialization error:", err)
      }
    }
  }, [])

  const handleSendQA = () => {
    if (!qaInput.trim() || isResponding) return
    sendMessage(qaInput.trim())
    setQaInput("")
  }

  const handleAnalyzeObjection = async (input: string, isRetryAfterStaleSession = false) => {
    setIsAnalyzing(true)
    setAnalysisError(null)
    setLastInput(input)

    const activeSessionId = isRetryAfterStaleSession ? undefined : sessionId || undefined

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectionText: input,
          sessionId: activeSessionId,
          previousObjectionId: copilotResponse?.objectionId,
        }),
      })

      if (res.ok) {
        const data: CopilotResponse = await res.json()
        setCopilotResponse(data)

        // Only update active sessionId if DB persistence succeeded
        if (data.persistenceStatus === "persisted" && data.sessionId) {
          setSessionId(data.sessionId)
          try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, data.sessionId)
          } catch {
            // Ignore
          }
        }
      } else {
        const errorData = await res.json().catch(() => ({}))

        // Check if error is due to a stale or completed session
        if (!isRetryAfterStaleSession && isStaleSessionError(res.status, errorData.error)) {
          console.warn("[AskAIPanel] Stale session detected. Resetting session boundary and retrying once...")
          clearCopilotSessionBoundary()
          // Retry ONCE without sessionId to create a fresh active session
          return await handleAnalyzeObjection(input, true)
        }

        setAnalysisError(errorData.error || "Unable to analyze objection. Please try again.")
        setCopilotResponse(null)
      }
    } catch (err) {
      console.error("[Sales Copilot] Analysis network error:", err)
      setAnalysisError("Unable to reach Sales Copilot. Please try again.")
      setCopilotResponse(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStartNewConversation = () => {
    clearCopilotSessionBoundary()
  }

  const handleSaveOutcome = async (outcome: OutcomeStatus, reason?: LostReason) => {
    if (copilotResponse?.persistenceStatus === "not-persisted") {
      throw new Error("Outcome tracking unavailable because this response was not saved.")
    }

    const activeSessionId = copilotResponse?.sessionId || sessionId
    const activeExchangeId = copilotResponse?.exchangeId

    // Try persistence endpoint first
    const res = await fetch("/api/copilot/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: activeSessionId || undefined,
        exchangeId: activeExchangeId || undefined,
        outcome,
        reason,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || "Could not save outcome to database.")
    }

    const data = await res.json()
    if (!data || data.success !== true) {
      throw new Error("Database reported error saving outcome.")
    }

    // Lifecycle rules:
    // If enrolled or lost: Session completed -> clear sessionId & sessionStorage for next conversation
    // If follow-up: Session remains active -> keep sessionId & sessionStorage intact
    if (outcome === "enrolled" || outcome === "lost") {
      clearCopilotSessionBoundary()
    }
  }

  const handleFeedback = async (rating: "thumbs-up" | "neutral" | "thumbs-down") => {
    if (!copilotResponse?.exchangeId || copilotResponse?.persistenceStatus === "not-persisted") {
      throw new Error("Feedback unavailable because this response was not saved.")
    }

    const res = await fetch("/api/copilot/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exchangeId: copilotResponse.exchangeId,
        rating,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || "Could not save feedback rating.")
    }

    const data = await res.json()
    if (!data || data.success !== true) {
      throw new Error("Database error saving feedback.")
    }
  }

  const isPersisted = copilotResponse?.persistenceStatus !== "not-persisted" && Boolean(copilotResponse?.exchangeId || sessionId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full border-l border-border">
        {/* Header & Mode Switcher */}
        <SheetHeader className="p-4 border-b border-border bg-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold">AI Sales Assistant</SheetTitle>
                <p className="text-xs text-muted-foreground">SurelyPlaced Knowledge OS</p>
              </div>
            </div>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● Guided Mode
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex rounded-md bg-muted p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("copilot")}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                mode === "copilot"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              Sales Copilot
            </button>

            <button
              type="button"
              onClick={() => setMode("qa")}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                mode === "qa"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              General Q&amp;A
            </button>
          </div>
        </SheetHeader>

        {/* Panel Body */}
        {mode === "copilot" ? (
          /* ===================================================================
             SALES COPILOT MVP MODE (Guided Decision-Support Tool)
             =================================================================== */
          <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
            {/* Phase 6A: Authenticated Advisor Identity (Level C). Sign-in is
                required to attribute and persist Copilot activity; identity comes
                exclusively from the verified Google Workspace session and cannot
                be edited client-side. */}
            {sessionStatus === "loading" ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Checking sign-in status...</span>
              </div>
            ) : advisorEmail ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs">
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Advisor:</span>
                  <strong className="text-foreground font-bold">{advisorEmail}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Sign In Required</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Sign in with your SurelyPlaced Google Workspace account to use Sales Copilot.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => signIn("google")}
                  className="h-8 text-xs font-bold px-3"
                >
                  Sign in with Google
                </Button>
              </div>
            )}

            <CopilotInput
              onAnalyze={handleAnalyzeObjection}
              onClear={handleStartNewConversation}
              isAnalyzing={isAnalyzing}
              hasActiveSession={Boolean(sessionId || copilotResponse)}
            />

            {isAnalyzing && (
              <div className="text-center py-6 space-y-2">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">
                  Classifying objection &amp; retrieving approved script...
                </p>
              </div>
            )}

            {/* Error State Banner */}
            {analysisError && !isAnalyzing && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Analysis Error</span>
                </div>
                <p className="text-xs text-foreground">{analysisError}</p>
                {lastInput && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnalyzeObjection(lastInput)}
                    className="h-7 text-xs font-bold gap-1 mt-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry Analysis
                  </Button>
                )}
              </div>
            )}

            {copilotResponse && !isAnalyzing && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <CopilotResponseCard response={copilotResponse} />
                {!copilotResponse.isRefusal && (
                  <OutcomeRecorder
                    onSaveOutcome={handleSaveOutcome}
                    onFeedback={handleFeedback}
                    isPersisted={isPersisted}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          /* ===================================================================
             GENERAL Q&A MODE (General Knowledge Assistant)
             =================================================================== */
          <>
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
                            Sources &amp; Citations:
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
                  handleSendQA()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="Ask about candidates, closing, objection scripts..."
                  className="flex-1 text-xs h-9"
                />
                <Button type="submit" size="sm" disabled={!qaInput.trim() || isResponding} className="h-9 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
