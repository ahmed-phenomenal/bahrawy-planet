"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarCheck, LogIn, LogOut, ShoppingCart } from "lucide-react";
import SaleForm from "@/components/SaleForm/SaleForm";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { formatMoney } from "@/lib/money";
import type { SaleRow, StaffBook } from "@/lib/saleTypes";
import { SHIFT_BADGE, SHIFT_INFO, normalizeShift } from "@/lib/shifts";
import { WEEK_DAYS } from "@/lib/week";
import "@/components/admin/admin-common.css";
import "./EmployeePanel.css";

type Employee = { id: number; loginId: string; name: string; role: string };

export type AttendanceInfo = {
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours: string | null;
  status: string;
};

export type TodayData = {
  date: string;
  weekday: number; // 0 = Saturday ... 6 = Friday
  shift: string;
  attendance: AttendanceInfo | null;
  week: { weekday: number; shift: string }[];
};

const badgeClass: Record<string, string> = {
  "On time": "adm-badge-green",
  Working: "adm-badge-blue",
  Late: "adm-badge-orange",
  Absent: "adm-badge-red",
};

export default function EmployeePanel({
  employee,
  today,
  books,
  sales,
  salesTotal,
}: {
  employee: Employee;
  today: TodayData;
  books: StaffBook[];
  sales: SaleRow[];
  salesTotal: number;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"attendance" | "sales">("attendance");
  const [mounted, setMounted] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceInfo | null>(
    today.attendance
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // When the page is refreshed with new data (for example the admin changed the shifts)
  useEffect(() => {
    setAttendance(today.attendance);
  }, [today]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    window.location.assign("/login");
  };

  const act = async (action: "check-in" | "check-out") => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/backend/attendance/${action}`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? "Something went wrong.");
        return;
      }
      setAttendance(data.attendance);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const header = (
    <header className="emp-topbar">
      <div className="emp-brand">
        <Image src="/logo.png" alt="Logo" width={36} height={36} />
        <span>Bahrawy Planet</span>
      </div>
      <div className="emp-right">
        <div className="emp-user">
          <strong>{employee.name}</strong>
          <span>
            {employee.role} · ID {employee.loginId}
          </span>
        </div>
        <ThemeToggle />
        <button className="emp-logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );

  // Dates depend on the visitor's clock, so wait until mounted
  if (!mounted) {
    return (
      <div className="emp-root">
        {header}
        <main className="emp-main">
          <p className="emp-loading">Loading...</p>
        </main>
      </div>
    );
  }

  const checkedIn = Boolean(attendance?.check_in);
  const checkedOut = Boolean(attendance?.check_out);

  const myShifts = WEEK_DAYS.map((_, i) =>
    normalizeShift(today.week.find((w) => w.weekday === i)?.shift)
  );
  const todayShift = normalizeShift(today.shift);
  const blocked = todayShift === "Off Day" || todayShift === "No Show";

  const weekDates = WEEK_DAYS.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - today.weekday + i);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  });

  return (
    <div className="emp-root">
      {header}

      <main className="emp-main">
        <h1 className="adm-page-title">Hello, {employee.name.split(" ")[0]}</h1>
        <p className="adm-page-sub">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="emp-tabs">
          <button
            className={`emp-tab ${tab === "attendance" ? "active" : ""}`}
            onClick={() => setTab("attendance")}
          >
            <CalendarCheck size={18} />
            Attendance & Shifts
          </button>
          <button
            className={`emp-tab ${tab === "sales" ? "active" : ""}`}
            onClick={() => setTab("sales")}
          >
            <ShoppingCart size={18} />
            Sales
          </button>
        </div>

        {tab === "attendance" && (
          <>
            <div className="adm-card emp-section">
              <h2 className="adm-card-title">Today&rsquo;s Attendance</h2>

              <div className="emp-times">
                <div>
                  <span>Today&rsquo;s shift</span>
                  <span className={`adm-badge ${SHIFT_BADGE[todayShift]}`}>
                    {todayShift}
                  </span>
                </div>
                <div>
                  <span>Check-in</span>
                  <strong>{attendance?.check_in ?? "-"}</strong>
                </div>
                <div>
                  <span>Check-out</span>
                  <strong>{attendance?.check_out ?? "-"}</strong>
                </div>
                <div>
                  <span>Worked</span>
                  <strong>{attendance?.hours ?? "-"}</strong>
                </div>
              </div>

              <div className="emp-actions">
                <button
                  className="adm-btn adm-btn-primary"
                  onClick={() => act("check-in")}
                  disabled={busy || checkedIn || blocked}
                >
                  <LogIn size={18} />
                  Check In
                </button>
                <button
                  className="adm-btn adm-btn-accent"
                  onClick={() => act("check-out")}
                  disabled={busy || !checkedIn || checkedOut}
                >
                  <LogOut size={18} />
                  Check Out (end of day)
                </button>
              </div>

              {error && <p className="emp-note red">{error}</p>}
              {todayShift === "Off Day" && (
                <p className="emp-note">Today is your day off. Enjoy your rest!</p>
              )}
              {todayShift === "No Show" && (
                <p className="emp-note red">
                  You were marked as No Show today. Please contact the admin.
                </p>
              )}
              {checkedOut && (
                <p className="emp-done">
                  You are done for today. See you tomorrow!
                </p>
              )}
              {attendance && checkedIn && (
                <p className="emp-status">
                  Status:{" "}
                  <span
                    className={`adm-badge ${
                      badgeClass[attendance.status] ?? "adm-badge-gray"
                    }`}
                  >
                    {attendance.status}
                  </span>
                </p>
              )}
            </div>

            <div className="adm-card emp-section">
              <h2 className="adm-card-title">My Shifts This Week</h2>
              <div className="adm-table-wrap">
                <table className="adm-table emp-shifts">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEK_DAYS.map((day, i) => (
                      <tr
                        key={day}
                        className={i === today.weekday ? "emp-today-row" : ""}
                      >
                        <td>
                          <strong>{day}</strong>
                          {i === today.weekday && (
                            <span className="adm-badge adm-badge-blue emp-today-badge">
                              Today
                            </span>
                          )}
                        </td>
                        <td>{weekDates[i]}</td>
                        <td>
                          <span className={`adm-badge ${SHIFT_BADGE[myShifts[i]]}`}>
                            {myShifts[i]}
                          </span>
                          <span className="emp-shift-time">
                            {SHIFT_INFO[myShifts[i]]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "sales" && (
          <>
            <SaleForm books={books} />

            <div className="adm-card emp-section">
              <h2 className="adm-card-title">
                My Sales Today ({sales.length})
              </h2>
              <p className="emp-total">
                Total: <strong>{formatMoney(salesTotal)}</strong>
              </p>

              {sales.length === 0 ? (
                <p className="emp-empty">No sales recorded yet today.</p>
              ) : (
                <ul className="emp-sales">
                  {sales.map((s) => (
                    <li key={s.id}>
                      <div>
                        <h4>
                          {s.title}
                          {s.quantity > 1 ? ` x${s.quantity}` : ""}
                        </h4>
                        <span>
                          {s.time} ·{" "}
                          {s.channel === "delivery"
                            ? `Delivery to ${s.address}`
                            : "On the spot"}
                        </span>
                      </div>
                      <strong>{formatMoney(s.total)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}