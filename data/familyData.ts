export interface FamilyConfigMember {
  id: string;
  name: string;
  role: "parent" | "child" | "pet";
  color: string; // hex color
  icon: string;  // lucide-react icon name string
  emoji: string;
}

export interface WeeklyDinner {
  day: string;
  dinner: string;
  cook: string;
}

export interface ChildActivity {
  childId: string;
  activity: string;
  day: string;
  time: string;
}

export interface FamilyConfig {
  members: FamilyConfigMember[];
  food: WeeklyDinner[];
  schedule: ChildActivity[];
}

export const familyConfig: FamilyConfig = {
  members: [
    {
      id: "mats",
      name: "Mats",
      role: "parent",
      color: "#818cf8", // indigo-400
      icon: "User",
      emoji: "👨",
    },
    {
      id: "amandah",
      name: "Amandah",
      role: "parent",
      color: "#fb7185", // rose-400
      icon: "User",
      emoji: "👩",
    },
    {
      id: "maya",
      name: "Maya",
      role: "child",
      color: "#c084fc", // purple-400
      icon: "Star",
      emoji: "👧",
    },
    {
      id: "stina",
      name: "Stina",
      role: "child",
      color: "#fbbf24", // amber-400
      icon: "Sparkles",
      emoji: "👧🏼",
    },
    {
      id: "castiel",
      name: "Castiel",
      role: "child",
      color: "#22d3ee", // cyan-400
      icon: "Zap",
      emoji: "👦",
    },
    {
      id: "tristan",
      name: "Tristan",
      role: "child",
      color: "#4ade80", // green-400
      icon: "Shield",
      emoji: "👦🏻",
    },
    {
      id: "luna",
      name: "Luna",
      role: "pet",
      color: "#fb923c", // orange-400
      icon: "Cat",
      emoji: "🐱",
    },
  ],

  food: [
    { day: "Måndag",  dinner: "Köttfärssås & pasta",          cook: "amandah" },
    { day: "Tisdag",  dinner: "Kycklinggryta & ris",           cook: "amandah" },
    { day: "Onsdag",  dinner: "Laxfilé & potatisgratäng",      cook: "mats"    },
    { day: "Torsdag", dinner: "Vegetarisk curry & naan",       cook: "amandah" },
    { day: "Fredag",  dinner: "Fredagstacos 🌮",               cook: "mats"    },
    { day: "Lördag",  dinner: "Hemmagjord pizza",              cook: "hela familjen" },
    { day: "Söndag",  dinner: "Söndagsstek & rotfrukter",      cook: "mats"    },
  ],

  schedule: [
    { childId: "maya",    activity: "Fotbollsträning",   day: "Måndag",  time: "17:00" },
    { childId: "maya",    activity: "Simträning",        day: "Onsdag",  time: "16:30" },
    { childId: "stina",   activity: "Gymnastiksträning", day: "Tisdag",  time: "17:30" },
    { childId: "stina",   activity: "Pianolektioner",    day: "Torsdag", time: "16:00" },
    { childId: "castiel", activity: "Kampsportsträning", day: "Måndag",  time: "18:00" },
    { childId: "castiel", activity: "Schackklubb",       day: "Onsdag",  time: "15:30" },
    { childId: "tristan", activity: "Fotbollsträning",   day: "Tisdag",  time: "17:00" },
    { childId: "tristan", activity: "Cykelklubb",        day: "Torsdag", time: "15:00" },
  ],
};
