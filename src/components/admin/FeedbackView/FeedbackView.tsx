"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import "./FeedbackView.css";

export type FeedbackItem = {
  id: number;
  name: string;
  rating: number;
  message: string;
  created_at: string;
};

type Props = {
  initial: FeedbackItem[];
  failed?: boolean;
};

// The browser talks to Laravel through the Next.js proxy, which adds the token from the cookie
const ENDPOINT = "/api/backend/admin/feedback";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    timeZone: "Africa/Cairo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FeedbackView({ initial, failed = false }: Props) {
  const [items, setItems] = useState<FeedbackItem[]>(initial);
  const [error, setError] = useState(
    failed ? "Could not load the feedback. Is the backend running?" : ""
  );
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);

    try {
      const res = await fetch(ENDPOINT, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("failed");

      const data = await res.json();
      setItems(data.feedback ?? []);
      setError("");
    } catch {
      if (!silent) setError("Could not refresh the feedback. Please try again.");
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  // New messages from the website show up by themselves every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => load(true), 30000);
    return () => clearInterval(timer);
  }, [load]);

  const remove = async (item: FeedbackItem) => {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return;

    setError("");

    try {
      const res = await fetch(`${ENDPOINT}/${item.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("failed");

      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch {
      setError("Could not delete the message. Please try again.");
    }
  };

  const average = items.length
    ? (items.reduce((sum, f) => sum + f.rating, 0) / items.length).toFixed(1)
    : "0.0";

  return (
    <>
      <h1 className="adm-page-title">Customer Feedback</h1>
      <p className="adm-page-sub">
        {items.length} messages · Average rating {average} / 5
      </p>

      <div className="afb-toolbar">
        <span className="afb-note">New messages from the website appear here.</span>
        <button
          type="button"
          className="afb-refresh"
          onClick={() => load()}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? "afb-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="afb-error">{error}</p>}

      {items.length === 0 && !error ? (
        <div className="adm-card afb-empty">No feedback yet.</div>
      ) : (
        <div className="afb-grid">
          {items.map((f) => {
            const stars = Math.min(5, Math.max(0, Math.round(f.rating)));

            return (
              <article key={f.id} className="adm-card afb-card">
                <div className="afb-head">
                  <div className="afb-avatar">{f.name.trim().charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{f.name}</h3>
                    <span className="afb-date">{formatDate(f.created_at)}</span>
                  </div>
                  <button
                    type="button"
                    className="afb-delete"
                    onClick={() => remove(f)}
                    aria-label={`Delete the message from ${f.name}`}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="afb-stars" aria-label={`${stars} out of 5`}>
                  {"★".repeat(stars)}
                  <span>{"★".repeat(5 - stars)}</span>
                </div>

                <p>{f.message}</p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}