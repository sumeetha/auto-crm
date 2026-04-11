"use client";

import Image from "next/image";
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
  MessagesSquare,
  Megaphone,
  Share2,
  BarChart3,
  Settings,
  ChevronLeft,
  GitBranch,
  Bot,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    label: "Customer engagement",
    items: [
      { label: "Conversations", href: "/bdc", icon: MessagesSquare },
      { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      { label: "Social", href: "/social", icon: Share2 },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Workflows", href: "/workflows", icon: GitBranch },
      { label: "Agents", href: "/agents", icon: Bot },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

type SidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {collapsed ? (
            <button
              type="button"
              onClick={() => onCollapsedChange(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="relative flex h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-1 ring-sidebar-border/60 transition-colors hover:bg-sidebar-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/25"
            >
              <Image
                src="/brand/autocrm-logo.png"
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
                priority
              />
            </button>
          ) : (
            <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-sidebar-border/60">
              <Image
                src="/brand/autocrm-logo.png"
                alt="AutoCRM"
                width={32}
                height={32}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
                AutoCRM
              </span>
              <span className="text-[10px] text-sidebar-foreground/50">
                AI-Powered
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="shrink-0 rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
          </button>
        )}
      </div>

      <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const allItems = navGroups.flatMap((g) => g.items);
                const isActive = (() => {
                  if (pathname === item.href) return true;
                  if (item.href === "/dashboard") return false;
                  if (!pathname.startsWith(item.href)) return false;
                  const hasMoreSpecific = allItems.some(
                    (other) =>
                      other.href !== item.href &&
                      other.href.length > item.href.length &&
                      pathname.startsWith(other.href),
                  );
                  return !hasMoreSpecific;
                })();
                const linkClassName = cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                );

                const linkBody = (
                  <>
                    <item.icon
                      className={cn(
                        "h-4.5 w-4.5 shrink-0",
                        isActive && "text-primary",
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                );

                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger
                          nativeButton={false}
                          delay={200}
                          render={(props) => {
                            const {
                              className: triggerClassName,
                              nativeButton: _omitNativeButton,
                              ...rest
                            } = props as typeof props & {
                              nativeButton?: boolean;
                            };
                            return (
                              <Link
                                {...rest}
                                href={item.href}
                                className={cn(
                                  linkClassName,
                                  triggerClassName,
                                )}
                              >
                                {linkBody}
                              </Link>
                            );
                          }}
                        />
                        <TooltipContent side="right" sideOffset={10}>
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link href={item.href} className={linkClassName}>
                        {linkBody}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-end rounded-lg p-2 pr-2.5 text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
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
