"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterField } from "@/components/shared/page-filter-bar";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customers } from "@/lib/mock-data";
import type { Customer } from "@/lib/mock-data";

const fmt = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

function isLeaseEndingSoon(leaseEnd: string | null): boolean {
  if (!leaseEnd) return false;
  const now = new Date("2026-04-11");
  const end = new Date(leaseEnd);
  const diff = end.getTime() - now.getTime();
  return diff > 0 && diff <= SIX_MONTHS_MS;
}

const ANCHOR = new Date("2026-04-11");
const TWELVE_MO_MS = 365 * 24 * 60 * 60 * 1000;

function matchesEquity(c: Customer, eq: string): boolean {
  if (eq === "positive") return c.equityPosition > 0;
  if (eq === "zero") return c.equityPosition === 0;
  if (eq === "negative") return c.equityPosition < 0;
  return false;
}

function matchesService(c: Customer, s: string): boolean {
  if (s === "recent") {
    if (!c.lastServiceDate) return false;
    return (
      ANCHOR.getTime() - new Date(c.lastServiceDate).getTime() <= TWELVE_MO_MS
    );
  }
  if (s === "none") return !c.lastServiceDate;
  return false;
}

function matchesLtv(c: Customer, band: string): boolean {
  if (band === "50k") return c.lifetimeValue < 50_000;
  if (band === "50k-80k")
    return c.lifetimeValue >= 50_000 && c.lifetimeValue <= 80_000;
  if (band === "80k") return c.lifetimeValue > 80_000;
  return false;
}

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [equitySel, setEquitySel] = useState<string[]>([]);
  const [serviceSel, setServiceSel] = useState<string[]>([]);
  const [ltvSel, setLtvSel] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (q) {
        const name = `${c.firstName} ${c.lastName}`.toLowerCase();
        if (
          !name.includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !c.phone.includes(q)
        ) {
          return false;
        }
      }
      if (
        equitySel.length > 0 &&
        !equitySel.some((eq) => matchesEquity(c, eq))
      )
        return false;
      if (
        serviceSel.length > 0 &&
        !serviceSel.some((s) => matchesService(c, s))
      )
        return false;
      if (ltvSel.length > 0 && !ltvSel.some((b) => matchesLtv(c, b)))
        return false;
      return true;
    });
  }, [search, equitySel, serviceSel, ltvSel]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (equitySel.length > 0) n++;
    if (serviceSel.length > 0) n++;
    if (ltvSel.length > 0) n++;
    if (search.trim().length > 0) n++;
    return n;
  }, [equitySel, serviceSel, ltvSel, search]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} total customers
            </p>
          </div>
        </div>
      </div>

      <CollapsibleFilterPanel activeCount={activeFilterCount}>
        <FilterField label="Equity">
          <MultiSelectFilter
            options={[
              { value: "positive", label: "Positive" },
              { value: "zero", label: "Zero" },
              { value: "negative", label: "Negative" },
            ]}
            value={equitySel}
            onChange={setEquitySel}
            emptyLabel="Any"
            triggerClassName="min-w-[140px]"
            aria-label="Filter by equity"
          />
        </FilterField>
        <FilterField label="Service">
          <MultiSelectFilter
            options={[
              { value: "recent", label: "Visited in 12 mo" },
              { value: "none", label: "No service on file" },
            ]}
            value={serviceSel}
            onChange={setServiceSel}
            emptyLabel="Any"
            triggerClassName="min-w-[160px]"
            aria-label="Filter by service history"
          />
        </FilterField>
        <FilterField label="Lifetime value">
          <MultiSelectFilter
            options={[
              { value: "50k", label: "Under $50k" },
              { value: "50k-80k", label: "$50k – $80k" },
              { value: "80k", label: "Over $80k" },
            ]}
            value={ltvSel}
            onChange={setLtvSel}
            emptyLabel="Any"
            triggerClassName="min-w-[150px]"
            aria-label="Filter by lifetime value"
          />
        </FilterField>
        <FilterField label="Search" className="min-w-[220px] flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers…"
              className="h-8 pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search customers"
            />
          </div>
        </FilterField>
      </CollapsibleFilterPanel>

      <div className="rounded-xl border bg-card ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Vehicles</TableHead>
              <TableHead className="text-right">Lifetime Value</TableHead>
              <TableHead className="text-right">Equity Position</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead>Lease End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const href = `/customers/${c.id}`;
              const rowName = `${c.firstName} ${c.lastName}`;
              return (
              <TableRow
                key={c.id}
                className="cursor-pointer hover:bg-muted/50"
                tabIndex={0}
                aria-label={`View customer ${rowName}`}
                onClick={() => router.push(href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(href);
                  }
                }}
              >
                <TableCell className="font-medium">
                  {c.firstName} {c.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.phone}
                </TableCell>
                <TableCell className="text-center">
                  {c.purchaseHistory.length}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {fmt(c.lifetimeValue)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      c.equityPosition > 0
                        ? "font-medium text-emerald-600"
                        : c.equityPosition < 0
                          ? "font-medium text-red-600"
                          : "text-muted-foreground"
                    }
                  >
                    {c.equityPosition >= 0 ? "+" : ""}
                    {fmt(c.equityPosition)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.lastServiceDate ? fmtDate(c.lastServiceDate) : "—"}
                </TableCell>
                <TableCell>
                  {c.leaseEndDate ? (
                    <Badge
                      className={
                        isLeaseEndingSoon(c.leaseEndDate)
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {fmtDate(c.leaseEndDate)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
