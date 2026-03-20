export type MemberRole = "parent" | "child" | "pet";

export const DAYS_SV = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
] as const;

export function getTodayName(): string {
  return DAYS_SV[new Date().getDay()];
}

export interface FamilyMember {
  id: string;
  name: string;
  role: MemberRole;
  emoji: string;
  color: string;
  responsibilities: string[];
  status: string;
  points: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  emoji: string;
  category: "activity" | "treat" | "privilege" | "other";
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: "chores" | "school" | "pet" | "cooking" | "other";
  dueTime?: string;
}

export interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  cook: string;
}

export interface Reminder {
  id: string;
  title: string;
  assignedTo: string;
  time: string;
  urgent: boolean;
}

export const familyMembers: FamilyMember[] = [
  {
    id: "mats",
    name: "Mats",
    role: "parent",
    emoji: "👨",
    color: "indigo",
    responsibilities: [
      "Handla mat på fredagar",
      "Köra barnen till aktiviteter",
      "Fixa tekniska problem",
      "Ta hand om trädgården",
    ],
    status: "På jobbet",
    points: 320,
  },
  {
    id: "amandah",
    name: "Amandah",
    role: "parent",
    emoji: "👩",
    color: "rose",
    responsibilities: [
      "Laga middag måndag–torsdag",
      "Läkarbesök & bokningar",
      "Hålla koll på schema",
      "Hjälpa med läxor",
    ],
    status: "Hemma",
    points: 410,
  },
  {
    id: "maya",
    name: "Maya",
    role: "child",
    emoji: "👧",
    color: "purple",
    responsibilities: [
      "Diska efter middag (måndag)",
      "Städa sitt rum",
      "Mata Luna på tisdagar",
    ],
    status: "I skolan",
    points: 185,
  },
  {
    id: "stina",
    name: "Stina",
    role: "child",
    emoji: "👧🏼",
    color: "amber",
    responsibilities: [
      "Diska efter middag (tisdag)",
      "Städa sitt rum",
      "Mata Luna på onsdagar",
    ],
    status: "I skolan",
    points: 230,
  },
  {
    id: "castiel",
    name: "Castiel",
    role: "child",
    emoji: "👦",
    color: "cyan",
    responsibilities: [
      "Ta ut soporna",
      "Diska efter middag (onsdag)",
      "Mata Luna på torsdagar",
    ],
    status: "I skolan",
    points: 150,
  },
  {
    id: "tristan",
    name: "Tristan",
    role: "child",
    emoji: "👦🏻",
    color: "green",
    responsibilities: [
      "Diska efter middag (torsdag)",
      "Städa vardagsrummet",
      "Mata Luna på fredagar",
    ],
    status: "I skolan",
    points: 195,
  },
  {
    id: "luna",
    name: "Luna",
    role: "pet",
    emoji: "🐱",
    color: "orange",
    responsibilities: [
      "Bli matad två gånger om dagen",
      "Leka & kela",
      "Veterinärkontroll var 6:e månad",
    ],
    status: "Sover 😴",
    points: 0,
  },
];

export const rewardItems: RewardItem[] = [
  {
    id: "rw1",
    title: "Bio-kväll",
    description: "Välj en film och titta med familjen på fredag kväll.",
    cost: 100,
    emoji: "🎬",
    category: "activity",
  },
  {
    id: "rw2",
    title: "Välj middagen",
    description: "Bestäm vad hela familjen äter en valfri dag.",
    cost: 75,
    emoji: "🍕",
    category: "treat",
  },
  {
    id: "rw3",
    title: "Slipp en diskning",
    description: "Slippa diska en gång – någon annan tar din tur.",
    cost: 50,
    emoji: "🧹",
    category: "privilege",
  },
  {
    id: "rw4",
    title: "Godisdag",
    description: "En extra godisdag utöver fredagsgodis.",
    cost: 60,
    emoji: "🍬",
    category: "treat",
  },
  {
    id: "rw5",
    title: "Utflykt till lekplatsen",
    description: "En timme på favoritlekplatsen med mamma eller pappa.",
    cost: 80,
    emoji: "🛝",
    category: "activity",
  },
  {
    id: "rw6",
    title: "Sova länge på helgen",
    description: "Slipp morgonrutinerna en lördag eller söndag.",
    cost: 40,
    emoji: "😴",
    category: "privilege",
  },
  {
    id: "rw7",
    title: "Ny bok eller spel",
    description: "Välj en ny bok, brädspel eller mobilspel (max 150 kr).",
    cost: 150,
    emoji: "🎮",
    category: "treat",
  },
  {
    id: "rw8",
    title: "Matlagningskväll",
    description: "Laga din favoriträtt tillsammans med mamma eller pappa.",
    cost: 90,
    emoji: "👨‍🍳",
    category: "activity",
  },
];

export const todayTasks: Task[] = [
  {
    id: "t1",
    title: "Mata Luna – morgon",
    assignedTo: "maya",
    completed: false,
    priority: "high",
    category: "pet",
    dueTime: "07:30",
  },
  {
    id: "t2",
    title: "Laga frukost",
    assignedTo: "amandah",
    completed: true,
    priority: "high",
    category: "cooking",
    dueTime: "07:00",
  },
  {
    id: "t3",
    title: "Hämta Maya från fotboll",
    assignedTo: "mats",
    completed: false,
    priority: "high",
    category: "other",
    dueTime: "17:00",
  },
  {
    id: "t4",
    title: "Laga middag (kycklinggryta)",
    assignedTo: "amandah",
    completed: false,
    priority: "medium",
    category: "cooking",
    dueTime: "17:30",
  },
  {
    id: "t5",
    title: "Diska efter middag",
    assignedTo: "stina",
    completed: false,
    priority: "medium",
    category: "chores",
    dueTime: "19:00",
  },
  {
    id: "t6",
    title: "Göra läxor (Matte & Svenska)",
    assignedTo: "castiel",
    completed: false,
    priority: "high",
    category: "school",
    dueTime: "16:00",
  },
  {
    id: "t7",
    title: "Städa vardagsrummet",
    assignedTo: "tristan",
    completed: false,
    priority: "low",
    category: "chores",
    dueTime: "18:00",
  },
  {
    id: "t8",
    title: "Mata Luna – kväll",
    assignedTo: "stina",
    completed: false,
    priority: "high",
    category: "pet",
    dueTime: "18:00",
  },
  {
    id: "t9",
    title: "Handla extra mat",
    assignedTo: "mats",
    completed: true,
    priority: "medium",
    category: "other",
    dueTime: "12:00",
  },
  {
    id: "t10",
    title: "Boka tandläkartid för Castiel",
    assignedTo: "amandah",
    completed: false,
    priority: "low",
    category: "other",
  },
];

export const weeklyMealPlan: MealPlan[] = [
  {
    day: "Måndag",
    breakfast: "Havregrynsgröt & frukt",
    lunch: "Smörgås & soppa",
    dinner: "Köttfärssås & pasta",
    cook: "amandah",
  },
  {
    day: "Tisdag",
    breakfast: "Yoghurt & granola",
    lunch: "Kvarvarande pasta",
    dinner: "Kycklinggryta & ris",
    cook: "amandah",
  },
  {
    day: "Onsdag",
    breakfast: "Rostat bröd & ägg",
    lunch: "Wrap med kyckling",
    dinner: "Laxfilé & potatisgratäng",
    cook: "mats",
  },
  {
    day: "Torsdag",
    breakfast: "Smoothie & smörgås",
    lunch: "Sallad & bröd",
    dinner: "Vegetarisk curry & naan",
    cook: "amandah",
  },
  {
    day: "Fredag",
    breakfast: "Pannkakor",
    lunch: "Tacos (förberedelse)",
    dinner: "Fredagstacos 🌮",
    cook: "mats",
  },
  {
    day: "Lördag",
    breakfast: "Äggröra & bacon",
    lunch: "Varmkorv & potatissallad",
    dinner: "Pizza hemmagjord",
    cook: "hela familjen",
  },
  {
    day: "Söndag",
    breakfast: "Frukostbuffé hemma",
    lunch: "Soppa",
    dinner: "Söndagsstek & rotfrukter",
    cook: "mats",
  },
];

export const reminders: Reminder[] = [
  {
    id: "r1",
    title: "Mayas fotbollsträning",
    assignedTo: "mats",
    time: "17:00",
    urgent: true,
  },
  {
    id: "r2",
    title: "Mata Luna – kväll",
    assignedTo: "stina",
    time: "18:00",
    urgent: true,
  },
  {
    id: "r3",
    title: "Tristans läxläsning",
    assignedTo: "tristan",
    time: "16:30",
    urgent: false,
  },
  {
    id: "r4",
    title: "Handla inför helgen",
    assignedTo: "mats",
    time: "Fredag",
    urgent: false,
  },
];

export const lunaFeeder: Record<string, string> = {
  Måndag: "Tristan",
  Tisdag: "Maya",
  Onsdag: "Stina",
  Torsdag: "Castiel",
  Fredag: "Tristan",
  Lördag: "Mats",
  Söndag: "Amandah",
};

export const colorMap: Record<string, string> = {
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  rose: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  green: "text-green-400 bg-green-500/10 border-green-500/30",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/30",
};

export const badgeColorMap: Record<string, string> = {
  indigo: "bg-indigo-500/20 text-indigo-300",
  rose: "bg-rose-500/20 text-rose-300",
  purple: "bg-purple-500/20 text-purple-300",
  amber: "bg-amber-500/20 text-amber-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  green: "bg-green-500/20 text-green-300",
  orange: "bg-orange-500/20 text-orange-300",
};
