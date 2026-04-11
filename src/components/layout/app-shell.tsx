"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={cn(
          "flex h-full min-h-0 flex-col transition-[padding] duration-200 ease-out",
          collapsed ? "pl-[68px]" : "pl-[240px]",
        )}
      >
        <Topbar />
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}
