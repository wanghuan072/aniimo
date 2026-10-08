export type ServerRegion = "america" | "europe" | "apac";
export type UpdateKind = "patch" | "event" | "notice";

export interface SourceReference {
  label: string;
  href: string;
  kind: "official" | "community";
}

export interface ServerWindow {
  startsAt: string;
  endsAt: string | null;
}

export interface EventEntry {
  slug: string;
  title: string;
  summary: string;
  category: string;
  priority: "today" | "week" | "season";
  windows: Record<ServerRegion, ServerWindow>;
  source: SourceReference;
}

export interface RewardCode {
  slug: string;
  code: string;
  rewards: string[];
  addedAt: string;
  expiresAt: string | null;
  status: "listed" | "expired";
  source: SourceReference;
}

export interface UpdateEntry {
  slug: string;
  publishedAt: string;
  kind: UpdateKind;
  label: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  source: SourceReference;
}

export interface ResetSchedule {
  region: ServerRegion;
  label: string;
  utcOffsetMinutes: number;
  dailyHour: number;
  weeklyDay: number;
  weeklyHour: number;
}

export const updatesReviewedAt = "2026-09-30";

const officialUpdate: SourceReference = {
  label: "Official September 23 update notice",
  href: "https://aniimo.com/newslist/detail/100145",
  kind: "official",
};

const communityEvents: SourceReference = {
  label: "AniimoVerse event calendar",
  href: "https://www.aniimoverse.com/events",
  kind: "community",
};

export const events: EventEntry[] = [
  {
    slug: "glamour-star-floral-soiree",
    title: "Glamour Star: Floral Soirée",
    summary: "Style an Aniimo for the Floral Soirée theme and reach score milestones for rewards.",
    category: "Activities",
    priority: "today",
    windows: {
      america: { startsAt: "2026-09-25T04:00:00-04:00", endsAt: "2026-10-02T03:59:00-04:00" },
      europe: { startsAt: "2026-09-25T04:00:00+00:00", endsAt: "2026-10-02T03:59:00+00:00" },
      apac: { startsAt: "2026-09-25T04:00:00+08:00", endsAt: "2026-10-02T03:59:00+08:00" },
    },
    source: officialUpdate,
  },
  {
    slug: "aniimo-discovery-irisalis",
    title: "Aniimo Discovery: Irisalis",
    summary: "Use replenishing Search Attempts to find Irisalis, complete research quests and unlock search buffs.",
    category: "Field research",
    priority: "today",
    windows: {
      america: { startsAt: "2026-09-25T04:00:00-04:00", endsAt: "2026-10-09T03:59:00-04:00" },
      europe: { startsAt: "2026-09-25T04:00:00+00:00", endsAt: "2026-10-09T03:59:00+00:00" },
      apac: { startsAt: "2026-09-25T04:00:00+08:00", endsAt: "2026-10-09T03:59:00+08:00" },
    },
    source: officialUpdate,
  },
  {
    slug: "vein-abundance-rosetower-woods",
    title: "Vein Abundance: Rosetower Woods",
    summary: "Prismana Melloblum appears in Rosetower Woods during the current boosted encounter window.",
    category: "Prismana",
    priority: "today",
    windows: {
      america: { startsAt: "2026-09-28T04:00:00-04:00", endsAt: "2026-10-05T03:59:00-04:00" },
      europe: { startsAt: "2026-09-28T04:00:00+00:00", endsAt: "2026-10-05T03:59:00+00:00" },
      apac: { startsAt: "2026-09-28T04:00:00+08:00", endsAt: "2026-10-05T03:59:00+08:00" },
    },
    source: officialUpdate,
  },
  {
    slug: "windchasers-departure-iris-companion",
    title: "Windchaser’s Departure: Iris Companion",
    summary: "The first Legendary Journey season adds Irisalis, seasonal progression and a dedicated capture route.",
    category: "Legendary Journey",
    priority: "season",
    windows: {
      america: { startsAt: "2026-09-25T10:00:00-04:00", endsAt: "2026-12-09T19:59:00-04:00" },
      europe: { startsAt: "2026-09-25T10:00:00+00:00", endsAt: "2026-12-09T23:59:00+00:00" },
      apac: { startsAt: "2026-09-25T10:00:00+08:00", endsAt: "2026-12-10T07:59:00+08:00" },
    },
    source: officialUpdate,
  },
  {
    slug: "journey-chronicles-october",
    title: "Journey Chronicles",
    summary: "Log in across the event window to collect travel gifts and launch-season rewards.",
    category: "Login event",
    priority: "week",
    windows: {
      america: { startsAt: "2026-10-01T04:00:00-04:00", endsAt: "2026-10-29T03:59:00-04:00" },
      europe: { startsAt: "2026-10-01T04:00:00+00:00", endsAt: "2026-10-29T03:59:00+00:00" },
      apac: { startsAt: "2026-10-01T04:00:00+08:00", endsAt: "2026-10-29T03:59:00+08:00" },
    },
    source: officialUpdate,
  },
  {
    slug: "launch-twitch-drops",
    title: "Launch Twitch Drops",
    summary: "Watch participating Aniimo streams while the launch campaign is live, then claim rewards through the linked account.",
    category: "Community",
    priority: "week",
    windows: {
      america: { startsAt: "2026-09-16T00:00:00-04:00", endsAt: "2026-10-13T23:59:00-04:00" },
      europe: { startsAt: "2026-09-16T04:00:00+00:00", endsAt: "2026-10-14T03:59:00+00:00" },
      apac: { startsAt: "2026-09-16T12:00:00+08:00", endsAt: "2026-10-14T11:59:00+08:00" },
    },
    source: communityEvents,
  },
];

const codeSource: SourceReference = {
  label: "AniimoVerse codes directory",
  href: "https://www.aniimoverse.com/codes",
  kind: "community",
};

export const rewardCodes: RewardCode[] = [
  { slug: "aniimofreetoplay", code: "aniimofreetoplay", rewards: ["Glimmer ×50", "Aniipod Pro ×5", "Growth Flower ×5"], addedAt: "2026-09-21", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimoopenworld", code: "aniimoopenworld", rewards: ["Aniipod ×5", "Credits ×10,000"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimolaunch2026", code: "aniimolaunch2026", rewards: ["Aniipod ×5", "Credits ×10,000"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimobonus", code: "aniimobonus", rewards: ["Glimmer ×50"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "twinewithaniimo", code: "twinewithaniimo", rewards: ["Glimmer ×50", "Aniipod Pro ×5", "Growth Flower ×5"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimowelcome", code: "aniimowelcome", rewards: ["Glimmer ×50", "Aniipod Pro ×5", "Growth Flower ×5"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "anyoneaniimo", code: "anyoneaniimo", rewards: ["Aniipod ×5", "Credits ×10,000"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimotogether", code: "aniimotogether", rewards: ["Growth Flower ×3", "Credits ×10,000"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimoidyll", code: "aniimoidyll", rewards: ["Aniipod ×5", "Credits ×10,000"], addedAt: "2026-09-18", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimogift", code: "ANIIMOGIFT", rewards: ["Glimmer ×10", "Credits ×20,000", "Growth Flower ×10", "Aniipod Pro ×5"], addedAt: "2026-09-17", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimo2026", code: "Aniimo2026", rewards: ["Glimmer ×20"], addedAt: "2026-09-02", expiresAt: null, status: "listed", source: codeSource },
  { slug: "aniimoparty", code: "aniimoparty", rewards: ["Glimmer ×50", "Aniipod Pro ×5", "Growth Flower ×5"], addedAt: "2026-09-18", expiresAt: "2026-09-29T23:59:00+08:00", status: "expired", source: codeSource },
];

const official = (label: string, href: string): SourceReference => ({ label, href, kind: "official" });

export const updateEntries: UpdateEntry[] = [
  {
    slug: "mobile-global-launch",
    publishedAt: "2026-09-23",
    kind: "notice",
    label: "Platform launch",
    title: "Aniimo is live on mobile with cross-platform progression",
    summary: "The iOS and Android release completed the global platform rollout, with progress shared across platforms when players use the same account and server.",
    href: "https://aniimo.com/newslist/detail/100147",
    image: "/images/home/aniimo-world-hero.png",
    source: official("Official mobile launch announcement", "https://aniimo.com/newslist/detail/100147"),
  },
  {
    slug: "setting-out-in-pursuit-of-the-wind-part-one",
    publishedAt: "2026-09-21",
    kind: "patch",
    label: "Version 1.1",
    title: "Setting Out in Pursuit of the Wind: Part I",
    summary: "The September 23 update introduced Irisalis, new launch events, Chaos Egg Heist, quality-of-life work and a broad set of fixes.",
    href: "https://aniimo.com/newslist/detail/100145",
    image: "/images/guides/official/egg-heist.avif",
    source: officialUpdate,
  },
  {
    slug: "mobile-pre-download",
    publishedAt: "2026-09-22",
    kind: "notice",
    label: "Mobile",
    title: "Mobile pre-download and launch schedule",
    summary: "The official notice confirmed storage guidance, regional server launch times and cross-platform account behavior for iOS and Android.",
    href: "https://www.aniimo.com/en/newslist/detail/100137",
    image: "/images/aniimo/fenrier.png",
    source: official("Official mobile pre-download notice", "https://www.aniimo.com/en/newslist/detail/100137"),
  },
  {
    slug: "pc-console-launch",
    publishedAt: "2026-09-14",
    kind: "notice",
    label: "PC & console",
    title: "PC and console launch schedule confirmed",
    summary: "Pre-download opened ahead of the September 16 release, with separate America, Europe and APAC server opening times.",
    href: "https://aniimo.com/newslist/detail/100089",
    image: "/images/aniimo/helion.png",
    source: official("Official PC and console launch notice", "https://aniimo.com/newslist/detail/100089"),
  },
  {
    slug: "letter-from-the-dev-team",
    publishedAt: "2026-09-03",
    kind: "notice",
    label: "Developer letter",
    title: "The development team outlines launch improvements",
    summary: "The team covered controls, story voiceovers, catching changes, Egg Heist, quest guidance and other launch-version improvements.",
    href: "https://aniimo.com/newslist/detail/100064",
    image: "/images/aniimo/leafy.png",
    source: official("Official developer letter", "https://aniimo.com/newslist/detail/100064"),
  },
  {
    slug: "global-launch-dates",
    publishedAt: "2026-08-26",
    kind: "event",
    label: "Launch milestone",
    title: "Global launch dates announced",
    summary: "The Gamescom announcement set the September release schedule and introduced the pre-launch Time to Aniimo web event.",
    href: "https://www.aniimo.com/newslist/detail/100051",
    image: "/images/aniimo/emberpup.png",
    source: official("Official global launch announcement", "https://www.aniimo.com/newslist/detail/100051"),
  },
];

export const resetSchedules: ResetSchedule[] = [
  { region: "america", label: "America", utcOffsetMinutes: -240, dailyHour: 4, weeklyDay: 1, weeklyHour: 4 },
  { region: "europe", label: "Europe", utcOffsetMinutes: 0, dailyHour: 4, weeklyDay: 1, weeklyHour: 4 },
  { region: "apac", label: "APAC", utcOffsetMinutes: 480, dailyHour: 4, weeklyDay: 1, weeklyHour: 4 },
];

export const seasonBoundary = {
  label: "Season 1 · Part One ends",
  endsAt: "2026-10-28T23:59:00+00:00",
  source: {
    label: "AniimoVerse reset schedule",
    href: "https://www.aniimoverse.com/tools/reset-timers",
    kind: "community" as const,
  },
};

export const updatesSources = [
  officialUpdate,
  official("Official mobile launch announcement", "https://aniimo.com/newslist/detail/100147"),
  communityEvents,
  codeSource,
  seasonBoundary.source,
];
