"use client";

import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { appointments, users, type Appointment } from "@/lib/mock-data";

const TODAY = "2026-04-11";

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

const todayAppts = appointments.filter((a) => a.date.startsWith(TODAY));
const upcomingAppts = appointments.filter(
  (a) => !a.date.startsWith(TODAY) && new Date(a.date) >= new Date(TODAY)
);

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
  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="today">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Appointments</h1>
              <p className="text-sm text-muted-foreground">
                {todayAppts.length} today &middot; {upcomingAppts.length} upcoming
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="today">Today ({todayAppts.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppts.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today">
          <AppointmentList items={todayAppts} emptyText="No appointments today." />
        </TabsContent>
        <TabsContent value="upcoming">
          <AppointmentList items={upcomingAppts} emptyText="No upcoming appointments." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
