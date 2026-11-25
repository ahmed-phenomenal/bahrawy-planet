import AttendanceView from "@/components/admin/AttendanceView/AttendanceView";
import { listEmployees } from "@/lib/employees";

export const dynamic = "force-dynamic";

export default async function Page() {
  const list = await listEmployees();
  return (
    <AttendanceView
      employees={list.map((e) => ({ id: e.id, name: e.name, role: e.role }))}
    />
  );
}