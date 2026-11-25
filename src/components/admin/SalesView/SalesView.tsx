"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, Receipt, Search, Store, Trash2, Wallet } from "lucide-react";
import SaleForm from "@/components/SaleForm/SaleForm";
import { formatMoney } from "@/lib/money";
import {
  errorMessage,
  type SaleRow,
  type SalesSummary,
  type StaffBook,
} from "@/lib/saleTypes";
import "./SalesView.css";

type Filter = "all" | "spot" | "delivery";

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "spot", label: "On the spot" },
  { key: "delivery", label: "Delivery" },
];

export default function SalesView({
  initialBooks,
  initialSales,
  initialSummary,
}: {
  initialBooks: StaffBook[];
  initialSales: SaleRow[];
  initialSummary: SalesSummary;
}) {
  const router = useRouter();
  const [sales, setSales] = useState<SaleRow[]>(initialSales);
  const [summary, setSummary] = useState<SalesSummary>(initialSummary);
  const [channel, setChannel] = useState<Filter>("all");
  const [employee, setEmployee] = useState("");
  const [term, setTerm] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");

  // Wait a moment after typing before asking the database
  useEffect(() => {
    const timer = setTimeout(() => setTerm(employee.trim()), 350);
    return () => clearTimeout(timer);
  }, [employee]);

  // Loads the sales with the chosen filters from the database
  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const params = new URLSearchParams();
      if (channel !== "all") params.set("channel", channel);
      if (term) params.set("employee", term);
      const qs = params.toString();

      try {
        const res = await fetch(`/api/backend/sales${qs ? `?${qs}` : ""}`, {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(errorMessage(data));
          return;
        }
        setError("");
        setSales(data.sales ?? []);
        setSummary(data.summary);
      } catch {
        /* cancelled by a newer filter */
      }
    };

    run();
    return () => controller.abort();
  }, [channel, term, reloadKey]);

  const remove = async (sale: SaleRow) => {
    if (
      !window.confirm(
        `Delete this sale of "${sale.title}"? The copies go back to the storage.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/backend/admin/sales/${sale.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(errorMessage(data));
        return;
      }
      setReloadKey((k) => k + 1);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    }
  };

  const stats = [
    { label: "Sales Revenue", value: formatMoney(summary.revenue), icon: Wallet },
    { label: "Orders", value: summary.orders, icon: Receipt },
    { label: "On the Spot", value: summary.spot_orders, icon: Store },
    { label: "Delivery", value: summary.delivery_orders, icon: Bike },
  ];

  return (
    <>
      <h1 className="adm-page-title">Sales</h1>
      <p className="adm-page-sub">
        Every sale made by your employees, with who sold it and how. Each sale
        is added to your revenue and removed from your stock.
      </p>

      {/* ---------- Filters ---------- */}
      <div className="sales-filters">
        <div className="sales-search">
          <Search size={20} />
          <input
            className="adm-input"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            placeholder="Search by employee name or ID (e.g. Omar Hassan or 11000)"
            aria-label="Filter by employee"
          />
        </div>

        <div className="sales-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={channel === t.key}
              className={`sales-tab ${channel === t.key ? "active" : ""}`}
              onClick={() => setChannel(t.key)}
            >
              {t.key === "spot" && <Store size={18} />}
              {t.key === "delivery" && <Bike size={18} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-stats">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="adm-card adm-stat">
              <div className="adm-stat-icon">
                <Icon size={24} />
              </div>
              <div>
                <p className="adm-stat-label">{s.label}</p>
                <p className="adm-stat-value">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- All sales ---------- */}
      <div className="adm-card sales-block">
        <h2 className="adm-card-title">
          {channel === "all"
            ? "All Sales"
            : channel === "spot"
            ? "On the Spot Sales"
            : "Delivery Sales"}
          {term ? ` · ${term}` : ""}
        </h2>
        <p className="sales-note">
          Delivery fees collected: <strong>{formatMoney(summary.delivery_fees)}</strong>
        </p>
        {error && <p className="sales-error">{error}</p>}

        <div className="adm-table-wrap">
          <table className="adm-table sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Book</th>
                <th>Qty</th>
                <th>Type</th>
                <th>Address</th>
                <th>Total</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr>
                  <td colSpan={8} className="sales-empty">
                    No sales found.
                  </td>
                </tr>
              )}
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.date}
                    <br />
                    <small>{s.time}</small>
                  </td>
                  <td>
                    <strong>{s.sold_by}</strong>
                    <br />
                    <small>ID {s.login_id ?? "-"}</small>
                  </td>
                  <td>
                    <strong>{s.title ?? "-"}</strong>
                  </td>
                  <td>{s.quantity}</td>
                  <td>
                    <span
                      className={`adm-badge ${
                        s.channel === "delivery"
                          ? "adm-badge-orange"
                          : "adm-badge-green"
                      }`}
                    >
                      {s.channel === "delivery" ? "Delivery" : "On the spot"}
                    </span>
                  </td>
                  <td>{s.address || "-"}</td>
                  <td>
                    <strong>{formatMoney(s.total)}</strong>
                  </td>
                  <td>
                    <button
                      className="sales-delete"
                      onClick={() => remove(s)}
                      aria-label={`Delete sale of ${s.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- The admin can also sell ---------- */}
      <SaleForm
        books={initialBooks}
        onRecorded={() => setReloadKey((k) => k + 1)}
      />
    </>
  );
}