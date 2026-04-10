"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Handshake,
  UserCircle,
  Car,
  CalendarDays,
  BotMessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "CRM",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Leads", href: "/leads", icon: Users },
      { label: "Deals", href: "/deals", icon: Handshake },
      { label: "Customers", href: "/customers", icon: UserCircle },
      { label: "Inventory", href: "/inventory", icon: Car },
      { label: "Appointments", href: "/appointments", icon: CalendarDays },
    ],
  },
  {
    label: "AI Features",
    items: [
      { label: "BDC Command Center", href: "/bdc", icon: BotMessageSquare },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
              AutoCRM
            </span>
            <span className="text-[10px] text-sidebar-foreground/50">
              AI-Powered
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-primary")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </aside>
  );
}
