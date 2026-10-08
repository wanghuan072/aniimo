export type ServerRegion = "america" | "europe" | "apac";
export type EventState = "upcoming" | "live" | "ending" | "expired" | "invalid";

export interface ServerWindow {
  startsAt: string;
  endsAt: string | null;
}

export interface EventPeriod {
  slug: string;
  label: string;
  windows: Record<ServerRegion, ServerWindow>;
}

export interface ScheduledEvent {
  priority: "today" | "week" | "season";
  periods: EventPeriod[];
}

export interface ResetScheduleRecord {
  region: ServerRegion;
  label: string;
  utcOffsetMinutes: number;
  dailyHour: number;
  weeklyDay: number;
  weeklyHour: number;
}

export interface SeasonBoundaryRecord {
  slug: string;
  label: string;
  endsAt: string;
}

export interface RelevantEventPeriod {
  period: EventPeriod;
  window: ServerWindow;
  state: EventState;
  target: number;
}

const ENDING_SOON_MS = 72 * 60 * 60 * 1000;

export const parseTimestamp = (value: string | null | undefined) => {
  if (!value) return Number.NaN;
  return Date.parse(value);
};

export const getEventState = (window: ServerWindow | undefined, now: number): EventState => {
  if (!window) return "invalid";
  const start = parseTimestamp(window.startsAt);
  const end = window.endsAt ? parseTimestamp(window.endsAt) : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(start) || Number.isNaN(end) || end <= start) return "invalid";
  if (now < start) return "upcoming";
  if (now >= end) return "expired";
  return end - now <= ENDING_SOON_MS ? "ending" : "live";
};

export const getRelevantEventPeriod = (event: ScheduledEvent, region: ServerRegion, now: number): RelevantEventPeriod | null => {
  const candidates = event.periods
    .map((period) => {
      const window = period.windows[region];
      const state = getEventState(window, now);
      const target = state === "upcoming" ? parseTimestamp(window?.startsAt) : parseTimestamp(window?.endsAt);
      return { period, window, state, target };
    })
    .filter((entry): entry is RelevantEventPeriod => Boolean(entry.window) && entry.state !== "invalid" && entry.state !== "expired")
    .sort((a, b) => {
      const stateRank = (state: EventState) => state === "ending" ? 0 : state === "live" ? 1 : 2;
      return stateRank(a.state) - stateRank(b.state) || a.target - b.target;
    });
  return candidates[0] || null;
};

export const eventSortValue = (event: ScheduledEvent, relevant: RelevantEventPeriod) => {
  const stateRank = event.priority === "season" ? 3 : relevant.state === "ending" ? 0 : relevant.state === "live" ? 1 : relevant.state === "upcoming" ? 2 : 4;
  return [stateRank, relevant.target] as const;
};

export const compareRelevantEvents = (
  a: { event: ScheduledEvent; relevant: RelevantEventPeriod },
  b: { event: ScheduledEvent; relevant: RelevantEventPeriod },
) => {
  const [aRank, aTarget] = eventSortValue(a.event, a.relevant);
  const [bRank, bTarget] = eventSortValue(b.event, b.relevant);
  return aRank - bRank || aTarget - bTarget;
};

export const getNextReset = (schedule: ResetScheduleRecord, weekly: boolean, now: number) => {
  const shiftedNow = new Date(now + schedule.utcOffsetMinutes * 60_000);
  if (!Number.isFinite(shiftedNow.getTime())) return Number.NaN;
  const target = new Date(shiftedNow.getTime());
  target.setUTCHours(weekly ? schedule.weeklyHour : schedule.dailyHour, 0, 0, 0);
  if (weekly) {
    let days = (schedule.weeklyDay - shiftedNow.getUTCDay() + 7) % 7;
    if (days === 0 && target.getTime() <= shiftedNow.getTime()) days = 7;
    target.setUTCDate(target.getUTCDate() + days);
  } else if (target.getTime() <= shiftedNow.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  return target.getTime() - schedule.utcOffsetMinutes * 60_000;
};

export const getCurrentSeasonBoundary = (boundaries: SeasonBoundaryRecord[], now: number) => boundaries
  .map((boundary) => ({ boundary, target: parseTimestamp(boundary.endsAt) }))
  .filter((entry) => Number.isFinite(entry.target) && entry.target > now)
  .sort((a, b) => a.target - b.target)[0] || null;
