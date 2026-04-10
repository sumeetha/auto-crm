export type Message = {
  id: string;
  sender: "customer" | "ai-agent" | "human-agent";
  senderName: string;
  content: string;
  timestamp: string;
  confidence?: number;
};

export type ConversationSummary = {
  aiSummary: string;
  smartTags: string[];
  leadScore: number;
  scoreFactors: string[];
  qualificationData: {
    budget?: string;
    timeline?: string;
    tradeIn?: string;
    creditRange?: string;
    vehiclePreference?: string;
  };
  suggestedActions: string[];
};

export type Conversation = {
  id: string;
  /** When set, deep-links from customer profile → BDC (`?customerId=`). */
  customerId?: string | null;
  leadId: string;
  leadName: string;
  channel: "sms" | "email" | "chat";
  status:
    | "ai-handling"
    | "needs-review"
    | "escalated"
    | "human-active"
    | "closed";
  assignedUserId: string | null;
  messages: Message[];
  summary: ConversationSummary;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
};

export const conversations: Conversation[] = [
  // 1. Happy path: AI qualifies and books appointment successfully
  {
    id: "conv-1",
    leadId: "lead-2",
    leadName: "Jennifer Martinez",
    channel: "sms",
    status: "closed",
    assignedUserId: "user-2",
    messages: [
      {
        id: "msg-1-1",
        sender: "customer",
        senderName: "Jennifer Martinez",
        content: "Hi, I saw the 2026 CR-V Sport Touring Hybrid on your website. Is it still available?",
        timestamp: "2026-04-07T14:22:00Z",
      },
      {
        id: "msg-1-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Jennifer! Yes, we have the 2026 Honda CR-V Sport Touring Hybrid in Canyon River Blue available right now. It's one of our most popular models — the hybrid gets an impressive 40+ mpg combined. Are you looking to buy or lease?",
        timestamp: "2026-04-07T14:22:45Z",
        confidence: 0.95,
      },
      {
        id: "msg-1-3",
        sender: "customer",
        senderName: "Jennifer Martinez",
        content: "Probably lease. My Mazda CX-5 lease is up in June and I want something bigger with better gas mileage",
        timestamp: "2026-04-07T14:25:00Z",
      },
      {
        id: "msg-1-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "The CR-V Hybrid is a great step up from the CX-5! You'll love the extra cargo space and the hybrid really delivers on fuel economy. We have some competitive lease programs right now on the Sport Touring trim. Would you like to come in for a test drive? I can have everything ready for you.",
        timestamp: "2026-04-07T14:25:30Z",
        confidence: 0.93,
      },
      {
        id: "msg-1-5",
        sender: "customer",
        senderName: "Jennifer Martinez",
        content: "Yeah that would be great. Do you have anything this Saturday?",
        timestamp: "2026-04-07T14:27:00Z",
      },
      {
        id: "msg-1-6",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Absolutely! I have openings at 11:00 AM and 2:00 PM this Saturday. Which works better for you? I'll pair you with one of our product specialists who can walk you through all the hybrid features.",
        timestamp: "2026-04-07T14:27:25Z",
        confidence: 0.97,
      },
      {
        id: "msg-1-7",
        sender: "customer",
        senderName: "Jennifer Martinez",
        content: "11 AM works. My husband might come too",
        timestamp: "2026-04-07T14:28:00Z",
      },
      {
        id: "msg-1-8",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "You're all set for Saturday at 11:00 AM! The more the merrier 😊. You'll be working with Rob Johnson — he's great with the Honda hybrid lineup. We're at 1500 Auto Mall Drive. I'll send you a confirmation and a reminder the day before. Is there anything else I can help with?",
        timestamp: "2026-04-07T14:28:30Z",
        confidence: 0.96,
      },
      {
        id: "msg-1-9",
        sender: "customer",
        senderName: "Jennifer Martinez",
        content: "No that's perfect, thank you!",
        timestamp: "2026-04-07T14:29:00Z",
      },
    ],
    summary: {
      aiSummary: "Customer inquired about 2026 CR-V Sport Touring Hybrid. Currently leasing a Mazda CX-5 expiring June. Interested in lease. Appointment booked Saturday 11 AM with Rob Johnson. Husband may attend.",
      smartTags: ["hot-lead", "lease-expiring", "conquest"],
      leadScore: 85,
      scoreFactors: [
        "Active lease ending within 90 days",
        "Specific vehicle interest",
        "Appointment booked",
        "Conquest from competitor brand",
      ],
      qualificationData: {
        timeline: "June (lease end)",
        tradeIn: "2022 Mazda CX-5 Touring (lease return)",
        vehiclePreference: "2026 CR-V Sport Touring Hybrid",
      },
      suggestedActions: [
        "Prepare CR-V Hybrid lease numbers before appointment",
        "Have competitive comparison sheet vs CX-5 ready",
        "Confirm appointment Friday evening",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-07T14:29:00Z",
    createdAt: "2026-04-07T14:22:00Z",
  },

  // 2. AI handles price inquiry with trade-in discussion
  {
    id: "conv-2",
    leadId: "lead-1",
    leadName: "Michael Torres",
    channel: "chat",
    status: "human-active",
    assignedUserId: "user-1",
    messages: [
      {
        id: "msg-2-1",
        sender: "customer",
        senderName: "Michael Torres",
        content: "What's your best price on the 2026 CR-V EX-L? Stock H1001",
        timestamp: "2026-04-05T09:15:00Z",
      },
      {
        id: "msg-2-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Michael! Thanks for reaching out about the 2026 CR-V EX-L (Stock #H1001). It's a beautiful vehicle in Radiant Red with black leather interior. The MSRP is $38,400. We're currently running competitive pricing on the CR-V lineup. Do you have a vehicle you'd be trading in? That often helps us put together the best overall deal.",
        timestamp: "2026-04-05T09:15:35Z",
        confidence: 0.91,
      },
      {
        id: "msg-2-3",
        sender: "customer",
        senderName: "Michael Torres",
        content: "Yeah I have a 2019 Accord LX with about 62k miles. What could I get for it?",
        timestamp: "2026-04-05T09:18:00Z",
      },
      {
        id: "msg-2-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "A 2019 Accord LX with 62k miles is in great demand right now. Based on current market values, you'd likely be looking at somewhere in the $15,500–$17,500 range depending on condition. That would bring the CR-V EX-L into a really comfortable monthly payment. Would you like one of our managers to give you a firm trade-in number? We can do that in person or even start with some photos if you prefer.",
        timestamp: "2026-04-05T09:18:40Z",
        confidence: 0.85,
      },
      {
        id: "msg-2-5",
        sender: "customer",
        senderName: "Michael Torres",
        content: "I was hoping for at least 18k on the trade. KBB shows 17-19k",
        timestamp: "2026-04-05T09:21:00Z",
      },
      {
        id: "msg-2-6",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "I understand — and KBB is a good reference point. Our trade-in values are very competitive, and our used car manager will want to see the vehicle to give you the strongest number possible. We've been retailing clean Accords quickly, so there's definitely demand. Let me connect you with Rob Johnson, who can work through the numbers with you in detail. He's our best at putting the whole deal together. Would you like to come in, or would you prefer a phone call first?",
        timestamp: "2026-04-05T09:21:30Z",
        confidence: 0.82,
      },
      {
        id: "msg-2-7",
        sender: "customer",
        senderName: "Michael Torres",
        content: "I can come in. But I want to know the out-the-door number before I drive down there",
        timestamp: "2026-04-05T09:23:00Z",
      },
      {
        id: "msg-2-8",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Hey Michael, Rob here. I totally get it — nobody likes surprises. Let me pull some numbers together based on your trade and I'll text you a ballpark OTD figure within the hour. Quick question — are you planning to finance or paying cash?",
        timestamp: "2026-04-05T09:35:00Z",
      },
      {
        id: "msg-2-9",
        sender: "customer",
        senderName: "Michael Torres",
        content: "Financing, probably 60 months. Credit score is around 740",
        timestamp: "2026-04-05T09:37:00Z",
      },
      {
        id: "msg-2-10",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Perfect, with a 740 you'll qualify for some great rates. Give me about 30 min and I'll have some numbers for you.",
        timestamp: "2026-04-05T09:38:00Z",
      },
    ],
    summary: {
      aiSummary: "Returning customer Michael Torres inquiring about 2026 CR-V EX-L pricing. Has 2019 Accord LX trade-in with 62k miles. Wants OTD pricing before visiting. 740 credit score, looking at 60-month financing. Handed off to Rob Johnson for deal structuring.",
      smartTags: ["hot-lead", "trade-in", "returning-customer"],
      leadScore: 92,
      scoreFactors: [
        "Specific stock number referenced",
        "Trade-in ready",
        "Strong credit profile (740)",
        "Requesting OTD numbers (buying signal)",
        "Returning customer",
      ],
      qualificationData: {
        budget: "60-month financing",
        timeline: "Ready now",
        tradeIn: "2019 Honda Accord LX, 62k miles",
        creditRange: "740",
        vehiclePreference: "2026 CR-V EX-L (H1001)",
      },
      suggestedActions: [
        "Send OTD worksheet within the hour as promised",
        "Get appraisal range from used car manager",
        "Prepare Ally Financial rate sheet for 740+ FICO",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-05T09:38:00Z",
    createdAt: "2026-04-05T09:15:00Z",
  },

  // 3. Escalated: customer asks about special financing (credit concern)
  {
    id: "conv-3",
    leadId: "lead-13",
    leadName: "Carlos Ramirez",
    channel: "chat",
    status: "escalated",
    assignedUserId: "user-3",
    messages: [
      {
        id: "msg-3-1",
        sender: "customer",
        senderName: "Carlos Ramirez",
        content: "Hi, I'm looking at the 2025 Civic EX. I want to be upfront — my credit isn't great. Had some medical bills a couple years ago. Is there any point in even applying?",
        timestamp: "2026-04-09T20:15:00Z",
      },
      {
        id: "msg-3-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Carlos! Thanks for being upfront — and absolutely, it's worth exploring. We work with a wide range of lenders, including several that specialize in helping people rebuild credit. The 2025 Civic EX is a fantastic choice and we have one priced at $29,999 right now. Can I ask — do you have a rough idea of your credit score range?",
        timestamp: "2026-04-09T20:15:40Z",
        confidence: 0.88,
      },
      {
        id: "msg-3-3",
        sender: "customer",
        senderName: "Carlos Ramirez",
        content: "Last time I checked it was around 580. The medical stuff is from 2023",
        timestamp: "2026-04-09T20:18:00Z",
      },
      {
        id: "msg-3-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "A 580 is definitely workable. Medical collections are viewed more favorably by many lenders, especially when they're a couple of years old. We've helped plenty of customers in similar situations get approved. The rate may be a bit higher, but it's also a great opportunity to rebuild. Do you have a monthly budget in mind for payments?",
        timestamp: "2026-04-09T20:18:35Z",
        confidence: 0.84,
      },
      {
        id: "msg-3-5",
        sender: "customer",
        senderName: "Carlos Ramirez",
        content: "I could do around 400-450 a month. Do you guys do those special finance programs? My coworker mentioned something about first-time buyer programs too",
        timestamp: "2026-04-09T20:21:00Z",
      },
      {
        id: "msg-3-6",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Great question — let me connect you with our finance team who can walk you through all available programs. We do work with lenders that have credit rebuilding and first-time buyer programs. Marcus Williams, our BDC manager, will reach out to you. He's fantastic at finding the right lending solution. Is tomorrow morning a good time for a quick call?",
        timestamp: "2026-04-09T20:21:30Z",
        confidence: 0.79,
      },
      {
        id: "msg-3-7",
        sender: "customer",
        senderName: "Carlos Ramirez",
        content: "Yeah morning works, before noon if possible. I really appreciate you not making me feel bad about the credit thing",
        timestamp: "2026-04-09T20:23:00Z",
      },
      {
        id: "msg-3-8",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Of course, Carlos — everyone's situation is different and we're here to help. Marcus will call you before noon tomorrow. In the meantime, if you want a head start, you can fill out a quick pre-qualification form on our website — it's a soft pull so it won't affect your score. I'll text you the link!",
        timestamp: "2026-04-09T20:23:30Z",
        confidence: 0.91,
      },
    ],
    summary: {
      aiSummary: "First-time buyer Carlos Ramirez interested in 2025 Civic EX. Credit score ~580 due to medical collections from 2023. Budget $400-450/month. Asking about special finance and first-time buyer programs. Escalated to Marcus Williams for finance consultation. Call scheduled before noon.",
      smartTags: ["credit-concern", "first-time-buyer"],
      leadScore: 60,
      scoreFactors: [
        "Clear vehicle interest",
        "Defined monthly budget",
        "Credit challenges (580)",
        "Engaged and responsive",
        "Willing to apply",
      ],
      qualificationData: {
        budget: "$400-450/month",
        timeline: "Ready now",
        creditRange: "~580 (medical collections)",
        vehiclePreference: "2025 Honda Civic EX",
      },
      suggestedActions: [
        "Marcus to call before noon tomorrow",
        "Pre-screen with Capital One and Westlake Financial",
        "Prepare payment scenarios at different rates for $29,999 selling price",
        "Send soft-pull pre-qualification link",
      ],
    },
    unreadCount: 1,
    lastMessageAt: "2026-04-09T20:23:30Z",
    createdAt: "2026-04-09T20:15:00Z",
  },

  // 4. Human took over after AI initial response
  {
    id: "conv-4",
    leadId: "lead-10",
    leadName: "Stephanie Reed",
    channel: "sms",
    status: "human-active",
    assignedUserId: "user-1",
    messages: [
      {
        id: "msg-4-1",
        sender: "customer",
        senderName: "Stephanie Reed",
        content: "Hi, I was in on Saturday looking at the Accord Touring Hybrid. Is that white one still available?",
        timestamp: "2026-04-08T10:45:00Z",
      },
      {
        id: "msg-4-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Stephanie! Yes, the 2026 Accord Touring Hybrid in Platinum White Pearl is still here. It's a stunning vehicle — did you get a chance to test drive it when you visited? Is there anything specific I can help you with today?",
        timestamp: "2026-04-08T10:45:35Z",
        confidence: 0.92,
      },
      {
        id: "msg-4-3",
        sender: "customer",
        senderName: "Stephanie Reed",
        content: "Yeah I drove it. I love it. But I need to figure out the trade-in situation. I have a 2021 Camry SE and I still owe about 16k on it",
        timestamp: "2026-04-08T10:48:00Z",
      },
      {
        id: "msg-4-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Great to hear you loved the drive! The 2021 Camry SE is a solid trade — they hold their value well. Let me get Rob Johnson looped in — he was working with you on Saturday, right? He can pull up your info and work through the trade numbers with you.",
        timestamp: "2026-04-08T10:48:30Z",
        confidence: 0.87,
      },
      {
        id: "msg-4-5",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Hey Stephanie! Great to hear from you. I remember — you really liked that white Accord. Let me get a fresh number on your Camry. What's the current mileage?",
        timestamp: "2026-04-08T11:15:00Z",
      },
      {
        id: "msg-4-6",
        sender: "customer",
        senderName: "Stephanie Reed",
        content: "About 41,000. It's in great shape, no accidents, regular maintenance at the Toyota dealer",
        timestamp: "2026-04-08T11:18:00Z",
      },
      {
        id: "msg-4-7",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "That's great — clean history and dealer-maintained is exactly what we like to see. Based on that, I'm looking at around $19,000-19,500 for the trade. With $16k owed, that gives you $3,000-3,500 in equity to roll into the new Accord. Want me to put together some payment options?",
        timestamp: "2026-04-08T11:45:00Z",
      },
      {
        id: "msg-4-8",
        sender: "customer",
        senderName: "Stephanie Reed",
        content: "Yes please! I'm thinking 72 months. What kind of rate can you get me? My credit is excellent — over 780",
        timestamp: "2026-04-08T11:48:00Z",
      },
      {
        id: "msg-4-9",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "With 780+ you're going to get the best rates available. Honda Financial is at 4.9% on 72 months right now, and I bet Capital One can beat that. Let me run some scenarios and get back to you this afternoon. Can you come in tomorrow to wrap this up?",
        timestamp: "2026-04-08T11:52:00Z",
      },
      {
        id: "msg-4-10",
        sender: "customer",
        senderName: "Stephanie Reed",
        content: "I can come Friday morning. Let me know the numbers and I'll plan on it!",
        timestamp: "2026-04-08T11:55:00Z",
      },
    ],
    summary: {
      aiSummary: "Stephanie Reed returned after Saturday test drive of 2026 Accord Touring Hybrid (White Pearl). Trading in 2021 Toyota Camry SE, 41k miles, owes $16k. Trade estimated $19-19.5k giving $3-3.5k equity. Excellent credit (780+). Wants 72-month financing. Rob Johnson working deal, customer coming Friday.",
      smartTags: ["hot-lead", "trade-in", "weekend-buyer"],
      leadScore: 90,
      scoreFactors: [
        "Already test drove vehicle",
        "Positive equity in trade",
        "Excellent credit score (780+)",
        "Requesting payment scenarios",
        "Set return visit",
      ],
      qualificationData: {
        budget: "72-month financing",
        timeline: "This week",
        tradeIn: "2021 Toyota Camry SE, 41k miles, $16k payoff",
        creditRange: "780+",
        vehiclePreference: "2026 Accord Touring Hybrid (Platinum White Pearl)",
      },
      suggestedActions: [
        "Send payment scenarios by EOD",
        "Get Capital One rate quote for 780+ / 72 months",
        "Prepare deal jacket for Friday morning",
        "Confirm Friday appointment",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-08T11:55:00Z",
    createdAt: "2026-04-08T10:45:00Z",
  },

  // 5. Appointment booked, customer confirmed
  {
    id: "conv-5",
    leadId: "lead-8",
    leadName: "Lisa Nguyen",
    channel: "sms",
    status: "closed",
    assignedUserId: "user-2",
    messages: [
      {
        id: "msg-5-1",
        sender: "customer",
        senderName: "Lisa Nguyen",
        content: "Hi! I'm interested in the HR-V EX-L. My Kia Seltos lease ends next month and I'm looking at Honda this time",
        timestamp: "2026-04-06T13:10:00Z",
      },
      {
        id: "msg-5-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Lisa! Welcome to Sunrise Honda! The 2026 HR-V EX-L is a fantastic choice — it's a great step up from the Seltos with more cargo room and Honda's renowned reliability. We have one in Urban Gray Pearl on the lot right now. With your Kia lease ending, timing is perfect. Would you like to come in for a test drive?",
        timestamp: "2026-04-06T13:10:40Z",
        confidence: 0.94,
      },
      {
        id: "msg-5-3",
        sender: "customer",
        senderName: "Lisa Nguyen",
        content: "Yes! How about this Sunday? And is that the only color you have?",
        timestamp: "2026-04-06T13:14:00Z",
      },
      {
        id: "msg-5-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Sunday works great! I have a 10:00 AM or 1:00 PM slot available. And we also have the HR-V Sport in Nordic Forest Pearl if you'd like to see both trims side by side. The EX-L adds leather seats, a power tailgate, and a few extra tech features. Which time works best?",
        timestamp: "2026-04-06T13:14:30Z",
        confidence: 0.93,
      },
      {
        id: "msg-5-5",
        sender: "customer",
        senderName: "Lisa Nguyen",
        content: "10 AM is perfect. And yeah I'd love to see both!",
        timestamp: "2026-04-06T13:16:00Z",
      },
      {
        id: "msg-5-6",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "You're all set for Sunday at 10:00 AM! I'll have both the HR-V EX-L and Sport pulled up and ready for you. You'll be working with Rob Johnson. We're at 1500 Auto Mall Drive. Quick question — are you pre-approved through a credit union or would you like us to shop rates for you?",
        timestamp: "2026-04-06T13:16:30Z",
        confidence: 0.95,
      },
      {
        id: "msg-5-7",
        sender: "customer",
        senderName: "Lisa Nguyen",
        content: "I'm pre-approved through my credit union at 5.2%. See you Sunday!",
        timestamp: "2026-04-06T13:18:00Z",
      },
      {
        id: "msg-5-8",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "That's a solid rate! We'll see if we can match or beat it too. See you Sunday at 10, Lisa! 🙌",
        timestamp: "2026-04-06T13:18:25Z",
        confidence: 0.96,
      },
      {
        id: "msg-5-9",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Lisa! Just a friendly reminder — you're all set for your HR-V test drive tomorrow at 10:00 AM with Rob. We'll have both the EX-L and Sport ready. See you then!",
        timestamp: "2026-04-11T17:00:00Z",
        confidence: 0.98,
      },
      {
        id: "msg-5-10",
        sender: "customer",
        senderName: "Lisa Nguyen",
        content: "Thanks for the reminder! I'll be there 😊",
        timestamp: "2026-04-11T17:15:00Z",
      },
    ],
    summary: {
      aiSummary: "Lisa Nguyen switching from Kia Seltos (lease ending next month) to Honda HR-V. Interested in EX-L and Sport trims. Pre-approved at 5.2% through credit union. Appointment confirmed Sunday 10 AM. Positive sentiment throughout.",
      smartTags: ["hot-lead", "lease-expiring", "conquest"],
      leadScore: 88,
      scoreFactors: [
        "Lease ending within 30 days",
        "Pre-approved financing",
        "Appointment confirmed",
        "Conquest from Kia",
        "Responsive and enthusiastic",
      ],
      qualificationData: {
        budget: "Pre-approved at 5.2%",
        timeline: "Next month (lease end)",
        tradeIn: "Kia Seltos (lease return)",
        vehiclePreference: "2026 HR-V EX-L or Sport",
      },
      suggestedActions: [
        "Have both HR-V EX-L and Sport detailed and ready",
        "Prepare competitive rate to beat 5.2%",
        "Pull lease-return numbers from Kia",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-11T17:15:00Z",
    createdAt: "2026-04-06T13:10:00Z",
  },

  // 6. Customer asking about specific vehicle availability
  {
    id: "conv-6",
    leadId: "lead-7",
    leadName: "Kevin O'Brien",
    channel: "sms",
    status: "ai-handling",
    assignedUserId: null,
    messages: [
      {
        id: "msg-6-1",
        sender: "customer",
        senderName: "Kevin O'Brien",
        content: "Do you guys have any Ridgelines in stock? Looking for the RTL-E specifically",
        timestamp: "2026-04-09T16:30:00Z",
      },
      {
        id: "msg-6-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Kevin! Yes, we have a 2026 Ridgeline RTL-E on the lot right now in Sonic Gray Pearl. It's loaded — wireless CarPlay, adaptive cruise, the full works. MSRP is $46,800. We also have the Black Edition if you want to check out the top-of-the-line trim. Are you looking to trade anything in?",
        timestamp: "2026-04-09T16:30:35Z",
        confidence: 0.94,
      },
      {
        id: "msg-6-3",
        sender: "customer",
        senderName: "Kevin O'Brien",
        content: "The gray one sounds perfect. I have a 2017 F-150 XLT I want to trade. What can you give me for it?",
        timestamp: "2026-04-09T16:35:00Z",
      },
      {
        id: "msg-6-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "The F-150 XLT is always in demand! To give you an accurate estimate I'd need a few details — what's the approximate mileage, and is it 4x2 or 4x4? Any major service history we should know about?",
        timestamp: "2026-04-09T16:35:30Z",
        confidence: 0.90,
      },
      {
        id: "msg-6-5",
        sender: "customer",
        senderName: "Kevin O'Brien",
        content: "4x4, crew cab, about 78k miles. It's been well maintained, just had new tires put on",
        timestamp: "2026-04-09T16:40:00Z",
      },
      {
        id: "msg-6-6",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "A 2017 F-150 XLT 4x4 SuperCrew with 78k miles in good condition — you're looking at roughly $22,000–$25,000 range depending on a few factors we'd evaluate in person. New tires is a nice plus. Would you like to schedule a time to bring it in for an appraisal and test drive the Ridgeline?",
        timestamp: "2026-04-09T16:40:40Z",
        confidence: 0.83,
      },
      {
        id: "msg-6-7",
        sender: "customer",
        senderName: "Kevin O'Brien",
        content: "Let me think about it. Can you hold the gray one for me?",
        timestamp: "2026-04-09T16:45:00Z",
      },
      {
        id: "msg-6-8",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "I can't officially hold it without a deposit, but I can tell you it's been on the lot for just 4 days and there's been good interest. The Ridgeline RTL-E in Sonic Gray is one of the more popular configs. I'd recommend coming in sooner rather than later if it's the one you want! Just text me when you're ready and I'll make sure everything is set.",
        timestamp: "2026-04-09T16:45:30Z",
        confidence: 0.92,
      },
    ],
    summary: {
      aiSummary: "Kevin O'Brien interested in 2026 Ridgeline RTL-E (Sonic Gray). Has 2017 Ford F-150 XLT 4x4 SuperCrew, 78k miles to trade. Estimated trade value $22-25k. Customer wants to think about it but asked about holding the vehicle. No appointment set yet.",
      smartTags: ["trade-in", "conquest"],
      leadScore: 58,
      scoreFactors: [
        "Specific model and trim interest",
        "Trade-in details provided",
        "Hesitating (wants to think about it)",
        "Conquest from Ford",
      ],
      qualificationData: {
        tradeIn: "2017 Ford F-150 XLT 4x4 SuperCrew, 78k miles",
        vehiclePreference: "2026 Ridgeline RTL-E (Sonic Gray Pearl)",
      },
      suggestedActions: [
        "Follow up in 24 hours",
        "Send Ridgeline vs F-150 comparison",
        "Offer to come to his location for trade-in appraisal",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-09T16:45:30Z",
    createdAt: "2026-04-09T16:30:00Z",
  },

  // 7. Customer went cold after initial inquiry
  {
    id: "conv-7",
    leadId: "lead-17",
    leadName: "Jason Park",
    channel: "email",
    status: "needs-review",
    assignedUserId: "user-2",
    messages: [
      {
        id: "msg-7-1",
        sender: "customer",
        senderName: "Jason Park",
        content: "I saw the 2025 Accord EX-L Hybrid on AutoTrader. What's your best price? I'm also looking at the Camry and the K5.",
        timestamp: "2026-04-10T12:00:00Z",
      },
      {
        id: "msg-7-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Jason! Thanks for your interest in the 2025 Accord EX-L Hybrid. Great choice — it's one of our best values right now. We have it listed at $37,250, which is $650 below MSRP since it's a 2025 model. The Accord Hybrid really stands out against the Camry and K5 with its 48 mpg city rating and Honda Sensing suite. Would you like to schedule a test drive so you can compare them firsthand?",
        timestamp: "2026-04-10T12:00:45Z",
        confidence: 0.90,
      },
      {
        id: "msg-7-3",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Jason, just following up on the 2025 Accord EX-L Hybrid. I also wanted to let you know we have a special this month — 2.9% APR for 60 months on remaining 2025 models. That's a significant savings on the hybrid. Would you like me to send over some payment scenarios?",
        timestamp: "2026-04-10T18:00:00Z",
        confidence: 0.88,
      },
      {
        id: "msg-7-4",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Good morning Jason! Just checking in one more time on the Accord Hybrid. I know you mentioned comparing with the Camry and K5 — I put together a quick comparison sheet showing how the Accord stacks up on fuel economy, features, and total cost of ownership. Would you like me to send it over? No pressure at all.",
        timestamp: "2026-04-11T09:30:00Z",
        confidence: 0.85,
      },
    ],
    summary: {
      aiSummary: "Jason Park inquired via AutoTrader about 2025 Accord EX-L Hybrid. Cross-shopping with Camry and Kia K5. Initial response sent with pricing ($37,250). Two follow-ups sent with no customer response. Lead going cold.",
      smartTags: ["conquest"],
      leadScore: 48,
      scoreFactors: [
        "Cross-shopping multiple brands",
        "Price-focused inquiry",
        "No response to follow-ups",
        "AutoTrader lead (lower intent vs walk-in)",
      ],
      qualificationData: {
        vehiclePreference: "2025 Accord EX-L Hybrid",
      },
      suggestedActions: [
        "Try different channel (call instead of email)",
        "Wait 48 hours before next follow-up",
        "Send comparison vs Camry/K5 if customer re-engages",
        "Consider marking lost if no response by day 5",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-11T09:30:00Z",
    createdAt: "2026-04-10T12:00:00Z",
  },

  // 8. VIP returning customer, AI recognized and escalated
  {
    id: "conv-8",
    leadId: "lead-20",
    leadName: "Angela Price",
    channel: "chat",
    status: "human-active",
    assignedUserId: "user-1",
    messages: [
      {
        id: "msg-8-1",
        sender: "customer",
        senderName: "Angela Price",
        content: "Hi, my sister Emily Watson just bought a CR-V from you guys and had an amazing experience. I'm looking at the Pilot EX-L for my family.",
        timestamp: "2026-04-07T16:00:00Z",
      },
      {
        id: "msg-8-2",
        sender: "ai-agent",
        senderName: "Sunrise AI",
        content: "Hi Angela! Welcome, and thank you so much for the kind words about Emily's experience — we loved working with her! Let me flag your inquiry to our team right away so we can give you the VIP treatment. The 2025 Pilot EX-L is an excellent family vehicle with seating for 8 and Honda's latest tech. I'm connecting you with Rob Johnson now — he's our top product specialist and he'll take great care of you.",
        timestamp: "2026-04-07T16:00:40Z",
        confidence: 0.96,
      },
      {
        id: "msg-8-3",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Hi Angela! Rob here. Emily is one of our favorite customers — welcome to the Sunrise Honda family! Tell me about what you need. How many kids, how much driving, and what are you coming out of?",
        timestamp: "2026-04-07T16:15:00Z",
      },
      {
        id: "msg-8-4",
        sender: "customer",
        senderName: "Angela Price",
        content: "We have 3 kids (8, 5, and 2) so we need the third row. I have a 2019 Accord LX that's been great but we just outgrew it. My husband has a truck so this is the family hauler.",
        timestamp: "2026-04-07T16:18:00Z",
      },
      {
        id: "msg-8-5",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "The Pilot EX-L is perfect for that! You'll love the third row — it actually fits real people, not just kids. Plus the Magic Slide second row makes car seat access way easier. We have a 2025 Pilot EX-L in Platinum White Pearl that's priced to move at $43,500 (that's $850 off MSRP). Want to bring the family in for a test drive?",
        timestamp: "2026-04-07T16:22:00Z",
      },
      {
        id: "msg-8-6",
        sender: "customer",
        senderName: "Angela Price",
        content: "That sounds great. Emily mentioned you guys gave her a really fair deal. Can we do Monday morning? I drop the kids off at school at 9:30",
        timestamp: "2026-04-07T16:25:00Z",
      },
      {
        id: "msg-8-7",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Monday at 10:00 AM works perfectly. I'll have the Pilot pulled up front and ready to go. And absolutely — we take care of our referral customers. We'll make sure you're just as happy as Emily. See you Monday, Angela!",
        timestamp: "2026-04-07T16:28:00Z",
      },
      {
        id: "msg-8-8",
        sender: "customer",
        senderName: "Angela Price",
        content: "Awesome, see you then! 🎉",
        timestamp: "2026-04-07T16:30:00Z",
      },
      {
        id: "msg-8-9",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content: "Hi Angela! Looking forward to seeing you tomorrow at 10 AM. I've got the Pilot EX-L in Platinum White ready for your test drive. If anything changes, just text me. See you soon!",
        timestamp: "2026-04-12T16:00:00Z",
      },
      {
        id: "msg-8-10",
        sender: "customer",
        senderName: "Angela Price",
        content: "We'll be there! My husband is coming too 👍",
        timestamp: "2026-04-12T16:45:00Z",
      },
    ],
    summary: {
      aiSummary: "VIP referral from existing customer Emily Watson. Angela Price needs a family vehicle for 3 kids. Interested in 2025 Pilot EX-L ($43,500). Trading in 2019 Honda Accord LX. AI immediately recognized referral and escalated to Rob Johnson. Appointment Monday 10 AM, husband attending.",
      smartTags: ["hot-lead", "returning-customer", "trade-in"],
      leadScore: 86,
      scoreFactors: [
        "Direct referral from recent buyer",
        "Clear vehicle need (family growth)",
        "Specific model interest",
        "Appointment set with both decision-makers",
        "Positive sentiment",
      ],
      qualificationData: {
        timeline: "Ready now",
        tradeIn: "2019 Honda Accord LX",
        vehiclePreference: "2025 Pilot EX-L (Platinum White Pearl)",
      },
      suggestedActions: [
        "Appraise 2019 Accord LX before appointment",
        "Prepare referral incentive for Emily Watson",
        "Have car seats available for third-row demo",
        "Structure deal with family-friendly focus",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-12T16:45:00Z",
    createdAt: "2026-04-07T16:00:00Z",
  },

  // Returning customer — linked to cust-1 / lead-5 for BDC deep link from Customers
  {
    id: "conv-cust-1",
    customerId: "cust-1",
    leadId: "lead-5",
    leadName: "David Thompson",
    channel: "sms",
    status: "closed",
    assignedUserId: "user-1",
    messages: [
      {
        id: "msg-dt-1",
        sender: "customer",
        senderName: "David Thompson",
        content:
          "Hey — traded my Civic last week. Just want to confirm my first payment date on the Accord.",
        timestamp: "2026-04-08T18:00:00Z",
      },
      {
        id: "msg-dt-2",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content:
          "Hi David! Congrats again on the 2026 Accord Sport. First payment is due May 15 — you'll get Honda Financial's welcome packet by mail. Need anything else?",
        timestamp: "2026-04-08T18:04:00Z",
      },
      {
        id: "msg-dt-3",
        sender: "customer",
        senderName: "David Thompson",
        content: "All set. Thanks Rob!",
        timestamp: "2026-04-08T18:05:00Z",
      },
    ],
    summary: {
      aiSummary:
        "Post-delivery SMS from returning customer David Thompson. Confirmed first payment timing on new Accord Sport; conversation closed satisfactorily.",
      smartTags: ["returning-customer"],
      leadScore: 95,
      scoreFactors: [
        "Recent purchase completed",
        "High prior LTV",
        "Low support burden",
      ],
      qualificationData: {
        vehiclePreference: "2026 Honda Accord Sport",
      },
      suggestedActions: [
        "Schedule 30-day check-in",
        "Add to service retention campaign",
      ],
    },
    unreadCount: 0,
    lastMessageAt: "2026-04-08T18:05:00Z",
    createdAt: "2026-04-08T18:00:00Z",
  },

  // Linked to cust-2 / lead-16
  {
    id: "conv-cust-2",
    customerId: "cust-2",
    leadId: "lead-16",
    leadName: "Emily Watson",
    channel: "email",
    status: "human-active",
    assignedUserId: "user-1",
    messages: [
      {
        id: "msg-ew-1",
        sender: "customer",
        senderName: "Emily Watson",
        content:
          "Picking up the CR-V Hybrid Saturday — can you confirm the accessories we added (roof rails + all-weather mats) are on the we-owe?",
        timestamp: "2026-04-06T14:10:00Z",
      },
      {
        id: "msg-ew-2",
        sender: "human-agent",
        senderName: "Rob Johnson",
        content:
          "Emily — confirmed on the we-owe: roof rails and all-weather mats are in the deal jacket. See you Saturday at 10!",
        timestamp: "2026-04-06T14:22:00Z",
      },
    ],
    summary: {
      aiSummary:
        "Emily Watson (returning customer) finalizing CR-V Hybrid delivery; confirming accessories on we-owe before Saturday pickup.",
      smartTags: ["returning-customer", "lease-expiring"],
      leadScore: 97,
      scoreFactors: [
        "Repeat buyer",
        "Clear purchase intent",
        "Delivery scheduled",
      ],
      qualificationData: {
        vehiclePreference: "2025 Honda CR-V Hybrid Sport Touring",
        timeline: "Pickup Saturday",
      },
      suggestedActions: [
        "Pre-stage accessories before delivery",
        "Offer first service bundle at delivery",
      ],
    },
    unreadCount: 1,
    lastMessageAt: "2026-04-06T14:22:00Z",
    createdAt: "2026-04-06T14:10:00Z",
  },
];
