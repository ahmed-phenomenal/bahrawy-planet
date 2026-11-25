import { API_URL } from "@/lib/auth";
import type { Book } from "@/data/books";

// http://127.0.0.1:8000/storage/
const STORAGE_URL = API_URL.replace(/\/api\/?$/, "") + "/storage/";

export type Group = { id: string; label: string; categories: string[] };

export type Offer = {
  id: number;
  title: string;
  applies_to: string;
  discount_percent: number;
  starts_on: string;
  ends_on: string;
  description: string | null;
};

export type EventItem = {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string | null;
};

// weekday: 0 = Saturday ... 6 = Friday
export type StoreHour = {
  weekday: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

// Public GET to Laravel. Returns null if the backend is down or answers an error.
async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// Works whether Laravel sends cover_path ("covers/a.jpg") or cover_url
// ("http://localhost/storage/covers/a.jpg"): both end up on the backend address.
function coverOf(b: any): string | null {
  if (b.cover_path) return STORAGE_URL + String(b.cover_path).replace(/^\/+/, "");

  if (b.cover_url) {
    const url = String(b.cover_url);
    const i = url.indexOf("/storage/");
    return i >= 0 ? STORAGE_URL + url.slice(i + "/storage/".length) : url;
  }

  return null;
}

// Laravel returns decimals as strings ("350.00"), so every number goes through Number()
function toBook(b: any): Book {
  return {
    id: String(b.id),
    title: b.title,
    author: b.author,
    category: b.category?.name ?? "",
    rating: Number(b.rating ?? 0),
    price: Number(b.price ?? 0),
    description: b.description ?? "",
    details: b.details || b.description || "",
    pages: Number(b.pages ?? 0),
    language: b.language ?? "",
    year: Number(b.year ?? 0),
    publisher: b.publisher ?? "",
    coverUrl: coverOf(b),
  };
}

export async function getBooks(): Promise<Book[]> {
  const data = await get<any[]>("/books");
  return (data ?? []).map(toBook);
}

// Note: this endpoint also counts a view for the dashboard analytics
export async function getBook(id: string): Promise<Book | null> {
  const data = await get<any>(`/books/${id}`);
  return data ? toBook(data) : null;
}

export async function getGroups(): Promise<Group[]> {
  const data = await get<any[]>("/categories");
  return (data ?? []).map((g) => ({
    id: g.slug,
    label: g.label,
    categories: (g.categories ?? []).map((c: any) => c.name),
  }));
}

export async function getOffers(): Promise<Offer[]> {
  return (await get<Offer[]>("/offers")) ?? [];
}

export async function getEvents(): Promise<EventItem[]> {
  return (await get<EventItem[]>("/events")) ?? [];
}

export async function getStoreHours(): Promise<StoreHour[]> {
  return (await get<StoreHour[]>("/store-hours")) ?? [];
}