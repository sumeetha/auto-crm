"use client";

import type { Vehicle } from "@/lib/mock-data";
import type { DealCopilotData } from "@/lib/mock-data/deal-copilot";
import { formatCurrency, estimateMonthlyPayment } from "@/lib/deal-copilot";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  ShieldAlert,
  Lightbulb,
  TrendingUp,
  Shield,
  MessageCircleWarning,
  Car,
  ChevronRight,
  Info,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

function formatLabel(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function DealCopilotPanel({
  copilotData,
  upsellOptions,
  currentVehicle,
  tradeCredit,
  term,
}: {
  copilotData: DealCopilotData;
  upsellOptions: Vehicle[];
  currentVehicle: Vehicle | undefined;
  tradeCredit: number;
  term: number | null;
}) {
  return (
    <div className="flex h-full flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Co-pilot</h2>
            <p className="text-[11px] text-muted-foreground">
              Grounded in deal &amp; inventory data
            </p>
          </div>
        </div>
        {/* Guardrail strip */}
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800 leading-relaxed">
          <ShieldAlert className="size-3.5 shrink-0 mt-px" />
          <span>
            Suggestions are based on available data and are not legal,
            financial, or compliance advice. Always verify disclosures and
            lender terms before presenting to the customer.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="context" className="flex flex-1 flex-col min-h-0">
        <div className="shrink-0 border-b px-4 pt-1">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="upsells">Upsells</TabsTrigger>
            <TabsTrigger value="fi">F&amp;I</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {/* ---- Context Tab ---- */}
          <TabsContent value="context" className="p-4 space-y-4">
            {/* AI Summary */}
            <Card className="border-violet-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-3.5 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-700">
                    AI Summary
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copilotData.aiSummary}
                </p>
              </CardContent>
            </Card>

            {/* Desking Tips */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Lightbulb className="size-3" />
                Desking Tips
              </h3>
              <ul className="space-y-2">
                {copilotData.deskingTips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <ChevronRight className="size-3.5 shrink-0 mt-0.5 text-violet-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lender Notes */}
            {copilotData.lenderNotes.length > 0 && (
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Info className="size-3" />
                  Lender Notes
                </h3>
                <ul className="space-y-1.5">
                  {copilotData.lenderNotes.map((note, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:size-1.5 before:rounded-full before:bg-muted-foreground/30"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* ---- Upsells Tab ---- */}
          <TabsContent value="upsells" className="p-4 space-y-3">
            {upsellOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                <Car className="size-8 mb-2 opacity-40" />
                <p>No alternative trims in current inventory.</p>
                <p className="text-xs mt-1">
                  The selected vehicle is the only available option for this
                  make/model.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {upsellOptions.length} alternative{" "}
                  {upsellOptions.length === 1 ? "trim" : "trims"} from current
                  inventory
                </p>
                {upsellOptions.map((v) => {
                  const isUpgrade =
                    currentVehicle && v.msrp > currentVehicle.msrp;
                  const priceDelta = currentVehicle
                    ? v.msrp - currentVehicle.msrp
                    : 0;
                  const altPayment =
                    term && term > 0
                      ? estimateMonthlyPayment(
                          v.sellingPrice,
                          tradeCredit,
                          term,
                        )
                      : null;

                  return (
                    <Card key={v.id} className="overflow-hidden">
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">
                              {v.year} {v.make} {v.model} {v.trim}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Stock #{v.stockNo} · {v.exteriorColor}
                            </p>
                          </div>
                          {isUpgrade ? (
                            <Badge className="bg-violet-100 text-violet-700 shrink-0">
                              <TrendingUp className="size-3 mr-0.5" />
                              Upsell
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="shrink-0">
                              Alt
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold">
                            {formatCurrency(v.sellingPrice)}
                          </span>
                          {priceDelta !== 0 && (
                            <span
                              className={`text-xs ${priceDelta > 0 ? "text-amber-600" : "text-emerald-600"}`}
                            >
                              {priceDelta > 0 ? "+" : ""}
                              {formatCurrency(priceDelta)}
                            </span>
                          )}
                          {altPayment !== null && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              ~{formatCurrency(altPayment)}/mo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{v.condition === "new" ? "New" : "Used"}</span>
                          <span>{v.daysOnLot}d on lot</span>
                          <span>{v.interiorColor}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </TabsContent>

          {/* ---- F&I Tab ---- */}
          <TabsContent value="fi" className="p-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Recommended F&amp;I products based on deal structure and customer
              profile
            </p>
            {copilotData.fiBundles.map((bundle) => (
              <Card key={bundle.id} className="border-l-4 border-l-violet-400">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-violet-500" />
                      <h4 className="font-medium text-sm">{bundle.title}</h4>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      <DollarSign className="size-3" />
                      ~{formatCurrency(bundle.estimatedBackGross)}
                    </Badge>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground italic">
                    {bundle.rationale}
                  </p>

                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">
                      Talking Points
                    </h5>
                    <ul className="space-y-1">
                      {bundle.talkingPoints.map((tp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-sm"
                        >
                          <CheckCircle2 className="size-3 shrink-0 mt-1 text-emerald-500" />
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start gap-1.5 rounded bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600 leading-relaxed">
                    <ShieldAlert className="size-3 shrink-0 mt-px" />
                    {bundle.disclosureNote}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ---- Objections Tab ---- */}
          <TabsContent value="objections" className="p-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Common objections with evidence-backed responses
            </p>
            {copilotData.objections.map((obj) => (
              <Card key={obj.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircleWarning className="size-4 text-amber-500" />
                    <h4 className="font-medium text-sm">
                      &ldquo;{obj.objection}&rdquo;
                    </h4>
                  </div>

                  {obj.responses.map((resp, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-muted/30 px-3 py-2.5 space-y-1.5"
                    >
                      <Badge variant="secondary" className="text-[11px]">
                        {resp.approach}
                      </Badge>
                      <p className="text-sm leading-relaxed">{resp.script}</p>
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Info className="size-3 shrink-0 mt-0.5" />
                        <span className="italic">{resp.evidence}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
