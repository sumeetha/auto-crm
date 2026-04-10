"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  Sparkles,
  Eye,
  FileText,
  Bot,
  ClipboardCheck,
  CalendarCheck,
  MessageSquare,
  Car,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { leads, inventory, users } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  contacted: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  qualified: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "appointment-set": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  shown: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  negotiating: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  sold: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const TAG_COLORS: Record<string, string> = {
  "hot-lead": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "trade-in": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  conquest: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "returning-customer": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "credit-concern": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "lease-expiring": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "weekend-buyer": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "first-time-buyer": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "cash-buyer": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function formatLabel(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* ---------- AI Summary generation (deterministic mock) ---------- */
function getAiSummary(lead: (typeof leads)[0], vehicleName: string) {
  const summaries: Record<string, string> = {
    "lead-1": `Michael Torres is a high-intent returning customer actively negotiating on a ${vehicleName}. He has submitted a credit application and has a trade-in vehicle, indicating strong purchase readiness. Recommend prioritizing follow-up within the next 24 hours to close.`,
    "lead-2": `Jennifer Martinez is a conquest lead from Cars.com with a lease expiring soon. She has an appointment confirmed for Saturday to see a ${vehicleName}. High likelihood of conversion given the lease urgency and engagement level.`,
    "lead-10": `Stephanie Reed is a hot walk-in lead currently negotiating on a ${vehicleName} with a 2021 Camry trade-in. Weekend buyer pattern suggests decision is imminent. AI score of 90 reflects strong purchase signals across all qualifying dimensions.`,
  };
  return (
    summaries[lead.id] ??
    `${lead.firstName} ${lead.lastName} is a ${formatLabel(lead.status).toLowerCase()} lead sourced from ${formatLabel(lead.source).toLowerCase()} with an AI score of ${lead.aiScore}. Interested in the ${vehicleName}. ${lead.aiScore >= 70 ? "Engagement signals indicate strong purchase intent — recommend timely follow-up." : "Moderate engagement so far — nurture with targeted inventory updates and trade-in offers."}`
  );
}

/* ---------- Timeline mock events ---------- */
function getTimelineEvents(lead: (typeof leads)[0]) {
  const base = new Date(lead.createdAt);
  const events = [
    {
      icon: Eye,
      title: "VDP View",
      description: "Customer viewed vehicle detail page 3 times",
      time: new Date(base.getTime() - 3600000 * 2),
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/40",
    },
    {
      icon: FileText,
      title: "Form Submitted",
      description: `Lead form submitted via ${formatLabel(lead.source)}`,
      time: base,
      color: "text-green-500 bg-green-100 dark:bg-green-900/40",
    },
    {
      icon: Bot,
      title: "AI First Response",
      description: "Automated response sent within 45 seconds with vehicle details and availability",
      time: new Date(base.getTime() + 45000),
      color: "text-violet-500 bg-violet-100 dark:bg-violet-900/40",
    },
    {
      icon: ClipboardCheck,
      title: "Qualification Started",
      description: "AI began qualification flow — budget, timeline, and trade-in assessment",
      time: new Date(base.getTime() + 3600000),
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/40",
    },
    {
      icon: MessageSquare,
      title: "Customer Replied",
      description: "Customer responded to qualification questions via text",
      time: new Date(base.getTime() + 3600000 * 3),
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/40",
    },
    {
      icon: CalendarCheck,
      title: "Status Updated",
      description: lead.lastActivityDescription,
      time: new Date(lead.lastActivityAt),
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
    },
  ];
  return events.sort((a, b) => b.time.getTime() - a.time.getTime());
}

/* ---------- Contributing Factors ---------- */
function getContributingFactors(lead: (typeof leads)[0]) {
  const factors: { label: string; value: string; positive: boolean }[] = [];
  if (lead.smartTags.includes("returning-customer"))
    factors.push({ label: "Repeat buyer", value: "+15 pts", positive: true });
  if (lead.smartTags.includes("hot-lead"))
    factors.push({ label: "High engagement signals", value: "+20 pts", positive: true });
  if (lead.smartTags.includes("trade-in"))
    factors.push({ label: "Trade-in ready", value: "+10 pts", positive: true });
  if (lead.smartTags.includes("credit-concern"))
    factors.push({ label: "Credit concern flagged", value: "−8 pts", positive: false });
  if (lead.smartTags.includes("lease-expiring"))
    factors.push({ label: "Lease expiring soon", value: "+12 pts", positive: true });
  if (lead.smartTags.includes("cash-buyer"))
    factors.push({ label: "Cash buyer", value: "+10 pts", positive: true });
  if (lead.source === "referral")
    factors.push({ label: "Referral source", value: "+8 pts", positive: true });
  factors.push({
    label: "Response speed",
    value: lead.aiScore > 70 ? "+10 pts" : "+3 pts",
    positive: true,
  });
  return factors.slice(0, 3);
}

/* ---------- Score Ring SVG ---------- */
function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score > 70
      ? "stroke-green-500"
      : score >= 40
        ? "stroke-amber-500"
        : "stroke-red-500";
  const textColor =
    score > 70
      ? "text-green-600 dark:text-green-400"
      : score >= 40
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-3xl font-bold tabular-nums ${textColor}`}
        >
          {score}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">out of 100</span>
    </div>
  );
}

/* ---------- Suggested Actions ---------- */
const SUGGESTED_ACTIONS = [
  "Schedule Test Drive",
  "Send Trade-In Estimate",
  "Request Credit App",
  "Send Payment Calculator",
];

/* ---------- Page ---------- */
export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <h2 className="text-xl font-semibold">Lead not found</h2>
        <p className="text-muted-foreground">
          No lead exists with ID &ldquo;{id}&rdquo;.
        </p>
        <Button variant="outline" render={<Link href="/leads" />}>
          <ArrowLeft className="size-4" />
          Back to Leads
        </Button>
      </div>
    );
  }

  const vehicle = inventory.find((v) => v.id === lead.vehicleOfInterestId);
  const assignedUser = users.find((u) => u.id === lead.assignedUserId);
  const vehicleName = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
    : "—";
  const timeline = getTimelineEvents(lead);
  const factors = getContributingFactors(lead);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back nav */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" render={<Link href="/leads" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Lead &middot; Created {formatDate(lead.createdAt)}
            {assignedUser && <> &middot; Assigned to {assignedUser.name}</>}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ---- LEFT COLUMN ---- */}
        <div className="flex flex-col gap-6">
          {/* Lead Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Full Name</dt>
                  <dd className="mt-0.5 font-medium">
                    {lead.firstName} {lead.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {lead.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {lead.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Source</dt>
                  <dd className="mt-0.5">
                    <Badge variant="outline" className="capitalize">
                      <Globe className="size-3" />
                      {formatLabel(lead.source)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="mt-0.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? ""}`}
                    >
                      {formatLabel(lead.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {formatDate(lead.createdAt)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-3">
                {timeline.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <li key={i} className="mb-6 ml-6 last:mb-0">
                      <span
                        className={`absolute -left-3.5 flex size-7 items-center justify-center rounded-full ring-4 ring-card ${event.color}`}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">{event.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(event.time.toISOString())}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* ---- RIGHT COLUMN ---- */}
        <div className="flex flex-col gap-6">
          {/* AI Summary */}
          <Card className="border-violet-200 dark:border-violet-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Sparkles className="size-4" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {getAiSummary(lead, vehicleName)}
              </p>
            </CardContent>
          </Card>

          {/* Smart Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lead.smartTags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${TAG_COLORS[tag] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {formatLabel(tag)}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Score */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ScoreRing score={lead.aiScore} />
              <div className="w-full space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Contributing Factors
                </h4>
                {factors.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{f.label}</span>
                    <span
                      className={
                        f.positive
                          ? "font-medium text-green-600 dark:text-green-400"
                          : "font-medium text-red-600 dark:text-red-400"
                      }
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle of Interest */}
          {vehicle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="size-4 text-muted-foreground" />
                  Vehicle of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{vehicleName}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>Stock #{vehicle.stockNo}</span>
                    <span className="text-foreground font-semibold">
                      ${vehicle.sellingPrice.toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        vehicle.status === "available"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : vehicle.status === "in-transit"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : vehicle.status === "hold"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {formatLabel(vehicle.status)}
                    </span>
                  </div>
                  {vehicle.condition === "used" && (
                    <span className="text-xs text-muted-foreground">
                      {vehicle.mileage.toLocaleString()} miles
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggested Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Actions</CardTitle>
              <CardDescription>AI-recommended next steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {SUGGESTED_ACTIONS.map((action) => (
                  <button
                    key={action}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Sparkles className="size-4 text-violet-500" />
                    <span className="flex-1 text-left">{action}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
