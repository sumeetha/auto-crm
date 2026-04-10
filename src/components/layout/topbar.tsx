"use client";

import { useState } from "react";
import { Bell, Sparkles, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RooftopSwitcher } from "./rooftop-switcher";
import { AskAiSheet } from "./ask-ai-sheet";

export function Topbar() {
  const [askAiOpen, setAskAiOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <RooftopSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground sm:px-3"
          onClick={() => setAskAiOpen(true)}
          aria-label="Open Ask AI"
        >
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="hidden text-sm sm:inline">Ask AI</span>
        </Button>
        <AskAiSheet open={askAiOpen} onOpenChange={setAskAiOpen} />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4.5 min-w-[18px] rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg pl-1.5 pr-2 py-1.5 hover:bg-muted transition-colors outline-none">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                RJ
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-xs font-medium">Rob Johnson</span>
              <span className="text-[10px] text-muted-foreground">
                Sales Consultant
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
