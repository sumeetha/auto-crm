"use client";

import { Car, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

const newVehicles = inventory.filter((v) => v.condition === "new");
const usedVehicles = inventory.filter((v) => v.condition === "used");

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Inventory</h1>
              <p className="text-sm text-muted-foreground">
                {inventory.length} vehicles
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New ({newVehicles.length})</TabsTrigger>
            <TabsTrigger value="used">Used ({usedVehicles.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <VehicleGrid vehicles={inventory} />
        </TabsContent>
        <TabsContent value="new">
          <VehicleGrid vehicles={newVehicles} />
        </TabsContent>
        <TabsContent value="used">
          <VehicleGrid vehicles={usedVehicles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
