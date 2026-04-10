"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  MessageSquare,
  Bot,
  CalendarCheck,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { users, conversations } from "@/lib/mock-data";

const kpis = [
  {
    label: "Avg First Response",
    value: "47s",
    icon: Clock,
    color: "bg-blue-50 text-blue-600",
    change: "-12s vs last week",
    positive: true,
  },
  {
    label: "Active Conversations",
    value: "23",
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-600",
    change: "+5 from yesterday",
    positive: true,
  },
  {
    label: "AI Resolution Rate",
    value: "72%",
    icon: Bot,
    color: "bg-violet-50 text-violet-600",
    change: "+3% vs last week",
    positive: true,
  },
  {
    label: "Appts Set Today",
    value: "8",
    icon: CalendarCheck,
    color: "bg-amber-50 text-amber-600",
    change: "On pace for 12",
    positive: true,
  },
  {
    label: "Escalation Rate",
    value: "15%",
    icon: ArrowUpRight,
    color: "bg-red-50 text-red-600",
    change: "-2% vs last week",
    positive: true,
  },
];

const agentPerformance = [
  {
    userId: "user-2",
    conversations: 34,
    avgResponse: "38s",
    apptRate: "28%",
    aiHandoff: "65%",
  },
  {
    userId: "user-1",
    conversations: 28,
    avgResponse: "1m 12s",
    apptRate: "32%",
    aiHandoff: "45%",
  },
  {
    userId: "user-4",
    conversations: 22,
    avgResponse: "55s",
    apptRate: "24%",
    aiHandoff: "58%",
  },
];

const channelData = [
  { name: "Website", value: 38, color: "#6366f1" },
  { name: "Cars.com", value: 22, color: "#8b5cf6" },
  { name: "Autotrader", value: 18, color: "#a78bfa" },
  { name: "Phone", value: 14, color: "#c4b5fd" },
  { name: "Walk-in", value: 8, color: "#ddd6fe" },
];

const recentAIConvos = [
  {
    id: 1,
    leadName: "Michael Torres",
    summary: "AI qualified lead, booked test drive for 2026 CR-V",
    rating: "positive",
    time: "23m ago",
  },
  {
    id: 2,
    leadName: "Jennifer Martinez",
    summary: "AI answered lease vs buy questions, set appointment",
    rating: "positive",
    time: "45m ago",
  },
  {
    id: 3,
    leadName: "Robert Kim",
    summary: "AI escalated — customer asked about special financing",
    rating: "neutral",
    time: "1h ago",
  },
  {
    id: 4,
    leadName: "Amanda Foster",
    summary: "AI provided inventory details, customer still browsing",
    rating: "positive",
    time: "2h ago",
  },
  {
    id: 5,
    leadName: "Carlos Ramirez",
    summary: "AI response was off-topic, agent took over",
    rating: "negative",
    time: "3h ago",
  },
];

export default function BDCManagerDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">BDC Manager Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor AI agent performance and team metrics
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}
                >
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-emerald-600 font-medium">
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Agent Performance */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-center">Conversations</TableHead>
                  <TableHead className="text-center">Avg Response</TableHead>
                  <TableHead className="text-center">Appt Rate</TableHead>
                  <TableHead className="text-center">AI Handoff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentPerformance.map((agent) => {
                  const user = users.find((u) => u.id === agent.userId);
                  if (!user) return null;
                  return (
                    <TableRow key={agent.userId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">
                              {user.role.replace("-", " ")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {agent.conversations}
                      </TableCell>
                      <TableCell className="text-center">
                        {agent.avgResponse}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          {agent.apptRate}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {agent.aiHandoff}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Channel Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channelData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {channelData.map((ch) => (
                <div
                  key={ch.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span>{ch.name}</span>
                  </div>
                  <span className="font-medium">{ch.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Quality Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            AI Conversation Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAIConvos.map((convo) => (
              <div
                key={convo.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="text-sm font-medium">{convo.leadName}</p>
                    <p className="text-xs text-muted-foreground">
                      {convo.summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {convo.time}
                  </span>
                  <div className="flex gap-1">
                    <button
                      className={`rounded-full p-1.5 ${
                        convo.rating === "positive"
                          ? "bg-emerald-100 text-emerald-600"
                          : "hover:bg-emerald-50 text-slate-300"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className={`rounded-full p-1.5 ${
                        convo.rating === "negative"
                          ? "bg-red-100 text-red-600"
                          : "hover:bg-red-50 text-slate-300"
                      }`}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
