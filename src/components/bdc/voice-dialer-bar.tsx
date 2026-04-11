"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, PhoneCall, PhoneOff, Delete, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CallState = "idle" | "ringing" | "connected";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"] as const;

export function VoiceDialerBar({
  initialNumber,
  className,
}: {
  initialNumber: string;
  className?: string;
}) {
  const [phone, setPhone] = useState(initialNumber);
  const [callState, setCallState] = useState<CallState>("idle");
  /** Collapsed by default; expands for keypad / call controls. Stays open while a call is active. */
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPhone(initialNumber);
  }, [initialNumber]);

  function appendDigit(d: string) {
    setPhone((p) => p + d);
  }

  function backspace() {
    setPhone((p) => p.slice(0, -1));
  }

  function handleCall() {
    if (callState === "idle") setCallState("ringing");
    else if (callState === "ringing") setCallState("connected");
  }

  function handleEnd() {
    setCallState("idle");
  }

  const active = callState !== "idle";
  const showDialer = expanded || active;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl rounded-lg border border-border bg-muted/20 p-3",
        showDialer && "space-y-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 text-foreground"
          disabled={active}
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={showDialer}
          aria-controls="voice-dialer-panel"
          id="voice-dialer-toggle"
        >
          {showDialer ? (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          )}
          Dialer
        </Button>
        {!showDialer && (
          <span
            className="min-w-0 truncate font-mono text-xs text-muted-foreground"
            title={phone || undefined}
          >
            {phone.trim() ? phone : "Expand to place a call"}
          </span>
        )}
        {active && (
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {callState === "ringing" && (
              <span className="text-xs font-medium text-amber-600">Ringing…</span>
            )}
            {callState === "connected" && (
              <span className="text-xs font-medium text-emerald-600">Connected</span>
            )}
          </div>
        )}
      </div>

      {showDialer && (
        <div className="space-y-3" id="voice-dialer-panel" role="region" aria-labelledby="voice-dialer-toggle">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Voice calls use the AI agent first; it answers questions and escalates to
            your team when needed. Full transcript appears above.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="min-w-[160px] flex-1 font-mono text-sm"
              aria-label="Dial phone number"
              readOnly={active}
            />
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                disabled={
                  (!phone.trim() && callState === "idle") || callState === "connected"
                }
                onClick={handleCall}
              >
                {callState === "ringing" ? (
                  <>
                    <PhoneCall className="h-3.5 w-3.5" />
                    Answer
                  </>
                ) : (
                  <>
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                disabled={!active}
                onClick={handleEnd}
              >
                <PhoneOff className="h-3.5 w-3.5" />
                End
              </Button>
            </div>
          </div>
          <div className="grid max-w-[220px] grid-cols-3 gap-1.5">
            {KEYS.map((k) => (
              <Button
                key={k}
                type="button"
                variant="outline"
                size="sm"
                className="h-9 font-mono text-sm"
                disabled={active}
                onClick={() => appendDigit(k)}
              >
                {k}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="col-span-3 h-9 gap-1.5 text-muted-foreground"
              disabled={active}
              onClick={backspace}
            >
              <Delete className="h-3.5 w-3.5" />
              Backspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
