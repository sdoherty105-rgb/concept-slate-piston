/** Perth has no daylight saving. All workshop status is computed from this zone. */

const TZ = "Australia/Perth";
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export type PerthNow = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  iso: string;
};

export const bays = [
  { id: "a", name: "Bay A", role: "Hoist" },
  { id: "b", name: "Bay B", role: "Hoist" },
  { id: "c", name: "Bay C", role: "Alignment" },
  { id: "d", name: "Bay D", role: "Scan" },
] as const;

export type BayId = (typeof bays)[number]["id"];

export type BayState = {
  id: BayId;
  name: string;
  role: string;
  state: "Free" | "Occupied" | "Closed";
  detail: string;
};

export type BookDay = { iso: string; weekday: string; label: string };

export type WorkshopStatus = {
  bays: BayState[];
  freeCount: number;
  nextSlot: string;
  openUntil: string;
  open: boolean;
};

export function perthNow(date: Date): PerthNow {
  const bag: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(date)) {
    bag[part.type] = part.value;
  }
  const year = Number(bag.year);
  const month = Number(bag.month);
  const day = Number(bag.day);
  const weekday = WEEK.indexOf(bag.weekday as (typeof WEEK)[number]);
  return {
    year,
    month,
    day,
    hour: Number(bag.hour),
    minute: Number(bag.minute),
    weekday: weekday < 0 ? 0 : weekday,
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

function formatClock(hour: number, minute: number) {
  const suffix = hour >= 12 ? "pm" : "am";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function nextOpening(p: PerthNow): string {
  const mins = p.hour * 60 + p.minute;
  if (p.weekday >= 1 && p.weekday <= 5 && mins < 7 * 60 + 30) return "Today 7:30 am";
  if (p.weekday === 6 && mins < 8 * 60) return "Today 8:00 am";
  if (p.weekday === 5 && mins >= 17 * 60) return "Sat 8:00 am";
  if (p.weekday === 6 || p.weekday === 0) return "Mon 7:30 am";
  if (mins >= 17 * 60) return "Tomorrow 7:30 am";
  return "Mon 7:30 am";
}

export function workshopStatus(date: Date): WorkshopStatus {
  const p = perthNow(date);
  const mins = p.hour * 60 + p.minute;
  const weekdayOpen = p.weekday >= 1 && p.weekday <= 5 && mins >= 7 * 60 + 30 && mins < 17 * 60;
  const saturdayOpen = p.weekday === 6 && mins >= 8 * 60 && mins < 12 * 60;
  const open = weekdayOpen || saturdayOpen;
  const openUntil = !open ? "Closed" : p.weekday === 6 ? "12:00 pm" : "5:00 pm";

  if (!open) {
    return {
      bays: bays.map((b) => ({ ...b, state: "Closed", detail: "Workshop closed" })),
      freeCount: 0,
      nextSlot: nextOpening(p),
      openUntil,
      open: false,
    };
  }

  const phase = p.hour % 4;
  const half = p.minute < 30 ? formatClock(p.hour, 30) : formatClock((p.hour + 1) % 24, 0);
  const board: BayState[] = bays.map((b, i) => {
    const free = (i + phase) % 2 === 0;
    return { ...b, state: free ? "Free" : "Occupied", detail: free ? "Free now" : `Until ${half}` };
  });
  const firstFree = board.find((b) => b.state === "Free");
  return {
    bays: board,
    freeCount: board.filter((b) => b.state === "Free").length,
    nextSlot: firstFree ? firstFree.name : half,
    openUntil,
    open: true,
  };
}

export function bookDays(date: Date, count = 7): BookDay[] {
  const p = perthNow(date);
  const start = Date.UTC(p.year, p.month - 1, p.day);
  const mins = p.hour * 60 + p.minute;
  const closedForToday = (p.weekday === 6 && mins >= 12 * 60) || (p.weekday >= 1 && p.weekday <= 5 && mins >= 17 * 60);
  const out: BookDay[] = [];
  for (let i = closedForToday ? 1 : 0; out.length < count && i < 21; i++) {
    const d = new Date(start + i * 86_400_000);
    const wd = d.getUTCDay();
    if (wd === 0) continue;
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: WEEK[wd],
      label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
    });
  }
  return out;
}

/** Deterministic demonstration occupancy. Bay B stays open so a choice always exists. */
export function slotTaken(dayIndex: number, bayIndex: number) {
  if (bayIndex === 1) return false;
  return (dayIndex * 2 + bayIndex) % 5 === 0;
}

export function slotValue(iso: string, bayId: string) {
  return `${iso}|${bayId}`;
}

export function parseSlot(value: string) {
  const [iso, bayId] = value.split("|");
  const bay = bays.find((b) => b.id === bayId);
  if (!iso || !bay) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  const weekday = WEEK[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return { iso, bay, weekday, label: `${weekday} ${day} ${MONTHS[month - 1]}` };
}
