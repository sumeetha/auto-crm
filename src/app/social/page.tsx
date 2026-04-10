"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  socialThreads,
  customers,
  leads,
} from "@/lib/mock-data";
import type {
  SocialMessage,
  SocialPlatform,
  SocialThread,
  SocialThreadStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import {
  Bot,
  User,
  Sparkles,
  Send,
  Share2,
  Link2,
  ChevronRight,
} from "lucide-react";

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X / Twitter" },
];

const STATUS_OPTIONS: { value: SocialThreadStatus; label: string }[] = [
  { value: "unread", label: "Unread" },
  { value: "needs-reply", label: "Needs reply" },
  { value: "ai-handling", label: "AI handling" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
];

const platformBadge: Record<
  SocialPlatform,
  { label: string; className: string }
> = {
  facebook: { label: "Facebook", className: "bg-blue-100 text-blue-800" },
  instagram: {
    label: "Instagram",
    className: "bg-fuchsia-100 text-fuchsia-800",
  },
  twitter: { label: "X", className: "bg-slate-800 text-white" },
};

const statusBadge: Record<
  SocialThreadStatus,
  { label: string; className: string }
> = {
  unread: { label: "Unread", className: "bg-slate-200 text-slate-800" },
  "needs-reply": {
    label: "Needs reply",
    className: "bg-amber-100 text-amber-800",
  },
  "ai-handling": {
    label: "AI handling",
    className: "bg-violet-100 text-violet-800",
  },
  escalated: { label: "Escalated", className: "bg-red-100 text-red-800" },
  resolved: { label: "Resolved", className: "bg-emerald-100 text-emerald-800" },
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function SocialThreadList({
  threads,
  selectedId,
  onSelect,
  platforms,
  onPlatformsChange,
  statuses,
  onStatusesChange,
  searchQuery,
  onSearchChange,
}: {
  threads: SocialThread[];
  selectedId: string;
  onSelect: (id: string) => void;
  platforms: string[];
  onPlatformsChange: (next: string[]) => void;
  statuses: string[];
  onStatusesChange: (next: string[]) => void;
  searchQuery: string;
  onSearchChange: (s: string) => void;
}) {
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (platforms.length > 0) n++;
    if (statuses.length > 0) n++;
    if (searchQuery.trim().length > 0) n++;
    return n;
  }, [platforms, statuses, searchQuery]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = threads.filter((t) => {
    if (platforms.length > 0 && !platforms.includes(t.platform))
      return false;
    if (statuses.length > 0 && !statuses.includes(t.status)) return false;
    if (q) {
      const blob = `${t.title} ${t.preview}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex h-full min-h-0 w-[300px] min-w-0 shrink-0 flex-col border-r bg-card">
      <CollapsibleFilterPanel
        variant="stack"
        activeCount={activeFilterCount}
        className="shrink-0 rounded-none border-0 border-b border-border bg-transparent shadow-none"
        contentClassName="space-y-2 !py-2"
      >
        <div className="relative">
          <Input
            placeholder="Search threads…"
            className="h-9 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search social threads"
          />
        </div>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Platform
            </p>
            <MultiSelectFilter
              options={[...PLATFORM_OPTIONS]}
              value={platforms}
              onChange={onPlatformsChange}
              emptyLabel="All"
              triggerClassName="text-xs"
              aria-label="Filter by platform"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <MultiSelectFilter
              options={[...STATUS_OPTIONS]}
              value={statuses}
              onChange={onStatusesChange}
              emptyLabel="All"
              triggerClassName="text-xs"
              aria-label="Filter by status"
            />
          </div>
        </div>
      </CollapsibleFilterPanel>

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {filtered.map((t) => {
            const pb = platformBadge[t.platform];
            const sb = statusBadge[t.status];
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                className={cn(
                  "mb-1 w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent hover:bg-muted/60",
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("text-[9px] font-normal", pb.className)}
                  >
                    {pb.label}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn("text-[9px] font-normal", sb.className)}
                  >
                    {sb.label}
                  </Badge>
                  {t.unreadCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {t.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium leading-snug line-clamp-2">
                  {t.title}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                  {t.preview}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {t.threadType === "dm" ? "DM" : "Comment"} ·{" "}
                  {formatTime(t.lastMessageAt)}
                </p>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function SocialMessageBubble({
  message,
  thread,
  prevMessage,
}: {
  message: SocialMessage;
  thread: SocialThread;
  prevMessage?: SocialMessage;
}) {
  const isCustomer = message.sender === "customer";
  const isAIDraft = message.sender === "ai-draft";
  const isStaff = message.sender === "staff";
  const isPage = message.sender === "page";

  const showTimestamp =
    !prevMessage ||
    new Date(message.timestamp).getTime() -
      new Date(prevMessage.timestamp).getTime() >
      300000;

  return (
    <div>
      {showTimestamp && (
        <div className="flex justify-center py-2">
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {formatTime(message.timestamp)}
          </span>
        </div>
      )}
      <div
        className={cn(
          "flex gap-2",
          isCustomer ? "justify-start" : "justify-end",
        )}
      >
        {isCustomer && (
          <Avatar className="mt-1 h-7 w-7 shrink-0">
            <AvatarFallback className="bg-slate-200 text-[10px] font-semibold">
              {message.senderName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-3.5 py-2.5",
            isCustomer
              ? "bg-slate-100 text-foreground"
              : isAIDraft
                ? "border border-violet-100 bg-violet-50 text-foreground"
                : isPage
                  ? "border border-sky-200 bg-sky-50 text-foreground"
                  : isStaff
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
          )}
        >
          {!isCustomer && (
            <div className="mb-1 flex items-center gap-1.5">
              {isAIDraft ? (
                <>
                  <Bot className="h-3 w-3 text-violet-500" />
                  <span className="text-[10px] font-semibold text-violet-600">
                    AI draft
                  </span>
                  {message.confidence != null && (
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 px-1 py-0 text-[9px] text-violet-600"
                    >
                      {Math.round(message.confidence * 100)}%
                    </Badge>
                  )}
                </>
              ) : isPage ? (
                <>
                  <span className="text-[10px] font-semibold text-sky-800">
                    {message.senderName}
                  </span>
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-white/70" />
                  <span className="text-[10px] font-semibold text-white/80">
                    {message.senderName}
                  </span>
                </>
              )}
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        {!isCustomer && (
          <Avatar className="mt-1 h-7 w-7 shrink-0">
            <AvatarFallback
              className={cn(
                "text-[10px] font-semibold",
                isAIDraft
                  ? "bg-violet-100 text-violet-600"
                  : isPage
                    ? "bg-sky-100 text-sky-800"
                    : "bg-primary/10 text-primary",
              )}
            >
              {isAIDraft ? (
                <Bot className="h-3.5 w-3.5" />
              ) : isPage ? (
                message.senderName.slice(0, 2).toUpperCase()
              ) : (
                message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              )}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function SocialThreadPane({ thread }: { thread: SocialThread }) {
  const [compose, setCompose] = useState("");
  const [mode, setMode] = useState<"human" | "ai">("human");

  useEffect(() => {
    setCompose("");
    setMode("human");
  }, [thread.id]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold">{thread.title}</h2>
          <Badge variant="outline" className="text-[10px] font-normal">
            {platformBadge[thread.platform].label}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-normal">
            {thread.threadType === "dm" ? "DM" : "Comment thread"}
          </Badge>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-1 p-4">
          {thread.messages.map((m, i) => (
            <SocialMessageBubble
              key={m.id}
              message={m}
              thread={thread}
              prevMessage={thread.messages[i - 1]}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="shrink-0 border-t bg-card p-3">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Composer
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant={mode === "human" ? "secondary" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setMode("human")}
              >
                Human send
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "ai" ? "secondary" : "ghost"}
                className="h-7 gap-1 text-xs text-violet-700"
                onClick={() => setMode("ai")}
              >
                <Sparkles className="size-3" />
                AI assist
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder={
                mode === "ai"
                  ? "Optional instruction for AI…"
                  : "Type a reply…"
              }
              className="flex-1 text-sm"
              value={compose}
              onChange={(e) => setCompose(e.target.value)}
            />
            <Button size="sm" className="shrink-0 gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </div>
          {mode === "ai" && thread.suggestedReply && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-violet-200 text-left text-xs text-violet-800 hover:bg-violet-50"
              onClick={() => setCompose(thread.suggestedReply)}
            >
              <Sparkles className="size-3.5 shrink-0" />
              <span className="line-clamp-2">{thread.suggestedReply}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialInsightRail({ thread }: { thread: SocialThread }) {
  const customer = thread.linkedCustomerId
    ? customers.find((c) => c.id === thread.linkedCustomerId)
    : null;
  const lead = thread.linkedLeadId
    ? leads.find((l) => l.id === thread.linkedLeadId)
    : null;

  return (
    <div className="flex h-full min-h-0 w-[320px] min-w-[260px] shrink-0 flex-col border-l bg-card">
      <div className="shrink-0 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Thread intelligence</h3>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-700">
                AI summary
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/85">
              {thread.aiSummary}
            </p>
          </Card>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CRM link
            </h4>
            {customer ? (
              <Link
                href={`/customers/${customer.id}`}
                className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Link2 className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {customer.firstName} {customer.lastName}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              </Link>
            ) : lead ? (
              <Link
                href={`/leads/${lead.id}`}
                className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Link2 className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  Lead: {lead.firstName} {lead.lastName}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              </Link>
            ) : (
              <Button variant="outline" size="sm" className="w-full text-xs">
                Link to customer / lead
              </Button>
            )}
          </div>

          {thread.suggestedReply && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Suggested reply
              </h4>
              <p className="rounded-lg border border-violet-100 bg-violet-50/50 p-3 text-xs leading-relaxed text-foreground/90">
                {thread.suggestedReply}
              </p>
            </div>
          )}

          <Separator />

          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Manager approval may be required for public replies and promos
            (mock). Production: Meta Graph, X API, webhooks, audit log.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function SocialPage() {
  const [selectedId, setSelectedId] = useState(socialThreads[0]?.id ?? "");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const thread = socialThreads.find((t) => t.id === selectedId);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <Share2 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Social</h1>
            <p className="text-xs text-muted-foreground">
              Monitor X, Instagram, and Facebook; reply with AI or staff.
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SocialThreadList
          threads={socialThreads}
          selectedId={selectedId}
          onSelect={setSelectedId}
          platforms={platforms}
          onPlatformsChange={setPlatforms}
          statuses={statuses}
          onStatusesChange={setStatuses}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {thread ? (
          <>
            <SocialThreadPane thread={thread} />
            <SocialInsightRail thread={thread} />
          </>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center text-muted-foreground">
            Select a thread
          </div>
        )}
      </div>
    </div>
  );
}
