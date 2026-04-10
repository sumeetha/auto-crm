"use client";

import { useMemo, useState } from "react";
import { campaigns, campaignSegments } from "@/lib/mock-data";
import type { Campaign, CampaignChannel, CampaignStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Megaphone,
  Plus,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Mail,
} from "lucide-react";

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sending", label: "Sending" },
  { value: "sent", label: "Sent" },
  { value: "paused", label: "Paused" },
  { value: "failed", label: "Failed" },
];

const CHANNEL_OPTIONS: { value: CampaignChannel; label: string }[] = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

const statusStyles: Record<
  CampaignStatus,
  { className: string; label: string }
> = {
  draft: { className: "bg-slate-100 text-slate-700", label: "Draft" },
  scheduled: { className: "bg-blue-100 text-blue-800", label: "Scheduled" },
  sending: { className: "bg-amber-100 text-amber-800", label: "Sending" },
  sent: { className: "bg-emerald-100 text-emerald-800", label: "Sent" },
  paused: { className: "bg-orange-100 text-orange-800", label: "Paused" },
  failed: { className: "bg-red-100 text-red-800", label: "Failed" },
};

function formatShortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function CampaignComplianceBanner() {
  return (
    <Card className="border-amber-200/80 bg-amber-50/60 p-3">
      <div className="flex gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold text-amber-900">
            Compliance checklist (mock)
          </p>
          <ul className="list-inside list-disc text-[11px] leading-relaxed text-amber-900/85">
            <li>Consent and opt-out flags respected per recipient record</li>
            <li>Quiet hours and frequency caps enforced by policy engine</li>
            <li>Human review required for certain templates (dealer-configurable)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusSel, setStatusSel] = useState<string[]>([]);
  const [channelSel, setChannelSel] = useState<string[]>([]);
  const [detail, setDetail] = useState<Campaign | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftSegment, setDraftSegment] = useState(campaignSegments[0]?.id ?? "");
  const [draftChannels, setDraftChannels] = useState<CampaignChannel[]>(["email"]);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [scheduleLater, setScheduleLater] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (statusSel.length > 0 && !statusSel.includes(c.status)) return false;
      if (
        channelSel.length > 0 &&
        !c.channels.some((ch) => channelSel.includes(ch as CampaignChannel))
      )
        return false;
      if (q) {
        const blob = `${c.name} ${c.segmentLabel} ${c.bodyPreview}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [search, statusSel, channelSel]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (statusSel.length > 0) n++;
    if (channelSel.length > 0) n++;
    if (search.trim().length > 0) n++;
    return n;
  }, [statusSel, channelSel, search]);

  const seg = campaignSegments.find((s) => s.id === draftSegment);

  function toggleDraftChannel(ch: CampaignChannel) {
    setDraftChannels((prev) =>
      prev.includes(ch) ? prev.filter((x) => x !== ch) : [...prev, ch],
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <Megaphone className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Campaigns</h1>
            <p className="text-sm text-muted-foreground">
              Segment customers and leads; send now or schedule SMS / email
              broadcasts.
            </p>
          </div>
        </div>
        <Button className="gap-1.5" onClick={() => setNewOpen(true)}>
          <Plus className="size-4" />
          New campaign
        </Button>
      </div>

      <CampaignComplianceBanner />

      <CollapsibleFilterPanel
        variant="toolbar"
        activeCount={activeFilterCount}
        contentClassName="flex flex-wrap items-end gap-3 !py-3"
      >
        <div className="min-w-[200px] flex-1 space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <Input
            placeholder="Name, segment, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search campaigns"
          />
        </div>
        <div className="w-[160px] space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <MultiSelectFilter
            options={STATUS_OPTIONS}
            value={statusSel}
            onChange={setStatusSel}
            emptyLabel="All statuses"
            triggerClassName="text-xs w-full"
            aria-label="Filter by status"
          />
        </div>
        <div className="w-[140px] space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Channel
          </p>
          <MultiSelectFilter
            options={[...CHANNEL_OPTIONS]}
            value={channelSel}
            onChange={setChannelSel}
            emptyLabel="All channels"
            triggerClassName="text-xs w-full"
            aria-label="Filter by channel"
          />
        </div>
      </CollapsibleFilterPanel>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[28%]">Campaign</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule / sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => setDetail(c)}
              >
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.segmentLabel}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.channels.map((ch) => (
                      <Badge
                        key={ch}
                        variant="secondary"
                        className="gap-0.5 text-[10px] font-normal"
                      >
                        {ch === "sms" ? (
                          <MessageSquare className="size-3" />
                        ) : (
                          <Mail className="size-3" />
                        )}
                        {ch.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{c.recipientCount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal",
                      statusStyles[c.status].className,
                    )}
                  >
                    {statusStyles[c.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.status === "sent"
                    ? `Sent ${formatShortDate(c.sentAt)}`
                    : c.scheduledAt
                      ? `Scheduled ${formatShortDate(c.scheduledAt)}`
                      : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No campaigns match your filters.
          </p>
        )}
      </div>

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.name}</SheetTitle>
                <SheetDescription>
                  {detail.segmentLabel} ·{" "}
                  {detail.recipientCount.toLocaleString()} recipients
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={statusStyles[detail.status].className}
                  >
                    {statusStyles[detail.status].label}
                  </Badge>
                  {detail.channels.map((ch) => (
                    <Badge key={ch} variant="outline" className="text-xs">
                      {ch.toUpperCase()}
                    </Badge>
                  ))}
                </div>
                {detail.subject && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Subject
                    </p>
                    <p className="text-sm">{detail.subject}</p>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Body preview
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {detail.bodyPreview}
                  </p>
                </div>
                {detail.metrics && (
                  <Card className="p-3">
                    <p className="mb-2 text-xs font-semibold">Performance</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Delivered
                        </p>
                        <p className="font-medium">
                          {detail.metrics.delivered}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Opened
                        </p>
                        <p className="font-medium">{detail.metrics.opened}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Clicked
                        </p>
                        <p className="font-medium">{detail.metrics.clicked}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Replied
                        </p>
                        <p className="font-medium">{detail.metrics.replied}</p>
                      </div>
                    </div>
                  </Card>
                )}
                <CampaignComplianceBanner />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New campaign sheet (mock) */}
      <Sheet open={newOpen} onOpenChange={setNewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>New campaign</SheetTitle>
            <SheetDescription>
              Draft only in this prototype — no messages are sent.
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4">
            <div className="space-y-1">
              <p className="text-xs font-medium">Name</p>
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="April equity mailer"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Segment</p>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={draftSegment}
                onChange={(e) => setDraftSegment(e.target.value)}
              >
                {campaignSegments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} (~{s.estimatedCount})
                  </option>
                ))}
              </select>
              {seg && (
                <p className="text-[11px] text-muted-foreground">
                  {seg.description}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Channels</p>
              <div className="flex gap-2">
                {CHANNEL_OPTIONS.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={
                      draftChannels.includes(value) ? "default" : "outline"
                    }
                    onClick={() => toggleDraftChannel(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            {draftChannels.includes("email") && (
              <div className="space-y-1">
                <p className="text-xs font-medium">Email subject</p>
                <Input
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  placeholder="Hi {{firstName}}, quick update from {{dealerName}}"
                />
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs font-medium">Message</p>
              <Textarea
                rows={5}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                placeholder="Write your message. Merge fields: {{firstName}}, {{dealerName}}"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Button
                type="button"
                size="sm"
                variant={scheduleLater ? "outline" : "secondary"}
                onClick={() => setScheduleLater(false)}
              >
                Send now
              </Button>
              <Button
                type="button"
                size="sm"
                variant={scheduleLater ? "secondary" : "outline"}
                onClick={() => setScheduleLater(true)}
              >
                Schedule
              </Button>
              {scheduleLater && (
                <Input type="datetime-local" className="flex-1 text-xs" />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50"
            >
              <Sparkles className="size-3.5" />
              AI suggest variant
            </Button>
            <CampaignComplianceBanner />
          </div>
          <SheetFooter className="border-t">
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setNewOpen(false);
                setDraftName("");
                setDraftBody("");
                setDraftSubject("");
              }}
            >
              Save draft (mock)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
