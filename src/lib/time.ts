import { SHIFT_START, normalizeShift } from "@/lib/shifts";

const pad = (n: number) => String(n).padStart(2, "0");

function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Week starts on Saturday: Sat = 0 ... Fri = 6
export function todayIndex() {
  return (new Date().getDay() + 1) % 7;
}

export function weekIndexOf(dateStr: string) {
  return (parseDate(dateStr).getDay() + 1) % 7;
}

// Is this date inside the current week (Saturday to Friday)?
export function inCurrentWeek(dateStr: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - todayIndex());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const d = parseDate(dateStr);
  return d >= start && d <= end;
}

// Late = more than 15 minutes after the shift start
export function isLate(time: string, shift: string) {
  const start = SHIFT_START[normalizeShift(shift)];
  if (start === undefined) return false;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m > start + 15;
}

export function workedHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return "-";
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const diff = toMin(checkOut) - toMin(checkIn);
  if (diff < 0) return "-";
  return `${Math.floor(diff / 60)}h ${pad(diff % 60)}m`;
}