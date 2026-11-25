"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookPlus, ImagePlus, Trash2 } from "lucide-react";
import "./PromotionsView.css";

export type Category = { id: number; name: string };
export type BookItem = { id: number; title: string; meta: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
function errorMessage(data: any) {
  const first = data?.errors
    ? (Object.values(data.errors) as string[][])[0]?.[0]
    : null;
  return first ?? data?.message ?? data?.error ?? "Something went wrong.";
}

export default function PromotionsView({
  categories,
  items,
}: {
  categories: Category[];
  items: BookItem[];
}) {
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>({});
  const [cover, setCover] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onCover = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    setCover(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice("");
    setError("");

    // The select starts on its first option, so use it when nothing was changed
    const categoryId = values.category_id || String(categories[0]?.id ?? "");
    if (!categoryId) {
      setError("Categories could not be loaded. Refresh the page and try again.");
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("category_id", categoryId);
      fd.append("title", (values.title ?? "").trim());
      fd.append("author", (values.author ?? "").trim());
      fd.append("description", (values.description ?? "").trim());
      fd.append("price", values.price ?? "");
      if (values.stock_quantity) fd.append("stock_quantity", values.stock_quantity);
      if (coverFile) fd.append("cover", coverFile);

      const res = await fetch("/api/backend/admin/books", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(errorMessage(data));
        return;
      }

      setValues({});
      setCover(null);
      setCoverFile(null);
      setFormKey((k) => k + 1);
      setNotice("Book added successfully. It now appears on the website.");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: BookItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setNotice("");
    setError("");

    try {
      const res = await fetch(`/api/backend/admin/books/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(errorMessage(data));
        return;
      }
      setNotice("Book deleted.");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  };

  return (
    <>
      <h1 className="adm-page-title">Add Book</h1>
      <p className="adm-page-sub">
        Add a new book to your store. It appears on the website right away.
      </p>

      <div className="promo-grid">
        <div className="adm-card">
          <h2 className="adm-card-title">
            <BookPlus size={20} style={{ verticalAlign: "-4px" }} /> New Book
          </h2>

          <form key={formKey} onSubmit={onSubmit} className="promo-form">
            <label className="promo-cover">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="Cover preview" />
              ) : (
                <span>
                  <ImagePlus size={28} />
                  Upload book cover
                </span>
              )}
              <input type="file" accept="image/*" onChange={onCover} hidden />
            </label>

            <div className="adm-field">
              <label className="adm-label" htmlFor="title">
                Book title
              </label>
              <input
                id="title"
                name="title"
                className="adm-input"
                value={values.title ?? ""}
                onChange={onChange}
                maxLength={255}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="author">
                Author
              </label>
              <input
                id="author"
                name="author"
                className="adm-input"
                value={values.author ?? ""}
                onChange={onChange}
                maxLength={120}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="category_id">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="adm-input"
                value={values.category_id ?? String(categories[0]?.id ?? "")}
                onChange={onChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="price">
                Price (EGP)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="adm-input"
                value={values.price ?? ""}
                onChange={onChange}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="stock_quantity">
                Copies in storage
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                step="1"
                className="adm-input"
                value={values.stock_quantity ?? ""}
                onChange={onChange}
              />
            </div>

            <div className="adm-field promo-full">
              <label className="adm-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="adm-input"
                value={values.description ?? ""}
                onChange={onChange}
                maxLength={2000}
                required
              />
            </div>

            <div className="promo-full promo-actions">
              <button type="submit" className="adm-btn adm-btn-accent" disabled={busy}>
                {busy ? "Saving..." : "Publish Book"}
              </button>
              {notice && <span className="promo-notice">{notice}</span>}
              {error && (
                <span className="promo-notice" style={{ color: "#ef4444" }}>
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Books ({items.length})</h2>
          {items.length === 0 ? (
            <p className="promo-empty">No books yet.</p>
          ) : (
            <ul className="promo-list">
              {items.map((item) => (
                <li key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.meta}</p>
                  </div>
                  <button
                    className="promo-delete"
                    onClick={() => remove(item)}
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}