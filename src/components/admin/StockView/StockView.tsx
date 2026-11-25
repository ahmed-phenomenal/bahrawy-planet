"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Package,
  Plus,
  Receipt,
  RefreshCw,
  ShoppingBag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatMoney } from "@/lib/money";
import {
  toMovementsPage,
  type Movement,
  type MovementFilter,
  type MovementsPage,
} from "@/lib/movements";
import { errorMessage } from "@/lib/saleTypes";
import { todayStr } from "@/lib/time";
import "./StockView.css";

export type StockBook = {
  id: number;
  title: string;
  price: number;
  in_stock: number;
  sold: number;
  revenue: number;
  low_stock: boolean;
};

export type StockSummary = {
  in_storage: number;
  sold: number;
  books_revenue: number;
  delivery_fees: number;
  discounts: number;
  revenue: number;
  expenses: number;
  profit: number;
  recovered_percent: number;
};

export type StockData = { books: StockBook[]; summary: StockSummary };

const filters: { key: MovementFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sales (+)" },
  { key: "expense", label: "Expenses (-)" },
];

function movementTitle(m: Movement) {
  return m.kind === "sale" && m.quantity > 1
    ? `${m.title} x${m.quantity}`
    : m.title;
}

function movementMeta(m: Movement) {
  if (m.kind === "expense") return `${m.date} ${m.time} · Expense`;
  const by = `Sold by ${m.sold_by ?? "Admin"}${
    m.login_id ? ` (ID ${m.login_id})` : ""
  }`;
  const channel = m.channel === "delivery" ? "Delivery" : "On the spot";
  return `${m.date} ${m.time} · ${by} · ${channel}`;
}

export default function StockView({
  data,
  initialMovements,
}: {
  data: StockData | null;
  initialMovements: MovementsPage;
}) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  // Money movements: the server sends one page (15 rows) at a time
  const [movements, setMovements] = useState<MovementsPage>(initialMovements);
  const [filter, setFilter] = useState<MovementFilter>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const requestId = useRef(0);
  const lastKey = useRef("1:all");
  const view = useRef({ page: 1, filter: "all" as MovementFilter });
  view.current = { page, filter };

  // The date input starts on today (read on the browser, so it uses your clock)
  useEffect(() => {
    setDate((d) => d || todayStr());
  }, []);

  const loadMovements = useCallback(async (p: number, f: MovementFilter) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/backend/admin/movements?page=${p}&filter=${f}`,
        { cache: "no-store" }
      );
      const body = await res.json().catch(() => null);
      if (id !== requestId.current) return; // a newer request already started
      if (!res.ok || !body) {
        setNotice({ ok: false, text: errorMessage(body) });
        return;
      }
      const next = toMovementsPage(body);
      // The page does not exist anymore (the last row of it was deleted): go back one page
      if (next.data.length === 0 && p > next.last_page) {
        setPage(next.last_page);
        return;
      }
      setMovements(next);
    } catch {
      if (id === requestId.current) {
        setNotice({ ok: false, text: "Could not reach the server." });
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Load the page whenever the page number or the filter changes
  useEffect(() => {
    const key = `${page}:${filter}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    loadMovements(page, filter);
  }, [page, filter, loadMovements]);

  // Reload the numbers and the page you are looking at
  const refresh = useCallback(() => {
    startTransition(() => router.refresh());
    loadMovements(view.current.page, view.current.filter);
  }, [router, loadMovements]);

  // New sales from the employees show up here without pressing anything
  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
      loadMovements(view.current.page, view.current.filter);
    }, 30000);
    return () => clearInterval(timer);
  }, [router, loadMovements]);

  const changeFilter = (next: MovementFilter) => {
    setFilter(next);
    setPage(1);
  };

  const addExpense = async (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!title.trim() || !(value > 0) || !date) return;

    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/backend/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: value,
          spent_on: date,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice({ ok: false, text: errorMessage(body) });
        return;
      }
      setTitle("");
      setAmount("");
      setNotice({
        ok: true,
        text: "Expense added and deducted from your profit.",
      });
      router.refresh();
      // The newest movement is on the first page
      if (page === 1) loadMovements(1, filter);
      else setPage(1);
    } catch {
      setNotice({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  };

  const removeExpense = async (id: number, name: string) => {
    if (!window.confirm(`Delete the expense "${name}"?`)) return;
    setNotice(null);
    try {
      const res = await fetch(`/api/backend/admin/expenses/${id}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice({ ok: false, text: errorMessage(body) });
        return;
      }
      router.refresh();
      loadMovements(page, filter);
    } catch {
      setNotice({ ok: false, text: "Could not reach the server." });
    }
  };

  if (!data) {
    return (
      <>
        <h1 className="adm-page-title">Stock</h1>
        <p className="stk-error">
          Could not load the stock numbers. Check that the backend is running,
          then refresh the page.
        </p>
      </>
    );
  }

  const { summary, books } = data;
  const profit = summary.profit;
  const recovered = Math.max(0, Math.min(100, summary.recovered_percent));

  const stats = [
    {
      label: "Books in Storage",
      value: summary.in_storage.toLocaleString("en-US"),
      icon: Package,
      tone: "",
    },
    {
      label: "Books Sold",
      value: summary.sold.toLocaleString("en-US"),
      icon: ShoppingBag,
      tone: "",
    },
    {
      label: "Total Revenue",
      value: `+${formatMoney(summary.revenue)}`,
      icon: Wallet,
      tone: "plus",
    },
    {
      label: "Total Expenses",
      value: `-${formatMoney(summary.expenses)}`,
      icon: Receipt,
      tone: "minus",
    },
  ];

  return (
    <>
      <div className="stk-head">
        <div>
          <h1 className="adm-page-title">Stock</h1>
          <p className="adm-page-sub">
            Your storage, every sale (green) and every expense (red), and how
            much your store really earns.
          </p>
        </div>
        <button
          className="adm-btn adm-btn-primary stk-refresh"
          onClick={refresh}
          disabled={refreshing || loading}
        >
          <RefreshCw
            size={16}
            className={refreshing || loading ? "stk-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ---------- Summary cards ---------- */}
      <div className="stk-stats">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="adm-card stk-stat">
              <div className="stk-stat-icon">
                <Icon size={24} />
              </div>
              <div>
                <p className="stk-stat-label">{s.label}</p>
                <p className={`stk-stat-value ${s.tone}`}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Profit ---------- */}
      <div className={`adm-card stk-profit ${profit >= 0 ? "gain" : "loss"}`}>
        <div className="stk-profit-top">
          <div className="stk-profit-icon">
            {profit >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
          </div>
          <div>
            <p className="stk-stat-label">
              {profit >= 0 ? "Net Profit" : "Net Loss"}
            </p>
            <p className="stk-profit-value">
              {profit >= 0 ? "+" : "-"}
              {formatMoney(Math.abs(profit))}
            </p>
            <p className="stk-profit-formula">
              {formatMoney(summary.revenue)} revenue (including{" "}
              {formatMoney(summary.delivery_fees)} delivery fees
              {summary.discounts > 0
                ? `, after ${formatMoney(summary.discounts)} of vouchers`
                : ""}
              ) &minus; {formatMoney(summary.expenses)} expenses
            </p>
          </div>
        </div>

        <div className="stk-progress">
          <div className="stk-progress-head">
            <span>
              {profit >= 0
                ? "Break-even reached. Everything above is profit."
                : `${recovered.toFixed(0)}% of your expenses recovered so far`}
            </span>
            <strong>{recovered.toFixed(0)}%</strong>
          </div>
          <div className="stk-progress-track">
            <div
              className="stk-progress-fill"
              style={{ width: `${recovered}%` }}
            />
          </div>
        </div>
      </div>

      {/* ---------- Money movements ---------- */}
      <div className="adm-card stk-moves-card">
        <h2 className="adm-card-title">Money Movements</h2>
        <p className="stk-hint">
          <span className="stk-dot plus" /> A book was sold (by you or an
          employee) and its money was added.{" "}
          <span className="stk-dot minus" /> You paid something and it was
          deducted.
        </p>

        <div className="stk-tabs" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`stk-tab ${filter === f.key ? "active" : ""}`}
              onClick={() => changeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {movements.data.length === 0 ? (
          <p className="stk-hint">
            {loading ? "Loading..." : "Nothing here yet."}
          </p>
        ) : (
          <ul className={`stk-moves ${loading ? "loading" : ""}`}>
            {movements.data.map((m) => (
              <li key={m.key} className={m.kind === "sale" ? "plus" : "minus"}>
                <span className="stk-move-icon">
                  {m.kind === "sale" ? <Plus size={18} /> : <Minus size={18} />}
                </span>
                <div className="stk-move-text">
                  <h4>{movementTitle(m)}</h4>
                  <span>{movementMeta(m)}</span>
                </div>
                <div className="stk-list-end">
                  <strong className="stk-move-amount">
                    {m.kind === "sale" ? "+" : "-"}
                    {formatMoney(m.amount)}
                  </strong>
                  {m.kind === "expense" && (
                    <button
                      className="stk-delete"
                      onClick={() => removeExpense(m.id, m.title)}
                      aria-label={`Delete ${m.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {movements.last_page > 1 && (
          <div className="stk-pager">
            <button
              className="adm-btn adm-btn-primary stk-pager-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || movements.current_page <= 1}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="stk-pager-info">
              Page {movements.current_page.toLocaleString("en-US")} of{" "}
              {movements.last_page.toLocaleString("en-US")}
              <small>
                {movements.total.toLocaleString("en-US")} movements
              </small>
            </span>

            <button
              className="adm-btn adm-btn-primary stk-pager-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || movements.current_page >= movements.last_page}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="stk-grid">
        {/* ---------- Books table ---------- */}
        <div className="adm-card">
          <h2 className="adm-card-title">Books Inventory</h2>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>In Storage</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 && (
                  <tr>
                    <td colSpan={6} className="stk-empty">
                      No books found.
                    </td>
                  </tr>
                )}
                {books.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.title}</strong>
                    </td>
                    <td>{formatMoney(b.price)}</td>
                    <td>{b.in_stock}</td>
                    <td>{b.sold}</td>
                    <td>{formatMoney(b.revenue)}</td>
                    <td>
                      <span
                        className={`adm-badge ${
                          b.in_stock === 0
                            ? "adm-badge-red"
                            : b.low_stock
                            ? "adm-badge-orange"
                            : "adm-badge-green"
                        }`}
                      >
                        {b.in_stock === 0 ? "Out" : b.low_stock ? "Low" : "OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- Add expense ---------- */}
        <div className="adm-card">
          <h2 className="adm-card-title">Add Expense</h2>
          <p className="stk-hint">
            Add what you paid (printing, shipping, rent...). It appears in red
            above and is deducted from your profit.
          </p>

          <form onSubmit={addExpense} className="stk-form">
            <div className="adm-field">
              <label className="adm-label" htmlFor="exp-title">
                What did you pay for?
              </label>
              <input
                id="exp-title"
                className="adm-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Printing new books"
                maxLength={255}
                required
              />
            </div>

            <div className="stk-form-row">
              <div className="adm-field">
                <label className="adm-label" htmlFor="exp-amount">
                  Amount (EGP)
                </label>
                <input
                  id="exp-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="adm-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="adm-field">
                <label className="adm-label" htmlFor="exp-date">
                  Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  className="adm-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="adm-btn adm-btn-accent"
              disabled={busy}
            >
              <Plus size={18} />
              {busy ? "Saving..." : "Add Expense"}
            </button>
            {notice && (
              <p className={`stk-notice ${notice.ok ? "" : "error"}`}>
                {notice.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}