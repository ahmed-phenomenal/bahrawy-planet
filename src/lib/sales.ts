import { stockData } from "@/data/adminData";

export const DELIVERY_FEE = 50;

export type Sale = {
  id: number;
  bookId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  channel: "spot" | "delivery";
  address: string;
  deliveryFee: number;
  total: number;
  date: string;
  time: string;
  soldBy: string;
};

export type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
};

export const seedSales: Sale[] = [
  {
    id: 1,
    bookId: "6",
    title: "Mindful Mornings",
    unitPrice: 280,
    quantity: 2,
    channel: "spot",
    address: "",
    deliveryFee: 0,
    total: 560,
    date: "2026-11-07",
    time: "11:20",
    soldBy: "Omar Hassan",
  },
  {
    id: 2,
    bookId: "1",
    title: "The Silent Library",
    unitPrice: 350,
    quantity: 1,
    channel: "delivery",
    address: "12 Tahrir St, Cairo",
    deliveryFee: DELIVERY_FEE,
    total: 400,
    date: "2026-11-07",
    time: "15:45",
    soldBy: "Sara Ali",
  },
  {
    id: 3,
    bookId: "3",
    title: "Letters from the Valley",
    unitPrice: 300,
    quantity: 1,
    channel: "spot",
    address: "",
    deliveryFee: 0,
    total: 300,
    date: "2026-11-08",
    time: "10:05",
    soldBy: "Omar Hassan",
  },
];

export const seedExpenses: Expense[] = [
  { id: 1, title: "Printing - first batch", amount: 120000, date: "2026-10-05" },
  { id: 2, title: "Shipping and delivery", amount: 9500, date: "2026-10-12" },
  { id: 3, title: "Packaging materials", amount: 6000, date: "2026-10-20" },
];

// Stock after subtracting the books sold through the Sales form
export function stockFor(bookId: string, sales: Sale[]) {
  const base = stockData.find((s) => s.bookId === bookId);
  const soldNow = sales
    .filter((s) => s.bookId === bookId)
    .reduce((n, s) => n + s.quantity, 0);

  return {
    inStock: Math.max(0, (base?.inStock ?? 0) - soldNow),
    sold: (base?.sold ?? 0) + soldNow,
  };
}