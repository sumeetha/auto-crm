"use client";

import { Building2, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

const rooftops = [
  { id: "sunrise-honda", name: "Sunrise Honda", location: "San Jose, CA" },
  { id: "sunrise-toyota", name: "Sunrise Toyota", location: "Fremont, CA" },
  { id: "all", name: "All Rooftops", location: "Group View" },
];

export function RooftopSwitcher() {
  const [selected, setSelected] = useState(rooftops[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted transition-colors outline-none">
        <Building2 className="h-4 w-4 text-primary" />
        <span className="font-semibold">{selected.name}</span>
        <span className="text-xs text-muted-foreground">
          {selected.location}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {rooftops.map((rooftop) => (
          <DropdownMenuItem
            key={rooftop.id}
            onClick={() => setSelected(rooftop)}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">{rooftop.name}</p>
              <p className="text-xs text-muted-foreground">
                {rooftop.location}
              </p>
            </div>
            <Check
              className={cn(
                "h-4 w-4",
                selected.id === rooftop.id ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
