"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Car,
  MessageSquare,
  ShoppingBag,
  Wrench,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import {
  customers,
  deals,
  inventory,
  getCustomerEngagementTimeline,
  type CustomerTimelineEventKind,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fmt = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatStage(stage: string) {
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const TIMELINE_META: Record<
  CustomerTimelineEventKind,
  { Icon: LucideIcon; color: string }
> = {
  purchase: {
    Icon: ShoppingBag,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40",
  },
  service: {
    Icon: Wrench,
    color: "text-slate-600 bg-slate-100 dark:bg-slate-800/60",
  },
  lease: {
    Icon: Calendar,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
  },
  deal: {
    Icon: Car,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40",
  },
  message: {
    Icon: MessageSquare,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40",
  },
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <h2 className="text-xl font-semibold">Customer not found</h2>
        <p className="text-muted-foreground">
          No customer exists with ID &ldquo;{id}&rdquo;.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/customers" />}
        >
          <ArrowLeft className="size-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  const name = `${customer.firstName} ${customer.lastName}`;
  const relatedDeals = deals.filter((d) => d.customerId === customer.id);
  const timeline = getCustomerEngagementTimeline(customer);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href="/customers" />}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">
              {customer.purchaseHistory.length}{" "}
              {customer.purchaseHistory.length === 1 ? "vehicle" : "vehicles"}{" "}
              on file · LTV {fmt(customer.lifetimeValue)}
            </p>
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link href={`/bdc?customerId=${customer.id}`} />}
        >
          <MessageSquare className="size-4" />
          Message {customer.firstName}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                  <Mail className="size-3.5 text-muted-foreground" />
                  {customer.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                  <Phone className="size-3.5 text-muted-foreground" />
                  {customer.phone}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="mt-0.5 flex items-start gap-1.5 text-sm">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  {customer.address}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Lifetime value</dt>
                <dd className="mt-0.5 text-lg font-semibold">
                  {fmt(customer.lifetimeValue)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Equity position</dt>
                <dd
                  className={
                    customer.equityPosition > 0
                      ? "mt-0.5 text-lg font-semibold text-emerald-600"
                      : customer.equityPosition < 0
                        ? "mt-0.5 text-lg font-semibold text-red-600"
                        : "mt-0.5 text-lg font-semibold text-muted-foreground"
                  }
                >
                  {customer.equityPosition >= 0 ? "+" : ""}
                  {fmt(customer.equityPosition)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Last service</dt>
                <dd className="mt-0.5 text-sm font-medium">
                  {customer.lastServiceDate
                    ? fmtDate(customer.lastServiceDate)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Lease end</dt>
                <dd className="mt-0.5 text-sm font-medium">
                  {customer.leaseEndDate ? fmtDate(customer.leaseEndDate) : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...customer.purchaseHistory]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((p) => (
                  <TableRow key={`${p.date}-${p.vehicle}`}>
                    <TableCell className="text-muted-foreground">
                      {fmtDate(p.date)}
                    </TableCell>
                    <TableCell className="font-medium">{p.vehicle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {p.dealType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {p.dealType === "lease"
                        ? `${fmt(p.amount)}/mo`
                        : fmt(p.amount)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {relatedDeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedDeals.map((d) => {
              const v = inventory.find((x) => x.id === d.vehicleId);
              const vName = v
                ? `${v.year} ${v.make} ${v.model} ${v.trim}`
                : "Unknown vehicle";
              return (
                <Link
                  key={d.id}
                  href={`/deals/${d.id}`}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{vName}</p>
                    <p className="text-xs text-muted-foreground">{d.id}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {formatStage(d.stage)}
                  </Badge>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Engagement timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity on file.</p>
          ) : (
            <ol className="relative ml-3 border-l border-border">
              {timeline.map((event) => {
                const { Icon, color } = TIMELINE_META[event.kind];
                return (
                  <li key={event.id} className="mb-6 ml-6 last:mb-0">
                    <span
                      className={`absolute -left-3.5 flex size-7 items-center justify-center rounded-full ring-4 ring-card ${color}`}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium">{event.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(event.at)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
