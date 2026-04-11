export type LeadWorkflowStatus = "draft" | "active" | "paused";

export type LeadWorkflow = {
  id: string;
  name: string;
  triggerLabel: string;
  stepSummary: string;
  status: LeadWorkflowStatus;
  updatedAt: string;
};

export const leadWorkflows: LeadWorkflow[] = [
  {
    id: "wf-1",
    name: "New internet — speed-to-lead",
    triggerLabel: "New internet lead created",
    stepSummary: "Assign round-robin BDC → SMS + email intro → task if no reply 15m",
    status: "active",
    updatedAt: "2026-04-09T14:00:00Z",
  },
  {
    id: "wf-2",
    name: "No response — 24h nurture",
    triggerLabel: "Lead untouched 24 hours",
    stepSummary: "Second touch SMS → manager alert → move to ‘Working’ if any reply",
    status: "active",
    updatedAt: "2026-04-08T11:30:00Z",
  },
  {
    id: "wf-3",
    name: "Appointment set — handoff",
    triggerLabel: "Appointment status = confirmed",
    stepSummary: "Notify assigned sales → prep sheet → stop BDC auto-sequences",
    status: "active",
    updatedAt: "2026-04-07T09:15:00Z",
  },
  {
    id: "wf-4",
    name: "Trade-in inquiry — valuation path",
    triggerLabel: "Lead mentions trade or equity",
    stepSummary: "AI qualify trade → book appraisal slot → escalate if negative equity",
    status: "draft",
    updatedAt: "2026-04-05T16:45:00Z",
  },
  {
    id: "wf-5",
    name: "VIP / repeat buyer",
    triggerLabel: "Customer tagged VIP or prior purchase < 36 mo",
    stepSummary: "Route to original consultant → skip generic BDC queue",
    status: "paused",
    updatedAt: "2026-03-28T10:00:00Z",
  },
];
