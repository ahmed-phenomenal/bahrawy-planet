import { redirect } from "next/navigation";
import AttendanceView, {
  type AttendanceData,
} from "@/components/admin/AttendanceView/AttendanceView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

// Today's attendance, loaded on the server. The admin layout already protects this page.
export default async function Page() {
  let data: AttendanceData | null = null;
  let status = 0;

  try {
    const res = await apiFetch("/admin/attendance");
    status = res.status;

    if (res.ok) data = await res.json();
  } catch {
    // The page shows a message when the backend does not answer
  }

  // The login expired
  if (status === 401) redirect("/login");

  return <AttendanceView initial={data} />;
}