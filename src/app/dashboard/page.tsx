"use client";

import {
  Users,
  CalendarDays,
  Clock,
  Handshake,
  TrendingUp,
  DollarSign,
  Phone,
  ToggleRight,
  ToggleLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { leads, appointments, inventory } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Stats config
// ---------------------------------------------------------------------------

const stats = [
  {
    label: "New Leads Today",
    value: "12",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Appointments Today",
    value: "4",
    icon: CalendarDays,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Avg Response Time",
    value: "4m 32s",
    icon: Clock,
    color: "bg-amber-100 text-amber-600",
  },
  {
    label: "Deals in Progress",
    value: "8",
    icon: Handshake,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Monthly Units",
    value: "47",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Monthly Gross",
    value: "$287,450",
    icon: DollarSign,
    color: "bg-cyan-100 text-cyan-600",
  },
];

// ---------------------------------------------------------------------------
// Internet leads (new leads for the widget)
// ---------------------------------------------------------------------------

const internetLeads = [
  {
    name: "Priya Sharma",
    source: "website",
    vehicle: "2026 Accord Sport Hybrid",
    agent: "Sarah Chen",
    timeAgo: "32m",
  },
  {
    name: "Brian Wallace",
    source: "autotrader.com",
    vehicle: "2026 HR-V Sport",
    agent: "Sarah Chen",
    timeAgo: "1h",
  },
  {
    name: "Nathan Hughes",
    source: "website",
    vehicle: "2026 Civic Si",
    agent: "Sarah Chen",
    timeAgo: "1h 15m",
  },
  {
    name: "Carlos Ramirez",
    source: "website",
    vehicle: "2025 Civic EX",
    agent: "Sarah Chen",
    timeAgo: "2h",
  },
  {
    name: "Jason Park",
    source: "autotrader.com",
    vehicle: "2025 Accord EX-L Hybrid",
    agent: "Sarah Chen",
    timeAgo: "3h",
  },
];

const sourceBadgeColor: Record<string, string> = {
  website: "bg-blue-50 text-blue-700 border border-blue-200",
  "autotrader.com": "bg-orange-50 text-orange-700 border border-orange-200",
  "cars.com": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  referral: "bg-purple-50 text-purple-700 border border-purple-200",
  "walk-in": "bg-gray-50 text-gray-700 border border-gray-200",
  phone: "bg-amber-50 text-amber-700 border border-amber-200",
};

// ---------------------------------------------------------------------------
// Unresponded leads
// ---------------------------------------------------------------------------

const unrespondedLeads = [
  {
    name: "Amanda Foster",
    lastMessage: "Hi, I saw the Civic Sport online. Is it still available?",
    timeAgo: "45m",
    count: 3,
  },
  {
    name: "Carlos Ramirez",
    lastMessage: "What credit score do I need to get approved?",
    timeAgo: "1h 20m",
    count: 2,
  },
  {
    name: "Kevin O'Brien",
    lastMessage: "Can you send me the out-the-door price on the Ridgeline?",
    timeAgo: "2h",
    count: 1,
  },
  {
    name: "Jason Park",
    lastMessage: "Is there any wiggle room on the Accord EX-L?",
    timeAgo: "3h 15m",
    count: 4,
  },
];

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

const todayTasks = [
  {
    description: "Follow up with Michael Torres on credit app status",
    assignee: "Rob Johnson",
    subtitle: "Engaged Today",
  },
  {
    description: "Send Stephanie Reed updated trade-in numbers",
    assignee: "Rob Johnson",
    subtitle: "Engaged Today",
  },
  {
    description: "Confirm Jennifer Martinez appointment for Saturday",
    assignee: "Sarah Chen",
    subtitle: "Engaged Today",
  },
];

const recentOverdueTasks = [
  {
    description: "Call back Amanda Foster — credit pre-approval discussion",
    assignee: "Sarah Chen",
    subtitle: "2d ago",
  },
  {
    description: "Email Tyler Brooks Tacoma vs Ridgeline comparison sheet",
    assignee: "Rob Johnson",
    subtitle: "1d ago",
  },
  {
    description: "Submit Michelle Davis referral bonus paperwork",
    assignee: "Rob Johnson",
    subtitle: "2d ago",
  },
  {
    description: "Follow up on Kevin O'Brien voicemail",
    assignee: "Sarah Chen",
    subtitle: "1d ago",
  },
  {
    description: "Check Ally pre-approval status for lead-1",
    assignee: "Lisa Patel",
    subtitle: "2d ago",
  },
  {
    description: "Upload trade-in photos for 2021 Camry",
    assignee: "Rob Johnson",
    subtitle: "3d ago",
  },
  {
    description: "Send Angela Price the Pilot brochure",
    assignee: "Rob Johnson",
    subtitle: "1d ago",
  },
  {
    description: "Schedule Lisa Nguyen test-drive reminder",
    assignee: "Sarah Chen",
    subtitle: "2d ago",
  },
];

const allOverdueTasks = [
  ...recentOverdueTasks,
  {
    description: "Review CarGurus lead-quality report from March",
    assignee: "Marcus Williams",
    subtitle: "5d ago",
  },
  {
    description: "Order replacement floor mats for showroom CR-V",
    assignee: "Rob Johnson",
    subtitle: "4d ago",
  },
  {
    description: "Update CRM tags for March sold units",
    assignee: "Sarah Chen",
    subtitle: "6d ago",
  },
];

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------

const leadVelocityData = [
  { day: "Mon", leads: 14 },
  { day: "Tue", leads: 22 },
  { day: "Wed", leads: 18 },
  { day: "Thu", leads: 28 },
  { day: "Fri", leads: 24 },
  { day: "Sat", leads: 31 },
  { day: "Sun", leads: 12 },
];

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

const topLeads = [...leads]
  .filter((l) => l.status !== "sold" && l.status !== "lost")
  .sort((a, b) => b.aiScore - a.aiScore)
  .slice(0, 5);

const todayAppointments = appointments.filter((a) => {
  const d = new Date(a.date);
  return d.getFullYear() === 2026 && d.getMonth() === 3 && d.getDate() === 11;
});

const upcomingAppointments = appointments.filter((a) => {
  const d = new Date(a.date);
  const today = new Date("2026-04-11");
  return d > today && a.status !== "completed";
});

// ---------------------------------------------------------------------------
// Appointment status badge styling
// ---------------------------------------------------------------------------

function appointmentBadge(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-50 text-green-700 border border-green-200";
    case "not-confirmed":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "checked-in":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "checked-out":
      return "bg-gray-50 text-gray-700 border border-gray-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
}

function formatStatus(status: string) {
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTimeRange(time: string, duration: number) {
  const [timePart, ampm] = time.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  const totalMin = h * 60 + m + duration;
  const endH = Math.floor(totalMin / 60) % 12 || 12;
  const endM = totalMin % 60;
  const endAmpm = totalMin >= 720 ? "PM" : ampm;
  return `${time} – ${endH}:${String(endM).padStart(2, "0")} ${endAmpm}`;
}

// ---------------------------------------------------------------------------
// Score badge color
// ---------------------------------------------------------------------------

function scoreBadgeColor(score: number) {
  if (score >= 85) return "bg-green-100 text-green-800";
  if (score >= 70) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [acceptLeads, setAcceptLeads] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/80 p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Saturday, April 11, 2026 — Sunrise Honda
        </p>
      </div>

      {/* ─── Top Stats Bar ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-white border-0 shadow-sm rounded-xl"
          >
            <CardContent className="flex items-center gap-3 py-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold leading-tight text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Four Column Widgets ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Column 1: New Internet Leads */}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              New Internet Leads
            </CardTitle>
            <button
              onClick={() => setAcceptLeads(!acceptLeads)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {acceptLeads ? (
                <ToggleRight className="h-5 w-5 text-green-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
              Accept Leads
            </button>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {internetLeads.map((lead, i) => (
              <div
                key={i}
                className="group flex flex-col gap-1 rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {lead.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lead.timeAgo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${sourceBadgeColor[lead.source] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {lead.source}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {lead.vehicle}
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                  → {lead.agent}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Column 2: Unresponded */}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                Unresponded
              </CardTitle>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unrespondedLeads.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {unrespondedLeads.map((lead, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Avatar size="sm" className="mt-0.5">
                  <AvatarFallback>{initials(lead.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {lead.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {lead.lastMessage}
                  </p>
                </div>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0 mt-0.5 px-1">
                  {lead.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Column 3: Today's Appointments */}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="today">
              <TabsList variant="line" className="mb-3">
                <TabsTrigger value="today">
                  Today{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {todayAppointments.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {upcomingAppointments.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-3">
                {todayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {appt.leadName}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${appointmentBadge(appt.status)}`}
                      >
                        {formatStatus(appt.status)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeRange(appt.time, appt.duration)}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                      {appt.vehicleOfInterest}
                    </p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-3">
                {upcomingAppointments.slice(0, 4).map((appt) => (
                  <div
                    key={appt.id}
                    className="rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {appt.leadName}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${appointmentBadge(appt.status)}`}
                      >
                        {formatStatus(appt.status)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {appt.time} ·{" "}
                      {new Date(appt.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                      {appt.vehicleOfInterest}
                    </p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Column 4: Tasks */}
        <Card className="bg-white border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="today-tasks">
              <TabsList variant="line" className="mb-3">
                <TabsTrigger value="today-tasks">
                  Today{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {todayTasks.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="recent-overdue">
                  Recent{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {recentOverdueTasks.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="all-overdue">
                  All{" "}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {allOverdueTasks.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today-tasks" className="space-y-3">
                {todayTasks.map((task, i) => (
                  <TaskItem key={i} task={task} />
                ))}
              </TabsContent>

              <TabsContent value="recent-overdue" className="space-y-3">
                {recentOverdueTasks.slice(0, 5).map((task, i) => (
                  <TaskItem key={i} task={task} overdue />
                ))}
              </TabsContent>

              <TabsContent value="all-overdue" className="space-y-3">
                {allOverdueTasks.slice(0, 5).map((task, i) => (
                  <TaskItem key={i} task={task} overdue />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Lead Velocity Chart */}
        <Card className="bg-white border-0 shadow-sm rounded-xl lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Lead Velocity
              </CardTitle>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={leadVelocityData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="leadGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#leadGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Leads to Call */}
        <Card className="bg-white border-0 shadow-sm rounded-xl lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Top Leads to Call
              </CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-xs font-medium text-muted-foreground h-8">
                    Lead
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground h-8">
                    Score
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground h-8 hidden sm:table-cell">
                    Vehicle
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground h-8 text-right">
                    Activity
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLeads.map((lead) => {
                  const vehicle = inventory.find(
                    (v) => v.id === lead.vehicleOfInterestId
                  );
                  const lastActive = timeSince(lead.lastActivityAt);
                  return (
                    <TableRow
                      key={lead.id}
                      className="border-b border-gray-50 cursor-pointer hover:bg-gray-50/60"
                    >
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">
                              {initials(
                                `${lead.firstName} ${lead.lastName}`
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName.charAt(0)}.
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${scoreBadgeColor(lead.aiScore)}`}
                        >
                          {lead.aiScore}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {vehicle
                            ? `${vehicle.model} ${vehicle.trim}`
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <span className="text-xs text-muted-foreground">
                          {lastActive}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TaskItem({
  task,
  overdue = false,
}: {
  task: { description: string; assignee: string; subtitle: string };
  overdue?: boolean;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
      <div
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${overdue ? "bg-red-400" : "bg-blue-400"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 leading-snug">
          {task.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">
            {task.assignee}
          </span>
          <span className="text-[11px] text-muted-foreground/60">·</span>
          <span
            className={`text-[11px] ${overdue ? "text-red-500" : "text-muted-foreground/70"}`}
          >
            {task.subtitle}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

function timeSince(dateStr: string): string {
  const now = new Date("2026-04-11T12:00:00Z");
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}
