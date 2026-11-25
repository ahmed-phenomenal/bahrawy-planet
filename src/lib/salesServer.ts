import { apiFetch } from "@/lib/api";
import {
  EMPTY_SUMMARY,
  toStaffBook,
  type SaleRow,
  type SalesSummary,
  type StaffBook,
} from "@/lib/saleTypes";

// Every book with its storage count, straight from the database
export async function loadStaffBooks(): Promise<StaffBook[]> {
  try {
    const res = await apiFetch("/staff/books");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(toStaffBook) : [];
  } catch {
    return [];
  }
}

// query example: "" or "?date=2026-11-22"
export async function loadSales(
  query = ""
): Promise<{ sales: SaleRow[]; summary: SalesSummary }> {
  try {
    const res = await apiFetch(`/sales${query}`);
    if (!res.ok) return { sales: [], summary: EMPTY_SUMMARY };
    const data = await res.json();
    return {
      sales: (data.sales ?? []) as SaleRow[],
      summary: { ...EMPTY_SUMMARY, ...(data.summary ?? {}) },
    };
  } catch {
    return { sales: [], summary: EMPTY_SUMMARY };
  }
}