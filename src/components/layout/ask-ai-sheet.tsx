"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Bot, ChevronDown, ChevronRight, SendHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  appointments,
  conversations,
  deals,
  inventory,
  leads,
} from "@/lib/mock-data";

const SAMPLE_QUESTIONS = [
  "What should I work on first today?",
  "Summarize my hot leads for this week.",
  "How do I book a test drive from the BDC inbox?",
  "Which deals are stuck in desking?",
  "Explain the difference between Conversations and Social.",
] as const;

/** Demo “today” aligned with mock appointment dates in the prototype. */
const MOCK_TODAY_PREFIX = "2026-04-11";

const linkClass =
  "font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200";

function CrmLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

type ChatMessage =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content: ReactNode };

function vehicleLabel(vehicleId: string): string {
  const v = inventory.find((x) => x.id === vehicleId);
  return v ? `${v.year} ${v.make} ${v.model} ${v.trim}` : vehicleId;
}

function mockAssistantReplyNode(question: string): ReactNode {
  const q = question.toLowerCase();

  const convoNeedsAttention = conversations.filter(
    (c) => c.status === "needs-review" || c.status === "escalated",
  ).length;

  // 1) Conversations vs Social (strict)
  if (
    (q.includes("conversation") || q.includes("social")) &&
    (q.includes("difference") || q.includes(" vs ") || q.includes("between") || q.includes("explain"))
  ) {
    return (
      <div className="space-y-3">
        <p className="font-medium text-foreground">Side-by-side (mock CRM)</p>
        <div className="rounded-md border border-violet-100 bg-white/60 px-3 py-2 text-xs dark:border-violet-900/50 dark:bg-violet-950/20">
          <p className="mb-1">
            <CrmLink href="/bdc">Conversations</CrmLink> — BDC-style threads (SMS,
            email, chat, voice), qualification, and handoff. Mock inbox:{" "}
            <strong>{conversations.length}</strong> threads.
          </p>
          <p>
            <CrmLink href="/social">Social</CrmLink> — public social platforms
            (Meta, X, etc.) with AI-assist replies and thread intelligence.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Both live under <strong>Customer engagement</strong> in the sidebar.
        </p>
      </div>
    );
  }

  // 2) Priorities / today
  if (
    q.includes("work on") ||
    q.includes("first today") ||
    q.includes("priorit") ||
    q.includes("what should i do")
  ) {
    const myApptsToday = appointments.filter(
      (a) =>
        a.assignedUserId === "user-1" && a.date.startsWith(MOCK_TODAY_PREFIX),
    );
    const hotLeads = [...leads]
      .filter(
        (l) =>
          l.smartTags.some((t) => t.includes("hot")) ||
          l.aiScore >= 85,
      )
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 4);

    return (
      <div className="space-y-3">
        <p className="font-medium text-foreground">
          Here’s your mock snapshot for <strong>{MOCK_TODAY_PREFIX}</strong> (user{" "}
          <strong>Rob Johnson</strong>)
        </p>
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Appointments today
          </p>
          {myApptsToday.length === 0 ? (
            <p className="text-xs text-muted-foreground">None on file.</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-xs">
              {myApptsToday.map((a) => (
                <li key={a.id}>
                  <strong>{a.time}</strong> — {a.leadName} — {a.vehicleOfInterest}{" "}
                  <span className="text-muted-foreground">({a.status})</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1.5 text-xs">
            Full list: <CrmLink href="/appointments">Appointments</CrmLink> ·
            Day-at-a-glance: <CrmLink href="/dashboard">Dashboard</CrmLink>
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Highest-priority leads (by AI score / hot tags)
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs">
            {hotLeads.map((l) => (
              <li key={l.id}>
                <CrmLink href={`/leads/${l.id}`}>
                  {l.firstName} {l.lastName}
                </CrmLink>
                {" — "}
                score <strong>{l.aiScore}</strong>
                {l.smartTags.length > 0
                  ? ` · ${l.smartTags.slice(0, 2).join(", ")}`
                  : ""}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-xs">
            <CrmLink href="/leads">All leads</CrmLink>
          </p>
        </div>
        {convoNeedsAttention > 0 && (
          <p className="text-xs">
            <CrmLink href="/bdc">Conversations</CrmLink> —{" "}
            <strong>{convoNeedsAttention}</strong> thread
            {convoNeedsAttention === 1 ? "" : "s"} need review or escalation in
            mock data.
          </p>
        )}
      </div>
    );
  }

  // 3) Hot leads summary
  if (
    q.includes("hot lead") ||
    (q.includes("summarize") && q.includes("lead")) ||
    (q.includes("my leads") && q.includes("week"))
  ) {
    const hotLeads = [...leads]
      .filter(
        (l) =>
          l.smartTags.some((t) => t.includes("hot")) || l.aiScore >= 80,
      )
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);

    return (
      <div className="space-y-3">
        <p className="font-medium text-foreground">
          Hot / high-score leads (sample data)
        </p>
        <ul className="space-y-2 text-xs">
          {hotLeads.map((l) => (
            <li
              key={l.id}
              className="rounded-md border border-border/80 bg-white/50 px-2.5 py-2 dark:bg-violet-950/10"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <CrmLink href={`/leads/${l.id}`}>
                  {l.firstName} {l.lastName}
                </CrmLink>
                <span className="font-semibold text-violet-700 dark:text-violet-300">
                  {l.aiScore}
                </span>
              </div>
              <p className="mt-0.5 text-muted-foreground">
                {l.status.replace(/-/g, " ")} · {l.lastActivityDescription}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Tags: {l.smartTags.join(", ") || "—"}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs">
          Open the full pipeline on <CrmLink href="/leads">Leads</CrmLink>.
        </p>
      </div>
    );
  }

  // 4) BDC / test drive booking
  if (
    q.includes("test drive") ||
    (q.includes("book") && q.includes("bdc")) ||
    (q.includes("bdc") && q.includes("inbox"))
  ) {
    const example = conversations[0];
    return (
      <div className="space-y-3">
        <p className="font-medium text-foreground">Book from the BDC inbox</p>
        <ol className="list-decimal space-y-1.5 pl-4 text-xs">
          <li>
            Open <CrmLink href="/bdc">Conversations</CrmLink>.
          </li>
          <li>Select a thread (e.g. mock lead below).</li>
          <li>
            Use the composer to propose times; in production this would write to
            your DMS calendar.
          </li>
        </ol>
        <div className="rounded-md border border-violet-100 bg-white/60 px-3 py-2 text-xs dark:border-violet-900/50 dark:bg-violet-950/20">
          <p className="font-medium">{example?.leadName ?? "Lead"}</p>
          <p className="text-muted-foreground">
            Last activity: {example?.summary?.aiSummary?.slice(0, 120) ?? "…"}
            …
          </p>
          <p className="mt-1">
            <CrmLink href="/bdc">Open inbox</CrmLink>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Mock data: <strong>{convoNeedsAttention}</strong> conversation
          {convoNeedsAttention === 1 ? "" : "s"} flagged needs-review or
          escalated.
        </p>
      </div>
    );
  }

  // 5) Desking deals (strict — avoid matching random “deal” chatter)
  if (
    q.includes("desking") ||
    q.includes("stuck in desk") ||
    (q.includes("which deal") && q.includes("desk")) ||
    (q.includes("deal") && q.includes("stuck") && q.includes("desk"))
  ) {
    const desking = deals.filter((d) => d.stage === "desking");
    return (
      <div className="space-y-3">
        <p className="font-medium text-foreground">
          Deals in <strong>desking</strong> right now (mock)
        </p>
        {desking.length === 0 ? (
          <p className="text-xs text-muted-foreground">None in this sample set.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {desking.map((d) => {
              const lead = leads.find((l) => l.id === d.leadId);
              const name = lead
                ? `${lead.firstName} ${lead.lastName}`
                : d.leadId;
              return (
                <li
                  key={d.id}
                  className="rounded-md border border-border/80 bg-white/50 px-2.5 py-2 dark:bg-violet-950/10"
                >
                  <CrmLink href={`/deals/${d.id}`}>{name}</CrmLink>
                  <p className="mt-0.5 text-muted-foreground">
                    {vehicleLabel(d.vehicleId)} · ${d.totalGross.toLocaleString()}{" "}
                    total gross · {d.daysInStage} day{d.daysInStage === 1 ? "" : "s"}{" "}
                    in stage
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Co-pilot (mock): open deal for Context / Upsells / F&amp;I /
                    Objections.
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-xs">
          Board view: <CrmLink href="/deals">Deals pipeline</CrmLink>
        </p>
      </div>
    );
  }

  // 6) Campaigns
  if (q.includes("campaign")) {
    return (
      <div className="space-y-2 text-xs">
        <p className="font-medium text-foreground">Campaigns in this demo</p>
        <p>
          Segment and send mock SMS, email, and voice campaigns, with scheduling
          stubs and compliance banner — see{" "}
          <CrmLink href="/campaigns">Campaigns</CrmLink>. Pair with{" "}
          <CrmLink href="/customers">Customers</CrmLink> and{" "}
          <CrmLink href="/leads">Leads</CrmLink> for audiences.
        </p>
      </div>
    );
  }

  // 7) Settings
  if (
    q.includes("setting") ||
    q.includes("compliance") ||
    q.includes("playbook")
  ) {
    return (
      <div className="space-y-2 text-xs">
        <p className="font-medium text-foreground">Policies &amp; admin</p>
        <p>
          Playbooks, escalation, users, and AI/compliance tabs are on{" "}
          <CrmLink href="/settings">Settings</CrmLink> (illustrative only in the
          prototype).
        </p>
      </div>
    );
  }

  // 8) Unmatched — explicit prototype message
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      <p className="font-medium text-foreground">
        This is a <strong>prototype</strong> assistant
      </p>
      <p>
        There’s no scripted answer for that message, and nothing here calls a real
        language model or Tekion — responses use{" "}
        <strong>sample showroom data</strong> and fixed patterns only.
      </p>
      <p className="text-muted-foreground">
        Try the suggested questions, or browse{" "}
        <CrmLink href="/dashboard">Dashboard</CrmLink>,{" "}
        <CrmLink href="/leads">Leads</CrmLink>,{" "}
        <CrmLink href="/deals">Deals</CrmLink>,{" "}
        <CrmLink href="/bdc">Conversations</CrmLink>,{" "}
        <CrmLink href="/social">Social</CrmLink>, and{" "}
        <CrmLink href="/appointments">Appointments</CrmLink>.
      </p>
    </div>
  );
}

type AskAiSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AskAiSheet({ open, onOpenChange }: AskAiSheetProps) {
  const listId = useId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [samplesExpanded, setSamplesExpanded] = useState(true);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const hasUserMessage = messages.some((m) => m.role === "user");
  const prevHadUser = useRef(false);
  useEffect(() => {
    if (hasUserMessage && !prevHadUser.current) {
      setSamplesExpanded(false);
    }
    prevHadUser.current = hasUserMessage;
  }, [hasUserMessage]);

  useEffect(() => {
    if (!open) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking, open]);

  const appendAssistant = useCallback((content: ReactNode) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: text },
      ]);
      setDraft("");
      setThinking(true);

      const reply = mockAssistantReplyNode(text);
      window.setTimeout(() => {
        appendAssistant(reply);
        setThinking(false);
      }, 450);
    },
    [appendAssistant, thinking],
  );

  const showSampleChips = !hasUserMessage || samplesExpanded;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      disablePointerDismissal
    >
      <SheetContent
        side="right"
        showCloseButton
        hideOverlay
        className="flex h-full w-full flex-col gap-0 border-l shadow-xl p-0 sm:max-w-md"
      >
        <SheetHeader className="shrink-0 border-b px-4 py-4 pr-12 text-left">
          <SheetTitle>AI co-pilot</SheetTitle>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div
            id={listId}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex flex-col gap-3 px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Try a suggestion below or type your own question.
              </p>
            )}
            {messages.map((m) =>
              m.role === "user" ? (
                <div
                  key={m.id}
                  className="ml-6 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
                >
                  {m.content}
                </div>
              ) : (
                <div
                  key={m.id}
                  className="mr-4 rounded-lg border border-violet-100 bg-violet-50/80 px-3 py-2 text-sm leading-relaxed text-foreground/90 dark:border-violet-900/40 dark:bg-violet-950/30"
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Bot className="size-3.5 shrink-0 text-violet-500" />
                    <span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">
                      Assistant
                    </span>
                  </div>
                  <div className="text-sm [&_strong]:font-semibold">{m.content}</div>
                </div>
              ),
            )}
            {thinking && (
              <div className="mr-4 flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2 text-xs text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300">
                <Bot className="size-3.5 shrink-0 text-violet-500" />
                <span>Thinking…</span>
              </div>
            )}
            <div ref={scrollAnchorRef} className="h-px shrink-0" aria-hidden />
          </div>
        </ScrollArea>

        <div className="shrink-0 space-y-3 border-t px-4 py-3">
          {hasUserMessage && (
            <button
              type="button"
              onClick={() => setSamplesExpanded((e) => !e)}
              className="flex w-full items-center gap-1 text-left text-xs font-medium text-violet-700 hover:underline dark:text-violet-300"
              aria-expanded={samplesExpanded}
            >
              {samplesExpanded ? (
                <ChevronDown className="size-3.5 shrink-0" />
              ) : (
                <ChevronRight className="size-3.5 shrink-0" />
              )}
              Sample questions
            </button>
          )}
          {showSampleChips && !hasUserMessage && (
            <p className="text-xs font-medium text-muted-foreground">
              Sample questions
            </p>
          )}
          {showSampleChips && (
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto max-w-full whitespace-normal border-violet-200 py-1.5 text-left text-xs text-violet-800 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-950/40"
                  disabled={thinking}
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask in natural language…"
              className="min-h-[4.5rem] resize-none text-sm"
              disabled={thinking}
              aria-label="Message to assistant"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(draft);
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 shrink-0 self-end"
              disabled={thinking || !draft.trim()}
              onClick={() => sendMessage(draft)}
              aria-label="Send message"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
