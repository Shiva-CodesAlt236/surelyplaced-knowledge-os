'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { AskAIPanel } from '@/components/ai/AskAIPanel';
import type { Citation } from '@/components/ai/AICitationItem';

/**
 * AI conversation state — the single Ask AI system for the
 * application (Milestone 4C, Priority 4). Milestone 4A built this
 * store with an intentionally honest constraint: no assistant reply
 * is fabricated without a real grounding pipeline. Milestone 4B
 * separately built `components/ai/AskAIPanel.tsx` with a nicer UI
 * (message bubbles, citations list, context scope selector) but
 * wired it to keyword-matched canned responses presented as if they
 * were grounded — a second, disconnected, fabricating Ask AI system.
 *
 * This merges them: this store remains the single source of truth
 * (open/close, message history, in-flight state), and `AskAIPanel`
 * is now a purely presentational consumer of it — its old
 * `input.includes("aws")`-style branching logic is gone entirely.
 * `docs/AI_RETRIEVAL_MANIFEST.md`'s real grounding pipeline is still
 * a future milestone; until it exists, every submitted question gets
 * an honest, non-fabricated status reply rather than a generated —
 * or generated-looking — answer.
 */
export interface AIMessage {
  id: string;
  /** 'status' messages are honest system notices (e.g. "not yet connected"), never a generated or fabricated answer. */
  role: 'user' | 'status';
  content: string;
  /** Preserved for when real retrieval exists; always empty until then. */
  citations?: Citation[];
}

interface AIState {
  isOpen: boolean;
  messages: AIMessage[];
  isResponding: boolean;
  open: () => void;
  close: () => void;
  sendMessage: (content: string) => void;
}

const NOT_CONNECTED_NOTICE = 'Grounded retrieval not yet connected.';

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  messages: [],
  isResponding: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  sendMessage: (content) => {
    const userMessage: AIMessage = { id: crypto.randomUUID(), role: 'user', content };
    set((state) => ({ messages: [...state.messages, userMessage], isResponding: true }));

    // Brief, honestly-labeled UI pacing so the loading state is
    // visible — not a simulated "thinking" delay standing in for
    // real inference. docs/AI_RETRIEVAL_MANIFEST.md's retrieval
    // pipeline is what actually generates an answer in a future
    // milestone; until then this notice is the only reply.
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          { id: crypto.randomUUID(), role: 'status', content: NOT_CONNECTED_NOTICE, citations: [] },
        ],
        isResponding: false,
      }));
    }, 300);
  },
}));

export function AIProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useAIStore((state) => state.isOpen);
  const open = useAIStore((state) => state.open);
  const close = useAIStore((state) => state.close);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingContext =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j' && !isTypingContext) {
        event.preventDefault();
        useAIStore.getState().open();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {children}
      <AskAIPanel open={isOpen} onOpenChange={(next) => (next ? open() : close())} />
    </>
  );
}
