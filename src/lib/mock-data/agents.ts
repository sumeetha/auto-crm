export type CustomAgentStatus = "draft" | "deployed";

export type CustomAgent = {
  id: string;
  name: string;
  description: string;
  modelLabel: string;
  capabilities: string[];
  status: CustomAgentStatus;
  deployedAt: string | null;
};

export const customAgents: CustomAgent[] = [
  {
    id: "agent-1",
    name: "First-response BDC (SMS)",
    description:
      "Handles initial SMS replies for internet leads; books appointments within policy.",
    modelLabel: "AutoCRM Lead v2",
    capabilities: ["SMS", "Lead CRM", "Calendar"],
    status: "deployed",
    deployedAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "agent-2",
    name: "Service equity miner",
    description:
      "Evaluates service arrivals for equity and buy-cycle; drafts consultant-aware outreach.",
    modelLabel: "AutoCRM Service v1",
    capabilities: ["Service RO", "Equity", "SMS"],
    status: "deployed",
    deployedAt: "2026-03-22T15:30:00Z",
  },
  {
    id: "agent-3",
    name: "Desking objection coach",
    description:
      "Internal-only agent: suggests evidence-backed rebuttals from deal + inventory context.",
    modelLabel: "GPT-4.1",
    capabilities: ["Deals", "Inventory", "Internal"],
    status: "draft",
    deployedAt: null,
  },
  {
    id: "agent-4",
    name: "Campaign copy assistant",
    description:
      "Drafts segmented campaign variants with merge fields; requires human approval to send.",
    modelLabel: "AutoCRM Comms v1",
    capabilities: ["Campaigns", "Consent flags"],
    status: "draft",
    deployedAt: null,
  },
];
