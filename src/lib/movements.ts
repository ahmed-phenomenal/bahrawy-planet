export type MovementKind = "sale" | "expense";
export type MovementFilter = "all" | MovementKind;

export type Movement = {
  key: string;
  kind: MovementKind;
  id: number;
  title: string;
  quantity: number;
  amount: number;
  date: string;
  time: string;
  sold_by: string | null;
  login_id: string | null;
  channel: "spot" | "delivery" | null;
};

export type MovementsPage = {
  data: Movement[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export const EMPTY_MOVEMENTS: MovementsPage = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// Laravel decimals can arrive as strings, so every number goes through Number()
export function toMovementsPage(raw: any): MovementsPage {
  return {
    data: (raw?.data ?? []).map(
      (m: any): Movement => ({
        key: `${m.kind}-${m.id}`,
        kind: m.kind === "expense" ? "expense" : "sale",
        id: Number(m.id),
        title: String(m.title ?? ""),
        quantity: Number(m.quantity ?? 1),
        amount: Number(m.amount ?? 0),
        date: String(m.date ?? "").slice(0, 10),
        time: String(m.time ?? ""),
        sold_by: m.sold_by ?? null,
        login_id: m.login_id != null ? String(m.login_id) : null,
        channel:
          m.channel === "delivery" || m.channel === "spot" ? m.channel : null,
      })
    ),
    current_page: Number(raw?.current_page ?? 1),
    last_page: Number(raw?.last_page ?? 1),
    per_page: Number(raw?.per_page ?? 15),
    total: Number(raw?.total ?? 0),
  };
}