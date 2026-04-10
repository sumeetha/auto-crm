export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  purchaseHistory: {
    date: string;
    vehicle: string;
    dealType: "new" | "used" | "lease";
    amount: number;
  }[];
  lastServiceDate: string | null;
  equityPosition: number;
  leaseEndDate: string | null;
  lifetimeValue: number;
};

export const customers: Customer[] = [
  {
    id: "cust-1",
    firstName: "David",
    lastName: "Thompson",
    email: "dthompson.work@gmail.com",
    phone: "(555) 224-5578",
    address: "4521 Maple Dr, Springfield, IL 62704",
    purchaseHistory: [
      {
        date: "2023-03-15",
        vehicle: "2023 Honda Civic EX",
        dealType: "new",
        amount: 29450,
      },
      {
        date: "2026-04-09",
        vehicle: "2026 Honda Accord Sport",
        dealType: "new",
        amount: 33400,
      },
    ],
    lastServiceDate: "2026-01-20",
    equityPosition: 2800,
    leaseEndDate: null,
    lifetimeValue: 62850,
  },
  {
    id: "cust-2",
    firstName: "Emily",
    lastName: "Watson",
    email: "emily.watson@yahoo.com",
    phone: "(555) 118-6643",
    address: "892 Oak Hill Ln, Springfield, IL 62711",
    purchaseHistory: [
      {
        date: "2023-05-10",
        vehicle: "2023 Honda CR-V EX-L",
        dealType: "lease",
        amount: 399,
      },
      {
        date: "2026-04-07",
        vehicle: "2025 Honda CR-V Hybrid Sport Touring",
        dealType: "new",
        amount: 41200,
      },
    ],
    lastServiceDate: "2025-11-08",
    equityPosition: 0,
    leaseEndDate: null,
    lifetimeValue: 55544,
  },
  {
    id: "cust-3",
    firstName: "Mark",
    lastName: "Henderson",
    email: "mhenderson@gmail.com",
    phone: "(555) 337-4412",
    address: "1100 Birch St, Springfield, IL 62702",
    purchaseHistory: [
      {
        date: "2022-08-22",
        vehicle: "2022 Honda Pilot Touring",
        dealType: "new",
        amount: 45200,
      },
    ],
    lastServiceDate: "2026-02-14",
    equityPosition: 3200,
    leaseEndDate: null,
    lifetimeValue: 48900,
  },
  {
    id: "cust-4",
    firstName: "Sarah",
    lastName: "Lawson",
    email: "slawson77@icloud.com",
    phone: "(555) 892-0033",
    address: "673 Willow Creek Rd, Springfield, IL 62707",
    purchaseHistory: [
      {
        date: "2023-11-01",
        vehicle: "2024 Honda Accord Hybrid Touring",
        dealType: "lease",
        amount: 479,
      },
    ],
    lastServiceDate: "2025-09-12",
    equityPosition: -1200,
    leaseEndDate: "2026-11-01",
    lifetimeValue: 22192,
  },
  {
    id: "cust-5",
    firstName: "James",
    lastName: "Butler",
    email: "jbutler.home@gmail.com",
    phone: "(555) 445-8892",
    address: "2234 Elmwood Ave, Springfield, IL 62704",
    purchaseHistory: [
      {
        date: "2021-06-18",
        vehicle: "2021 Honda CR-V EX AWD",
        dealType: "new",
        amount: 32400,
      },
      {
        date: "2019-01-10",
        vehicle: "2019 Honda Civic LX",
        dealType: "new",
        amount: 22100,
      },
    ],
    lastServiceDate: "2026-03-05",
    equityPosition: 1500,
    leaseEndDate: null,
    lifetimeValue: 59800,
  },
  {
    id: "cust-6",
    firstName: "Patricia",
    lastName: "Kim",
    email: "p.kim@outlook.com",
    phone: "(555) 213-6678",
    address: "445 Sunset Blvd, Springfield, IL 62703",
    purchaseHistory: [
      {
        date: "2024-01-20",
        vehicle: "2024 Honda HR-V EX-L",
        dealType: "lease",
        amount: 369,
      },
    ],
    lastServiceDate: "2025-07-30",
    equityPosition: -800,
    leaseEndDate: "2027-01-20",
    lifetimeValue: 15948,
  },
  {
    id: "cust-7",
    firstName: "Thomas",
    lastName: "Garcia",
    email: "tgarcia@gmail.com",
    phone: "(555) 558-2201",
    address: "3890 Pine Ridge Dr, Springfield, IL 62712",
    purchaseHistory: [
      {
        date: "2020-04-12",
        vehicle: "2020 Honda Accord Sport 1.5T",
        dealType: "new",
        amount: 28500,
      },
    ],
    lastServiceDate: "2025-12-18",
    equityPosition: -2100,
    leaseEndDate: null,
    lifetimeValue: 34200,
  },
  {
    id: "cust-8",
    firstName: "Linda",
    lastName: "Chen",
    email: "linda.chen@gmail.com",
    phone: "(555) 776-3349",
    address: "512 Magnolia Ct, Springfield, IL 62704",
    purchaseHistory: [
      {
        date: "2023-07-08",
        vehicle: "2023 Honda Civic Sport Touring",
        dealType: "lease",
        amount: 425,
      },
    ],
    lastServiceDate: "2026-01-05",
    equityPosition: 400,
    leaseEndDate: "2026-07-08",
    lifetimeValue: 18700,
  },
  {
    id: "cust-9",
    firstName: "William",
    lastName: "Patel",
    email: "wpatel@yahoo.com",
    phone: "(555) 994-1120",
    address: "8201 Valley View Rd, Springfield, IL 62711",
    purchaseHistory: [
      {
        date: "2022-11-30",
        vehicle: "2023 Honda Ridgeline RTL",
        dealType: "new",
        amount: 42800,
      },
    ],
    lastServiceDate: "2026-02-28",
    equityPosition: 4100,
    leaseEndDate: null,
    lifetimeValue: 47500,
  },
  {
    id: "cust-10",
    firstName: "Karen",
    lastName: "Wright",
    email: "kwright.home@gmail.com",
    phone: "(555) 332-8847",
    address: "1455 Cherry Blossom Way, Springfield, IL 62702",
    purchaseHistory: [
      {
        date: "2024-03-15",
        vehicle: "2024 Honda CR-V Hybrid Sport",
        dealType: "lease",
        amount: 449,
      },
    ],
    lastServiceDate: "2025-10-22",
    equityPosition: 600,
    leaseEndDate: "2027-03-15",
    lifetimeValue: 19356,
  },
  {
    id: "cust-11",
    firstName: "Steven",
    lastName: "Moore",
    email: "smoore@protonmail.com",
    phone: "(555) 667-5534",
    address: "3672 Aspen Ct, Springfield, IL 62707",
    purchaseHistory: [
      {
        date: "2021-09-05",
        vehicle: "2021 Toyota Camry XSE",
        dealType: "used",
        amount: 29800,
      },
      {
        date: "2018-12-20",
        vehicle: "2018 Honda Civic EX",
        dealType: "new",
        amount: 24500,
      },
    ],
    lastServiceDate: "2025-08-14",
    equityPosition: -3400,
    leaseEndDate: null,
    lifetimeValue: 58700,
  },
  {
    id: "cust-12",
    firstName: "Rebecca",
    lastName: "Hall",
    email: "rhall.biz@gmail.com",
    phone: "(555) 114-9902",
    address: "927 Lakewood Dr, Springfield, IL 62712",
    purchaseHistory: [
      {
        date: "2023-02-14",
        vehicle: "2023 Honda Pilot EX-L",
        dealType: "lease",
        amount: 499,
      },
    ],
    lastServiceDate: "2025-06-20",
    equityPosition: -1800,
    leaseEndDate: "2026-08-14",
    lifetimeValue: 24450,
  },
  {
    id: "cust-13",
    firstName: "Daniel",
    lastName: "Lee",
    email: "dlee.auto@gmail.com",
    phone: "(555) 448-7766",
    address: "5580 Riverside Dr, Springfield, IL 62703",
    purchaseHistory: [
      {
        date: "2024-06-01",
        vehicle: "2024 Honda Accord EX-L Hybrid",
        dealType: "new",
        amount: 36900,
      },
    ],
    lastServiceDate: "2026-03-10",
    equityPosition: 1900,
    leaseEndDate: null,
    lifetimeValue: 39200,
  },
  {
    id: "cust-14",
    firstName: "Nicole",
    lastName: "Adams",
    email: "nicole.adams@icloud.com",
    phone: "(555) 229-3310",
    address: "4120 Brookside Ln, Springfield, IL 62704",
    purchaseHistory: [
      {
        date: "2023-09-28",
        vehicle: "2024 Honda CR-V EX-L",
        dealType: "lease",
        amount: 439,
      },
    ],
    lastServiceDate: "2025-05-15",
    equityPosition: -500,
    leaseEndDate: "2026-09-28",
    lifetimeValue: 19308,
  },
  {
    id: "cust-15",
    firstName: "Christopher",
    lastName: "Young",
    email: "cyoung@gmail.com",
    phone: "(555) 881-2245",
    address: "7890 Hilltop Rd, Springfield, IL 62711",
    purchaseHistory: [
      {
        date: "2020-12-15",
        vehicle: "2021 Honda Pilot Black Edition",
        dealType: "new",
        amount: 50200,
      },
      {
        date: "2017-05-20",
        vehicle: "2017 Honda Accord Touring",
        dealType: "new",
        amount: 33600,
      },
      {
        date: "2013-08-10",
        vehicle: "2013 Honda CR-V EX",
        dealType: "new",
        amount: 27400,
      },
    ],
    lastServiceDate: "2026-03-25",
    equityPosition: 5200,
    leaseEndDate: null,
    lifetimeValue: 122400,
  },
];
