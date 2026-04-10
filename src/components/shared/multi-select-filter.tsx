"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MultiSelectOption = { value: string; label: string };

function summarizeSelection(
  selected: string[],
  options: MultiSelectOption[],
  emptyLabel: string,
): string {
  if (selected.length === 0) return emptyLabel;
  if (selected.length === 1) {
    const o = options.find((x) => x.value === selected[0]);
    return o?.label ?? selected[0];
  }
  return `${selected.length} selected`;
}

type MultiSelectFilterProps = {
  options: MultiSelectOption[];
  /** Selected values; empty array means no restriction (show all). */
  value: string[];
  onChange: (next: string[]) => void;
  emptyLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default";
  align?: "start" | "center" | "end";
  id?: string;
  "aria-label"?: string;
  /** Show search field inside the dropdown (default true). */
  searchable?: boolean;
};

export function MultiSelectFilter({
  options,
  value,
  onChange,
  emptyLabel = "All",
  triggerClassName,
  contentClassName,
  size = "sm",
  align = "start",
  id,
  "aria-label": ariaLabel,
  searchable = true,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const summary = useMemo(
    () => summarizeSelection(value, options, emptyLabel),
    [value, options, emptyLabel],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchable) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, query, searchable]);

  const toggle = useCallback(
    (v: string) => {
      if (value.includes(v)) {
        onChange(value.filter((x) => x !== v));
      } else {
        onChange([...value, v]);
      }
    },
    [value, onChange],
  );

  const clear = useCallback(() => onChange([]), [onChange]);

  const allFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((o) => value.includes(o.value));

  const selectAllFiltered = useCallback(() => {
    if (filteredOptions.length === 0) return;
    if (allFilteredSelected) {
      const remove = new Set(filteredOptions.map((o) => o.value));
      onChange(value.filter((x) => !remove.has(x)));
    } else {
      const next = new Set(value);
      for (const o of filteredOptions) next.add(o.value);
      onChange([...next]);
    }
  }, [allFilteredSelected, filteredOptions, onChange, value]);

  const btnSize = size === "sm" ? "sm" : "default";
  const hasQuery = query.trim().length > 0;

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
        aria-label={ariaLabel ?? summary}
        className={cn(
          "flex w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-left text-sm outline-none transition-colors select-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
          size === "sm" ? "h-8 rounded-[min(var(--radius-md),10px)] text-xs" : "h-9",
          triggerClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{summary}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("min-w-[220px] p-0 sm:min-w-[260px]", contentClassName)}
      >
        {searchable && options.length > 0 && (
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
        )}
        <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-1.5">
          <Button
            type="button"
            variant="ghost"
            size={btnSize}
            className="h-7 px-2 text-xs"
            onClick={selectAllFiltered}
            disabled={filteredOptions.length === 0}
          >
            {allFilteredSelected
              ? hasQuery
                ? "Clear visible"
                : "Clear all"
              : hasQuery
                ? "Select visible"
                : "Select all"}
          </Button>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size={btnSize}
              className="h-7 px-2 text-xs"
              onClick={clear}
            >
              Reset
            </Button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No matches
            </p>
          ) : (
            filteredOptions.map((o) => {
              const checked = value.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  onClick={() => toggle(o.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {checked ? <Check className="size-3" strokeWidth={3} /> : null}
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
