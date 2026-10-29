"use client";

import { useState } from "react";
import { ExternalLink, Mail, MessageCircle, Send, X } from "lucide-react";
import { FAQ_BASE, SUPPORT_EMAIL, helpAnswers } from "./demo-data";

interface Message {
  from: "bot" | "user";
  text: string;
  anchor?: string;
}

const greeting: Message = {
  from: "bot",
  text: "Hi Dana, I can help with login codes, the GripAble, tests and results. What do you need?",
};

function findAnswer(text: string): Message {
  const query = text.toLowerCase();
  const match = helpAnswers.find((a) => a.keywords.some((k) => query.includes(k)));
  if (match) return { from: "bot", text: match.answer, anchor: match.anchor };
  return {
    from: "bot",
    text: `I'm not sure about that one, so let's get you to a person. Email ${SUPPORT_EMAIL} and we'll reply within one business day.`,
  };
}

export function HelpPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");

  const ask = (question: string) => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { from: "user", text: question }, findAnswer(question)]);
    setDraft("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-ac-blue px-5 py-3.5 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105"
        aria-expanded={open}
        aria-controls="onboarding-help"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        {open ? "Close help" : "Help"}
      </button>

      {open && (
        <section
          id="onboarding-help"
          aria-label="Help"
          className="fixed bottom-24 right-4 z-40 flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 md:right-6"
        >
          <div className="bg-ac-blue px-5 py-4 text-white">
            <div className="font-bold">Able Care assistant</div>
            <div className="text-xs text-white/70">Demo: scripted answers from our FAQs</div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.from === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-ac-blue px-4 py-2.5 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-ac-grey/50 px-4 py-2.5 text-sm text-ac-black"
                  }
                >
                  {m.text}
                  {m.anchor && (
                    <a
                      href={`${FAQ_BASE}${m.anchor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-ac-blue underline underline-offset-2"
                    >
                      Read the full answer <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {helpAnswers.map((a) => (
                  <button
                    key={a.question}
                    type="button"
                    onClick={() => ask(a.question)}
                    className="rounded-full border border-ac-blue/30 px-3 py-1.5 text-left text-xs font-medium text-ac-blue transition-colors hover:bg-ac-blue hover:text-white"
                  >
                    {a.question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-black/5 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <label htmlFor="help-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="help-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a question"
              className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-ac-blue"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ac-blue text-white"
              aria-label="Send"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center justify-center gap-2 border-t border-black/5 px-4 py-3 text-xs font-semibold text-ac-black/70 hover:text-ac-blue"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Prefer email? {SUPPORT_EMAIL}
          </a>
        </section>
      )}
    </>
  );
}
