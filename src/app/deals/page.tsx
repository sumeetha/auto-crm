"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { deals, leads, inventory, users } from "@/lib/mock-data";
import type { Deal } from "@/lib/mock-data";
import { FilterField } from "@/components/shared/page-filter-bar";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { SearchableFilterSelect } from "@/components/shared/searchable-filter-select";
import {
  DollarSign,
  Car,
  ArrowRightLeft,
  Clock,
  Search,
} from "lucide-react";

const STAGES = [
  { key: "prospect", label: "Prospect" },
  { key: "qualified", label: "Qualified" },
  { key: "appointment-set", label: "Appointment Set" },
  { key: "shown", label: "Shown" },
  { key: "desking", label: "Desking" },
  { key: "f-and-i", label: "F&I" },
  { key: "sold", label: "Sold" },
  { key: "lost", label: "Lost" },
] as const;

const MIN_GROSS_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "1000", label: "$1,000+" },
  { value: "2000", label: "$2,000+" },
  { value: "3000", label: "$3,000+" },
] as const;

const STAGE_COLORS: Record<string, string> = {
  prospect: "bg-slate-100 text-slate-700",
  qualified: "bg-blue-100 text-blue-700",
  "appointment-set": "bg-indigo-100 text-indigo-700",
  shown: "bg-violet-100 text-violet-700",
  desking: "bg-amber-100 text-amber-700",
  "f-and-i": "bg-orange-100 text-orange-700",
  sold: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function getLeadName(leadId: string) {
  const lead = leads.find((l) => l.id === leadId);
  return lead ? `${lead.firstName} ${lead.lastName}` : "Unknown";
}

function getVehicleName(vehicleId: string) {
  const vehicle = inventory.find((v) => v.id === vehicleId);
  return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
}

function getUserInitials(userId: string) {
  const user = users.find((u) => u.id === userId);
  return user ? user.avatar : "??";
}

function getUserName(userId: string) {
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "Unknown";
}

function formatGross(value: number) {
  if (value === 0) return "—";
  return `$${value.toLocaleString()}`;
}

function formatDaysInStage(days: number) {
  if (days === 0) return "<1d";
  return `${days}d`;
}

function DealCard({ deal }: { deal: Deal }) {
  const customerName = getLeadName(deal.leadId);
  const vehicleName = getVehicleName(deal.vehicleId);
  const initials = getUserInitials(deal.assignedUserId);
  const userName = getUserName(deal.assignedUserId);
  const showGross = deal.frontGross > 0 || deal.backGross > 0 || deal.totalGross > 0;

  return (
    <Link href={`/deals/${deal.id}`} className="block">
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-sm leading-tight truncate">
            {customerName}
          </span>
          <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 h-4">
            <Clock className="size-2.5 mr-0.5" />
            {formatDaysInStage(deal.daysInStage)}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Car className="size-3.5 shrink-0" />
          <span className="text-xs truncate">{vehicleName}</span>
        </div>

        {showGross && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              F <span className="text-foreground font-medium">{formatGross(deal.frontGross)}</span>
            </span>
            <span className="text-muted-foreground">
              B <span className="text-foreground font-medium">{formatGross(deal.backGross)}</span>
            </span>
            <span className="text-muted-foreground ml-auto">
              <DollarSign className="size-3 inline -mt-px" />
              <span className="text-foreground font-semibold">{formatGross(deal.totalGross)}</span>
            </span>
          </div>
        )}

        {deal.tradeInVehicle && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowRightLeft className="size-3 shrink-0" />
            <span className="truncate">Trade: {deal.tradeInVehicle}</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-0.5">
          <div className="flex items-center gap-1.5" title={userName}>
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

export default function DealsPage() {
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [minGross, setMinGross] = useState<string>("all");

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deals.filter((d) => {
      if (
        assignedUserIds.length > 0 &&
        !assignedUserIds.includes(d.assignedUserId)
      )
        return false;
      if (minGross !== "all") {
        const min = Number(minGross);
        if (d.totalGross < min) return false;
      }
      if (q) {
        const lead = leads.find((l) => l.id === d.leadId);
        const name = lead
          ? `${lead.firstName} ${lead.lastName}`.toLowerCase()
          : "";
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [assignedUserIds, search, minGross]);

  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    for (const stage of STAGES) {
      grouped[stage.key] = filteredDeals.filter((d) => d.stage === stage.key);
    }
    return grouped;
  }, [filteredDeals]);

  const totalDeals = filteredDeals.length;
  const totalGross = filteredDeals.reduce((sum, d) => sum + d.totalGross, 0);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (assignedUserIds.length > 0) n++;
    if (minGross !== "all") n++;
    if (search.trim().length > 0) n++;
    return n;
  }, [assignedUserIds, minGross, search]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b shrink-0 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Deals Pipeline
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage and track deals across every stage
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Showing</p>
              <p className="text-lg font-semibold">{totalDeals}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Gross (filtered)</p>
              <p className="text-lg font-semibold text-emerald-600">
                ${totalGross.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <CollapsibleFilterPanel
          activeCount={activeFilterCount}
          className="max-w-4xl"
        >
          <FilterField label="Assigned">
            <MultiSelectFilter
              options={users.map((u) => ({ value: u.id, label: u.name }))}
              value={assignedUserIds}
              onChange={setAssignedUserIds}
              emptyLabel="Anyone"
              triggerClassName="min-w-[160px]"
              aria-label="Filter by assigned user"
            />
          </FilterField>
          <FilterField label="Min total gross">
            <SearchableFilterSelect
              options={[...MIN_GROSS_OPTIONS]}
              value={minGross}
              onChange={(v) => setMinGross(v ?? "all")}
              triggerClassName="min-w-[140px]"
              aria-label="Minimum total gross"
            />
          </FilterField>
          <FilterField label="Search" className="min-w-[200px] flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-8 pl-8"
                placeholder="Customer name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search deals by customer name"
              />
            </div>
          </FilterField>
        </CollapsibleFilterPanel>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex gap-4 p-6 h-full" style={{ minWidth: "fit-content" }}>
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage.key] ?? [];
            return (
              <div
                key={stage.key}
                className="flex flex-col rounded-xl bg-muted/40 border"
                style={{ minWidth: 280, width: 280 }}
              >
                <div className="flex items-center justify-between px-3 py-2.5 border-b">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        STAGE_COLORS[stage.key]?.split(" ")[0] ?? "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm font-medium">{stage.label}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[11px] h-5 px-1.5 ${STAGE_COLORS[stage.key] ?? ""}`}
                  >
                    {stageDeals.length}
                  </Badge>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: "calc(100vh - 220px)" }}>
                  {stageDeals.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      No deals
                    </p>
                  )}
                  {stageDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
