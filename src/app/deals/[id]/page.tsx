"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  deals,
  leads,
  customers,
  inventory,
  users,
  getDealCopilotData,
} from "@/lib/mock-data";
import { getUpsellOptions } from "@/lib/deal-copilot";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DealDeskingContext } from "@/components/deals/deal-desking-context";
import { DealCopilotPanel } from "@/components/deals/deal-copilot-panel";

function formatLabel(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const deal = deals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <h2 className="text-xl font-semibold">Deal not found</h2>
        <p className="text-muted-foreground">
          No deal exists with ID &ldquo;{id}&rdquo;.
        </p>
        <Button variant="outline" nativeButton={false} render={<Link href="/deals" />}>
          <ArrowLeft className="size-4" />
          Back to Deals
        </Button>
      </div>
    );
  }

  const vehicle = inventory.find((v) => v.id === deal.vehicleId);
  const lead = leads.find((l) => l.id === deal.leadId);
  const customer = deal.customerId
    ? customers.find((c) => c.id === deal.customerId)
    : undefined;
  const assignedUser = users.find((u) => u.id === deal.assignedUserId);

  const copilotData = getDealCopilotData(deal.id);
  const upsellOptions = vehicle ? getUpsellOptions(vehicle, deal.vehicleId) : [];

  const vehicleName = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
    : "Unknown Vehicle";
  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : lead
      ? `${lead.firstName} ${lead.lastName}`
      : "Unknown";

  return (
    <div className="flex h-full flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href="/deals" />}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold tracking-tight truncate">
              {customerName} — {vehicleName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatLabel(deal.stage)} · Deal {deal.id} ·{" "}
              {assignedUser?.name ?? "Unassigned"}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Desking context (scrollable) */}
        <ScrollArea className="flex-1 min-h-0 min-w-0">
          <div className="p-6">
            <DealDeskingContext
              deal={deal}
              vehicle={vehicle}
              lead={lead}
              customer={customer}
              assignedUser={assignedUser}
            />
          </div>
        </ScrollArea>

        {/* Right: Co-pilot rail */}
        <div className="w-[380px] shrink-0 border-l min-h-0 flex flex-col">
          <DealCopilotPanel
            copilotData={copilotData}
            upsellOptions={upsellOptions}
            currentVehicle={vehicle}
            tradeCredit={deal.tradeInValue ?? 0}
            term={deal.term}
          />
        </div>
      </div>
    </div>
  );
}
