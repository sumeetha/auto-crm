"use client";

import { useMemo, useState } from "react";
import {
  customAgents as seedAgents,
  type CustomAgent,
  type CustomAgentStatus,
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
import { Bot, Plus } from "lucide-react";

const agentStatusStyles: Record<
  CustomAgentStatus,
  { className: string; label: string }
> = {
  draft: { className: "bg-slate-100 text-slate-700", label: "Draft" },
  deployed: {
    className: "bg-violet-100 text-violet-800",
    label: "Deployed",
  },
};

function formatShortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AgentsPage() {
  const [items, setItems] = useState<CustomAgent[]>(() => [...seedAgents]);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modelLabel, setModelLabel] = useState("AutoCRM custom");
  const [systemPrompt, setSystemPrompt] = useState("");

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const ta = a.deployedAt ? new Date(a.deployedAt).getTime() : 0;
        const tb = b.deployedAt ? new Date(b.deployedAt).getTime() : 0;
        return tb - ta;
      }),
    [items],
  );

  function resetForm() {
    setName("");
    setDescription("");
    setModelLabel("AutoCRM custom");
    setSystemPrompt("");
  }

  function handleSave() {
    const trimmed = name.trim() || "Untitled agent";
    const newItem: CustomAgent = {
      id: `agent-${Date.now()}`,
      name: trimmed,
      description: description.trim() || "No description",
      modelLabel: modelLabel.trim() || "AutoCRM custom",
      capabilities: systemPrompt.trim()
        ? ["Custom prompt"]
        : ["Configurable"],
      status: "draft",
      deployedAt: null,
    };
    setItems((prev) => [newItem, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  function deploy(id: string) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "deployed" as const,
              deployedAt: new Date().toISOString(),
            }
          : a,
      ),
    );
  }

  function pause(id: string) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "draft" as const, deployedAt: null }
          : a,
      ),
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Create and (mock) deploy custom AI agents with scoped capabilities.
            Complements the default BDC agent; use for specialized roles
            (service equity, desking assist, campaign copy, etc.).
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New agent
        </Button>
      </div>

      <Card className="border-dashed border-muted-foreground/25 bg-muted/20 p-3">
        <div className="flex gap-2">
          <Bot className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Prototype only: deploy toggles local state. Production would enforce
            RBAC, model routing, tool allow-lists, and immutable audit of
            versions.
          </p>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[18%]">Agent</TableHead>
              <TableHead className="w-[16%]">Model</TableHead>
              <TableHead className="w-[34%] min-w-0">Description</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[128px]">Deployed</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {a.modelLabel}
                </TableCell>
                <TableCell className="min-w-0 whitespace-normal align-top">
                  <p
                    className="line-clamp-2 break-words text-sm leading-snug text-foreground/90"
                    title={a.description}
                  >
                    {a.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal",
                      agentStatusStyles[a.status].className,
                    )}
                  >
                    {agentStatusStyles[a.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatShortDate(a.deployedAt)}
                </TableCell>
                <TableCell className="text-right">
                  {a.status === "draft" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => deploy(a.id)}
                    >
                      Deploy (mock)
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => pause(a.id)}
                    >
                      Pause
                    </Button>
                  )}
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
            <SheetTitle>New agent</SheetTitle>
            <SheetDescription>
              Define role and optional system instructions. Saved as draft until
              you deploy (mock).
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4">
            <div className="space-y-1">
              <p className="text-xs font-medium">Name</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Used car re-engagement"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Description</p>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this agent does and when to use it"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Model / profile label</p>
              <Input
                value={modelLabel}
                onChange={(e) => setModelLabel(e.target.value)}
                placeholder="e.g. GPT-4.1 or AutoCRM Lead v2"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">System prompt (optional)</p>
              <Textarea
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Tone, guardrails, and tools this agent may use (prototype text only)"
              />
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
              Save agent (mock)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
