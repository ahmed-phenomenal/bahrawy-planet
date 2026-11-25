"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SHIFTS,
  SHIFT_BADGE,
  SHIFT_INFO,
  normalizeShift,
  type Shift,
} from "@/lib/shifts";
import { WEEK_DAYS } from "@/lib/week";
import "./ScheduleView.css";

export type HourRow = {
  weekday: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

export type PersonRow = { id: number; name: string; shifts: string[] };

const shiftClass: Record<Shift, string> = {
  Morning: "morning",
  Night: "night",
  "Off Day": "off",
  "No Show": "noshow",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function errorMessage(data: any) {
  const first = data?.errors
    ? (Object.values(data.errors) as string[][])[0]?.[0]
    : null;
  return first ?? data?.message ?? data?.error ?? "Something went wrong.";
}

const weekOf = (p: { shifts: string[] }) =>
  WEEK_DAYS.map((_, i) => normalizeShift(p.shifts[i]));

type Note = { ok: boolean; text: string } | null;

export default function ScheduleView({
  employees,
  hours: initialHours,
}: {
  employees: PersonRow[];
  hours: HourRow[];
}) {
  const router = useRouter();
  const [hours, setHours] = useState<HourRow[]>(initialHours);
  const [people, setPeople] = useState<PersonRow[]>(employees);
  const [prevEmployees, setPrevEmployees] = useState(employees);
  const [dirty, setDirty] = useState(false);
  const [hoursNote, setHoursNote] = useState<Note>(null);
  const [scheduleNote, setScheduleNote] = useState<Note>(null);
  const [busy, setBusy] = useState<"hours" | "schedule" | null>(null);
  const [hoursDirty, setHoursDirty] = useState(false);

  // The server sent fresh data (a new employee, or after a save): use it,
  // unless you are in the middle of editing
  if (prevEmployees !== employees) {
    setPrevEmployees(employees);
    if (!dirty) setPeople(employees);
  }

  // Days the store is closed: every employee is on Off Day, and the cell is locked
  const closedDays = new Set(
    hours.filter((h) => h.is_closed).map((h) => h.weekday)
  );

  const updateHours = (
    weekday: number,
    key: "opens_at" | "closes_at" | "is_closed",
    value: string | boolean
  ) => {
    setHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, [key]: value } : h))
    );
    setHoursNote(null);
    setHoursDirty(true);
  };

  const updateShift = (employeeId: number, dayIndex: number, value: Shift) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== employeeId) return p;
        const week = weekOf(p);
        week[dayIndex] = value;
        return { ...p, shifts: week };
      })
    );
    setDirty(true);
    setScheduleNote(null);
  };

  const saveHours = async () => {
    setBusy("hours");
    setHoursNote(null);
    try {
      const res = await fetch("/api/backend/admin/store-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setHoursNote({ ok: false, text: errorMessage(data) });
        return;
      }
      setHoursDirty(false);
      setHoursNote({
        ok: true,
        text: "Saved. The footer is updated and closed days are Off Day for everyone.",
      });
      router.refresh();
    } catch {
      setHoursNote({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(null);
    }
  };

  const saveSchedule = async () => {
    setBusy("schedule");
    setScheduleNote(null);
    try {
      const shifts: Record<string, string[]> = {};
      people.forEach((p) => {
        shifts[String(p.id)] = weekOf(p);
      });

      const res = await fetch("/api/backend/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shifts }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setScheduleNote({
          ok: false,
          text: `Not saved (${res.status}): ${errorMessage(data)}`,
        });
        return;
      }

      // Read the schedule back from the database to be sure it was saved
      const check = await fetch("/api/backend/admin/schedule");
      const stored = await check.json().catch(() => null);
      if (!check.ok || !Array.isArray(stored?.employees)) {
        setScheduleNote({
          ok: false,
          text: "Saved, but could not read it back to confirm. Refresh the page.",
        });
        return;
      }

      const fresh: PersonRow[] = stored.employees.map((e: any) => ({
        id: Number(e.id),
        name: String(e.name),
        shifts: e.shifts ?? [],
      }));

      // Closed days are ignored in the comparison (they are Off Day anyway)
      const sameOpenDays = (a: PersonRow, b: PersonRow) =>
        weekOf(a).every(
          (shift, i) => closedDays.has(i) || shift === weekOf(b)[i]
        );

      const mismatch = people.filter((p) => {
        const db = fresh.find((f) => f.id === p.id);
        return !db || !sameOpenDays(p, db);
      });

      if (mismatch.length > 0) {
        setScheduleNote({
          ok: false,
          text: `The database did not keep the shifts of: ${mismatch
            .map((m) => m.name)
            .join(", ")}.`,
        });
        return;
      }

      setPeople(fresh);
      setDirty(false);
      setScheduleNote({
        ok: true,
        text: "Saved and confirmed from the database. Employees can see their new shifts.",
      });
      router.refresh();
    } catch {
      setScheduleNote({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <h1 className="adm-page-title">Schedule</h1>
      <p className="adm-page-sub">
        Set when the store opens and closes, and plan your employees&rsquo; week.
        This is a weekly schedule that repeats every week until you change it.
        A closed day is an Off Day for all employees, and their shifts come back
        when you open that day again.
      </p>

      <div className="adm-card sch-section">
        <h2 className="adm-card-title">Store Opening Hours</h2>

        {hours.length === 0 ? (
          <p className="sch-saved" style={{ color: "#ef4444" }}>
            Could not load the opening hours. Check that the backend is running.
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Opens</th>
                  <th>Closes</th>
                  <th>Closed all day</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((h) => (
                  <tr key={h.weekday}>
                    <td>
                      <strong>{WEEK_DAYS[h.weekday]}</strong>
                    </td>
                    <td>
                      <input
                        type="time"
                        className="adm-input sch-time"
                        value={h.opens_at}
                        disabled={h.is_closed}
                        onChange={(e) =>
                          updateHours(h.weekday, "opens_at", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        className="adm-input sch-time"
                        value={h.closes_at}
                        disabled={h.is_closed}
                        onChange={(e) =>
                          updateHours(h.weekday, "closes_at", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="sch-check"
                        checked={h.is_closed}
                        onChange={(e) =>
                          updateHours(h.weekday, "is_closed", e.target.checked)
                        }
                        aria-label={`${WEEK_DAYS[h.weekday]} closed`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="sch-actions">
          <button
            className="adm-btn adm-btn-primary"
            onClick={saveHours}
            disabled={busy !== null || hours.length === 0}
          >
            {busy === "hours" ? "Saving..." : "Save Opening Hours"}
          </button>
          {hoursNote && (
            <span
              className="sch-saved"
              style={hoursNote.ok ? undefined : { color: "#ef4444" }}
            >
              {hoursNote.text}
            </span>
          )}
        </div>
      </div>

      <div className="adm-card sch-section">
        <h2 className="adm-card-title">Employee Weekly Schedule</h2>

        <div className="sch-legend">
          {SHIFTS.map((s) => (
            <div key={s}>
              <span className={`adm-badge ${SHIFT_BADGE[s]}`}>{s}</span>
              <small>{SHIFT_INFO[s]}</small>
            </div>
          ))}
        </div>

        {people.length === 0 ? (
          <p className="sch-saved">No employees yet.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table sch-wide">
              <thead>
                <tr>
                  <th>Employee</th>
                  {WEEK_DAYS.map((d, dayIndex) => (
                    <th key={d}>
                      {d.slice(0, 3)}
                      {closedDays.has(dayIndex) && (
                        <small style={{ display: "block", color: "#ef4444" }}>
                          Closed
                        </small>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <strong>{emp.name}</strong>
                    </td>
                    {WEEK_DAYS.map((d, dayIndex) => {
                      const closed = closedDays.has(dayIndex);
                      const value: Shift = closed
                        ? "Off Day"
                        : normalizeShift(emp.shifts[dayIndex]);
                      return (
                        <td key={d}>
                          <select
                            className={`adm-input sch-shift ${shiftClass[value]}`}
                            value={value}
                            disabled={closed}
                            style={
                              closed
                                ? { opacity: 0.6, cursor: "not-allowed" }
                                : undefined
                            }
                            title={
                              closed
                                ? "The store is closed on this day"
                                : undefined
                            }
                            onChange={(e) =>
                              updateShift(emp.id, dayIndex, e.target.value as Shift)
                            }
                            aria-label={`${emp.name} on ${d}`}
                          >
                            {SHIFTS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="sch-actions">
          <button
            className="adm-btn adm-btn-accent"
            onClick={saveSchedule}
            disabled={busy !== null || people.length === 0 || hoursDirty}
          >
            {busy === "schedule" ? "Saving..." : "Save Schedule"}
          </button>
          {hoursDirty && (
            <span className="sch-saved" style={{ color: "#ef4444" }}>
              Save the opening hours first, then save the schedule.
            </span>
          )}
          {dirty && !hoursDirty && !scheduleNote && (
            <span className="sch-saved" style={{ color: "#f59e0b" }}>
              You have unsaved changes. Press Save Schedule.
            </span>
          )}
          {scheduleNote && (
            <span
              className="sch-saved"
              style={scheduleNote.ok ? undefined : { color: "#ef4444" }}
            >
              {scheduleNote.text}
            </span>
          )}
        </div>
      </div>
    </>
  );
}