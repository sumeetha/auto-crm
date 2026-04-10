import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent horizontal strip for page-level filters (Selects, search, etc.).
 */
export function PageFilterBar({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      aria-label="Filters"
      className={cn(
        "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
