import type { Aniimo, DatabaseCategory, Guide } from "@/types/content";

export type TdkEntry = {
  title: string;
  description: string;
  pathname: string;
  lastModified: string;
  image?: string;
  noIndex?: boolean;
};

const released = "2026-09-01";

const guideDescriptions: Record<string, string> = {
  "aniimo-beginners-guide": "Start with a practical Aniimo route covering your first catches, Twining, exploration priorities and the four roles that keep an early team balanced.",
  "how-to-choose-your-first-aniimo": "Compare Aniimo forms, element changes, published evolution paths and material costs before committing resources to your first long-term choice.",
  "aniimo-elements-and-roles-explained": "Learn how Aniimo roles, BREAK windows, EP use and elemental coverage work together when you are building a balanced four-member team.",
};

function fitDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  const clipped = normalized.slice(0, 157);
  const sentenceEnd = Math.max(clipped.lastIndexOf("."), clipped.lastIndexOf("!"), clipped.lastIndexOf("?"));
  if (sentenceEnd >= 120) return clipped.slice(0, sentenceEnd + 1);
  const wordEnd = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, wordEnd > 120 ? wordEnd : clipped.length).replace(/[,.]$/, "")}…`;
}

export const tdk = {
  home: {
    title: "Aniimo — Creatures, Guides, Maps & Team Tools",
    description: "Explore Aniimo creatures, forms, skills, habitats, guides, maps, player rankings, and team tools to plan your next route through Idyll with confidence.",
    pathname: "/",
    lastModified: released,
  },
  aniimo: {
    title: "All Aniimo Creatures — Forms, Skills & Habitats",
    description: "Browse the Aniimo roster by element, role, stage, and form. Open each creature profile to compare stats, skills, traits, evolution paths, and habitats.",
    pathname: "/aniimo",
    lastModified: released,
  },
  database: {
    title: "Aniimo Database — Skills, Items, Habitats & More",
    description: "Explore Aniimo skills, traits, items, materials, habitats, evolutions, bosses, and achievements, then follow the useful links between each record.",
    pathname: "/database",
    lastModified: released,
  },
  guides: {
    title: "Aniimo Guides — From First Catch to Smarter Teams",
    description: "Read Aniimo guides for first teams, elements, roles, forms, evolution choices, and exploration planning without losing sight of what you want to do next.",
    pathname: "/guides",
    lastModified: released,
  },
  map: {
    title: "Aniimo Interactive Map — Breezy Plains and Idyll Atlases",
    description: "Explore Idyll chests, spawns, puzzles and transporters on a local interactive map covering Breezy Plains, Astra, Whisperwake Isles and The Lost Islets.",
    pathname: "/map",
    lastModified: released,
  },
  tierList: {
    title: "Aniimo Tier List — Player Picks by Role and Team Use",
    description: "Browse the Aniimo Tier List by role, compare player-focused picks for DPS, support, healing and more, then open profiles to build a team that fits your plan.",
    pathname: "/tier-list",
    lastModified: released,
  },
  globalVote: {
    title: "Aniimo Global Vote 2026 — Player Popularity Ranking",
    description: "Browse the Aniimo Global Vote 2026 by player vote count, discover fan favorites, and use the results as a popularity snapshot rather than a combat ranking.",
    pathname: "/tier-list/global-vote",
    lastModified: released,
  },
  teamBuilder: {
    title: "Aniimo Team Builder — Plan Your Party and Compare Stats",
    description: "Choose Aniimo for a four-member party, review role and element coverage, compare published base fields, and spot gaps before you set out to explore Idyll.",
    pathname: "/team-builder",
    lastModified: released,
  },
  teamTemplates: {
    title: "Aniimo Team Templates — Six Player-Made Starting Points",
    description: "Browse six player-made Aniimo team shapes, see each party’s role and element coverage, then open a template in Team Builder and adapt it to your own roster.",
    pathname: "/team-builder/templates",
    lastModified: released,
  },
  tools: {
    title: "Aniimo Tools — Build, Compare and Track Your Roster",
    description: "Use Aniimo planning tools to build a party, compare a short list of creatures, and keep track of the Aniimo you still want to find on your next route.",
    pathname: "/tools",
    lastModified: released,
  },
  compare: {
    title: "Aniimo Compare — Review Creature Stats Side by Side",
    description: "Compare selected Aniimo side by side using published base fields, elements, roles, forms, and skills, then open the profiles that matter to your team decision.",
    pathname: "/tools/compare",
    lastModified: released,
  },
  collectionTracker: {
    title: "Aniimo Collection Tracker — Keep Your Roster in View",
    description: "Track the Aniimo you have found, filter the roster by your next goal, and keep an approachable local checklist while you explore the world of Idyll.",
    pathname: "/tools/collection-tracker",
    lastModified: released,
  },
  updates: {
    title: "Aniimo Updates — Release News, Events and Milestones",
    description: "Follow Aniimo release milestones, event notices, and update highlights in one player-facing hub built to help you see what changed and what is next.",
    pathname: "/updates",
    lastModified: released,
  },
  howItWorks: {
    title: "How Aniimo Keeps Player Pages Useful and Clear",
    description: "See how Aniimo separates creature fields from player-made guidance, handles corrections, and keeps page connections clear without filling gaps with guesses.",
    pathname: "/sources",
    lastModified: released,
  },
  privacy: {
    title: "Aniimo Privacy Policy — How This Fan Site Handles Data",
    description: "Read how Aniimo handles browser storage, service data, contact messages, cookies, and privacy choices for a fan site serving players in the United States.",
    pathname: "/legal/privacy-policy",
    lastModified: released,
  },
  terms: {
    title: "Aniimo Terms of Service — Independent Fan Site Terms",
    description: "Read the Aniimo terms covering permitted use, player-made tools, intellectual-property notices, disclaimers, and limits of relying on evolving game information.",
    pathname: "/legal/terms-of-service",
    lastModified: released,
  },
  copyright: {
    title: "Aniimo Copyright Notice — Fan Site Content and Rights",
    description: "Read Aniimo’s copyright notice for original site writing, game-related names and artwork, takedown requests, and rights reserved by their respective owners.",
    pathname: "/legal/copyright",
    lastModified: released,
  },
  about: {
    title: "About Aniimo — An Independent Player-Made Companion",
    description: "Learn why Aniimo exists, what the site helps players do, how creature pages and guides are approached, and why it remains separate from the game’s owners.",
    pathname: "/legal/about-us",
    lastModified: released,
  },
  contact: {
    title: "Contact Aniimo — Corrections, Feedback and Questions",
    description: "Contact Aniimo to report a page correction, share player feedback, ask a site question, or send a copyright concern with enough detail for a useful response.",
    pathname: "/legal/contact-us",
    lastModified: released,
  },
} satisfies Record<string, TdkEntry>;

export function aniimoTdk(entry: Aniimo): TdkEntry {
  const formCount = entry.forms.length;
  const forms = formCount > 1 ? `${formCount} available forms` : "its available form";
  return {
    title: `${entry.name} — Aniimo Skills, Forms, Stats & Evolution`,
    description: fitDescription(`Explore ${entry.name}'s ${entry.elements.join(" and ")} element, ${entry.roles.join(" and ")} role, published stats, skills, traits, ${forms}, habitats, and evolution path in Aniimo. Plan ahead.`),
    pathname: `/aniimo/${entry.slug}`,
    lastModified: released,
    image: entry.image,
  };
}

export function guideTdk(guide: Guide): TdkEntry {
  const title = guide.title.toLowerCase().startsWith("aniimo ")
    ? guide.title
    : `${guide.title} — Aniimo Guide`;
  return {
    title,
    description: fitDescription(guideDescriptions[guide.slug] || guide.excerpt),
    pathname: `/guides/${guide.slug}`,
    lastModified: guide.updated,
    image: guide.coverImage,
  };
}

export function categoryTdk(category: DatabaseCategory): TdkEntry {
  const title = category.slug === "skills"
    ? "Aniimo Skills List — Effects, Owners & Skill Types"
    : `Aniimo ${category.name} — Browse Related Game Records`;
  return {
    title,
    description: fitDescription(`${category.description} Browse connected Aniimo records, open the entries that matter to your next route, and keep useful game information in one place.`),
    pathname: `/database/${category.slug}`,
    lastModified: released,
    noIndex: category.status === "tracking",
  };
}
