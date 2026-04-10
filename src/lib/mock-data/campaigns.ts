export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "paused"
  | "failed";

export type CampaignChannel = "sms" | "email";

export type CampaignSegment = {
  id: string;
  label: string;
  description: string;
  estimatedCount: number;
};

export const campaignSegments: CampaignSegment[] = [
  {
    id: "seg-lease-90",
    label: "Lease ending < 90 days",
    description: "Customers with a lease end date in the next 90 days.",
    estimatedCount: 142,
  },
  {
    id: "seg-service-12",
    label: "Service, no sale (12 mo)",
    description: "Serviced in the last 12 months with no new vehicle purchase.",
    estimatedCount: 389,
  },
  {
    id: "seg-cold-leads",
    label: "Cold leads (14+ days)",
    description: "Leads with no outbound contact in 14+ days.",
    estimatedCount: 56,
  },
  {
    id: "seg-equity-positive",
    label: "Positive equity owners",
    description: "Customers with estimated positive equity on current vehicle.",
    estimatedCount: 201,
  },
];

export type Campaign = {
  id: string;
  name: string;
  segmentId: string;
  segmentLabel: string;
  recipientCount: number;
  channels: CampaignChannel[];
  status: CampaignStatus;
  subject: string | null;
  bodyPreview: string;
  createdAt: string;
  scheduledAt: string | null;
  sentAt: string | null;
  metrics?: {
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  };
};

export const campaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Spring lease renewal — CR-V & Pilot",
    segmentId: "seg-lease-90",
    segmentLabel: "Lease ending < 90 days",
    recipientCount: 142,
    channels: ["sms", "email"],
    status: "sent",
    subject: "{{firstName}}, your Honda lease options at {{dealerName}}",
    bodyPreview:
      "Hi {{firstName}}, your lease is winding down. We have early turn-in options and 2026 CR-V / Pilot incentives…",
    createdAt: "2026-04-01T10:00:00Z",
    scheduledAt: "2026-04-02T14:00:00Z",
    sentAt: "2026-04-02T14:02:00Z",
    metrics: {
      delivered: 138,
      opened: 91,
      clicked: 34,
      replied: 22,
      bounced: 4,
    },
  },
  {
    id: "camp-2",
    name: "Service reminder + trade appraisal",
    segmentId: "seg-service-12",
    segmentLabel: "Service, no sale (12 mo)",
    recipientCount: 389,
    channels: ["email"],
    status: "scheduled",
    subject: "Thanks for trusting us with your service, {{firstName}}",
    bodyPreview:
      "We’d love to show you what your vehicle is worth toward your next Honda — book a no-pressure appraisal…",
    createdAt: "2026-04-08T16:30:00Z",
    scheduledAt: "2026-04-12T09:00:00Z",
    sentAt: null,
  },
  {
    id: "camp-3",
    name: "Re-engage: weekend test drive slots",
    segmentId: "seg-cold-leads",
    segmentLabel: "Cold leads (14+ days)",
    recipientCount: 56,
    channels: ["sms"],
    status: "draft",
    subject: null,
    bodyPreview:
      "Still interested in a test drive? We have Saturday slots open — reply YES to hold a time.",
    createdAt: "2026-04-10T11:00:00Z",
    scheduledAt: null,
    sentAt: null,
  },
  {
    id: "camp-4",
    name: "Equity opportunity — upgrade event",
    segmentId: "seg-equity-positive",
    segmentLabel: "Positive equity owners",
    recipientCount: 201,
    channels: ["sms", "email"],
    status: "paused",
    subject: "You may have equity to use toward your next vehicle",
    bodyPreview:
      "Based on recent market data, your current vehicle may carry positive equity. Let’s review options…",
    createdAt: "2026-03-20T09:00:00Z",
    scheduledAt: "2026-04-15T10:00:00Z",
    sentAt: null,
  },
  {
    id: "camp-5",
    name: "Memorial Day preview — VIP list",
    segmentId: "seg-equity-positive",
    segmentLabel: "Positive equity owners",
    recipientCount: 120,
    channels: ["email"],
    status: "sending",
    subject: "Early access: Memorial Day offers ({{dealerName}})",
    bodyPreview:
      "You’re on our VIP list for early Memorial Day incentives. Inventory is limited — confirm interest…",
    createdAt: "2026-04-11T08:00:00Z",
    scheduledAt: "2026-04-11T08:05:00Z",
    sentAt: null,
  },
  {
    id: "camp-6",
    name: "April service coupon blast",
    segmentId: "seg-service-12",
    segmentLabel: "Service, no sale (12 mo)",
    recipientCount: 400,
    channels: ["sms"],
    status: "failed",
    subject: null,
    bodyPreview: "$29.95 synthetic oil change this month — show this text at write-up.",
    createdAt: "2026-04-05T12:00:00Z",
    scheduledAt: "2026-04-05T13:00:00Z",
    sentAt: null,
  },
];
