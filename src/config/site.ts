export const siteConfig = {
  name: "Aniimo",
  shortName: "ANIIMO",
  description:
    "An independent Aniimo companion with creature profiles, forms, skills, habitats, guides, maps, and practical planning tools for players.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aniimo.cc",
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
      { label: "Choose Your First Aniimo", href: "/guides/how-to-choose-your-first-aniimo" },
      { label: "Elements & Roles", href: "/guides/aniimo-elements-and-roles-explained" },
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
