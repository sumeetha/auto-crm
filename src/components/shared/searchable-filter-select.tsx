"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = { value: string; label: string };

type SearchableFilterSelectProps = {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  id?: string;
  "aria-label"?: string;
};

export function SearchableFilterSelect({
  options,
  value,
  onChange,
  triggerClassName,
  align = "start",
  id,
  "aria-label": ariaLabel,
}: SearchableFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? value;
  }, [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  const pick = useCallback(
    (v: string) => {
      onChange(v);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger
        id={id}
        aria-label={ariaLabel ?? selectedLabel}
        className={cn(
          "flex w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-left text-sm outline-none transition-colors select-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
          "h-8 rounded-[min(var(--radius-md),10px)] text-xs",
          triggerClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="min-w-[220px] p-0 sm:min-w-[260px]"
      >
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-xs"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search options"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No matches
            </p>
          ) : (
            filtered.map((o) => {
              const isSelected = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => pick(o.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected ? (
                      <Check className="size-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
