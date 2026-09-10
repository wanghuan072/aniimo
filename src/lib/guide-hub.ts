export type GuideCueItem = {
  href: string;
  title: string;
  blurb?: string;
};

export type GuideRelated = {
  href: string;
  title: string;
  description: string;
};

export type GuideTextLink = {
  href: string;
  label: string;
};

export const guideConnections: Record<string, {
  outline: Array<{ href: string; label: string }>;
  related: GuideRelated[];
  tools: GuideTextLink[];
}> = {
  "aniimo-catching-guide": {
    outline: [
      { href: "#catch-choice", label: "Read the encounter" },
      { href: "#catch-pods", label: "Pick the Aniipod" },
      { href: "#catch-aim", label: "Mega, Hyper, Trace" },
      { href: "#catch-restock", label: "Restock without draining" },
    ],
    related: [
      { href: "/guides/aniimo-beginners-guide", title: "First hours in Aniimo", description: "Where catching sits in the opening sequence." },
      { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", description: "Why a BREAK opening makes the throw cheaper." },
      { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", description: "Turn a named miss into a route, not a pouch problem." },
    ],
    tools: [
      { href: "/database/items?q=aniipod", label: "Aniipod item records" },
      { href: "/map", label: "Find the encounter on the map" },
      { href: "/tools/collection-tracker", label: "Collection Tracker" },
    ],
  },
  "aniimo-beginners-guide": {
    outline: [
      { href: "#first-hours", label: "First hours" },
      { href: "#starter-choice", label: "Helion or Lunara" },
      { href: "#twining", label: "Command and Twining" },
      { href: "#first-team", label: "Three-job team" },
    ],
    related: [
      { href: "/guides/aniimo-catching-guide", title: "Catching: which Aniipod to throw", description: "Spend the cheapest pod that solves the miss." },
      { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", description: "What the first three jobs are actually for." },
      { href: "/team-builder", title: "Team Builder", description: "Drop Helion or Fennelun in a slot and test the missing job." },
    ],
    tools: [
      { href: "/aniimo/helion", label: "Helion’s profile" },
      { href: "/aniimo/fennelun", label: "Fennelun’s profile" },
      { href: "/map", label: "Nimbus Fields on the map" },
    ],
  },
  "aniimo-forms-and-evolution": {
    outline: [
      { href: "#three-things", label: "Form, stage, evolution" },
      { href: "#family-read", label: "Scorchhowl or Inferlupa" },
      { href: "#three-gates", label: "What an evolution can require" },
      { href: "#team-fit", label: "Does this branch help?" },
    ],
    related: [
      { href: "/guides/aniimo-materials-guide", title: "Material routes in Breezy Plains", description: "Farm after you name the destination." },
      { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", description: "Check whether the later record actually changes a fight." },
      { href: "/database/evolutions", title: "Evolution records", description: "See the published paths before you spend stones." },
    ],
    tools: [
      { href: "/aniimo/emberpup", label: "Emberpup’s family" },
      { href: "/database/materials", label: "Material records" },
      { href: "/team-builder", label: "Test the later record" },
    ],
  },
  "aniimo-combat-guide": {
    outline: [
      { href: "#matchup", label: "1.6× matchup" },
      { href: "#break-loop", label: "Open a BREAK window" },
      { href: "#ep-choice", label: "Save EP for the burst" },
      { href: "#small-rebuild", label: "Fix one slot" },
    ],
    related: [
      { href: "/guides/aniimo-elements-guide", title: "Type matchups", description: "Read the chart before swapping the whole party." },
      { href: "/guides/aniimo-traits-guide", title: "Traits that actually fire", description: "Only keep a passive you can place in this rotation." },
      { href: "/team-builder", title: "Team Builder", description: "Change one job and keep the other three still." },
    ],
    tools: [
      { href: "/tools/type-chart", label: "Type chart" },
      { href: "/database/skills?q=break", label: "BREAK skills" },
      { href: "/tools/compare", label: "Compare two Aniimo" },
    ],
  },
  "aniimo-elements-guide": {
    outline: [
      { href: "#matrix", label: "Read the chart" },
      { href: "#coverage-test", label: "Fix one matchup" },
      { href: "#forms", label: "When a form changes typing" },
      { href: "#no-overreaction", label: "Keep the Aniimo you like" },
    ],
    related: [
      { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", description: "Matchup is the first multiplier, not the whole fight." },
      { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", description: "A regional form can drop or add an element." },
      { href: "/database/elements", title: "Element directory", description: "Jump from a type to the Aniimo that use it." },
    ],
    tools: [
      { href: "/tools/type-chart", label: "Type chart" },
      { href: "/team-builder", label: "Coverage in Team Builder" },
      { href: "/aniimo", label: "Browse the roster" },
    ],
  },
  "aniimo-traits-guide": {
    outline: [
      { href: "#three-parts", label: "Trigger, target, timing" },
      { href: "#trait-fit", label: "Fit it to the rotation" },
      { href: "#trait-mistakes", label: "Common mistakes" },
      { href: "#trait-note", label: "One-line field note" },
    ],
    related: [
      { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", description: "A trait should fire inside a loop you already run." },
      { href: "/database/traits", title: "Trait records", description: "Read the exact trigger before you rebuild." },
      { href: "/team-builder", title: "Team Builder", description: "See whether the holder still covers a real job." },
    ],
    tools: [
      { href: "/database/traits", label: "Trait directory" },
      { href: "/tools/compare", label: "Compare two holders" },
      { href: "/aniimo", label: "Browse roles" },
    ],
  },
  "aniimo-materials-guide": {
    outline: [
      { href: "#shortfall", label: "Name the shortfall" },
      { href: "#route-value", label: "Run one loop" },
      { href: "#craft-boundary", label: "Records vs recipes" },
      { href: "#inventory", label: "Stop when funded" },
    ],
    related: [
      { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", description: "Farm only after the destination is named." },
      { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", description: "Pair a material loop with a missing record." },
      { href: "/map", title: "Breezy Plains map", description: "Turn one layer on and leave the rest quiet." },
    ],
    tools: [
      { href: "/database/materials", label: "Material records" },
      { href: "/database/evolutions", label: "Evolution paths" },
      { href: "/map", label: "Open the map" },
    ],
  },
  "aniimo-eggs-guide": {
    outline: [
      { href: "#hatch", label: "How hatching works" },
      { href: "#label", label: "What the shell can promise" },
      { href: "#plan", label: "Where to look" },
      { href: "#unknowns", label: "What this page does not guess" },
    ],
    related: [
      { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", description: "A hatch is a lead, then a tracker mark." },
      { href: "/guides/aniimo-catching-guide", title: "Catching: which Aniipod to throw", description: "Save Ultra and Sparkling Cube for wild catches." },
      { href: "/map", title: "Egg layers on the map", description: "Pick one egg label, not every icon." },
    ],
    tools: [
      { href: "/database/items?q=egg", label: "Egg item records" },
      { href: "/map", label: "Egg layers" },
      { href: "/tools/collection-tracker", label: "Collection Tracker" },
    ],
  },
  "aniimo-collection-guide": {
    outline: [
      { href: "#one-target", label: "Pick one missing Aniimo" },
      { href: "#exact-version", label: "Check the exact form" },
      { href: "#two-purpose-route", label: "Pair with a second goal" },
      { href: "#completion", label: "After you find it" },
    ],
    related: [
      { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", description: "A family name is not the version you are hunting." },
      { href: "/guides/aniimo-eggs-guide", title: "Eggs and hatching", description: "When the next lead is a shell, not a spawn." },
      { href: "/tools/collection-tracker", title: "Collection Tracker", description: "Mark the base record in this browser." },
    ],
    tools: [
      { href: "/tools/collection-tracker", label: "Open the tracker" },
      { href: "/map", label: "Open the map" },
      { href: "/team-builder", label: "Test it in a team" },
    ],
  },
};

export const extraSectionLinks: Record<string, GuideTextLink[]> = {
  "first-hours": [
    { href: "/guides/aniimo-catching-guide", label: "Catching: which Aniipod" },
    { href: "/map", label: "Open Nimbus Fields" },
  ],
  "starter-choice": [
    { href: "/aniimo/helion", label: "Open Helion" },
    { href: "/guides/aniimo-elements-guide", label: "Type matchups" },
  ],
  "twining": [
    { href: "/aniimo/emberpup", label: "Emberpup’s Hustle" },
    { href: "/aniimo/bolty", label: "Bolty’s High Jump" },
  ],
  "first-team": [
    { href: "/guides/aniimo-combat-guide", label: "Combat: BREAK and EP" },
    { href: "/aniimo/skippy", label: "Skippy’s profile" },
    { href: "/aniimo/leafy", label: "Leafy’s profile" },
  ],
  "first-hour-route": [
    { href: "/aniimo/emberpup", label: "Emberpup" },
    { href: "/aniimo/skippy", label: "Skippy" },
    { href: "/guides/aniimo-materials-guide", label: "Material routes" },
  ],
  "first-roster": [
    { href: "/guides/aniimo-combat-guide", label: "Combat: BREAK and EP" },
    { href: "/aniimo/leafy", label: "Leafy" },
  ],
  "three-things": [
    { href: "/aniimo/emberpup", label: "Emberpup forms" },
    { href: "/guides/aniimo-collection-guide", label: "Collection routes" },
  ],
  "family-read": [
    { href: "/aniimo/scorchhowl", label: "Scorchhowl" },
    { href: "/aniimo/inferlupa", label: "Inferlupa" },
    { href: "/tools/compare?first=emberpup", label: "Compare the family" },
  ],
  "three-gates": [
    { href: "/guides/aniimo-materials-guide", label: "Farm after the gates" },
    { href: "/database/evolutions", label: "Evolution records" },
  ],
  "team-fit": [
    { href: "/guides/aniimo-combat-guide", label: "Combat: BREAK and EP" },
    { href: "/aniimo", label: "Browse the roster" },
  ],
  "matchup": [
    { href: "/guides/aniimo-elements-guide", label: "How to read the chart" },
    { href: "/database/elements", label: "Element directory" },
  ],
  "break-loop": [
    { href: "/guides/aniimo-catching-guide", label: "Catching after BREAK" },
    { href: "/team-builder", label: "Who opens BREAK?" },
  ],
  "ep-choice": [
    { href: "/aniimo/skippy", label: "Skippy’s Healing Water" },
    { href: "/aniimo/leafy", label: "Leafy’s Blooms of Vigor" },
  ],
  "small-rebuild": [
    { href: "/guides/aniimo-traits-guide", label: "Traits that actually fire" },
    { href: "/tools/compare", label: "Compare two Aniimo" },
  ],
  "matrix": [
    { href: "/tools/type-chart", label: "Interactive type chart" },
    { href: "/guides/aniimo-combat-guide", label: "Combat: BREAK and EP" },
  ],
  "coverage-test": [
    { href: "/aniimo", label: "Browse by element" },
    { href: "/tools/compare", label: "Compare a shortlist" },
  ],
  "forms": [
    { href: "/aniimo/emberpup", label: "Highland Emberpup" },
    { href: "/aniimo/coraliz", label: "Coraliz forms" },
  ],
  "no-overreaction": [
    { href: "/guides/aniimo-traits-guide", label: "Traits that actually fire" },
    { href: "/team-builder", label: "Keep a flexible slot" },
  ],
  "three-parts": [
    { href: "/aniimo/emberpup", label: "Scorching Flames" },
    { href: "/aniimo/tubster", label: "Victory Concerto" },
  ],
  "trait-fit": [
    { href: "/aniimo/leafy", label: "Power of Nature" },
    { href: "/guides/aniimo-combat-guide", label: "Combat rotation" },
  ],
  "trait-mistakes": [
    { href: "/database/traits", label: "Trait records" },
  ],
  "trait-note": [
    { href: "/team-builder", label: "Test the holder" },
  ],
  "shortfall": [
    { href: "/guides/aniimo-forms-and-evolution", label: "Name the destination first" },
    { href: "/aniimo/emberpup", label: "Emberpup’s branch" },
  ],
  "route-value": [
    { href: "/guides/aniimo-collection-guide", label: "Add a catch objective" },
    { href: "/database/habitats", label: "Habitat records" },
  ],
  "craft-boundary": [
    { href: "/guides/aniimo-forms-and-evolution", label: "Forms and evolution" },
  ],
  "inventory": [
    { href: "/team-builder", label: "Spend, then test" },
  ],
  "hatch": [
    { href: "/guides/aniimo-catching-guide", label: "Keep Ultra for the field" },
    { href: "/database/items?q=egg", label: "Egg item records" },
  ],
  "label": [
    { href: "/aniimo/emberpup", label: "Elite Emberpup Egg" },
    { href: "/guides/aniimo-collection-guide", label: "Mark what hatched" },
  ],
  "plan": [
    { href: "/guides/aniimo-materials-guide", label: "Pair with a material loop" },
    { href: "/tools/collection-tracker", label: "Collection Tracker" },
  ],
  "unknowns": [
    { href: "/database/items?q=egg", label: "Quote the egg text" },
  ],
  "one-target": [
    { href: "/aniimo/helgon", label: "Helgon’s profile" },
    { href: "/aniimo", label: "Browse missing records" },
  ],
  "exact-version": [
    { href: "/aniimo/helgon", label: "Helgon forms" },
    { href: "/database/evolutions", label: "Evolution paths" },
  ],
  "two-purpose-route": [
    { href: "/guides/aniimo-materials-guide", label: "Material routes" },
    { href: "/guides/aniimo-eggs-guide", label: "Eggs and hatching" },
  ],
  "completion": [
    { href: "/guides/aniimo-combat-guide", label: "Does it change a fight?" },
    { href: "/aniimo", label: "Find the next record" },
  ],
  "emberpup-forms": [
    { href: "/map", label: "Open listed habitats" },
    { href: "/guides/aniimo-collection-guide", label: "Collection routes" },
  ],
  "emberpup-branches": [
    { href: "/aniimo/scorchhowl", label: "Scorchhowl" },
    { href: "/aniimo/inferlupa", label: "Inferlupa" },
    { href: "/team-builder", label: "Test the later record" },
  ],
  "skill-ledger": [
    { href: "/aniimo/blazen", label: "Blazen’s skills" },
    { href: "/guides/aniimo-combat-guide#break-loop", label: "BREAK window" },
  ],
  "rotation-example": [
    { href: "/aniimo/tubster", label: "Tubster" },
    { href: "/team-builder", label: "Test the lineup" },
  ],
  "type-chart-snapshot": [
    { href: "/guides/aniimo-combat-guide", label: "Combat: BREAK and EP" },
    { href: "/database/elements", label: "Element directory" },
  ],
  "matchup-swaps": [
    { href: "/aniimo", label: "Browse by element" },
    { href: "/team-builder", label: "Try one swap" },
  ],
  "named-traits": [
    { href: "/aniimo/emberpup", label: "Scorching Flames" },
    { href: "/aniimo/tubster", label: "Victory Concerto" },
  ],
  "trait-field-test": [
    { href: "/guides/aniimo-combat-guide", label: "Combat rotation" },
    { href: "/tools/compare", label: "Compare holders" },
  ],
  "breezy-plains-loops": [
    { href: "/guides/aniimo-collection-guide", label: "Add a catch objective" },
    { href: "/database/materials", label: "Material records" },
  ],
  "farm-session-ledger": [
    { href: "/guides/aniimo-forms-and-evolution", label: "Forms and evolution" },
    { href: "/map", label: "Open the map" },
  ],
  "egg-records": [
    { href: "/guides/aniimo-catching-guide", label: "Keep Ultra for the field" },
    { href: "/aniimo/emberpup", label: "Elite Emberpup Egg" },
  ],
  "egg-map-plan": [
    { href: "/guides/aniimo-materials-guide", label: "Pair with a material loop" },
    { href: "/tools/collection-tracker", label: "Collection Tracker" },
  ],
  "tracker-controls": [
    { href: "/aniimo", label: "Browse the roster" },
    { href: "/guides/aniimo-forms-and-evolution", label: "Forms and evolution" },
  ],
  "collection-session": [
    { href: "/aniimo/helgon", label: "Helgon" },
    { href: "/team-builder", label: "Does it earn a slot?" },
  ],
};

export const databaseGuideCues: Record<string, GuideCueItem[]> = {
  skills: [
    { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", blurb: "When a skill is setup, and when it is the burst." },
    { href: "/team-builder", title: "Team Builder", blurb: "See which Aniimo actually carry that skill." },
  ],
  traits: [
    { href: "/guides/aniimo-traits-guide", title: "Traits that actually fire", blurb: "Read trigger, target, and timing before you rebuild." },
    { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", blurb: "A trait has to fit a rotation you already run." },
  ],
  elements: [
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "1.6×, 1×, and 0.625× on this site’s chart." },
    { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", blurb: "Fix the resisted hit before rewriting the party." },
  ],
  habitats: [
    { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", blurb: "One habitat plus a backup objective is a session." },
    { href: "/map", title: "Interactive map", blurb: "Turn on the layer you need and leave the rest quiet." },
  ],
  evolutions: [
    { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", blurb: "Name the later record before you farm." },
    { href: "/guides/aniimo-materials-guide", title: "Material routes", blurb: "A listed stone is not the full recipe." },
  ],
  mobility: [
    { href: "/guides/aniimo-beginners-guide", title: "First hours in Aniimo", blurb: "Twining is how later terrain actually opens." },
    { href: "/map", title: "Interactive map", blurb: "Check the gap before you swap the travel partner." },
  ],
  items: [
    { href: "/guides/aniimo-catching-guide", title: "Catching: which Aniipod", blurb: "Match the pod to the miss, not the rarity." },
    { href: "/guides/aniimo-eggs-guide", title: "Eggs and hatching", blurb: "Quote the shell. Keep Ultra for wild catches." },
  ],
  materials: [
    { href: "/guides/aniimo-materials-guide", title: "Material routes in Breezy Plains", blurb: "Start from a named shortfall, then one loop." },
    { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", blurb: "Farm after the destination is chosen." },
  ],
  bosses: [
    { href: "/guides/aniimo-combat-guide", title: "Combat: BREAK and EP", blurb: "Open the window, then spend the expensive skills." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Fix the 0.625× hit first." },
  ],
  achievements: [
    { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", blurb: "Turn a named objective into a two-purpose route." },
    { href: "/guides/aniimo-beginners-guide", title: "First hours in Aniimo", blurb: "Finish the opening before chasing side goals." },
  ],
};

export const pageGuideCues = {
  aniimoProfile: [
    { href: "/guides/aniimo-catching-guide", title: "Catching", blurb: "Which Aniipod to throw for this encounter." },
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "BREAK, EP, and the 1.6× matchup." },
    { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", blurb: "Pick the later record before farming." },
  ],
  aniimoIndex: [
    { href: "/guides/aniimo-beginners-guide", title: "First hours", blurb: "Starter, first catch, three jobs." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Filter by the element you actually need." },
    { href: "/guides/aniimo-collection-guide", title: "Collection", blurb: "One missing record, then a route." },
  ],
  map: [
    { href: "/guides/aniimo-catching-guide", title: "Catching", blurb: "Read the encounter, then pick the pod." },
    { href: "/guides/aniimo-materials-guide", title: "Materials", blurb: "One layer, one shortfall, one loop." },
    { href: "/guides/aniimo-collection-guide", title: "Collection", blurb: "Pair a spawn with a second objective." },
  ],
  team: [
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "Who opens BREAK, who holds EP." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Fix one resisted fight, not all nine types." },
    { href: "/guides/aniimo-traits-guide", title: "Traits", blurb: "Keep a passive only if it fires here." },
  ],
  templates: [
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "Treat a template as a job list, not a ranking." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Swap the slot that fails the route." },
  ],
  collection: [
    { href: "/guides/aniimo-collection-guide", title: "Tracking your collection", blurb: "One missing Aniimo, then a backup objective." },
    { href: "/guides/aniimo-forms-and-evolution", title: "Forms and evolution", blurb: "The checkbox is the base slug, not every form." },
  ],
  compare: [
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "Compare jobs, not portraits." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Check the skill’s element, not only the badge." },
  ],
  tools: [
    { href: "/guides/aniimo-collection-guide", title: "Collection guide", blurb: "How to turn the tracker into a route." },
    { href: "/guides/aniimo-combat-guide", title: "Combat guide", blurb: "What to look for when you compare two records." },
  ],
  database: [
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "Skills and BREAK windows." },
    { href: "/guides/aniimo-forms-and-evolution", title: "Forms", blurb: "Evolution paths and later records." },
    { href: "/guides/aniimo-catching-guide", title: "Catching", blurb: "Items and Aniipods." },
  ],
  tier: [
    { href: "/guides/aniimo-combat-guide", title: "Combat", blurb: "A tier is a starting point, not a team." },
    { href: "/guides/aniimo-elements-guide", title: "Type matchups", blurb: "Keep the Aniimo that covers the fight you run." },
  ],
} satisfies Record<string, GuideCueItem[]>;

export function mergeGuideLinks(id: string, own?: GuideTextLink | GuideTextLink[]): GuideTextLink[] {
  const ownList = Array.isArray(own) ? own : own ? [own] : [];
  const extra = extraSectionLinks[id] || [];
  const seen = new Set(ownList.map((item) => item.href));
  return [...ownList, ...extra.filter((item) => !seen.has(item.href))];
}

export function getGuideConnections(slug: string) {
  return guideConnections[slug];
}
