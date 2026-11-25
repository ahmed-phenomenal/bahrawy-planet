"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bike, Search, ShoppingBag, Store, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import {
  DELIVERY_FEE,
  errorMessage,
  type SaleRow,
  type StaffBook,
} from "@/lib/saleTypes";
import "@/components/admin/admin-common.css";
import "./SaleForm.css";

type Props = {
  books: StaffBook[];
  onRecorded?: (sale: SaleRow) => void;
};

type Channel = "spot" | "delivery";

const LOW_STOCK = 15;

export default function SaleForm({ books: initialBooks, onRecorded }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [books, setBooks] = useState<StaffBook[]>(initialBooks);
  const [prevInitial, setPrevInitial] = useState(initialBooks);
  // The server sent fresh books (after router.refresh): use them
  if (prevInitial !== initialBooks) {
    setPrevInitial(initialBooks);
    setBooks(initialBooks);
  }

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [channel, setChannel] = useState<Channel>("spot");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const book = books.find((b) => b.id === selectedId) ?? null;
  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);

  const term = search.trim().toLowerCase();
  const visible = books.filter(
    (b) =>
      !term ||
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term)
  );

  const subtotal = book ? book.price * qty : 0;
  const deliveryFee = channel === "delivery" ? DELIVERY_FEE : 0;
  const total = book ? subtotal + deliveryFee : 0;

  const choose = (id: number) => {
    setSelectedId(id);
    setMessage(null);
    setQuantity("1");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!book) {
      setMessage({ ok: false, text: "Choose a book from the table first." });
      return;
    }
    if (book.stock === 0) {
      setMessage({ ok: false, text: "This book is out of stock." });
      return;
    }
    if (qty > book.stock) {
      setMessage({ ok: false, text: `Only ${book.stock} left in storage.` });
      return;
    }
    if (channel === "delivery" && !address.trim()) {
      setMessage({ ok: false, text: "Enter the delivery address." });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/backend/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: book.id,
          quantity: qty,
          channel,
          address: channel === "delivery" ? address.trim() : null,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage({ ok: false, text: errorMessage(data) });
        return;
      }

      // The storage count comes back from the database
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, stock: Number(data.in_stock) } : b
        )
      );
      setMessage({
        ok: true,
        text: `Sale recorded: ${formatMoney(Number(data.sale.total))}`,
      });
      setSelectedId(null);
      setQuantity("1");
      setChannel("spot");
      setAddress("");
      onRecorded?.(data.sale as SaleRow);
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* ---------- Books available now ---------- */}
      <div className="adm-card sf-card">
        <h2 className="adm-card-title">Books Available ({books.length})</h2>

        <div className="sf-search">
          <Search size={18} />
          <input
            className="adm-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or category..."
            aria-label="Search books"
          />
        </div>

        <div className="adm-table-wrap sf-table-scroll">
          <table className="adm-table sf-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Price</th>
                <th>In storage</th>
                <th aria-label="Sell" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="sf-empty">
                    {books.length === 0
                      ? "No books found. Check that the backend is running."
                      : "No book matches your search."}
                  </td>
                </tr>
              )}
              {visible.map((b) => (
                <tr
                  key={b.id}
                  className={b.id === selectedId ? "sf-row-selected" : ""}
                >
                  <td>
                    <strong>{b.title}</strong>
                    <br />
                    <small>by {b.author}</small>
                  </td>
                  <td>{b.category}</td>
                  <td>{formatMoney(b.price)}</td>
                  <td>
                    {b.stock === 0 ? (
                      <span className="adm-badge adm-badge-red">
                        Out of stock
                      </span>
                    ) : (
                      <span
                        className={`adm-badge ${
                          b.stock <= LOW_STOCK
                            ? "adm-badge-orange"
                            : "adm-badge-green"
                        }`}
                      >
                        {b.stock}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="adm-btn adm-btn-primary sf-sell"
                      disabled={b.stock === 0}
                      onClick={() => choose(b.id)}
                    >
                      <ShoppingBag size={16} />
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Record a sale ---------- */}
      <div className="adm-card sf-card">
        <h2 className="adm-card-title">Record a Sale</h2>

        <form ref={formRef} onSubmit={submit} className="sf-form">
          <div className="sf-full">
            <span className="adm-label">Selected book</span>
            {book ? (
              <div className="sf-selected">
                <div>
                  <strong>{book.title}</strong>
                  <small>
                    {formatMoney(book.price)} · In storage: {book.stock}
                  </small>
                </div>
                <button
                  type="button"
                  className="sf-clear"
                  onClick={() => setSelectedId(null)}
                  aria-label="Clear selected book"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <p className="sf-placeholder">
                Press <strong>Sell</strong> next to a book in the table above.
              </p>
            )}
          </div>

          <div className="adm-field sf-full">
            <label className="adm-label" htmlFor="sale-qty">
              Quantity
            </label>
            <input
              id="sale-qty"
              type="number"
              min="1"
              max={book?.stock || undefined}
              className="adm-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="sf-full">
            <span className="adm-label">Sale type</span>
            <div className="sf-channels">
              <button
                type="button"
                className={`sf-channel ${channel === "spot" ? "active" : ""}`}
                onClick={() => setChannel("spot")}
              >
                <Store size={20} />
                On the spot
              </button>
              <button
                type="button"
                className={`sf-channel ${channel === "delivery" ? "active" : ""}`}
                onClick={() => setChannel("delivery")}
              >
                <Bike size={20} />
                Delivery (+{DELIVERY_FEE} EGP)
              </button>
            </div>
          </div>

          {channel === "delivery" && (
            <div className="adm-field sf-full">
              <label className="adm-label" htmlFor="sale-address">
                Delivery address
              </label>
              <textarea
                id="sale-address"
                className="adm-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, building, city..."
                required
              />
            </div>
          )}

          <div className="sf-summary sf-full">
            <div>
              <span>Book{qty > 1 ? ` (x${qty})` : ""}</span>
              <strong>{book ? formatMoney(subtotal) : "-"}</strong>
            </div>
            <div>
              <span>Delivery fee</span>
              <strong>{formatMoney(deliveryFee)}</strong>
            </div>
            <div className="sf-total">
              <span>Total</span>
              <strong>{book ? formatMoney(total) : "-"}</strong>
            </div>
          </div>

          <div className="sf-full sf-actions">
            <button
              type="submit"
              className="adm-btn adm-btn-accent"
              disabled={busy || !book}
            >
              {busy ? "Saving..." : "Record Sale"}
            </button>
            {message && (
              <span className={`sf-message ${message.ok ? "ok" : "error"}`}>
                {message.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}