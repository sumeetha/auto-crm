"use client";

import { useMemo, useState } from "react";
import { Car, Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterField } from "@/components/shared/page-filter-bar";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { inventory, type Vehicle } from "@/lib/mock-data";

const fmt = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtMiles = (v: number) => v.toLocaleString("en-US");

function conditionClass(condition: "new" | "used") {
  return condition === "new"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
}

function daysOnLotClass(days: number) {
  if (days <= 30) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (days <= 60) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

function statusClass(status: string) {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "sold":
      return "bg-muted text-muted-foreground";
    case "in-transit":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "hold":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

const statusLabel: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  "in-transit": "In Transit",
  hold: "Hold",
};

function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border bg-card text-muted-foreground">
        No vehicles found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => (
        <Card key={v.id} className="overflow-hidden">
          <div className="flex aspect-video items-center justify-center bg-muted">
            <Car className="size-12 text-muted-foreground/40" />
          </div>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-snug">
                  {v.year} {v.make} {v.model} {v.trim}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Stock #{v.stockNo}
                </p>
              </div>
              <Badge className={conditionClass(v.condition)}>
                {v.condition === "new" ? "New" : "Used"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight">
                {v.condition === "new" ? fmt(v.msrp) : fmt(v.sellingPrice)}
              </span>
              {v.condition === "new" && v.msrp !== v.sellingPrice && (
                <span className="text-xs text-muted-foreground">
                  Selling {fmt(v.sellingPrice)}
                </span>
              )}
            </div>

            {v.condition === "used" && v.mileage > 0 && (
              <p className="text-xs text-muted-foreground">
                {fmtMiles(v.mileage)} miles
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className={daysOnLotClass(v.daysOnLot)}>
                {v.daysOnLot}d on lot
              </Badge>
              <Badge className={statusClass(v.status)}>
                {statusLabel[v.status] ?? v.status}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              {v.exteriorColor} / {v.interiorColor}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function matchesDaysBucket(v: Vehicle, bucket: string): boolean {
  if (bucket === "30") return v.daysOnLot <= 30;
  if (bucket === "60") return v.daysOnLot > 30 && v.daysOnLot <= 60;
  if (bucket === "60plus") return v.daysOnLot > 60;
  return false;
}

function applyInventoryFilters(
  list: Vehicle[],
  stockStatuses: string[],
  daysBuckets: string[],
  search: string,
): Vehicle[] {
  const q = search.trim().toLowerCase();
  return list.filter((v) => {
    if (stockStatuses.length > 0 && !stockStatuses.includes(v.status))
      return false;
    if (
      daysBuckets.length > 0 &&
      !daysBuckets.some((b) => matchesDaysBucket(v, b))
    )
      return false;
    if (q) {
      const blob = `${v.stockNo} ${v.vin} ${v.year} ${v.make} ${v.model} ${v.trim}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export default function InventoryPage() {
  const [stockStatuses, setStockStatuses] = useState<string[]>([]);
  const [daysBuckets, setDaysBuckets] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const newVehicles = useMemo(
    () => inventory.filter((v) => v.condition === "new"),
    [],
  );
  const usedVehicles = useMemo(
    () => inventory.filter((v) => v.condition === "used"),
    [],
  );

  const filteredAll = useMemo(
    () => applyInventoryFilters(inventory, stockStatuses, daysBuckets, search),
    [stockStatuses, daysBuckets, search],
  );
  const filteredNew = useMemo(
    () => applyInventoryFilters(newVehicles, stockStatuses, daysBuckets, search),
    [newVehicles, stockStatuses, daysBuckets, search],
  );
  const filteredUsed = useMemo(
    () => applyInventoryFilters(usedVehicles, stockStatuses, daysBuckets, search),
    [usedVehicles, stockStatuses, daysBuckets, search],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (stockStatuses.length > 0) n++;
    if (daysBuckets.length > 0) n++;
    if (search.trim().length > 0) n++;
    return n;
  }, [stockStatuses, daysBuckets, search]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="all">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Inventory</h1>
              <p className="text-sm text-muted-foreground">
                {inventory.length} in stock · filters apply to the grid below
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New ({newVehicles.length})</TabsTrigger>
            <TabsTrigger value="used">Used ({usedVehicles.length})</TabsTrigger>
          </TabsList>
        </div>

        <CollapsibleFilterPanel activeCount={activeFilterCount} className="mt-2">
          <FilterField label="Stock status">
            <MultiSelectFilter
              options={[
                { value: "available", label: "Available" },
                { value: "in-transit", label: "In transit" },
                { value: "hold", label: "Hold" },
                { value: "sold", label: "Sold" },
              ]}
              value={stockStatuses}
              onChange={setStockStatuses}
              emptyLabel="All statuses"
              triggerClassName="min-w-[140px]"
              aria-label="Filter by stock status"
            />
          </FilterField>
          <FilterField label="Days on lot">
            <MultiSelectFilter
              options={[
                { value: "30", label: "≤ 30 days" },
                { value: "60", label: "31 – 60 days" },
                { value: "60plus", label: "60+ days" },
              ]}
              value={daysBuckets}
              onChange={setDaysBuckets}
              emptyLabel="Any"
              triggerClassName="min-w-[140px]"
              aria-label="Filter by days on lot"
            />
          </FilterField>
          <FilterField label="Search" className="min-w-[200px] flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-8 pl-8"
                placeholder="Stock, VIN, make, model…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search inventory"
              />
            </div>
          </FilterField>
        </CollapsibleFilterPanel>

        <TabsContent value="all" className="mt-4">
          <VehicleGrid vehicles={filteredAll} />
        </TabsContent>
        <TabsContent value="new" className="mt-4">
          <VehicleGrid vehicles={filteredNew} />
        </TabsContent>
        <TabsContent value="used" className="mt-4">
          <VehicleGrid vehicles={filteredUsed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
