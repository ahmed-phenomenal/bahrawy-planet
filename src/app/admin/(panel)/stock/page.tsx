import StockView, { type StockData } from "@/components/admin/StockView/StockView";
import { apiFetch } from "@/lib/api";
import { EMPTY_MOVEMENTS, toMovementsPage } from "@/lib/movements";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function load(path: string): Promise<any> {
  try {
    const res = await apiFetch(path);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export default async function Page() {
  // Only the first 15 money movements are loaded, the next pages come when you press Next
  const [stock, movements] = await Promise.all([
    load("/admin/stock"),
    load("/admin/movements?page=1&filter=all"),
  ]);

  const data: StockData | null = stock
    ? {
        books: (stock.books ?? []).map((b: any) => ({
          id: Number(b.id),
          title: String(b.title ?? ""),
          price: Number(b.price ?? 0),
          in_stock: Number(b.in_stock ?? 0),
          sold: Number(b.sold ?? 0),
          revenue: Number(b.revenue ?? 0),
          low_stock: Boolean(b.low_stock),
        })),
        summary: {
          in_storage: Number(stock.summary?.in_storage ?? 0),
          sold: Number(stock.summary?.sold ?? 0),
          books_revenue: Number(stock.summary?.books_revenue ?? 0),
          delivery_fees: Number(stock.summary?.delivery_fees ?? 0),
          discounts: Number(stock.summary?.discounts ?? 0),
          revenue: Number(stock.summary?.revenue ?? 0),
          expenses: Number(stock.summary?.expenses ?? 0),
          profit: Number(stock.summary?.profit ?? 0),
          recovered_percent: Number(stock.summary?.recovered_percent ?? 100),
        },
      }
    : null;

  return (
    <StockView
      data={data}
      initialMovements={movements ? toMovementsPage(movements) : EMPTY_MOVEMENTS}
    />
  );
}