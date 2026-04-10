"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Shield,
  Users,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { users } from "@/lib/mock-data";

const playbooks = [
  {
    id: 1,
    name: "New Internet Lead — Standard",
    channel: "All",
    status: "active",
    responses: 12,
    lastUpdated: "Apr 8, 2026",
  },
  {
    id: 2,
    name: "Trade-In Inquiry",
    channel: "Website, Chat",
    status: "active",
    responses: 8,
    lastUpdated: "Apr 5, 2026",
  },
  {
    id: 3,
    name: "Lease Expiration Outreach",
    channel: "SMS, Email",
    status: "active",
    responses: 6,
    lastUpdated: "Apr 3, 2026",
  },
  {
    id: 4,
    name: "Service-to-Sales Handoff",
    channel: "SMS",
    status: "draft",
    responses: 4,
    lastUpdated: "Mar 28, 2026",
  },
];

const escalationRules = [
  {
    id: 1,
    trigger: "Customer mentions competitor offer",
    action: "Escalate to Sales Manager",
    priority: "high",
  },
  {
    id: 2,
    trigger: "Negative sentiment detected (2+ messages)",
    action: "Escalate to BDC Manager",
    priority: "high",
  },
  {
    id: 3,
    trigger: "Credit / financing questions",
    action: "Escalate to F&I Manager",
    priority: "medium",
  },
  {
    id: 4,
    trigger: "VIP / returning customer identified",
    action: "Notify original selling consultant",
    priority: "medium",
  },
  {
    id: 5,
    trigger: "Customer requests human agent",
    action: "Immediate handoff to available BDC agent",
    priority: "high",
  },
  {
    id: 6,
    trigger: "No AI confidence above 60% for 2+ turns",
    action: "Flag for human review",
    priority: "low",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure AI agent behavior, playbooks, and team management
        </p>
      </div>

      <Tabs defaultValue="playbooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playbooks" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            BDC Playbooks
          </TabsTrigger>
          <TabsTrigger value="escalation" className="gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Escalation Rules
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            AI Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playbooks">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                BDC Playbooks
              </CardTitle>
              <Button size="sm" className="gap-1.5">
                <Bot className="h-3.5 w-3.5" />
                New Playbook
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Playbook Name</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead className="text-center">Responses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playbooks.map((pb) => (
                    <TableRow key={pb.id} className="cursor-pointer hover:bg-accent/50">
                      <TableCell className="font-medium">{pb.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {pb.channel}
                      </TableCell>
                      <TableCell className="text-center">{pb.responses}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            pb.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {pb.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {pb.lastUpdated}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                Escalation Rules
              </CardTitle>
              <Button size="sm" variant="outline" className="gap-1.5">
                Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escalationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          rule.priority === "high"
                            ? "bg-red-50 text-red-500"
                            : rule.priority === "medium"
                            ? "bg-amber-50 text-amber-500"
                            : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rule.trigger}</p>
                        <p className="text-xs text-muted-foreground">
                          {rule.action}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        rule.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : rule.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {rule.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                Team Members
              </CardTitle>
              <Button size="sm" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Invite User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {user.role.replace(/-/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs text-emerald-600">Active</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <div className="grid gap-4 grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  AI Agent Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Default Operating Mode
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <Button size="sm" className="gap-1.5">
                      <Bot className="h-3.5 w-3.5" />
                      Fully Autonomous
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      Suggest & Approve
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      Draft Only
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Confidence Threshold for Auto-Send
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="85"
                      className="w-20 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      % (messages below this will be flagged for review)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Max Auto-Response Delay
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="30"
                      className="w-20 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      seconds
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Compliance & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">TCPA Compliance</p>
                    <p className="text-xs text-muted-foreground">
                      Enforce consent checks before outbound SMS
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Enabled
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">PII Redaction</p>
                    <p className="text-xs text-muted-foreground">
                      Redact SSN, credit scores in AI logs
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Enabled
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Audit Trail</p>
                    <p className="text-xs text-muted-foreground">
                      Log all AI actions with policy version
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Enabled
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">After-Hours Mode</p>
                    <p className="text-xs text-muted-foreground">
                      AI continues handling outside business hours
                    </p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">
                    Limited
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
