export const DELIVERY_FEE = 50;

export type StaffBook = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
};

export type SaleRow = {
  id: number;
  book_id: number;
  title: string | null;
  quantity: number;
  unit_price: number;
  channel: "spot" | "delivery";
  address: string | null;
  delivery_fee: number;
  voucher_code: string | null;
  discount_amount: number;
  total: number;
  sold_by: string;
  login_id: string | null;
  date: string;
  time: string;
};

export type SalesSummary = {
  orders: number;
  revenue: number;
  delivery_fees: number;
  discounts: number;
  delivery_orders: number;
  spot_orders: number;
};

export const EMPTY_SUMMARY: SalesSummary = {
  orders: 0,
  revenue: 0,
  delivery_fees: 0,
  discounts: 0,
  delivery_orders: 0,
  spot_orders: 0,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// Laravel decimals can arrive as strings, so every number goes through Number()
export function toStaffBook(b: any): StaffBook {
  return {
    id: Number(b.id),
    title: String(b.title ?? ""),
    author: String(b.author ?? ""),
    category: b.category?.name ?? "",
    price: Number(b.price ?? 0),
    stock: Number(b.stock_quantity ?? 0),
  };
}

export function errorMessage(data: any) {
  const first = data?.errors
    ? (Object.values(data.errors) as string[][])[0]?.[0]
    : null;
  return first ?? data?.message ?? data?.error ?? "Something went wrong.";
}