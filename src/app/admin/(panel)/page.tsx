import DashboardView, {
  type DashboardData,
} from "@/components/admin/DashboardView/DashboardView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  let data: DashboardData | null = null;

  try {
    const res = await apiFetch("/admin/dashboard");
    if (res.ok) data = await res.json();
  } catch {
    // The page shows a message when the backend is not running
  }

  return <DashboardView data={data} />;
}