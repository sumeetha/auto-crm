"use client";

import type { Deal, Lead, Customer, Vehicle, User } from "@/lib/mock-data";
import {
  formatCurrency,
  formatCurrencyCompact,
  estimateMonthlyPayment,
} from "@/lib/deal-copilot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  DollarSign,
  ArrowRightLeft,
  Landmark,
  CalendarDays,
  Mail,
  Phone,
  User as UserIcon,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react";

const STAGE_BADGE: Record<string, string> = {
  prospect: "bg-slate-100 text-slate-700",
  qualified: "bg-blue-100 text-blue-700",
  "appointment-set": "bg-indigo-100 text-indigo-700",
  shown: "bg-violet-100 text-violet-700",
  desking: "bg-amber-100 text-amber-700",
  "f-and-i": "bg-orange-100 text-orange-700",
  sold: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function formatLabel(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function DealDeskingContext({
  deal,
  vehicle,
  lead,
  customer,
  assignedUser,
}: {
  deal: Deal;
  vehicle: Vehicle | undefined;
  lead: Lead | undefined;
  customer: Customer | undefined;
  assignedUser: User | undefined;
}) {
  const vehicleName = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
    : "—";

  const tradeCredit = deal.tradeInValue ?? 0;
  const estPayment =
    vehicle && deal.term
      ? estimateMonthlyPayment(vehicle.sellingPrice, tradeCredit, deal.term)
      : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Vehicle Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Car className="size-4 text-muted-foreground" />
            Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{vehicleName}</p>
          {vehicle && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Stock #{vehicle.stockNo}</span>
              <span>{vehicle.exteriorColor}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(vehicle.sellingPrice)}
              </span>
              {vehicle.msrp !== vehicle.sellingPrice && (
                <span className="line-through text-xs">
                  MSRP {formatCurrency(vehicle.msrp)}
                </span>
              )}
              <Badge
                variant="secondary"
                className={
                  vehicle.status === "available"
                    ? "bg-emerald-100 text-emerald-700"
                    : vehicle.status === "in-transit"
                      ? "bg-blue-100 text-blue-700"
                      : ""
                }
              >
                {formatLabel(vehicle.status)}
              </Badge>
              {vehicle.daysOnLot > 0 && (
                <span className="text-xs">
                  {vehicle.daysOnLot}d on lot
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Economics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-4 text-muted-foreground" />
              Deal Structure
            </CardTitle>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_BADGE[deal.stage] ?? ""}`}
            >
              {formatLabel(deal.stage)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Front Gross</dt>
              <dd className="mt-0.5 font-semibold">
                {formatCurrencyCompact(deal.frontGross)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Back Gross</dt>
              <dd className="mt-0.5 font-semibold">
                {formatCurrencyCompact(deal.backGross)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total Gross</dt>
              <dd className="mt-0.5 font-semibold text-emerald-600">
                {formatCurrencyCompact(deal.totalGross)}
              </dd>
            </div>

            {deal.tradeInVehicle && (
              <>
                <div className="col-span-2">
                  <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowRightLeft className="size-3" />
                    Trade-In
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium">
                    {deal.tradeInVehicle}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Trade Value
                  </dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatCurrency(deal.tradeInValue ?? 0)}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Financing */}
      {deal.lender && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Landmark className="size-4 text-muted-foreground" />
              Financing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-xs text-muted-foreground">Lender</dt>
                <dd className="mt-0.5 text-sm font-medium">{deal.lender}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Term</dt>
                <dd className="mt-0.5 font-semibold">
                  {deal.term} months
                </dd>
              </div>
              {estPayment !== null && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Est. Payment
                  </dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatCurrency(estPayment)}/mo
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Lead / Customer Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="size-4 text-muted-foreground" />
            {customer ? "Customer" : "Lead"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="mt-0.5 font-medium">
                {customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : lead
                    ? `${lead.firstName} ${lead.lastName}`
                    : "—"}
              </dd>
            </div>
            {(customer || lead) && (
              <>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-sm">
                    <Mail className="size-3 text-muted-foreground" />
                    {customer?.email ?? lead?.email ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-sm">
                    <Phone className="size-3 text-muted-foreground" />
                    {customer?.phone ?? lead?.phone ?? "—"}
                  </dd>
                </div>
              </>
            )}
            {assignedUser && (
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Assigned Consultant
                </dt>
                <dd className="mt-0.5 text-sm font-medium">
                  {assignedUser.name} · {assignedUser.role}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Customer History (when available) */}
      {customer && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-muted-foreground" />
              Customer History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.purchaseHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Past Purchases
                </h4>
                <ul className="space-y-1.5">
                  {customer.purchaseHistory.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{p.vehicle}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(p.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              {customer.equityPosition !== 0 && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-500" />
                  Equity: {formatCurrency(customer.equityPosition)}
                </span>
              )}
              {customer.leaseEndDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3 text-amber-500" />
                  Lease ends{" "}
                  {new Date(customer.leaseEndDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {customer.lastServiceDate && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  Last service{" "}
                  {new Date(customer.lastServiceDate).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Lifetime value:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(customer.lifetimeValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
