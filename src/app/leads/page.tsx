"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { leads, inventory, users } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { FilterField } from "@/components/shared/page-filter-bar";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { SearchableFilterSelect } from "@/components/shared/searchable-filter-select";
import {
  applyLeadFilters,
  collectLeadSmartTags,
  type LeadFilterCriteria,
} from "@/lib/lead-filters";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";

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

function timeAgo(dateStr: string) {
  const now = new Date("2026-04-11T12:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function getVehicleName(vehicleId: string) {
  const v = inventory.find((i) => i.id === vehicleId);
  if (!v) return "—";
  return `${v.year} ${v.make} ${v.model} ${v.trim}`;
}

function getUserName(userId: string) {
  const u = users.find((i) => i.id === userId);
  return u?.name ?? "—";
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score > 70
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : score >= 40
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${color}`}
    >
      {score}
    </span>
  );
}

const TAB_ITEMS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "appointment-set", label: "Appointment Set" },
  { value: "negotiating", label: "Negotiating" },
  { value: "sold", label: "Sold" },
  { value: "lost", label: "Lost" },
] as const;

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "cars.com", label: "Cars.com" },
  { value: "autotrader", label: "Autotrader" },
  { value: "walk-in", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "referral", label: "Referral" },
];

const ACTIVITY_OPTIONS: { value: string; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function LeadTableRows({ filteredLeads }: { filteredLeads: typeof leads }) {
  const router = useRouter();

  if (filteredLeads.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
          No leads found.
        </TableCell>
      </TableRow>
    );
  }
  return filteredLeads.map((lead) => {
    const href = `/leads/${lead.id}`;
    const name = `${lead.firstName} ${lead.lastName}`;
    return (
    <TableRow
      key={lead.id}
      className="group cursor-pointer"
      tabIndex={0}
      aria-label={`View lead ${name}`}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      <TableCell>
        <span className="font-medium text-foreground">{name}</span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {formatLabel(lead.source)}
        </Badge>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? ""}`}
        >
          {formatLabel(lead.status)}
        </span>
      </TableCell>
      <TableCell>
        <ScoreBadge score={lead.aiScore} />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {lead.smartTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${TAG_COLORS[tag] ?? "bg-muted text-muted-foreground"}`}
            >
              {formatLabel(tag)}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[200px] truncate text-muted-foreground">
        {getVehicleName(lead.vehicleOfInterestId)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {getUserName(lead.assignedUserId)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {timeAgo(lead.lastActivityAt)}
      </TableCell>
    </TableRow>
    );
  });
}

export default function LeadsPage() {
  const [criteria, setCriteria] = useState<LeadFilterCriteria>({
    sources: [],
    assignedUserIds: [],
    smartTags: [],
    activity: "any",
    search: "",
  });

  const smartTagOptions = useMemo(() => collectLeadSmartTags(leads), []);

  const activeFilterDimensions = useMemo(() => {
    let n = 0;
    if (criteria.sources.length > 0) n++;
    if (criteria.assignedUserIds.length > 0) n++;
    if (criteria.smartTags.length > 0) n++;
    if (criteria.activity !== "any") n++;
    if (criteria.search.trim().length > 0) n++;
    return n;
  }, [criteria]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const t of TAB_ITEMS) {
      if (t.value === "all") continue;
      counts[t.value] = leads.filter((l) => l.status === t.value).length;
    }
    return counts;
  }, []);

  const setField = <K extends keyof LeadFilterCriteria>(
    key: K,
    value: LeadFilterCriteria[K],
  ) => setCriteria((c) => ({ ...c, [key]: value }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <span className="inline-flex h-6 items-center rounded-full bg-muted px-2.5 text-xs font-medium text-muted-foreground">
            {leads.length}
          </span>
        </div>
        <Button>
          <Plus className="size-4" />
          New Lead
        </Button>
      </div>

      <CollapsibleFilterPanel activeCount={activeFilterDimensions}>
        <FilterField label="Source">
          <MultiSelectFilter
            options={SOURCE_OPTIONS}
            value={criteria.sources}
            onChange={(sources) => setField("sources", sources)}
            emptyLabel="All sources"
            triggerClassName="min-w-[140px] w-[min(100%,160px)]"
            aria-label="Filter by lead source"
          />
        </FilterField>
        <FilterField label="Assigned">
          <MultiSelectFilter
            options={users.map((u) => ({ value: u.id, label: u.name }))}
            value={criteria.assignedUserIds}
            onChange={(assignedUserIds) =>
              setField("assignedUserIds", assignedUserIds)
            }
            emptyLabel="Anyone"
            triggerClassName="min-w-[140px] w-[min(100%,180px)]"
            aria-label="Filter by assigned user"
          />
        </FilterField>
        <FilterField label="Tag">
          <MultiSelectFilter
            options={smartTagOptions.map((tag) => ({
              value: tag,
              label: formatLabel(tag),
            }))}
            value={criteria.smartTags}
            onChange={(smartTags) => setField("smartTags", smartTags)}
            emptyLabel="Any tag"
            triggerClassName="min-w-[140px] w-[min(100%,180px)]"
            aria-label="Filter by smart tag"
          />
        </FilterField>
        <FilterField label="Activity">
          <SearchableFilterSelect
            options={ACTIVITY_OPTIONS}
            value={criteria.activity}
            onChange={(v) =>
              setField(
                "activity",
                (v as LeadFilterCriteria["activity"]) || "any",
              )
            }
            triggerClassName="min-w-[120px]"
            aria-label="Filter by activity"
          />
        </FilterField>
        <FilterField label="Search" className="min-w-[200px] flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 pl-8"
              placeholder="Name, email, phone…"
              value={criteria.search}
              onChange={(e) => setField("search", e.target.value)}
              aria-label="Search leads"
            />
          </div>
        </FilterField>
      </CollapsibleFilterPanel>

      <Tabs defaultValue="all">
        <TabsList variant="line" className="w-full justify-start gap-0">
          {TAB_ITEMS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="px-3">
              {t.label}
              <span className="ml-1 text-xs text-muted-foreground">
                ({statusCounts[t.value] ?? 0})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_ITEMS.map((t) => {
          const base =
            t.value === "all"
              ? leads
              : leads.filter((l) => l.status === t.value);
          const filtered = applyLeadFilters(base, criteria);
          return (
            <TabsContent key={t.value} value={t.value}>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Lead Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Smart Tags</TableHead>
                      <TableHead>Vehicle of Interest</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <LeadTableRows filteredLeads={filtered} />
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
