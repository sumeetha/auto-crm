import type { Customer } from "./customers";
import { deals } from "./deals";
import { inventory } from "./inventory";
import { conversations } from "./conversations";

export type CustomerTimelineEventKind =
  | "purchase"
  | "service"
  | "lease"
  | "deal"
  | "message";

export type CustomerTimelineEvent = {
  id: string;
  at: string;
  kind: CustomerTimelineEventKind;
  title: string;
  description: string;
};

function vehicleName(vehicleId: string): string {
  const v = inventory.find((i) => i.id === vehicleId);
  return v ? `${v.year} ${v.make} ${v.model} ${v.trim}` : vehicleId;
}

function formatDealStage(stage: string): string {
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function noonIso(dateYmd: string): string {
  return new Date(`${dateYmd}T12:00:00`).toISOString();
}

export function getCustomerEngagementTimeline(
  customer: Customer,
): CustomerTimelineEvent[] {
  const events: CustomerTimelineEvent[] = [];
  const cid = customer.id;

  for (const p of customer.purchaseHistory) {
    const isLease = p.dealType === "lease";
    const amt = isLease
      ? `${p.amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}/mo`
      : p.amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        });
    const title =
      p.dealType === "lease"
        ? "Lease transaction"
        : p.dealType === "used"
          ? "Used purchase"
          : "New purchase";
    events.push({
      id: `pur-${p.date}-${p.vehicle.slice(0, 24)}`,
      at: noonIso(p.date),
      kind: "purchase",
      title,
      description: `${p.vehicle} · ${amt}`,
    });
  }

  if (customer.lastServiceDate) {
    events.push({
      id: `svc-${customer.lastServiceDate}`,
      at: noonIso(customer.lastServiceDate),
      kind: "service",
      title: "Service visit",
      description: "Vehicle serviced at the dealership.",
    });
  }

  if (customer.leaseEndDate) {
    events.push({
      id: `lease-${customer.leaseEndDate}`,
      at: noonIso(customer.leaseEndDate),
      kind: "lease",
      title: "Lease maturity",
      description: "Scheduled lease end date.",
    });
  }

  for (const d of deals.filter((x) => x.customerId === cid)) {
    const vn = vehicleName(d.vehicleId);
    events.push({
      id: `deal-${d.id}`,
      at: d.updatedAt,
      kind: "deal",
      title: `Deal · ${formatDealStage(d.stage)}`,
      description: `${vn} · Ref ${d.id}`,
    });
  }

  for (const c of conversations) {
    if (c.customerId !== cid) continue;
    const last = c.messages[c.messages.length - 1];
    const ch = c.channel.charAt(0).toUpperCase() + c.channel.slice(1);
    const snippet = last
      ? last.content.length > 100
        ? `${last.content.slice(0, 100)}…`
        : last.content
      : "Conversation updated.";
    events.push({
      id: `conv-${c.id}`,
      at: c.lastMessageAt,
      kind: "message",
      title: `${ch} · BDC thread`,
      description: snippet,
    });
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}
