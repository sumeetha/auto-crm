"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { deals, leads, inventory, users } from "@/lib/mock-data";
import type { Deal } from "@/lib/mock-data";
import {
  DollarSign,
  Car,
  ArrowRightLeft,
  Clock,
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
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    for (const stage of STAGES) {
      grouped[stage.key] = deals.filter((d) => d.stage === stage.key);
    }
    return grouped;
  }, []);

  const totalDeals = deals.length;
  const totalGross = deals.reduce((sum, d) => sum + d.totalGross, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b shrink-0">
        <div className="flex items-center justify-between">
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
              <p className="text-xs text-muted-foreground">Total Deals</p>
              <p className="text-lg font-semibold">{totalDeals}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Gross</p>
              <p className="text-lg font-semibold text-emerald-600">
                ${totalGross.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
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
