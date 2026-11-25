import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/employee");
  return <AdminShell>{children}</AdminShell>;
}