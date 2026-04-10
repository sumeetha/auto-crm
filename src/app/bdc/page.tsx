"use client";

import { useMemo, useState } from "react";
import { conversations, leads, inventory, users } from "@/lib/mock-data";
import type { Conversation, Message } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import {
  Search,
  MessageSquare,
  Mail,
  Globe,
  Bot,
  User,
  Sparkles,
  Send,
  ArrowUpRight,
  Paperclip,
  Phone,
  Clock,
  Target,
  TrendingUp,
  Car,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Timer,
  ShoppingCart,
  CreditCard,
  CircleDot,
} from "lucide-react";

const channelIcons: Record<string, React.ElementType> = {
  sms: MessageSquare,
  email: Mail,
  chat: Globe,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  "ai-handling": { label: "AI Handling", color: "bg-violet-100 text-violet-700" },
  "needs-review": { label: "Needs Review", color: "bg-amber-100 text-amber-700" },
  escalated: { label: "Escalated", color: "bg-red-100 text-red-700" },
  "human-active": { label: "Human Active", color: "bg-blue-100 text-blue-700" },
  closed: { label: "Closed", color: "bg-slate-100 text-slate-500" },
};

const CHANNEL_OPTIONS = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
] as const;

const STATUS_FILTERS = [
  { key: "ai-handling", label: "AI Handling" },
  { key: "needs-review", label: "Needs Review" },
  { key: "escalated", label: "Escalated" },
  { key: "human-active", label: "Human Active" },
  { key: "closed", label: "Closed" },
] as const;

const tagColors: Record<string, string> = {
  "hot-lead": "bg-red-100 text-red-700",
  "trade-in": "bg-blue-100 text-blue-700",
  conquest: "bg-purple-100 text-purple-700",
  "returning-customer": "bg-green-100 text-green-700",
  "credit-concern": "bg-amber-100 text-amber-700",
  "lease-expiring": "bg-orange-100 text-orange-700",
  "weekend-buyer": "bg-cyan-100 text-cyan-700",
  "first-time-buyer": "bg-emerald-100 text-emerald-700",
  "cash-buyer": "bg-emerald-100 text-emerald-700",
  "vip": "bg-yellow-100 text-yellow-700",
  "price-sensitive": "bg-rose-100 text-rose-700",
  "high-intent": "bg-indigo-100 text-indigo-700",
  "lease-inquiry": "bg-teal-100 text-teal-700",
  "specific-vehicle": "bg-sky-100 text-sky-700",
};

function formatTag(tag: string) {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Conversation List (Left Column) ──────────────────────────────

function ConversationList({
  conversations,
  selected,
  onSelect,
  selectedStatuses,
  onStatusesChange,
  channels,
  onChannelsChange,
  tags,
  onTagsChange,
  searchQuery,
  onSearchChange,
  tagOptions,
}: {
  conversations: Conversation[];
  selected: string;
  onSelect: (id: string) => void;
  selectedStatuses: string[];
  onStatusesChange: (next: string[]) => void;
  channels: string[];
  onChannelsChange: (next: string[]) => void;
  tags: string[];
  onTagsChange: (next: string[]) => void;
  searchQuery: string;
  onSearchChange: (s: string) => void;
  tagOptions: string[];
}) {
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (channels.length > 0) n++;
    if (tags.length > 0) n++;
    if (selectedStatuses.length > 0) n++;
    if (searchQuery.trim().length > 0) n++;
    return n;
  }, [channels, tags, selectedStatuses, searchQuery]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = conversations.filter((c) => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(c.status))
      return false;
    if (channels.length > 0 && !channels.includes(c.channel)) return false;
    if (
      tags.length > 0 &&
      !c.summary.smartTags.some((t) => tags.includes(t))
    )
      return false;
    if (q) {
      const last = c.messages[c.messages.length - 1]?.content ?? "";
      const blob = `${c.leadName} ${last}`.toLowerCase();
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
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Channel
            </p>
            <MultiSelectFilter
              options={[...CHANNEL_OPTIONS]}
              value={channels}
              onChange={onChannelsChange}
              emptyLabel="All channels"
              triggerClassName="text-xs"
              aria-label="Filter by channel"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Smart tag
            </p>
            <MultiSelectFilter
              options={tagOptions.map((tag) => ({
                value: tag,
                label: formatTag(tag),
              }))}
              value={tags}
              onChange={onTagsChange}
              emptyLabel="Any tag"
              triggerClassName="text-xs"
              aria-label="Filter by smart tag"
            />
          </div>
        </div>
      </CollapsibleFilterPanel>
      <div className="shrink-0 space-y-1 border-b border-border bg-card px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Status
        </p>
        <div className="flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain">
          <button
            type="button"
            onClick={() => onStatusesChange([])}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              selectedStatuses.length === 0
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            All
          </button>
          {STATUS_FILTERS.map((f) => {
            const on = selectedStatuses.includes(f.key);
            return (
              <button
                type="button"
                key={f.key}
                onClick={() => {
                  if (on) {
                    onStatusesChange(selectedStatuses.filter((x) => x !== f.key));
                  } else {
                    onStatusesChange([...selectedStatuses, f.key]);
                  }
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  on
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="divide-y">
          {filtered.map((conv) => {
            const ChannelIcon = channelIcons[conv.channel] || MessageSquare;
            const lastMsg = conv.messages[conv.messages.length - 1];
            const status = statusConfig[conv.status];
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "flex w-full flex-col gap-1.5 p-3 text-left transition-colors hover:bg-accent/50",
                  selected === conv.id && "bg-accent border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{conv.leadName}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className={cn("text-[10px] px-1.5 py-0", status.color)}
                  >
                    {status.label}
                  </Badge>
                  {conv.summary.smartTags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        tagColors[tag] || "bg-slate-100 text-slate-600"
                      )}
                    >
                      {formatTag(tag)}
                    </Badge>
                  ))}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {lastMsg?.sender === "customer" ? "" : lastMsg?.sender === "ai-agent" ? "AI: " : "Agent: "}
                  {lastMsg?.content.slice(0, 80)}
                </p>
                {conv.unreadCount > 0 && (
                  <div className="flex justify-end">
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {conv.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Conversation Thread (Center Column) ──────────────────────────

function ConversationThread({ conversation }: { conversation: Conversation }) {
  const status = statusConfig[conversation.status];
  const assignedUser = conversation.assignedUserId
    ? users.find((u) => u.id === conversation.assignedUserId)
    : null;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Thread Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 overflow-x-auto border-b bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-200 text-xs font-semibold">
              {conversation.leadName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {conversation.leadName}
              </span>
              <Badge
                variant="secondary"
                className={cn("text-[10px]", status.color)}
              >
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>(555) 312-8844</span>
              <span>·</span>
              <span className="capitalize">{conversation.channel}</span>
              {assignedUser && (
                <>
                  <span>·</span>
                  <span>{assignedUser.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversation.status === "ai-handling" && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <User className="h-3.5 w-3.5" />
              Take Over
            </Button>
          )}
          {conversation.status !== "escalated" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Escalate
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 min-w-0 flex-1 p-4">
        <div className="mx-auto min-w-0 max-w-2xl space-y-4">
          {conversation.messages.map((msg, idx) => (
            <MessageBubble key={msg.id} message={msg} conversation={conversation} prevMessage={conversation.messages[idx - 1]} />
          ))}

          {/* Qualification Card (inline in thread) */}
          {Object.keys(conversation.summary.qualificationData).length > 0 && (
            <QualificationCard data={conversation.summary.qualificationData} />
          )}
        </div>
      </ScrollArea>

      {/* Compose Bar */}
      <div className="shrink-0 border-t bg-card p-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Suggest
          </Button>
          <Button size="sm" className="shrink-0 gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  conversation,
  prevMessage,
}: {
  message: Message;
  conversation: Conversation;
  prevMessage?: Message;
}) {
  const isCustomer = message.sender === "customer";
  const isAI = message.sender === "ai-agent";

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
          isCustomer ? "justify-start" : "justify-end"
        )}
      >
        {isCustomer && (
          <Avatar className="mt-1 h-7 w-7 shrink-0">
            <AvatarFallback className="bg-slate-200 text-[10px] font-semibold">
              {conversation.leadName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-3.5 py-2.5",
            isCustomer
              ? "bg-slate-100 text-foreground"
              : isAI
              ? "bg-violet-50 border border-violet-100 text-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {!isCustomer && (
            <div className="mb-1 flex items-center gap-1.5">
              {isAI ? (
                <>
                  <Bot className="h-3 w-3 text-violet-500" />
                  <span className="text-[10px] font-semibold text-violet-600">
                    AI Agent
                  </span>
                  {message.confidence && (
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 text-violet-600 text-[9px] px-1 py-0"
                    >
                      {Math.round(message.confidence * 100)}%
                    </Badge>
                  )}
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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        {!isCustomer && (
          <Avatar className="mt-1 h-7 w-7 shrink-0">
            <AvatarFallback
              className={cn(
                "text-[10px] font-semibold",
                isAI
                  ? "bg-violet-100 text-violet-600"
                  : "bg-primary/10 text-primary"
              )}
            >
              {isAI ? (
                <Bot className="h-3.5 w-3.5" />
              ) : (
                message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              )}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function QualificationCard({
  data,
}: {
  data: Record<string, string | undefined>;
}) {
  const fields = [
    { key: "budget", label: "Budget", icon: DollarSign },
    { key: "timeline", label: "Timeline", icon: Timer },
    { key: "tradeIn", label: "Trade-In", icon: Car },
    { key: "creditRange", label: "Credit Range", icon: CreditCard },
    { key: "vehiclePreference", label: "Vehicle", icon: ShoppingCart },
  ];

  const activeFields = fields.filter((f) => data[f.key]);
  if (activeFields.length === 0) return null;

  return (
    <div className="mx-auto max-w-md">
      <Card className="border-violet-200 bg-violet-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-700">
            Qualification Data Captured
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {activeFields.map((field) => (
            <div
              key={field.key}
              className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5"
            >
              <field.icon className="h-3.5 w-3.5 text-violet-400" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {field.label}
                </p>
                <p className="text-xs font-medium">{data[field.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Lead Intelligence Panel (Right Column) ───────────────────────

function LeadIntelligencePanel({
  conversation,
}: {
  conversation: Conversation;
}) {
  const lead = leads.find((l) => l.id === conversation.leadId);
  const vehicle = lead
    ? inventory.find((v) => v.id === lead.vehicleOfInterestId)
    : null;
  const { summary } = conversation;
  const score = summary.leadScore;
  const scoreColor =
    score >= 70
      ? "text-emerald-600"
      : score >= 40
      ? "text-amber-500"
      : "text-red-500";
  const scoreRingColor =
    score >= 70
      ? "stroke-emerald-500"
      : score >= 40
      ? "stroke-amber-500"
      : "stroke-red-500";

  return (
    <div className="flex h-full min-h-0 w-[340px] min-w-[280px] shrink-0 flex-col border-l bg-card">
      <div className="shrink-0 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Lead Intelligence</h3>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          {/* AI Summary */}
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-700">
                AI Summary
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">
              {summary.aiSummary}
            </p>
          </Card>

          {/* Smart Tags */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Smart Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {summary.smartTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "text-[10px] font-medium",
                    tagColors[tag] || "bg-slate-100 text-slate-600"
                  )}
                >
                  {formatTag(tag)}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Lead Score */}
          <div className="text-center">
            <h4 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lead Score
            </h4>
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 264} 264`}
                  className={scoreRingColor}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-2xl font-bold", scoreColor)}>
                  {score}
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {summary.scoreFactors.map((factor, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Vehicle of Interest */}
          {vehicle && (
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Vehicle of Interest
              </h4>
              <Card className="p-3">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-3 mb-2">
                  <Car className="h-8 w-8 text-slate-400" />
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.trim}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Stock #</p>
                    <p className="font-medium">{vehicle.stockNo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MSRP</p>
                    <p className="font-medium">
                      ${vehicle.msrp.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        vehicle.status === "available"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {vehicle.status === "available"
                        ? "Available"
                        : vehicle.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days on Lot</p>
                    <p className="font-medium">{vehicle.daysOnLot}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Separator />

          {/* Key Events Timeline */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Key Events
            </h4>
            <div className="space-y-3">
              {[
                {
                  icon: Globe,
                  label: "VDP View",
                  time: "3 days ago",
                  color: "text-blue-500 bg-blue-50",
                },
                {
                  icon: Mail,
                  label: "Form Submitted",
                  time: "2 days ago",
                  color: "text-green-500 bg-green-50",
                },
                {
                  icon: Bot,
                  label: "AI First Response",
                  time: "2 days ago",
                  color: "text-violet-500 bg-violet-50",
                },
                {
                  icon: Target,
                  label: "Qualification Started",
                  time: "1 day ago",
                  color: "text-amber-500 bg-amber-50",
                },
                {
                  icon: Calendar,
                  label: "Appointment Discussed",
                  time: "Today",
                  color: "text-emerald-500 bg-emerald-50",
                },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      event.color
                    )}
                  >
                    <event.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{event.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Suggested Actions */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Suggested Actions
            </h4>
            <div className="space-y-1.5">
              {summary.suggestedActions.map((action, i) => (
                <button
                  key={i}
                  className="flex w-full items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2 text-left text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                >
                  <Sparkles className="h-3 w-3 shrink-0" />
                  <span className="flex-1">{action}</span>
                  <ChevronRight className="h-3 w-3 shrink-0 text-violet-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Main BDC Command Center Page ─────────────────────────────────

export default function BDCCommandCenter() {
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || "");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tagOptions = useMemo(() => {
    const s = new Set<string>();
    for (const c of conversations) {
      for (const t of c.summary.smartTags) s.add(t);
    }
    return [...s].sort();
  }, []);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="flex h-full min-h-0 w-full max-w-full overflow-hidden">
      <ConversationList
        conversations={conversations}
        selected={selectedConvId}
        onSelect={setSelectedConvId}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        channels={channels}
        onChannelsChange={setChannels}
        tags={tags}
        onTagsChange={setTags}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tagOptions={tagOptions}
      />
      {selectedConv ? (
        <>
          <ConversationThread conversation={selectedConv} />
          <LeadIntelligencePanel conversation={selectedConv} />
        </>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center text-muted-foreground">
          Select a conversation to view
        </div>
      )}
    </div>
  );
}
