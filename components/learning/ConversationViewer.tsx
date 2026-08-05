"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Phone, PhoneOff, Clock, Smile, Meh, Frown, AlertCircle,
  Globe, Briefcase, BarChart2, Pause, ChevronDown, Linkedin, PhoneCall, PhoneIncoming, PhoneOutgoing,
} from "lucide-react"

export type CandidateMood = "positive" | "neutral" | "hesitant" | "resistant"
export type AppearanceMode = "chat" | "phone" | "whatsapp" | "cold-call" | "linkedin"
export type CallDirection = "inbound" | "outbound"

export interface ChatMessage {
  sender: "rep" | "candidate"
  name?: string
  text: string
  annotation?: string
  mood?: CandidateMood
  typing?: boolean
  pauseAfter?: boolean
  timestamp?: string
}

export interface ConversationViewerProps {
  messages: ChatMessage[]
  repName?: string
  candidateName?: string
  /** Visual appearance mode: chat (default), phone, whatsapp, cold-call, linkedin. */
  appearance?: AppearanceMode
  callDirection?: CallDirection
  callDuration?: string
  candidateMood?: CandidateMood
  visaStatus?: string
  leadSource?: string
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  expectedOutcome?: string
  highlightUpTo?: number
  autoReveal?: boolean
}

const moodConfig: Record<CandidateMood, { icon: React.ElementType; label: string; className: string }> = {
  positive:  { icon: Smile,       label: "Positive",  className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
  neutral:   { icon: Meh,         label: "Neutral",   className: "text-sky-600 dark:text-sky-400 bg-sky-500/15 border-sky-500/20" },
  hesitant:  { icon: AlertCircle, label: "Hesitant",  className: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/20" },
  resistant: { icon: Frown,       label: "Resistant", className: "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/20" },
}

const diffColors: Record<string, string> = {
  Foundational:  "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
  Intermediate:  "text-sky-600 dark:text-sky-400 bg-sky-500/15 border-sky-500/20",
  Advanced:      "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/20",
  Expert:        "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/20",
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-fd-muted-foreground/60"
          style={{
            animation: "cv-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

function MoodBadge({ mood }: { mood: CandidateMood }) {
  const cfg = moodConfig[mood]
  const Icon = cfg.icon
  return (
    <Badge className={cn("gap-1 border text-[10px]", cfg.className)}>
      <Icon className="size-2.5" />
      {cfg.label}
    </Badge>
  )
}

export function ConversationViewer({
  messages,
  repName = "Sales Executive",
  candidateName = "Candidate",
  appearance = "chat",
  callDirection = "outbound",
  callDuration,
  candidateMood,
  visaStatus,
  leadSource,
  difficulty,
  expectedOutcome,
  highlightUpTo,
  autoReveal = false,
}: ConversationViewerProps) {
  const [revealedCount, setRevealedCount] = useState(autoReveal ? 1 : messages.length)
  const [showAll, setShowAll] = useState(!autoReveal)
  const [typing, setTyping] = useState(autoReveal)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoReveal || showAll) return
    if (revealedCount >= messages.length) {
      setTyping(false)
      return
    }
    const msg = messages[revealedCount]
    const delay = msg?.typing === false ? 300 : 1200
    setTyping(true)
    const timer = setTimeout(() => {
      setTyping(false)
      setRevealedCount((c) => c + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [autoReveal, showAll, revealedCount, messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [revealedCount])

  const handleShowAll = () => {
    setShowAll(true)
    setRevealedCount(messages.length)
    setTyping(false)
  }

  const visibleMessages = showAll ? messages : messages.slice(0, revealedCount)
  const isPhone = appearance === "phone" || appearance === "cold-call"
  const isWhatsApp = appearance === "whatsapp"
  const isLinkedIn = appearance === "linkedin"
  const isColdCall = appearance === "cold-call"

  const hasMeta = candidateMood || visaStatus || leadSource || difficulty || expectedOutcome

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-fd-border shadow-sm">
      <style>{`@keyframes cv-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}`}</style>

      {/* Header bar */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 border-b border-fd-border px-4 py-2.5",
          isPhone && !isColdCall && "bg-fd-secondary",
          isColdCall && "bg-amber-500/10 border-amber-500/30",
          isWhatsApp && "bg-emerald-700 dark:bg-emerald-900 text-white",
          isLinkedIn && "bg-sky-700 dark:bg-sky-900 text-white",
          !isPhone && !isWhatsApp && !isLinkedIn && "bg-fd-card"
        )}
      >
        {isColdCall ? (
          <Badge variant="accent" className="gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]">
            <PhoneCall className="size-3" /> Cold Call
          </Badge>
        ) : isLinkedIn ? (
          <Linkedin className="size-4 text-white" />
        ) : isWhatsApp ? (
          <Phone className="size-4 text-white" />
        ) : (
          <Phone className="size-4 text-emerald-500" />
        )}

        <span className={cn(
          "text-sm font-semibold",
          isWhatsApp || isLinkedIn ? "text-white" : "text-fd-foreground"
        )}>
          {repName}
          <span className={cn(
            "mx-1.5",
            isWhatsApp || isLinkedIn ? "text-white/60" : "text-fd-muted-foreground"
          )}>↔</span>
          {candidateName}
        </span>

        {callDirection && (
          <span className={cn(
            "flex items-center gap-1 text-[10px] font-mono",
            isWhatsApp || isLinkedIn ? "text-white/80" : "text-fd-muted-foreground"
          )}>
            {callDirection === "outbound" ? (
              <><PhoneOutgoing className="size-2.5" /> Outbound</>
            ) : (
              <><PhoneIncoming className="size-2.5" /> Inbound</>
            )}
          </span>
        )}

        {callDuration && (
          <Badge variant="outline" className={cn("ml-auto gap-1 font-mono text-[10px]", isWhatsApp || isLinkedIn ? "border-white/30 text-white" : "")}>
            <Clock className="size-3" />
            {callDuration}
          </Badge>
        )}
      </div>

      {/* Metadata badges */}
      {hasMeta && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-fd-border px-4 py-2 bg-fd-card/60">
          {difficulty && (
            <Badge className={cn("gap-1 border text-[10px]", diffColors[difficulty] ?? diffColors.Intermediate)}>
              <BarChart2 className="size-2.5" />
              {difficulty}
            </Badge>
          )}
          {candidateMood && <MoodBadge mood={candidateMood} />}
          {visaStatus && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Globe className="size-2.5" />
              {visaStatus}
            </Badge>
          )}
          {leadSource && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Briefcase className="size-2.5" />
              {leadSource}
            </Badge>
          )}
          {expectedOutcome && (
            <span className="ml-auto text-[10px] font-medium text-fd-muted-foreground">
              Expected: <span className="text-fd-foreground">{expectedOutcome}</span>
            </span>
          )}
        </div>
      )}

      {/* Message area */}
      <div
        className={cn(
          "space-y-3 p-4",
          isWhatsApp && "bg-[#e5ddd5] dark:bg-[#0b1419]",
          isLinkedIn && "bg-sky-50/50 dark:bg-sky-950/20",
          isPhone && "bg-fd-background",
          !isPhone && !isWhatsApp && !isLinkedIn && "bg-fd-card"
        )}
        role="log"
        aria-label="Sales conversation"
      >
        {visibleMessages.map((msg, i) => {
          const isRep = msg.sender === "rep"
          const dimmed = typeof highlightUpTo === "number" && i > highlightUpTo

          return (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "flex gap-2",
                  isRep ? "justify-start" : "justify-end",
                  dimmed && "opacity-40",
                )}
              >
                {isRep && (
                  <div
                    className={cn(
                      "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                      isLinkedIn ? "bg-sky-600" : "bg-fd-primary"
                    )}
                    aria-hidden
                  >
                    {(msg.name ?? repName).charAt(0)}
                  </div>
                )}

                <div className="max-w-[78%] space-y-0.5">
                  <span className="block text-[10px] font-semibold text-fd-muted-foreground">
                    {isRep ? msg.name ?? repName : msg.name ?? candidateName}
                    {msg.mood && (
                      <span className={cn("ml-1.5", moodConfig[msg.mood].className, "rounded px-1 py-0.5 text-[9px] border")}>
                        {moodConfig[msg.mood].label}
                      </span>
                    )}
                  </span>

                  <div
                    className={cn(
                      "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      isRep
                        ? isLinkedIn
                          ? "rounded-tl-sm bg-sky-100 text-sky-950 dark:bg-sky-900 dark:text-sky-100"
                          : "rounded-tl-sm bg-fd-secondary text-fd-secondary-foreground"
                        : isWhatsApp
                          ? "rounded-tr-sm bg-emerald-100 text-emerald-950 dark:bg-emerald-800 dark:text-emerald-50"
                          : "rounded-tr-sm bg-fd-primary/10 text-fd-foreground"
                    )}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    {msg.timestamp && (
                      <span className="text-[9px] text-fd-muted-foreground">{msg.timestamp}</span>
                    )}
                    {msg.annotation && (
                      <span className="text-[10px] italic text-fd-muted-foreground">{msg.annotation}</span>
                    )}
                  </div>
                </div>

                {!isRep && (
                  <div
                    className={cn(
                      "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      isWhatsApp
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : isLinkedIn
                        ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                        : "bg-fd-accent text-fd-accent-foreground"
                    )}
                    aria-hidden
                  >
                    {(msg.name ?? candidateName).charAt(0)}
                  </div>
                )}
              </div>

              {msg.pauseAfter && (
                <div className="flex items-center gap-2 py-1" aria-hidden>
                  <div className="h-px flex-1 bg-fd-border" />
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    <Pause className="size-3" /> Pause & Reflect
                  </span>
                  <div className="h-px flex-1 bg-fd-border" />
                </div>
              )}
            </React.Fragment>
          )
        })}

        {typing && revealedCount < messages.length && (
          <div className={cn("flex gap-2", messages[revealedCount]?.sender === "rep" ? "justify-start" : "justify-end")}>
            <div className={cn(
              "rounded-xl",
              messages[revealedCount]?.sender === "rep"
                ? "rounded-tl-sm bg-fd-secondary"
                : "rounded-tr-sm bg-fd-primary/10"
            )}>
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer controls */}
      {autoReveal && !showAll && revealedCount < messages.length && (
        <div className="flex items-center justify-between border-t border-fd-border px-4 py-2 bg-fd-card">
          <span className="text-[10px] text-fd-muted-foreground">
            {revealedCount}/{messages.length} messages
          </span>
          <Button variant="ghost" size="sm" onClick={handleShowAll} className="gap-1 text-xs">
            <ChevronDown className="size-3.5" />
            Show All
          </Button>
        </div>
      )}

      {isPhone && (
        <div className="flex items-center justify-center gap-2 border-t border-fd-border bg-fd-secondary px-4 py-2">
          <PhoneOff className="size-4 text-red-500" />
          <span className="text-xs font-medium text-fd-muted-foreground">End of Call</span>
        </div>
      )}
    </div>
  )
}
