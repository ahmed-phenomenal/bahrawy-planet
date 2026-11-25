import SalesView from "@/components/admin/SalesView/SalesView";
import { loadSales, loadStaffBooks } from "@/lib/salesServer";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [books, data] = await Promise.all([loadStaffBooks(), loadSales()]);

  return (
    <SalesView
      initialBooks={books}
      initialSales={data.sales}
      initialSummary={data.summary}
    />
  );
}