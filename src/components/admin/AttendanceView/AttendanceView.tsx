"use client";

import { useMemo, useState } from "react";
import {
  attendance as seedAttendance,
  employees,
  type AttendanceRecord,
  type AttendanceStatus,
} from "@/data/adminData";
import { useStored } from "@/lib/store";
import { workedHours } from "@/lib/time";
import "./AttendanceView.css";

const badgeClass: Record<AttendanceStatus, string> = {
  "On time": "adm-badge-green",
  Working: "adm-badge-blue",
  Late: "adm-badge-orange",
  Absent: "adm-badge-red",
};

export default function AttendanceView() {
  const [records] = useStored<AttendanceRecord[]>(
    "bs_attendance",
    seedAttendance
  );
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState<"All" | AttendanceStatus>("All");

  const dates = useMemo(
    () => Array.from(new Set(records.map((r) => r.date))).sort().reverse(),
    [records]
  );
  const date = dates.includes(selected) ? selected : dates[0] ?? "";

  const forDate = records.filter((r) => r.date === date);
  const rows = forDate.filter((r) => status === "All" || r.status === status);
  const count = (s: AttendanceStatus) =>
    forDate.filter((r) => r.status === s).length;

  const summary = [
    { label: "Present", value: forDate.length - count("Absent"), cls: "adm-badge-green" },
    { label: "Late", value: count("Late"), cls: "adm-badge-orange" },
    { label: "Absent", value: count("Absent"), cls: "adm-badge-red" },
  ];

  return (
    <>
      <h1 className="adm-page-title">Employee Attendance</h1>
      <p className="adm-page-sub">
        See who came in, who left, and who was late. Employees record this
        themselves from their own page.
      </p>

      <div className="adm-card">
        <div className="att-toolbar">
          <div className="att-summary">
            {summary.map((s) => (
              <span key={s.label} className={`adm-badge ${s.cls}`}>
                {s.label}: {s.value}
              </span>
            ))}
          </div>

          <div className="att-filters">
            <select
              className="adm-input"
              value={date}
              onChange={(e) => setSelected(e.target.value)}
              aria-label="Date"
            >
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="adm-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              aria-label="Status"
            >
              {["All", "On time", "Working", "Late", "Absent"].map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

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
              {rows.map((r) => {
                const emp = employees.find((e) => e.id === r.employeeId);
                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{emp?.name}</strong>
                    </td>
                    <td>{emp?.role}</td>
                    <td>{r.date}</td>
                    <td>{r.checkIn ?? "-"}</td>
                    <td>{r.checkOut ?? "-"}</td>
                    <td>{workedHours(r.checkIn, r.checkOut)}</td>
                    <td>
                      <span className={`adm-badge ${badgeClass[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}