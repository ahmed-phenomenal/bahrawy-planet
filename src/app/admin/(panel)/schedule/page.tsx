import ScheduleView, {
  type HourRow,
  type PersonRow,
} from "@/components/admin/ScheduleView/ScheduleView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function Page() {
  let data: any = null;
  try {
    const res = await apiFetch("/admin/schedule");
    if (res.ok) data = await res.json();
  } catch {}

  const employees: PersonRow[] = (data?.employees ?? []).map((e: any) => ({
    id: e.id,
    name: e.name,
    shifts: e.shifts ?? [],
  }));

  const hours: HourRow[] = (data?.store_hours ?? []).map((h: any) => ({
    weekday: h.weekday,
    opens_at: h.opens_at,
    closes_at: h.closes_at,
    is_closed: Boolean(h.is_closed),
  }));

  return <ScheduleView employees={employees} hours={hours} />;
}