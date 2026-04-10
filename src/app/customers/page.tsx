"use client";

import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [search]);

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
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
            {filtered.map((c) => (
              <TableRow key={c.id}>
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
            ))}
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
