export const siteConfig = {
  name: "Aniimo",
  shortName: "ANIIMO",
  description:
    "An independent Aniimo companion with creature profiles, forms, skills, habitats, guides, maps, and practical planning tools for players.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aniimo.cc",
  author: "Frontline Pathfinde",
  contactEmail: "wyong@aniimo.cc",
  officialWiki: "https://wiki.aniimo.com/en",
  releaseNote: "PC and console: September 16, 2026 · Mobile: September 23, 2026",
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Aniimo", href: "/aniimo" },
  {
    label: "Database",
    href: "/database",
    children: [
      { label: "Skills", href: "/database/skills" },
      { label: "Items", href: "/database/items" },
      { label: "Traits", href: "/database/traits" },
      { label: "Elements", href: "/database/elements" },
      { label: "Habitats", href: "/database/habitats" },
      { label: "Evolutions", href: "/database/evolutions" },
      { label: "Mobility", href: "/database/mobility" },
      { label: "Materials", href: "/database/materials" },
      { label: "World Bosses", href: "/database/bosses" },
      { label: "Achievements", href: "/database/achievements" },
    ],
  },
  {
    label: "Tier List",
    href: "/tier-list",
    children: [
      { label: "Aniimo Tier List", href: "/tier-list" },
      { label: "Global Vote 2026", href: "/tier-list/global-vote" },
    ],
  },
  { label: "Map", href: "/map" },
  {
    label: "Team Builder",
    href: "/team-builder",
    children: [
      { label: "Build a Team", href: "/team-builder" },
      { label: "Player Team Templates", href: "/team-builder/templates" },
    ],
  },
  {
    label: "Guides",
    href: "/guides",
    children: [
      { label: "Beginner Guide", href: "/guides/aniimo-beginners-guide" },
      { label: "Forms & Evolution", href: "/guides/aniimo-forms-and-evolution" },
      { label: "Combat Guide", href: "/guides/aniimo-combat-guide" },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "Team Builder", href: "/team-builder" },
      { label: "Compare", href: "/tools/compare" },
      { label: "Collection Tracker", href: "/tools/collection-tracker" },
    ],
  },
  { label: "Updates", href: "/updates" },
];

export const elementMeta: Record<string, { label: string; symbol: string; color: string; spriteIndex: number }> = {
  fire: { label: "Fire", symbol: "◆", color: "#ef6548", spriteIndex: 1 },
  water: { label: "Water", symbol: "●", color: "#3e9df5", spriteIndex: 5 },
  grass: { label: "Grass", symbol: "✦", color: "#65ad55", spriteIndex: 0 },
  wind: { label: "Wind", symbol: "◌", color: "#50bda9", spriteIndex: 4 },
  electric: { label: "Electric", symbol: "ϟ", color: "#efb72e", spriteIndex: 2 },
  ice: { label: "Ice", symbol: "✣", color: "#55b8dd", spriteIndex: 8 },
  rock: { label: "Rock", symbol: "⬟", color: "#ad7448", spriteIndex: 3 },
  dark: { label: "Dark", symbol: "☾", color: "#7156ac", spriteIndex: 7 },
  holy: { label: "Holy", symbol: "✧", color: "#d49e2a", spriteIndex: 6 },
};

export const roleLabels: Record<string, string> = {
  dps: "DPS",
  heal: "Heal",
  sup: "Support",
  break: "Break",
  regen: "Regen",
  energy: "Regen",
};

export const homelandAbilityMeta: Record<string, { label: string; color: string }> = {
  "home-1000": { label: "Fire", color: "#e26161" },
  "home-1001": { label: "Grass", color: "#51b17a" },
  "home-1002": { label: "Water", color: "#529de7" },
  "home-1003": { label: "Earth", color: "#bea77b" },
  "home-1004": { label: "Lightning", color: "#e0c21a" },
  "home-1005": { label: "Ice", color: "#45c1d6" },
  "home-1006": { label: "Wind", color: "#2a52be" },
  "home-1007": { label: "Dark", color: "#a373d2" },
  "home-1008": { label: "Holy", color: "#f6a93c" },
  "home-1100": { label: "Carrying", color: "#6285cc" },
  "home-1101": { label: "Planting", color: "#71b258" },
  "home-1102": { label: "Harvesting", color: "#e77894" },
  "home-1103": { label: "Crafting", color: "#b579dc" },
};
