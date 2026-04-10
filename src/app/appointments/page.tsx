"use client";

import { useMemo, useState } from "react";
import { Calendar, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterField } from "@/components/shared/page-filter-bar";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { SearchableFilterSelect } from "@/components/shared/searchable-filter-select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { appointments, users, type Appointment } from "@/lib/mock-data";

const TODAY = "2026-04-11";
const TODAY_START = new Date(TODAY).getTime();

const DATE_WINDOW_OPTIONS: {
  value: "all" | "today" | "week" | "month";
  label: string;
}[] = [
  { value: "all", label: "All in tab" },
  { value: "today", label: "Today only" },
  { value: "week", label: "Next 7 days" },
  { value: "month", label: "Next 30 days" },
];

function typeStyle(type: string) {
  switch (type) {
    case "test-drive":
      return { label: "Test Drive", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "delivery":
      return { label: "Delivery", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "follow-up":
      return { label: "Follow-up", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    case "finance":
      return { label: "Finance", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
    default:
      return { label: type, cls: "bg-secondary text-secondary-foreground" };
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "confirmed":
      return { label: "Confirmed", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "not-confirmed":
      return { label: "Not Confirmed", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    case "checked-in":
      return { label: "Checked In", cls: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" };
    case "checked-out":
      return { label: "Checked Out", cls: "bg-muted text-muted-foreground" };
    case "no-show":
      return { label: "No Show", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    case "completed":
      return { label: "Completed", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    default:
      return { label: status, cls: "bg-secondary text-secondary-foreground" };
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const userMap = new Map(users.map((u) => [u.id, u]));

function inDateWindow(
  appt: Appointment,
  window: "today" | "week" | "month" | "all",
  tab: "today" | "upcoming",
): boolean {
  const t = new Date(appt.date).getTime();
  if (tab === "today") {
    return appt.date.startsWith(TODAY);
  }
  if (appt.date.startsWith(TODAY)) return false;
  if (t < TODAY_START) return false;
  if (window === "all") return true;
  if (window === "today") return false;
  const end =
    window === "week"
      ? TODAY_START + 7 * 24 * 60 * 60 * 1000
      : TODAY_START + 30 * 24 * 60 * 60 * 1000;
  return t <= end;
}

function applyApptFilters(
  list: Appointment[],
  types: string[],
  statuses: string[],
  assignedUserIds: string[],
  search: string,
  dateWindow: "today" | "week" | "month" | "all",
  tab: "today" | "upcoming",
): Appointment[] {
  const q = search.trim().toLowerCase();
  return list.filter((appt) => {
    if (!inDateWindow(appt, dateWindow, tab)) return false;
    if (types.length > 0 && !types.includes(appt.type)) return false;
    if (statuses.length > 0 && !statuses.includes(appt.status)) return false;
    if (
      assignedUserIds.length > 0 &&
      !assignedUserIds.includes(appt.assignedUserId)
    )
      return false;
    if (q) {
      const blob = `${appt.leadName} ${appt.vehicleOfInterest} ${appt.notes ?? ""}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

function AppointmentList({ items, emptyText }: { items: Appointment[]; emptyText: string }) {
  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border bg-card text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((appt) => {
        const user = userMap.get(appt.assignedUserId);
        const ts = typeStyle(appt.type);
        const ss = statusStyle(appt.status);
        return (
          <Card key={appt.id}>
            <CardContent className="flex items-start gap-4">
              <div className="flex w-20 shrink-0 flex-col items-center rounded-lg bg-muted px-3 py-2 text-center">
                <Clock className="mb-1 size-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold leading-tight">
                  {appt.time}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {fmtDate(appt.date)}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{appt.leadName}</h3>
                  <Badge className={ts.cls}>{ts.label}</Badge>
                  <Badge className={ss.cls}>{ss.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {appt.vehicleOfInterest}
                </p>
                {appt.notes && (
                  <p className="line-clamp-1 text-xs text-muted-foreground/80">
                    {appt.notes}
                  </p>
                )}
              </div>

              {user && (
                <div className="flex shrink-0 items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {user.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AppointmentsPage() {
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dateWindow, setDateWindow] = useState<"today" | "week" | "month" | "all">("all");

  const todayFiltered = useMemo(
    () =>
      applyApptFilters(
        appointments,
        types,
        statuses,
        assignedUserIds,
        search,
        dateWindow,
        "today",
      ),
    [types, statuses, assignedUserIds, search, dateWindow],
  );

  const upcomingFiltered = useMemo(
    () =>
      applyApptFilters(
        appointments,
        types,
        statuses,
        assignedUserIds,
        search,
        dateWindow,
        "upcoming",
      ),
    [types, statuses, assignedUserIds, search, dateWindow],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (types.length > 0) n++;
    if (statuses.length > 0) n++;
    if (assignedUserIds.length > 0) n++;
    if (dateWindow !== "all") n++;
    if (search.trim().length > 0) n++;
    return n;
  }, [types, statuses, assignedUserIds, dateWindow, search]);

  const filterBar = (
    <CollapsibleFilterPanel activeCount={activeFilterCount}>
      <FilterField label="Type">
        <MultiSelectFilter
          options={[
            { value: "test-drive", label: "Test drive" },
            { value: "delivery", label: "Delivery" },
            { value: "follow-up", label: "Follow-up" },
            { value: "finance", label: "Finance" },
          ]}
          value={types}
          onChange={setTypes}
          emptyLabel="All types"
          triggerClassName="min-w-[130px]"
          aria-label="Filter by appointment type"
        />
      </FilterField>
      <FilterField label="Status">
        <MultiSelectFilter
          options={[
            { value: "confirmed", label: "Confirmed" },
            { value: "not-confirmed", label: "Not confirmed" },
            { value: "checked-in", label: "Checked in" },
            { value: "checked-out", label: "Checked out" },
            { value: "no-show", label: "No show" },
            { value: "completed", label: "Completed" },
          ]}
          value={statuses}
          onChange={setStatuses}
          emptyLabel="All statuses"
          triggerClassName="min-w-[150px]"
          aria-label="Filter by status"
        />
      </FilterField>
      <FilterField label="Assigned">
        <MultiSelectFilter
          options={users.map((u) => ({ value: u.id, label: u.name }))}
          value={assignedUserIds}
          onChange={setAssignedUserIds}
          emptyLabel="Anyone"
          triggerClassName="min-w-[150px]"
          aria-label="Filter by assignee"
        />
      </FilterField>
      <FilterField label="Date window">
        <SearchableFilterSelect
          options={DATE_WINDOW_OPTIONS}
          value={dateWindow}
          onChange={(v) =>
            setDateWindow((v as typeof dateWindow) || "all")
          }
          triggerClassName="min-w-[140px]"
          aria-label="Date window"
        />
      </FilterField>
      <FilterField label="Search" className="min-w-[200px] flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8"
            placeholder="Name, vehicle, notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search appointments"
          />
        </div>
      </FilterField>
    </CollapsibleFilterPanel>
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="today">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Appointments</h1>
              <p className="text-sm text-muted-foreground">
                {todayFiltered.length} today · {upcomingFiltered.length} upcoming (filtered)
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </div>

        {filterBar}

        <TabsContent value="today" className="mt-4">
          <AppointmentList
            items={todayFiltered}
            emptyText="No appointments match your filters today."
          />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <AppointmentList
            items={upcomingFiltered}
            emptyText="No upcoming appointments match your filters."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
