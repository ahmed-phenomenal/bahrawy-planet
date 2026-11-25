"use client";

import { useEffect } from "react";

const KEY = "bp_viewed_books";

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// Counts a book view only the first time THIS browser opens that book
export default function ViewCounter({ bookId }: { bookId: string }) {
  useEffect(() => {
    const seen = readSeen();
    if (seen.includes(bookId)) return;

    // Mark it first, so a second run (React dev mode) or a fast reopen cannot count twice
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen, bookId]));
    } catch {
      return; // storage is blocked, so we cannot tell if it was counted: do not count
    }

    const unmark = () => {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify(readSeen().filter((id) => id !== bookId))
        );
      } catch {}
    };

    fetch(`/api/books/${bookId}/view`, { method: "POST", keepalive: true })
      .then((res) => {
        if (!res.ok) unmark(); // not counted, so allow a retry next time
      })
      .catch(unmark);
  }, [bookId]);

  return null;
}