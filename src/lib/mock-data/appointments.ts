export type Appointment = {
  id: string;
  leadId: string;
  leadName: string;
  vehicleOfInterest: string;
  type: "test-drive" | "delivery" | "follow-up" | "finance";
  date: string;
  time: string;
  duration: number;
  assignedUserId: string;
  status:
    | "confirmed"
    | "not-confirmed"
    | "checked-in"
    | "checked-out"
    | "no-show"
    | "completed";
  notes: string;
};

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    leadId: "lead-2",
    leadName: "Jennifer Martinez",
    vehicleOfInterest: "2026 Honda CR-V Sport Touring Hybrid",
    type: "test-drive",
    date: "2026-04-11T11:00:00Z",
    time: "11:00 AM",
    duration: 60,
    assignedUserId: "user-1",
    status: "confirmed",
    notes: "Current lease expiring on Mazda CX-5. Interested in hybrid. Husband may come along.",
  },
  {
    id: "appt-2",
    leadId: "lead-8",
    leadName: "Lisa Nguyen",
    vehicleOfInterest: "2026 Honda HR-V EX-L",
    type: "test-drive",
    date: "2026-04-12T10:00:00Z",
    time: "10:00 AM",
    duration: 60,
    assignedUserId: "user-1",
    status: "confirmed",
    notes: "Lease ending on Kia Seltos next month. Pre-approved through credit union.",
  },
  {
    id: "appt-3",
    leadId: "lead-14",
    leadName: "Heather Mitchell",
    vehicleOfInterest: "2026 Honda CR-V Sport",
    type: "test-drive",
    date: "2026-04-11T14:00:00Z",
    time: "2:00 PM",
    duration: 60,
    assignedUserId: "user-1",
    status: "not-confirmed",
    notes: "Trading in 2018 Hyundai Tucson. Wants to compare CR-V and RAV4.",
  },
  {
    id: "appt-4",
    leadId: "lead-20",
    leadName: "Angela Price",
    vehicleOfInterest: "2025 Honda Pilot EX-L",
    type: "test-drive",
    date: "2026-04-13T10:00:00Z",
    time: "10:00 AM",
    duration: 60,
    assignedUserId: "user-1",
    status: "confirmed",
    notes: "Referred by sister. Family of 5, needs 3-row. Trading in 2019 Honda Accord.",
  },
  {
    id: "appt-5",
    leadId: "lead-1",
    leadName: "Michael Torres",
    vehicleOfInterest: "2026 Honda CR-V EX-L",
    type: "finance",
    date: "2026-04-11T15:30:00Z",
    time: "3:30 PM",
    duration: 45,
    assignedUserId: "user-4",
    status: "confirmed",
    notes: "Credit app submitted. Ally pre-approval at 5.9%. Finalizing numbers.",
  },
  {
    id: "appt-6",
    leadId: "lead-10",
    leadName: "Stephanie Reed",
    vehicleOfInterest: "2026 Honda Accord Touring Hybrid",
    type: "follow-up",
    date: "2026-04-11T10:00:00Z",
    time: "10:00 AM",
    duration: 30,
    assignedUserId: "user-1",
    status: "checked-in",
    notes: "Coming back to finalize trade-in value on 2021 Camry. Desk working numbers.",
  },
  {
    id: "appt-7",
    leadId: "lead-5",
    leadName: "David Thompson",
    vehicleOfInterest: "2026 Honda Accord Sport",
    type: "delivery",
    date: "2026-04-09T16:00:00Z",
    time: "4:00 PM",
    duration: 45,
    assignedUserId: "user-1",
    status: "completed",
    notes: "Vehicle delivery and walkthrough complete. Set up HondaLink app.",
  },
  {
    id: "appt-8",
    leadId: "lead-12",
    leadName: "Michelle Davis",
    vehicleOfInterest: "2026 Honda Pilot TrailSport",
    type: "test-drive",
    date: "2026-04-12T13:00:00Z",
    time: "1:00 PM",
    duration: 60,
    assignedUserId: "user-1",
    status: "not-confirmed",
    notes: "Referred by David Thompson. Currently in 2020 Pilot EX-L. Wants to see TrailSport features.",
  },
  {
    id: "appt-9",
    leadId: "lead-4",
    leadName: "Amanda Foster",
    vehicleOfInterest: "2026 Honda Civic Sport",
    type: "finance",
    date: "2026-04-12T11:00:00Z",
    time: "11:00 AM",
    duration: 45,
    assignedUserId: "user-4",
    status: "not-confirmed",
    notes: "First-time buyer. Needs to discuss financing options, possible co-signer situation.",
  },
  {
    id: "appt-10",
    leadId: "lead-15",
    leadName: "Tyler Brooks",
    vehicleOfInterest: "2026 Honda Ridgeline Black Edition",
    type: "follow-up",
    date: "2026-04-11T16:30:00Z",
    time: "4:30 PM",
    duration: 30,
    assignedUserId: "user-1",
    status: "not-confirmed",
    notes: "Comparing to Toyota Tacoma. Wants to see updated trade-in numbers on his 2020 Tacoma.",
  },
];
