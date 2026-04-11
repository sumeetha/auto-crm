"use client";

import { useMemo, useState } from "react";
import {
  leadWorkflows as seedWorkflows,
  type LeadWorkflow,
  type LeadWorkflowStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { GitBranch, Plus } from "lucide-react";

const workflowStatusStyles: Record<
  LeadWorkflowStatus,
  { className: string; label: string }
> = {
  draft: { className: "bg-slate-100 text-slate-700", label: "Draft" },
  active: { className: "bg-emerald-100 text-emerald-800", label: "Active" },
  paused: { className: "bg-orange-100 text-orange-800", label: "Paused" },
};

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkflowsPage() {
  const [items, setItems] = useState<LeadWorkflow[]>(() => [...seedWorkflows]);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [steps, setSteps] = useState("");
  const [status, setStatus] = useState<LeadWorkflowStatus>("draft");

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [items],
  );

  function resetForm() {
    setName("");
    setTrigger("");
    setSteps("");
    setStatus("draft");
  }

  function handleSave() {
    const trimmedName = name.trim() || "Untitled workflow";
    const newItem: LeadWorkflow = {
      id: `wf-${Date.now()}`,
      name: trimmedName,
      triggerLabel: trigger.trim() || "Custom trigger",
      stepSummary: steps.trim() || "No steps described yet",
      status,
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Lead-management automations: when a trigger fires, run ordered
            actions (assign, notify, tasks, stage changes). Distinct from{" "}
            <span className="text-foreground/80">Settings → BDC Playbooks</span>
            , which are conversation templates.
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New workflow
        </Button>
      </div>

      <Card className="border-dashed border-muted-foreground/25 bg-muted/20 p-3">
        <div className="flex gap-2">
          <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Prototype only: workflows are stored in browser state. Production
            would persist definitions, version policies, and audit each run
            against Tekion lead events.
          </p>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[22%]">Workflow</TableHead>
              <TableHead className="w-[20%]">Trigger</TableHead>
              <TableHead>Steps (summary)</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[110px]">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {w.triggerLabel}
                </TableCell>
                <TableCell className="max-w-md text-sm text-foreground/90">
                  {w.stepSummary}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal",
                      workflowStatusStyles[w.status].className,
                    )}
                  >
                    {workflowStatusStyles[w.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatShortDate(w.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetForm();
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New workflow</SheetTitle>
            <SheetDescription>
              Define a lead trigger and what should happen next. Mock save only
              — no Tekion writes.
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4">
            <div className="space-y-1">
              <p className="text-xs font-medium">Name</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hot lead — immediate call task"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Trigger</p>
              <Input
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g. Lead source = CarGurus and status = New"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Steps (summary)</p>
              <Textarea
                rows={4}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 1) Assign to BDC pool 2) Send SMS intro 3) Create follow-up task in 2h"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Initial status</p>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as LeadWorkflowStatus)
                }
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          <SheetFooter className="border-t">
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save workflow (mock)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
