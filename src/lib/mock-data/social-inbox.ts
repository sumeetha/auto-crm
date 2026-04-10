export type SocialPlatform = "twitter" | "instagram" | "facebook";

export type SocialMessageSender = "customer" | "page" | "ai-draft" | "staff";

export type SocialMessage = {
  id: string;
  sender: SocialMessageSender;
  senderName: string;
  content: string;
  timestamp: string;
  confidence?: number;
};

export type SocialThreadStatus =
  | "unread"
  | "ai-handling"
  | "needs-reply"
  | "escalated"
  | "resolved";

export type SocialThread = {
  id: string;
  platform: SocialPlatform;
  threadType: "dm" | "comment";
  title: string;
  preview: string;
  status: SocialThreadStatus;
  unreadCount: number;
  lastMessageAt: string;
  linkedCustomerId?: string | null;
  linkedLeadId?: string | null;
  aiSummary: string;
  suggestedReply: string;
  messages: SocialMessage[];
};

export const socialThreads: SocialThread[] = [
  {
    id: "soc-1",
    platform: "facebook",
    threadType: "comment",
    title: "Sunrise Honda — Post: 2026 Accord hybrid",
    preview: "@MikeR: Is the Sport trim available in Sonic Gray?",
    status: "needs-reply",
    unreadCount: 1,
    lastMessageAt: "2026-04-11T14:20:00Z",
    linkedLeadId: "lead-5",
    aiSummary:
      "Prospective buyer asking about trim/color availability on a specific new model year. Positive intent; quick factual reply can convert to DM or appointment.",
    suggestedReply:
      "Hi Mike — yes, we can get Sport in Sonic Gray Pearl. Want me to check live allocation and DM you a window sticker?",
    messages: [
      {
        id: "sm-1-1",
        sender: "page",
        senderName: "Sunrise Honda",
        content:
          "The 2026 Accord Hybrid is here — up to 48 mpg combined. Book a test drive this week.",
        timestamp: "2026-04-11T12:00:00Z",
      },
      {
        id: "sm-1-2",
        sender: "customer",
        senderName: "Mike R.",
        content: "Is the Sport trim available in Sonic Gray?",
        timestamp: "2026-04-11T14:20:00Z",
      },
      {
        id: "sm-1-3",
        sender: "ai-draft",
        senderName: "Sunrise AI",
        content:
          "Hi Mike — yes, Sport is available in Sonic Gray Pearl. I can confirm inbound units today; reply here or DM us your phone # and a specialist will follow up within the hour.",
        timestamp: "2026-04-11T14:21:00Z",
        confidence: 0.88,
      },
    ],
  },
  {
    id: "soc-2",
    platform: "instagram",
    threadType: "dm",
    title: "@sarahdrives__ (DM)",
    preview: "Do you take trade-ins with a loan payoff?",
    status: "ai-handling",
    unreadCount: 0,
    lastMessageAt: "2026-04-11T13:55:00Z",
    aiSummary:
      "Trade-in with payoff question — common objection handling. AI drafted compliant, non-binding guidance.",
    suggestedReply:
      "We work trades with payoffs every day. Bring your VIN + lender statement and we’ll structure the deal transparently.",
    messages: [
      {
        id: "sm-2-1",
        sender: "customer",
        senderName: "sarahdrives__",
        content: "Do you take trade-ins with a loan payoff?",
        timestamp: "2026-04-11T13:50:00Z",
      },
      {
        id: "sm-2-2",
        sender: "ai-draft",
        senderName: "Sunrise AI",
        content:
          "Yes — we handle payoffs with your lender directly. A specialist will confirm payoff amount and equity before you sign anything. Want to send your VIN?",
        timestamp: "2026-04-11T13:55:00Z",
        confidence: 0.91,
      },
    ],
  },
  {
    id: "soc-3",
    platform: "twitter",
    threadType: "comment",
    title: "@SunriseHonda — mention",
    preview: "@DealSeeker99: Your BDC never called me back 🤬",
    status: "escalated",
    unreadCount: 2,
    lastMessageAt: "2026-04-11T12:10:00Z",
    linkedCustomerId: "cust-4",
    aiSummary:
      "Public complaint about follow-up. Escalate to manager; empathetic public reply + move to private channel.",
    suggestedReply:
      "We’re sorry this happened — that’s not the experience we want. Please DM us your mobile # and we’ll have a manager reach out within 30 minutes.",
    messages: [
      {
        id: "sm-3-1",
        sender: "customer",
        senderName: "DealSeeker99",
        content: "@SunriseHonda Your BDC never called me back 🤬",
        timestamp: "2026-04-11T12:08:00Z",
      },
      {
        id: "sm-3-2",
        sender: "ai-draft",
        senderName: "Sunrise AI",
        content:
          "[Awaiting approval] We’re sorry for the missed follow-up. Please DM your contact info and a manager will reach out shortly.",
        timestamp: "2026-04-11T12:10:00Z",
        confidence: 0.72,
      },
    ],
  },
  {
    id: "soc-4",
    platform: "facebook",
    threadType: "dm",
    title: "Facebook Page — James P.",
    preview: "What’s your best OTD on a CR-V EX?",
    status: "needs-reply",
    unreadCount: 1,
    lastMessageAt: "2026-04-11T11:40:00Z",
    linkedLeadId: "lead-8",
    aiSummary:
      "Price shopping via Messenger. Avoid binding OTD in public; invite to appointment or phone with disclaimer.",
    suggestedReply:
      "OTD varies by taxes/fees — happy to itemize. Are you in zip 62704? I can have BDC send a worksheet in the next hour.",
    messages: [
      {
        id: "sm-4-1",
        sender: "customer",
        senderName: "James P.",
        content: "What’s your best OTD on a CR-V EX?",
        timestamp: "2026-04-11T11:38:00Z",
      },
    ],
  },
  {
    id: "soc-5",
    platform: "instagram",
    threadType: "comment",
    title: "Reel: Type R walkaround",
    preview: "@track_day_matt: MSRP or markup?",
    status: "resolved",
    unreadCount: 0,
    lastMessageAt: "2026-04-10T18:00:00Z",
    aiSummary:
      "Type R pricing question answered by staff; thread closed positively.",
    suggestedReply: "",
    messages: [
      {
        id: "sm-5-1",
        sender: "customer",
        senderName: "track_day_matt",
        content: "MSRP or markup?",
        timestamp: "2026-04-10T17:45:00Z",
      },
      {
        id: "sm-5-2",
        sender: "staff",
        senderName: "Alex M.",
        content:
          "Matt — we’re MSRP on in-stock Type R; no addendum. DM if you want to hold one.",
        timestamp: "2026-04-10T18:00:00Z",
      },
    ],
  },
  {
    id: "soc-6",
    platform: "twitter",
    threadType: "dm",
    title: "@fleet_buyer_il (DM)",
    preview: "Do you sell to small businesses?",
    status: "unread",
    unreadCount: 1,
    lastMessageAt: "2026-04-11T15:00:00Z",
    aiSummary:
      "B2B fleet inquiry — route to fleet manager; AI can draft intro acknowledging fleet program.",
    suggestedReply:
      "Yes — we work with small fleets and commercial registrations. I can connect you with our fleet specialist. Best callback #?",
    messages: [
      {
        id: "sm-6-1",
        sender: "customer",
        senderName: "fleet_buyer_il",
        content: "Do you sell to small businesses?",
        timestamp: "2026-04-11T15:00:00Z",
      },
    ],
  },
  {
    id: "soc-7",
    platform: "facebook",
    threadType: "comment",
    title: "Event post — Spring sales event",
    preview: "Linda K.: Is the $0 down real?",
    status: "needs-reply",
    unreadCount: 1,
    lastMessageAt: "2026-04-11T10:15:00Z",
    aiSummary:
      "Advertising-sensitive question; requires compliant language and likely human review.",
    suggestedReply:
      "Hi Linda — offers vary by credit and vehicle. We’ll walk through approved terms with no surprises. Can we call you at the # on your profile?",
    messages: [
      {
        id: "sm-7-1",
        sender: "customer",
        senderName: "Linda K.",
        content: "Is the $0 down real?",
        timestamp: "2026-04-11T10:15:00Z",
      },
    ],
  },
  {
    id: "soc-8",
    platform: "instagram",
    threadType: "dm",
    title: "@emma_civic (DM)",
    preview: "Love my service advisor — can I request Carlos?",
    status: "resolved",
    unreadCount: 0,
    lastMessageAt: "2026-04-09T09:00:00Z",
    linkedCustomerId: "cust-2",
    aiSummary: "Service preference note; positive sentiment.",
    suggestedReply: "",
    messages: [
      {
        id: "sm-8-1",
        sender: "customer",
        senderName: "emma_civic",
        content: "Love my service advisor — can I request Carlos?",
        timestamp: "2026-04-09T08:55:00Z",
      },
      {
        id: "sm-8-2",
        sender: "staff",
        senderName: "Service Desk",
        content:
          "Absolutely — note added to your profile. Ask for Carlos at check-in or book via the link we sent.",
        timestamp: "2026-04-09T09:00:00Z",
      },
    ],
  },
];
