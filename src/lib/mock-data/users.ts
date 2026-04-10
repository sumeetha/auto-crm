export type User = {
  id: string;
  name: string;
  role:
    | "bdc-agent"
    | "bdc-manager"
    | "sales-consultant"
    | "desk-manager"
    | "sales-manager"
    | "gm";
  avatar: string;
  email: string;
  phone: string;
};

export const users: User[] = [
  {
    id: "user-1",
    name: "Rob Johnson",
    role: "sales-consultant",
    avatar: "RJ",
    email: "rob.johnson@sunrisehonda.com",
    phone: "(555) 201-3344",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    role: "bdc-agent",
    avatar: "SC",
    email: "sarah.chen@sunrisehonda.com",
    phone: "(555) 201-3345",
  },
  {
    id: "user-3",
    name: "Marcus Williams",
    role: "bdc-manager",
    avatar: "MW",
    email: "marcus.williams@sunrisehonda.com",
    phone: "(555) 201-3346",
  },
  {
    id: "user-4",
    name: "Lisa Patel",
    role: "desk-manager",
    avatar: "LP",
    email: "lisa.patel@sunrisehonda.com",
    phone: "(555) 201-3347",
  },
  {
    id: "user-5",
    name: "David Kim",
    role: "sales-manager",
    avatar: "DK",
    email: "david.kim@sunrisehonda.com",
    phone: "(555) 201-3348",
  },
  {
    id: "user-6",
    name: "James Morrison",
    role: "gm",
    avatar: "JM",
    email: "james.morrison@sunrisehonda.com",
    phone: "(555) 201-3300",
  },
];
