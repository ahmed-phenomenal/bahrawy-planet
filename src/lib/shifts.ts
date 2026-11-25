export const SHIFTS = ["Morning", "Night", "Off Day", "No Show"] as const;
export type Shift = (typeof SHIFTS)[number];

// Change the shift times here if you want different hours
export const SHIFT_INFO: Record<Shift, string> = {
  Morning: "9 AM - 5 PM",
  Night: "2 PM - 10 PM",
  "Off Day": "Day off given by the admin",
  "No Show": "Employee did not come",
};

// Shift start time in minutes after midnight (used to detect lateness)
export const SHIFT_START: Partial<Record<Shift, number>> = {
  Morning: 9 * 60,
  Night: 14 * 60,
};

export const SHIFT_BADGE: Record<Shift, string> = {
  Morning: "adm-badge-green",
  Night: "adm-badge-blue",
  "Off Day": "adm-badge-gray",
  "No Show": "adm-badge-red",
};

// Converts older saved values ("Morning (9-5)", "Evening (1-9)", "Off") to the new names
export function normalizeShift(value: string | undefined | null): Shift {
  const v = (value ?? "").toLowerCase();
  if (v.startsWith("morning")) return "Morning";
  if (v.startsWith("night") || v.startsWith("evening")) return "Night";
  if (v.startsWith("no show")) return "No Show";
  return "Off Day";
}