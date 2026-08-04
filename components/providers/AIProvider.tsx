'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

/**
 * AI conversation state, per docs/STATE_MANAGEMENT.md's AI domain.
 * This provider hosts the panel's open/close chrome and message
 * capture only — the grounded, cited retrieval pipeline specified in
 * docs/AI_RETRIEVAL_MANIFEST.md and the full conversation experience
 * in docs/AI_CHAT_COMPONENT_SPEC.md belong to a future milestone that
 * implements those specs. Consistent with that scope boundary, a
 * submitted message is appended to the transcript as the learner's
 * own message and nothing else — no assistant reply is fabricated
 * here, since generating one without the real grounding pipeline
 * would be exactly the kind of fake implementation this build
 * excludes.
 */
export interface AIMessage {
  id: string;
  role: 'user';
  content: string;
}

interface AIState {
  isOpen: boolean;
  messages: AIMessage[];
  open: () => void;
  close: () => void;
  sendMessage: (content: string) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  messages: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  sendMessage: (content) =>
    set((state) => ({
      messages: [...state.messages, { id: crypto.randomUUID(), role: 'user', content }],
    })),
}));

export function AIProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useAIStore((state) => state.isOpen);
  const messages = useAIStore((state) => state.messages);
  const open = useAIStore((state) => state.open);
  const close = useAIStore((state) => state.close);
  const sendMessage = useAIStore((state) => state.sendMessage);

  const [draft, setDraft] = useState('');

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setDraft('');
  }

  return (
    <>
      {children}
      <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
        <SheetContent side="right" className="flex w-full max-w-sm flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-fd-primary" />
              Ask AI
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            {messages.length === 0 ? (
              <p className="pt-8 text-center text-sm text-fd-muted-foreground">
                Ask a question about anything in the Knowledge OS.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 py-4">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className="ml-auto max-w-[85%] rounded-lg bg-fd-primary px-3 py-2 text-sm text-fd-primary-foreground"
                  >
                    {message.content}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-fd-border p-4">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit(event);
                }
              }}
              placeholder="Ask a question…"
              rows={2}
              className="flex-1 resize-none rounded-md border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Sparkles />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
