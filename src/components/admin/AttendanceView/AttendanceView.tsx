"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import "./AttendanceView.css";

export type AttendanceRow = {
  employee_id: number;
  login_id: string | null;
  name: string;
  job_title: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours: string | null;
  status: string;
};

export type AttendanceData = {
  date: string;
  summary: { present: number; late: number; absent: number; off_day: number };
  rows: AttendanceRow[];
};

// The browser talks to Laravel through the Next.js proxy, which adds the token from the cookie
const ENDPOINT = "/api/backend/admin/attendance";

const STATUSES = [
  "On time",
  "Working",
  "Late",
  "Absent",
  "Off Day",
  "Not in yet",
  "Scheduled",
];

const BADGE: Record<string, string> = {
  "On time": "adm-badge-green",
  Working: "adm-badge-blue",
  Late: "adm-badge-orange",
  Absent: "adm-badge-red",
  "Off Day": "adm-badge-gray",
  "Not in yet": "adm-badge-orange",
  Scheduled: "adm-badge-blue",
};

export default function AttendanceView({ initial }: { initial: AttendanceData | null }) {
  const [data, setData] = useState<AttendanceData | null>(initial);
  // The date comes from the server, so it is the store's date (Cairo), not the visitor's clock
  const [date, setDate] = useState(initial?.date ?? "");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState(
    initial ? "" : "Could not load the attendance. Is the backend running?"
  );
  const [loading, setLoading] = useState(false);
  const lastRequest = useRef(0);

  const load = useCallback(async (day: string, silent = false) => {
    const request = ++lastRequest.current;
    if (!silent) setLoading(true);

    try {
      const query = day ? `?date=${encodeURIComponent(day)}` : "";
      const res = await fetch(`${ENDPOINT}${query}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("failed");

      const next = (await res.json()) as AttendanceData;

      // An older answer must never replace a newer one (when the date is changed quickly)
      if (request !== lastRequest.current) return;

      setData(next);
      setDate(next.date);
      setError("");
    } catch {
      if (request === lastRequest.current && !silent) {
        setError("Could not load the attendance. Please try again.");
      }
    } finally {
      if (request === lastRequest.current && !silent) setLoading(false);
    }
  }, []);

  // Employees check in by themselves, so the table refreshes every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => load(date, true), 30000);
    return () => clearInterval(timer);
  }, [date, load]);

  const rows = (data?.rows ?? []).filter((r) => status === "All" || r.status === status);
  const summary = data?.summary;

  const badges = [
    { label: "Present", value: summary?.present ?? 0, cls: "adm-badge-green" },
    { label: "Late", value: summary?.late ?? 0, cls: "adm-badge-orange" },
    { label: "Absent", value: summary?.absent ?? 0, cls: "adm-badge-red" },
    { label: "Off Day", value: summary?.off_day ?? 0, cls: "adm-badge-gray" },
  ];

  return (
    <>
      <h1 className="adm-page-title">Employee Attendance</h1>
      <p className="adm-page-sub">
        See who came in, who left, and who was late. Employees record this
        themselves. A day marked No Show in the schedule counts as absent.
      </p>

      <div className="adm-card">
        <div className="att-toolbar">
          <div className="att-summary">
            {badges.map((b) => (
              <span key={b.label} className={`adm-badge ${b.cls}`}>
                {b.label}: {b.value}
              </span>
            ))}
          </div>

          <div className="att-filters">
            <input
              type="date"
              className="adm-input"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (e.target.value) load(e.target.value);
              }}
              aria-label="Date"
            />

            <select
              className="adm-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Status"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="att-refresh"
              onClick={() => load(date)}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "att-spin" : ""} />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && <p className="att-error">{error}</p>}

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="att-empty">
                    No records match this filter.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={`${r.employee_id}-${r.date}`}>
                  <td>
                    <strong>{r.name}</strong>
                    {r.login_id && <small className="att-id"> · {r.login_id}</small>}
                  </td>
                  <td>{r.job_title ?? "-"}</td>
                  <td>{r.date}</td>
                  <td>{r.check_in ?? "-"}</td>
                  <td>{r.check_out ?? "-"}</td>
                  <td>{r.hours ?? "-"}</td>
                  <td>
                    <span className={`adm-badge ${BADGE[r.status] ?? "adm-badge-gray"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}