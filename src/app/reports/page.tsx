"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Bot } from "lucide-react";

const reports = [
  {
    title: "Sales Performance",
    description: "Units sold, gross profit, and conversion rates by rep",
    icon: TrendingUp,
    color: "bg-blue-50 text-blue-600",
    status: "Updated today",
  },
  {
    title: "BDC Effectiveness",
    description: "Response times, appointment set rates, AI vs human metrics",
    icon: Bot,
    color: "bg-violet-50 text-violet-600",
    status: "Updated today",
  },
  {
    title: "Lead Source ROI",
    description: "Cost per lead, conversion by source, attribution analysis",
    icon: BarChart3,
    color: "bg-emerald-50 text-emerald-600",
    status: "Updated yesterday",
  },
  {
    title: "Inventory Aging",
    description: "Days on lot distribution, aged units, pricing recommendations",
    icon: Calendar,
    color: "bg-amber-50 text-amber-600",
    status: "Updated today",
  },
  {
    title: "Customer Retention",
    description: "Repeat buyers, service-to-sales, equity mining opportunities",
    icon: Users,
    color: "bg-cyan-50 text-cyan-600",
    status: "Updated weekly",
  },
  {
    title: "Gross Profit Analysis",
    description: "Front/back gross, PVR, F&I penetration, trade performance",
    icon: DollarSign,
    color: "bg-rose-50 text-rose-600",
    status: "Updated today",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Performance analytics and operational insights
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.title}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${report.color}`}
                >
                  <report.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{report.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {report.description}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-2 text-[10px] bg-slate-100 text-slate-500"
                  >
                    {report.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
