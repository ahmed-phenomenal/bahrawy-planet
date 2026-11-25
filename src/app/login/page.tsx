import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin/AdminLogin";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/employee");
  return <AdminLogin />;
}