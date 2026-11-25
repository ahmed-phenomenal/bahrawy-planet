import { redirect } from "next/navigation";
import EmployeesView, {
  type EmployeeItem,
} from "@/components/admin/EmployeesView/EmployeesView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

// The admin layout already makes sure only the admin can open this page,
// so there is no role check here.
export default async function Page() {
  let employees: EmployeeItem[] = [];
  let status = 0;

  try {
    const res = await apiFetch("/admin/employees");
    status = res.status;

    if (res.ok) {
      const data = await res.json();
      employees = data.employees ?? [];
    }
  } catch {
    // The page shows a message when the backend is not running
  }

  // The login expired
  if (status === 401) redirect("/login");

  return <EmployeesView initial={employees} failed={status !== 200} />;
}