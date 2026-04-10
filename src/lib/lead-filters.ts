import type { Lead } from "@/lib/mock-data";

export type LeadFilterCriteria = {
  /** Empty = any source */
  sources: string[];
  /** Empty = any assignee */
  assignedUserIds: string[];
  /** Empty = any tag; if set, lead must have at least one selected tag */
  smartTags: string[];
  activity: "any" | "7d" | "30d";
  search: string;
};

const ANCHOR = new Date("2026-04-11T23:59:59Z");

function withinActivityWindow(
  lastActivityAt: string,
  activity: LeadFilterCriteria["activity"],
): boolean {
  if (activity === "any") return true;
  const days = activity === "7d" ? 7 : 30;
  const cutoff = ANCHOR.getTime() - days * 24 * 60 * 60 * 1000;
  return new Date(lastActivityAt).getTime() >= cutoff;
}

export function applyLeadFilters(
  list: Lead[],
  c: LeadFilterCriteria,
): Lead[] {
  const q = c.search.trim().toLowerCase();
  return list.filter((lead) => {
    if (c.sources.length > 0 && !c.sources.includes(lead.source)) return false;
    if (
      c.assignedUserIds.length > 0 &&
      !c.assignedUserIds.includes(lead.assignedUserId)
    )
      return false;
    if (
      c.smartTags.length > 0 &&
      !c.smartTags.some((t) => lead.smartTags.includes(t))
    )
      return false;
    if (!withinActivityWindow(lead.lastActivityAt, c.activity)) return false;
    if (q) {
      const name = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      if (
        !name.includes(q) &&
        !lead.email.toLowerCase().includes(q) &&
        !lead.phone.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

export function collectLeadSmartTags(leads: Lead[]): string[] {
  const set = new Set<string>();
  for (const l of leads) {
    for (const t of l.smartTags) set.add(t);
  }
  return [...set].sort();
}
