export type FiBundleSuggestion = {
  id: string;
  title: string;
  estimatedBackGross: number;
  rationale: string;
  talkingPoints: string[];
  disclosureNote: string;
};

export type ObjectionPrompt = {
  id: string;
  objection: string;
  responses: {
    approach: string;
    script: string;
    evidence: string;
  }[];
};

export type DealCopilotData = {
  dealId: string;
  aiSummary: string;
  lenderNotes: string[];
  fiBundles: FiBundleSuggestion[];
  objections: ObjectionPrompt[];
  deskingTips: string[];
};

const deal3Copilot: DealCopilotData = {
  dealId: "deal-3",
  aiSummary:
    "Michael Torres is a returning customer with strong purchase intent (AI score 92). Credit application submitted, trade-in 2019 Accord LX appraised at $16,800. Currently desking a 2026 CR-V EX-L at $38,400 with Ally Financial over 60 months. Front gross sits at $2,500 — F&I products represent the primary margin opportunity on this deal.",
  lenderNotes: [
    "Ally Financial approval on file — 60-month term, estimated 5.9% APR based on credit tier.",
    "Customer qualifies for Ally rate reduction with GAP or VSC bundle — potential 0.25% buy-down.",
    "Trade payoff confirmed clear title — no negative equity to roll in.",
  ],
  fiBundles: [
    {
      id: "fi-1",
      title: "Vehicle Service Contract (VSC)",
      estimatedBackGross: 1200,
      rationale:
        "CR-V EX-L includes Honda Sensing suite and power tailgate — component repair costs average $1,800–$3,200 out of warranty. Torres kept his Accord 7 years, indicating long ownership pattern.",
      talkingPoints: [
        "Your 2019 Accord served you well for 7 years — this plan keeps the CR-V just as worry-free.",
        "Covers Honda Sensing recalibration ($800–$1,200 per event) and power liftgate motor ($1,400 typical).",
        "Adds only ~$20/month rolled into your existing payment.",
      ],
      disclosureNote:
        "Service contract is optional and not required for financing. Coverage terms and exclusions vary — provide full contract for customer review before signing.",
    },
    {
      id: "fi-2",
      title: "GAP Protection",
      estimatedBackGross: 800,
      rationale:
        "Financed amount after trade equity leaves ~$21,600 balance. New CR-Vs depreciate 15–20% in year one. GAP closes the insurance-payout-to-loan-balance gap in a total-loss scenario.",
      talkingPoints: [
        "If something happens in the first couple of years, insurance pays market value — not what you owe. GAP covers that difference.",
        "Especially relevant on a 60-month term where the loan amortizes slower than depreciation.",
        "One-time cost, no monthly premium — built right into the deal.",
      ],
      disclosureNote:
        "GAP waiver/addendum is optional. Does not replace comprehensive or collision insurance. State-specific terms apply.",
    },
    {
      id: "fi-3",
      title: "Appearance Protection Bundle",
      estimatedBackGross: 600,
      rationale:
        "Customer selected Radiant Red Metallic — high-visibility color that shows swirl marks and environmental damage more readily. Bundle includes ceramic coating + interior fabric/leather guard.",
      talkingPoints: [
        "Radiant Red is a stunning color — this keeps it looking showroom-fresh. Ceramic coating repels water, UV, and minor scratches.",
        "Interior guard covers leather seats against dye transfer and spills — important with daily family use.",
        "Covers paintless dent repair for door dings up to 4 inches.",
      ],
      disclosureNote:
        "Appearance products are optional. Efficacy depends on proper maintenance. Review product terms for coverage details and claim process.",
    },
  ],
  objections: [
    {
      id: "obj-1",
      objection: "The price is higher than I expected",
      responses: [
        {
          approach: "Value reframe",
          script:
            "I understand — let's look at what you're getting compared to what you're coming from. The CR-V EX-L adds Honda Sensing, wireless CarPlay, heated seats, and a power tailgate that your 2019 Accord didn't have.",
          evidence:
            "CR-V EX-L MSRP $38,400 vs. segment average $39,200 (RAV4 XLE Premium $39,985, Tucson SEL $38,550). Priced competitively within segment.",
        },
        {
          approach: "Payment focus",
          script:
            "With your Accord trade at $16,800, you're looking at roughly $395/month over 60 months. That's comparable to what many customers pay for the base Sport trim — but you're getting the full EX-L package.",
          evidence:
            "Est. payment $395/mo at 5.9% APR / 60 mo after $16,800 trade credit. Base Sport trim would be ~$348/mo — $47/mo delta for leather, power tailgate, heated seats.",
        },
      ],
    },
    {
      id: "obj-2",
      objection: "I want to think about it / not ready today",
      responses: [
        {
          approach: "Scarcity + urgency (factual)",
          script:
            "Completely understand — take the time you need. I do want to mention that we have two CR-V EX-Ls on the lot right now, and this Radiant Red is the only one. April incentives end on the 30th.",
          evidence:
            "Current CR-V EX-L inventory: 1 unit in Radiant Red (veh-1, 12 days on lot). 1 Sport Touring Hybrid also available. Model turns averaging 18 days this quarter.",
        },
        {
          approach: "Commitment softener",
          script:
            "No pressure at all. What if we lock in today's numbers so you have them to compare? If you find something better, no hard feelings. But these figures are based on your credit app which is good for 30 days.",
          evidence:
            "Ally approval valid 30 days from application date. Current rate environment trending upward — locking protects against mid-month adjustments.",
        },
      ],
    },
    {
      id: "obj-3",
      objection: "My trade-in is worth more than $16,800",
      responses: [
        {
          approach: "Market data grounding",
          script:
            "I hear you — your Accord is in good shape. Our appraisal is based on current wholesale market data. Let me show you where we landed and how that compares.",
          evidence:
            "2019 Accord LX — KBB trade range $15,200–$17,800 (Good condition). Offer of $16,800 sits in the upper third. Comparable auction results this week: $15,400–$16,200.",
        },
      ],
    },
  ],
  deskingTips: [
    "Torres is a returning customer — reinforce loyalty value and mention any owner-loyalty incentives available.",
    "Credit app is already submitted and approved. Minimize friction by presenting numbers confidently.",
    "Trade is clean title, no payoff — simplifies paperwork and speeds delivery.",
    "Customer's AI score of 92 indicates very high purchase intent. Focus on closing today rather than follow-up.",
  ],
};

const deal4Copilot: DealCopilotData = {
  dealId: "deal-4",
  aiSummary:
    "Stephanie Reed is a high-intent walk-in (AI score 90) currently desking a 2026 Accord Touring Hybrid at $40,550. Weekend buyer pattern — decision likely imminent. Trading 2021 Toyota Camry SE valued at $19,200. Financing through Capital One Auto at 72 months. Vehicle is in-transit — set delivery expectations early. Front gross at $2,650; Touring Hybrid is top trim so no trim upsell, but strong F&I opportunity on hybrid powertrain coverage.",
  lenderNotes: [
    "Capital One Auto approval — 72-month term. Estimated 6.4% APR based on application.",
    "72-month term increases GAP relevance — longer amortization vs. depreciation curve.",
    "Conquest from Toyota — Capital One may offer rate match if customer mentions competing offers.",
  ],
  fiBundles: [
    {
      id: "fi-4",
      title: "Hybrid Powertrain Extended Warranty",
      estimatedBackGross: 1400,
      rationale:
        "Touring Hybrid includes dual-motor hybrid system, e-CVT, and battery pack. Honda factory hybrid warranty is 8yr/100k for battery but only 5yr/60k for other hybrid components. Extended coverage bridges the gap for a long-ownership buyer.",
      talkingPoints: [
        "The hybrid system has more components than a traditional powertrain — the e-CVT, inverter, and DC-DC converter are all specialized parts.",
        "Honda covers the battery for 8 years, but the other hybrid parts are only 5yr/60k. This plan extends everything to match.",
        "Coming from a Camry, you know Toyota reliability — Honda hybrids are equally proven, and this warranty gives you that same peace of mind.",
      ],
      disclosureNote:
        "Extended warranty is optional and not required for financing. Review contract for specific hybrid component coverage, deductibles, and exclusions.",
    },
    {
      id: "fi-5",
      title: "GAP Protection",
      estimatedBackGross: 850,
      rationale:
        "72-month financing on $40,550 MSRP minus $19,200 trade still leaves $21,350 financed. Longer term amplifies the depreciation-vs-payoff gap in years 1–3.",
      talkingPoints: [
        "On a 72-month loan, there's a wider window where you could owe more than the car is worth if something unexpected happens.",
        "GAP covers the difference between your insurance payout and your remaining balance — it's a one-time cost built into the deal.",
        "Most customers financing over 60 months find this gives real peace of mind.",
      ],
      disclosureNote:
        "GAP waiver is optional. Does not replace primary auto insurance. Terms vary by state.",
    },
    {
      id: "fi-6",
      title: "Pre-Paid Maintenance Plan (3yr/36k)",
      estimatedBackGross: 700,
      rationale:
        "Hybrid maintenance schedule is simpler (no traditional oil changes) but still includes brake fluid, cabin filter, tire rotation, and multi-point inspections. Locking in today's rates saves against service price inflation.",
      talkingPoints: [
        "Hybrids are lower-maintenance than traditional cars, but you'll still want regular service. This locks in today's prices for 3 years of scheduled maintenance.",
        "Includes tire rotations, brake fluid exchange, cabin/engine filters, and multi-point inspections.",
        "You can use any Honda dealer nationwide — convenient if you travel or relocate.",
      ],
      disclosureNote:
        "Maintenance plan is optional. Covers factory-scheduled maintenance items only. See plan terms for service intervals and covered items.",
    },
  ],
  objections: [
    {
      id: "obj-4",
      objection: "The vehicle is in-transit — I want something I can drive today",
      responses: [
        {
          approach: "Transparency + lock-in",
          script:
            "I completely understand wanting to drive home today. The Touring Hybrid is our most popular trim and they move fast. We can lock in your pricing and trade value now — both are guaranteed until delivery. Expected arrival is within the next 7–10 days.",
          evidence:
            "Veh-8 status: in-transit, 2 days on allocation. Touring Hybrid is highest Accord trim with limited allocation — no other Touring Hybrid in current inventory. Sport Hybrid (veh-7) and EX-L Hybrid (veh-9) available on lot today as alternatives.",
        },
      ],
    },
    {
      id: "obj-5",
      objection: "The monthly payment is too high",
      responses: [
        {
          approach: "Structure adjustment",
          script:
            "Let's look at the structure together. At 72 months, you're at roughly $375/month. If we adjust the term or look at a slightly different trim, we can find a number that works. What monthly range are you comfortable with?",
          evidence:
            "Est. payment: $375/mo at 6.4% / 72mo after $19,200 trade. Alternative: Accord Sport Hybrid (veh-7) at $36,200 → ~$295/mo same terms. Accord EX-L Hybrid (veh-9) at $37,250 → ~$313/mo.",
        },
        {
          approach: "Value justification",
          script:
            "The Touring Hybrid gets an estimated 48 city / 47 highway MPG. Coming from a Camry SE at about 28 city / 39 highway, you're saving roughly $80–$100/month in fuel costs at current gas prices. That effectively offsets a big chunk of the payment difference.",
          evidence:
            "2026 Accord Touring Hybrid: 48/47 MPG (EPA est). 2021 Camry SE: 28/39 MPG. At $3.50/gal and 12,000 mi/yr: Accord ~$92/mo fuel vs Camry ~$131/mo fuel = ~$39/mo savings. Actual savings vary with driving habits.",
        },
      ],
    },
    {
      id: "obj-6",
      objection: "I can get a better deal on a Camry / want to compare Toyota",
      responses: [
        {
          approach: "Competitive positioning",
          script:
            "That's smart shopping. The new Camry is a great car — but let me show you where the Accord Touring Hybrid stands out. You're getting a larger cabin, Google Built-In, wireless CarPlay, and a head-up display that the Camry XLE doesn't include.",
          evidence:
            "2026 Accord Touring Hybrid vs. 2025 Camry XLE Hybrid: Accord adds HUD, 12-speaker Bose audio, ventilated seats, Google Built-In. Accord interior volume: 105.7 cu ft vs Camry 100.4 cu ft. Similar MSRP range ($40,550 vs $39,490).",
        },
      ],
    },
  ],
  deskingTips: [
    "Vehicle is in-transit (2 days on allocation). Set clear delivery timeline expectations — estimated 7–10 days.",
    "Weekend buyer pattern: Stephanie tends to make decisions quickly. Maintain momentum.",
    "Conquest from Toyota — highlight Honda-specific advantages. Don't disparage the Camry; acknowledge it and differentiate.",
    "72-month term increases total interest cost. If customer is rate-sensitive, explore 60-month option with slightly higher payment.",
    "Touring Hybrid is top-of-line — no trim upsell available. Focus F&I on hybrid powertrain warranty and GAP.",
  ],
};

function getGenericCopilotData(dealId: string): DealCopilotData {
  return {
    dealId,
    aiSummary:
      "AI analysis is generating insights based on deal structure, customer profile, and inventory data. Detailed recommendations will appear once deal context is fully resolved.",
    lenderNotes: [
      "Review lender approval status and confirm rate/term before presenting numbers.",
      "Check for lender-specific F&I product incentives or rate buy-down opportunities.",
    ],
    fiBundles: [
      {
        id: "fi-gen-1",
        title: "Vehicle Service Contract (VSC)",
        estimatedBackGross: 1100,
        rationale:
          "Extended coverage protects against unexpected repair costs after factory warranty expires. Tailor coverage term to customer's expected ownership length.",
        talkingPoints: [
          "Covers major mechanical and electrical components beyond the factory warranty period.",
          "Transferable to a future buyer, which can increase resale value.",
          "Can be rolled into your monthly payment for convenience.",
        ],
        disclosureNote:
          "Service contract is optional and not required for financing. Review full terms, covered components, and exclusions with customer.",
      },
      {
        id: "fi-gen-2",
        title: "GAP Protection",
        estimatedBackGross: 750,
        rationale:
          "Recommended for any financed vehicle where loan-to-value ratio exceeds 80% in the first 24 months of the term.",
        talkingPoints: [
          "Covers the difference between insurance payout and remaining loan balance in a total loss.",
          "One-time cost — no recurring premium.",
          "Especially valuable on longer financing terms (60+ months).",
        ],
        disclosureNote:
          "GAP waiver is optional. Does not replace comprehensive or collision insurance. State-specific terms apply.",
      },
    ],
    objections: [
      {
        id: "obj-gen-1",
        objection: "The price is too high",
        responses: [
          {
            approach: "Value comparison",
            script:
              "Let me walk you through how this compares to similar vehicles in the market so you can see the full picture.",
            evidence:
              "Compare MSRP and feature set against top 2–3 segment competitors. Highlight included features that are add-ons on competing models.",
          },
        ],
      },
      {
        id: "obj-gen-2",
        objection: "I need to think about it",
        responses: [
          {
            approach: "Commitment softener",
            script:
              "Absolutely — it's a big decision. What if we put today's numbers in writing so you have a solid benchmark to compare against? No obligation.",
            evidence:
              "Lock-in protects against inventory turn, rate changes, and incentive expiration. Provides a concrete anchor for the customer's decision process.",
          },
        ],
      },
    ],
    deskingTips: [
      "Review customer's lead score and engagement history before presenting numbers.",
      "Confirm trade-in appraisal is current and payoff (if any) is verified.",
      "Present deal structure clearly — itemize selling price, trade credit, taxes/fees, and monthly payment.",
    ],
  };
}

export function getDealCopilotData(dealId: string): DealCopilotData {
  if (dealId === "deal-3") return deal3Copilot;
  if (dealId === "deal-4") return deal4Copilot;
  return getGenericCopilotData(dealId);
}
