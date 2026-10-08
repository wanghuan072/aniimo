import type { EventPeriod, ResetScheduleRecord, SeasonBoundaryRecord, ServerRegion, ServerWindow } from "@/lib/update-schedule";

export type { EventPeriod, ServerRegion, ServerWindow } from "@/lib/update-schedule";
export type UpdateKind = "patch" | "event" | "notice";

export interface SourceReference {
  label: string;
  href: string;
  kind: "official" | "community";
}

export interface EventEntry {
  slug: string;
  title: string;
  summary: string;
  category: string;
  priority: "today" | "week" | "season";
  periods: EventPeriod[];
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

export type ResetSchedule = ResetScheduleRecord;
export type SeasonBoundary = SeasonBoundaryRecord & { source: SourceReference };

export const updatesReviewedAt = "2026-10-08";

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

const communityEvent = (label: string, slug: string): SourceReference => ({
  label,
  href: `https://www.aniimoverse.com/events/${slug}`,
  kind: "community",
});

const serverWindows = (startsAt: string, endsAt: string | null): Record<ServerRegion, ServerWindow> => ({
  america: { startsAt: `${startsAt}-04:00`, endsAt: endsAt ? `${endsAt}-04:00` : null },
  europe: { startsAt: `${startsAt}+00:00`, endsAt: endsAt ? `${endsAt}+00:00` : null },
  apac: { startsAt: `${startsAt}+08:00`, endsAt: endsAt ? `${endsAt}+08:00` : null },
});

const period = (slug: string, label: string, startsAt: string, endsAt: string | null): EventPeriod => ({
  slug,
  label,
  windows: serverWindows(startsAt, endsAt),
});

const weeklyPeriods = (prefix: string, dates: Array<[string, string]>, label: string): EventPeriod[] => dates.map(([start, end]) => period(
  `${prefix}-${start.slice(0, 10)}`,
  `${label} · ${start.slice(5, 10).replace("-", "/")}`,
  start,
  end,
));

export const events: EventEntry[] = [
  {
    slug: "aniimo-discovery-irisalis",
    title: "Aniimo Discovery: Irisalis",
    summary: "Use replenishing Search Attempts to find Irisalis, complete research quests and unlock search buffs.",
    category: "Field research",
    priority: "today",
    periods: [period("irisalis-search", "Irisalis research", "2026-09-25T04:00:00", "2026-10-09T03:59:00")],
    source: officialUpdate,
  },
  {
    slug: "whos-that-aniimo",
    title: "Who’s That Aniimo?",
    summary: "Identify the featured Aniimo from its clues and submit the correct answer before the round closes.",
    category: "Activities",
    priority: "today",
    periods: [
      period("round-2", "Round 2", "2026-10-02T04:00:00", "2026-10-09T03:59:00"),
      period("round-3", "Round 3", "2026-10-16T04:00:00", "2026-10-23T03:59:00"),
      period("round-4", "Round 4", "2026-10-30T04:00:00", "2026-11-06T03:59:00"),
    ],
    source: communityEvent("AniimoVerse Who’s That Aniimo schedule", "whos-that-aniimo"),
  },
  {
    slug: "ecological-investigation",
    title: "Ecological Investigation",
    summary: "Complete the current field investigation objectives and collect each round’s research rewards.",
    category: "Field research",
    priority: "today",
    periods: [
      period("round-6", "Round 6", "2026-10-02T04:00:00", "2026-10-09T03:59:00"),
      period("round-7", "Round 7", "2026-10-16T04:00:00", "2026-10-23T03:59:00"),
    ],
    source: communityEvent("AniimoVerse Ecological Investigation schedule", "ecological-investigation"),
  },
  {
    slug: "vein-abundance",
    title: "Vein Abundance",
    summary: "Follow the current regional surge to find the featured Prismana Aniimo during its boosted encounter window.",
    category: "Prismana",
    priority: "today",
    periods: [
      period("rosetower-woods", "Rosetower Woods", "2026-09-28T04:00:00", "2026-10-05T03:59:00"),
      period("berylline-vale", "Berylline Vale", "2026-10-05T04:00:00", "2026-10-12T03:59:00"),
      period("nimbus-fields", "Nimbus Fields", "2026-10-12T04:00:00", "2026-10-19T03:59:00"),
      period("prismana-carnival", "Prismana Carnival", "2026-10-19T04:00:00", "2026-10-26T03:59:00"),
    ],
    source: communityEvent("AniimoVerse Vein Abundance schedule", "vein-abundance"),
  },
  {
    slug: "holo-battle-interlink",
    title: "Holo-Battle Interlink",
    summary: "Improve the best star rank across three combat routes and claim the combined weekly milestones.",
    category: "Combat",
    priority: "week",
    periods: weeklyPeriods("holo", [
      ["2026-10-08T04:00:00", "2026-10-12T03:59:00"], ["2026-10-15T04:00:00", "2026-10-19T03:59:00"],
      ["2026-10-22T04:00:00", "2026-10-26T03:59:00"], ["2026-10-29T04:00:00", "2026-11-02T03:59:00"],
      ["2026-11-05T04:00:00", "2026-11-09T03:59:00"], ["2026-11-12T04:00:00", "2026-11-16T03:59:00"],
      ["2026-11-19T04:00:00", "2026-11-23T03:59:00"], ["2026-11-26T04:00:00", "2026-11-30T03:59:00"],
      ["2026-12-03T04:00:00", "2026-12-07T03:59:00"],
    ], "Thursday–Sunday"),
    source: communityEvent("AniimoVerse Holo-Battle Interlink schedule", "holo-battle-interlink"),
  },
  {
    slug: "glamour-star",
    title: "Glamour Star",
    summary: "Style an Aniimo for the current audition theme and reach score milestones for rewards.",
    category: "Activities",
    priority: "today",
    periods: [
      period("floral-soiree", "Floral Soirée", "2026-09-25T04:00:00", "2026-10-02T03:59:00"),
      period("audition-2", "Audition 2", "2026-10-09T04:00:00", "2026-10-16T03:59:00"),
      period("audition-3", "Audition 3", "2026-10-23T04:00:00", "2026-10-30T03:59:00"),
    ],
    source: communityEvent("AniimoVerse Glamour Star schedule", "glamour-star"),
  },
  {
    slug: "hatch-haste",
    title: "Hatch Haste",
    summary: "Qualifying Hatchinators run at double speed throughout the weekend bonus window.",
    category: "Bonuses",
    priority: "week",
    periods: weeklyPeriods("hatch", [
      ["2026-10-09T04:00:00", "2026-10-12T03:59:00"], ["2026-10-16T04:00:00", "2026-10-19T03:59:00"],
      ["2026-10-23T04:00:00", "2026-10-26T03:59:00"], ["2026-10-30T04:00:00", "2026-11-02T03:59:00"],
      ["2026-11-06T04:00:00", "2026-11-09T03:59:00"], ["2026-11-13T04:00:00", "2026-11-16T03:59:00"],
      ["2026-11-20T04:00:00", "2026-11-23T03:59:00"], ["2026-11-27T04:00:00", "2026-11-30T03:59:00"],
      ["2026-12-04T04:00:00", "2026-12-07T03:59:00"],
    ], "Friday–Sunday"),
    source: communityEvent("AniimoVerse Hatch Haste schedule", "hatch-haste"),
  },
  {
    slug: "forest-of-butterfly-dreams",
    title: "Forest of Butterfly Dreams",
    summary: "Complete the limited draw event before the October reset window closes.",
    category: "Limited event",
    priority: "week",
    periods: [period("launch-run", "Launch run", "2026-09-30T04:00:00", "2026-10-28T03:59:00")],
    source: communityEvent("AniimoVerse Forest of Butterfly Dreams schedule", "forest-of-butterfly-dreams"),
  },
  {
    slug: "journey-chronicles-october",
    title: "Journey Chronicles",
    summary: "Log in across the event window to collect travel gifts and launch-season rewards.",
    category: "Login event",
    priority: "week",
    periods: [period("october", "October check-in", "2026-10-01T04:00:00", "2026-10-29T03:59:00")],
    source: officialUpdate,
  },
  {
    slug: "launch-twitch-drops",
    title: "Launch Twitch Drops",
    summary: "Watch eligible Aniimo streams, claim each unlocked drop and finish before the global UTC deadline.",
    category: "Community",
    priority: "week",
    periods: [{ slug: "launch-campaign", label: "Launch campaign", windows: {
      america: { startsAt: "2026-09-16T00:00:00-04:00", endsAt: "2026-10-13T22:00:00-04:00" },
      europe: { startsAt: "2026-09-16T04:00:00+00:00", endsAt: "2026-10-14T02:00:00+00:00" },
      apac: { startsAt: "2026-09-16T12:00:00+08:00", endsAt: "2026-10-14T10:00:00+08:00" },
    } }],
    source: communityEvent("AniimoVerse Twitch Drops deadline", "twitch-drops"),
  },
  {
    slug: "windchasers-departure-iris-companion",
    title: "Windchaser’s Departure: Iris Companion",
    summary: "The first Legendary Journey season adds Irisalis, seasonal progression and a dedicated capture route.",
    category: "Legendary Journey",
    priority: "season",
    periods: [{ slug: "iris-companion", label: "Iris Companion", windows: {
      america: { startsAt: "2026-09-25T10:00:00-04:00", endsAt: "2026-12-09T19:59:00-04:00" },
      europe: { startsAt: "2026-09-25T10:00:00+00:00", endsAt: "2026-12-09T23:59:00+00:00" },
      apac: { startsAt: "2026-09-25T10:00:00+08:00", endsAt: "2026-12-10T07:59:00+08:00" },
    } }],
    source: officialUpdate,
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

const resetSource: SourceReference = {
  label: "AniimoVerse reset schedule",
  href: "https://www.aniimoverse.com/tools/reset-timers",
  kind: "community",
};

export const seasonBoundaries: SeasonBoundary[] = [
  { slug: "part-one", label: "Part One ends", endsAt: "2026-10-28T23:59:00+00:00", source: resetSource },
  { slug: "part-two", label: "Part Two ends", endsAt: "2026-12-09T23:59:00+00:00", source: resetSource },
];

export const updatesSources = [
  officialUpdate,
  official("Official mobile launch announcement", "https://aniimo.com/newslist/detail/100147"),
  communityEvents,
  codeSource,
  resetSource,
  ...events.map((event) => event.source),
];

const validateUpdateData = () => {
  const errors: string[] = [];
  const eventSlugs = new Set<string>();
  const regions: ServerRegion[] = ["america", "europe", "apac"];
  const validateSource = (source: SourceReference) => {
    if (!source.href.startsWith("https://")) errors.push(`Source must use HTTPS: ${source.href}`);
  };
  for (const event of events) {
    if (eventSlugs.has(event.slug)) errors.push(`Duplicate event slug: ${event.slug}`);
    eventSlugs.add(event.slug);
    validateSource(event.source);
    const periodSlugs = new Set<string>();
    for (const entry of event.periods) {
      if (periodSlugs.has(entry.slug)) errors.push(`Duplicate period ${entry.slug} in ${event.slug}`);
      periodSlugs.add(entry.slug);
      for (const region of regions) {
        const window = entry.windows[region];
        if (!window) {
          errors.push(`Missing ${region} window in ${event.slug}/${entry.slug}`);
          continue;
        }
        const start = Date.parse(window.startsAt);
        const end = window.endsAt ? Date.parse(window.endsAt) : Number.POSITIVE_INFINITY;
        if (!Number.isFinite(start) || Number.isNaN(end) || end <= start) errors.push(`Invalid window in ${event.slug}/${entry.slug}/${region}`);
      }
    }
  }
  const codeSlugs = new Set<string>();
  for (const entry of rewardCodes) {
    if (codeSlugs.has(entry.slug)) errors.push(`Duplicate reward code slug: ${entry.slug}`);
    codeSlugs.add(entry.slug);
    validateSource(entry.source);
  }
  const updateSlugs = new Set<string>();
  for (const entry of updateEntries) {
    if (updateSlugs.has(entry.slug)) errors.push(`Duplicate update slug: ${entry.slug}`);
    updateSlugs.add(entry.slug);
    validateSource(entry.source);
    if (!entry.href.startsWith("https://")) errors.push(`Update link must use HTTPS: ${entry.href}`);
  }
  for (const boundary of seasonBoundaries) {
    validateSource(boundary.source);
    if (!Number.isFinite(Date.parse(boundary.endsAt))) errors.push(`Invalid season boundary: ${boundary.slug}`);
  }
  if (errors.length) throw new Error(`Invalid updates data:\n${errors.join("\n")}`);
  const reviewed = Date.parse(`${updatesReviewedAt}T00:00:00Z`);
  if (Number.isFinite(reviewed) && Date.now() - reviewed > 7 * 86_400_000) console.warn(`[updates] Data was last reviewed on ${updatesReviewedAt}.`);
};

validateUpdateData();
