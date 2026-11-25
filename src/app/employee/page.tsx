import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { loadSales, loadStaffBooks } from "@/lib/salesServer";
import EmployeePanel, {
  type TodayData,
} from "@/components/employee/EmployeePanel/EmployeePanel";

export const dynamic = "force-dynamic";

export default async function EmployeePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  let today: TodayData | null = null;
  let unauthorized = false;
  try {
    const res = await apiFetch("/my/today");
    if (res.status === 401) unauthorized = true;
    else if (res.ok) today = (await res.json()) as TodayData;
  } catch {}

  if (unauthorized) redirect("/login");

  if (!today) {
    return (
      <p style={{ padding: 32 }}>
        Could not load your page. Check that the backend is running, then
        refresh.
      </p>
    );
  }

  // The books with their storage count, and only MY sales of today
  const [books, mine] = await Promise.all([
    loadStaffBooks(),
    loadSales(`?date=${today.date}`),
  ]);

  return (
    <EmployeePanel
      employee={{
        id: Number(session.id),
        loginId: session.loginId ?? "",
        name: session.name,
        role: session.jobTitle ?? "Employee",
      }}
      today={today}
      books={books}
      sales={mine.sales}
      salesTotal={mine.summary.revenue}
    />
  );
}