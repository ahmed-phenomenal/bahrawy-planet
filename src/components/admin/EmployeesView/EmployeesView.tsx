"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Copy,
  KeyRound,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import "./EmployeesView.css";

export type EmployeeItem = {
  id: number;
  login_id: string;
  name: string;
  job_title: string | null;
  phone: string | null;
  created_at: string;
};

type Credentials = {
  name: string;
  loginId: string;
  password: string;
  kind: "created" | "reset";
};

// Same jobs as the backend accepts
const JOBS = ["Cashier", "Sales Assistant", "Stock Keeper", "Store Manager"];

// The browser talks to Laravel through the Next.js proxy, which adds the token from the cookie
async function request<T>(
  path: string,
  method: "POST" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(`/api/backend/admin/employees${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Please sign in again.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errors = data?.errors as Record<string, string[]> | undefined;
    const first = errors ? Object.values(errors)[0]?.[0] : undefined;

    throw new Error(first ?? data?.message ?? `Request failed (${res.status})`);
  }

  return data as T;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    timeZone: "Africa/Cairo",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeesView({
  initial,
  failed = false,
}: {
  initial: EmployeeItem[];
  failed?: boolean;
}) {
  const [employees, setEmployees] = useState<EmployeeItem[]>(initial);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState(JOBS[0]);
  const [phone, setPhone] = useState("");
  const [creds, setCreds] = useState<Credentials | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState(
    failed ? "Could not load the employees. Is the backend running?" : ""
  );
  const [busy, setBusy] = useState(false);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      // Copying is not allowed on this page: the admin can select the text instead
    }
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await request<{ employee: EmployeeItem; password: string }>(
        "",
        "POST",
        { name: name.trim(), job_title: jobTitle, phone: phone.trim() || null }
      );

      setEmployees((prev) => [...prev, data.employee]);
      setCreds({
        name: data.employee.name,
        loginId: data.employee.login_id,
        password: data.password,
        kind: "created",
      });
      setName("");
      setPhone("");
      setJobTitle(JOBS[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (employee: EmployeeItem) => {
    if (
      !window.confirm(
        `Generate a new password for ${employee.name}? The old one will stop working.`
      )
    )
      return;

    setError("");

    try {
      const data = await request<{ employee: EmployeeItem; password: string }>(
        `/${employee.id}/reset-password`,
        "POST"
      );

      setCreds({
        name: employee.name,
        loginId: employee.login_id,
        password: data.password,
        kind: "reset",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const remove = async (employee: EmployeeItem) => {
    if (
      !window.confirm(
        `Remove ${employee.name}? They will no longer be able to sign in.`
      )
    )
      return;

    setError("");

    try {
      await request(`/${employee.id}`, "DELETE");

      setEmployees((prev) => prev.filter((x) => x.id !== employee.id));
      setCreds((c) => (c && c.loginId === employee.login_id ? null : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <>
      <h1 className="adm-page-title">Employees</h1>
      <p className="adm-page-sub">
        Add a new employee and the system creates their ID and password for you.
      </p>

      <div className="ev-top">
        <div className="adm-card">
          <h2 className="adm-card-title">Add Employee</h2>

          <form onSubmit={add} className="ev-form">
            <div className="adm-field">
              <label className="adm-label" htmlFor="ev-name">
                Full name
              </label>
              <input
                id="ev-name"
                className="adm-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmed Hassan"
                minLength={2}
                maxLength={60}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="ev-role">
                Role
              </label>
              <select
                id="ev-role"
                className="adm-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                {JOBS.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="ev-phone">
                Phone (optional)
              </label>
              <input
                id="ev-phone"
                type="tel"
                className="adm-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                maxLength={20}
              />
            </div>

            {error && <p className="ev-error">{error}</p>}

            <button type="submit" className="adm-btn adm-btn-accent" disabled={busy}>
              <UserPlus size={18} />
              {busy ? "Adding..." : "Add & Generate Login"}
            </button>
          </form>
        </div>

        <div className="adm-card ev-creds">
          <h2 className="adm-card-title">Login Details</h2>

          {!creds ? (
            <div className="ev-creds-empty">
              <ShieldCheck size={40} />
              <p>
                The ID and password appear here after you add an employee or
                generate a new password.
              </p>
            </div>
          ) : (
            <>
              <p className="ev-creds-title">
                {creds.kind === "created" ? "Employee added: " : "New password for: "}
                <strong>{creds.name}</strong>
              </p>

              <div className="ev-cred">
                <span>Employee ID</span>
                <code>{creds.loginId}</code>
                <button
                  type="button"
                  onClick={() => copy(creds.loginId, "id")}
                  aria-label="Copy ID"
                >
                  {copied === "id" ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <div className="ev-cred">
                <span>Password</span>
                <code>{creds.password}</code>
                <button
                  type="button"
                  onClick={() => copy(creds.password, "pw")}
                  aria-label="Copy password"
                >
                  {copied === "pw" ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <p className="ev-warning">
                Give these to the employee now. The password is shown only once and
                cannot be viewed again. You can generate a new one any time.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="adm-card">
        <h2 className="adm-card-title">All Employees ({employees.length})</h2>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Added</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="ev-empty">
                    No employees yet.
                  </td>
                </tr>
              )}
              {employees.map((x) => (
                <tr key={x.id}>
                  <td>
                    <code className="ev-id">{x.login_id}</code>
                  </td>
                  <td>
                    <strong>{x.name}</strong>
                  </td>
                  <td>{x.job_title ?? "-"}</td>
                  <td>{x.phone || "-"}</td>
                  <td>{formatDate(x.created_at)}</td>
                  <td>
                    <div className="ev-actions">
                      <button
                        className="ev-action"
                        onClick={() => reset(x)}
                        title="Generate a new password"
                      >
                        <KeyRound size={16} />
                        New password
                      </button>
                      <button
                        className="ev-delete"
                        onClick={() => remove(x)}
                        aria-label={`Remove ${x.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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