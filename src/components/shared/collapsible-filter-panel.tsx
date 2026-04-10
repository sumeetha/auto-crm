"use client";

import { useState } from "react";
import { ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

type CollapsibleFilterPanelProps = {
  /** Number of filter dimensions currently narrowing results (for badge + emphasis). */
  activeCount: number;
  /** When true, panel starts open. Default collapsed. */
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Extra classes on the expanded content wrapper (e.g. padding). */
  contentClassName?: string;
  /**
   * `toolbar` — horizontal wrap for `FilterField` rows (list pages).
   * `stack` — vertical block (e.g. BDC inbox column).
   */
  variant?: "toolbar" | "stack";
};

export function CollapsibleFilterPanel({
  activeCount,
  defaultExpanded = false,
  children,
  className,
  contentClassName,
  variant = "toolbar",
}: CollapsibleFilterPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-muted/30 shadow-sm",
        activeCount > 0 && !expanded
          ? "border-primary/50 ring-1 ring-primary/20"
          : "border-border",
        className,
        expanded ? "w-full overflow-hidden" : "w-fit self-start overflow-visible",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        title={expanded ? "Hide filters" : "Show filters"}
        aria-expanded={expanded}
        aria-label={
          expanded
            ? "Collapse filters"
            : activeCount > 0
              ? `Expand filters, ${activeCount} active`
              : "Expand filters"
        }
        className={cn(
          "relative flex items-center gap-1 px-2.5 py-2 text-left transition-colors hover:bg-muted/50",
          expanded
            ? "w-full shrink-0 border-b border-border"
            : "inline-flex",
        )}
      >
        <ListFilter
          className={cn(
            "size-4 shrink-0",
            activeCount > 0 && !expanded
              ? "text-primary"
              : "text-muted-foreground",
          )}
          aria-hidden
        />
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
        {!expanded && activeCount > 0 ? (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground tabular-nums shadow-sm"
            aria-hidden
          >
            {activeCount}
          </span>
        ) : null}
      </button>
      {expanded ? (
        <div className={cn("min-w-0 px-3 py-2.5", contentClassName)}>
          {variant === "stack" ? (
            children
          ) : (
            <div
              role="toolbar"
              aria-label="Filters"
              className="flex flex-wrap items-end gap-3"
            >
              {children}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
