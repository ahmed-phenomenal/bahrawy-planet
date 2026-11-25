"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/components/LangProvider/LangProvider";
import "./FeedbackForm.css";

export default function FeedbackForm() {
  const { lang, t } = useLang();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setDone("");
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), rating, message: message.trim() }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        setDone(t.feedback.thanks);
        setName("");
        setMessage("");
        setRating(5);
      } else if (lang === "ar") {
        setError(
          res.status === 429
            ? t.feedback.tooMany
            : res.status === 422
            ? t.feedback.invalid
            : t.feedback.generic
        );
      } else {
        setError(data?.error ?? t.feedback.generic);
      }
    } catch {
      setError(t.feedback.offline);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="fb" onSubmit={submit}>
      <h4 className="fb-title">{t.feedback.title}</h4>

      <input
        className="fb-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.feedback.name}
        minLength={2}
        maxLength={60}
        required
      />

      <div className="fb-stars" role="radiogroup" aria-label={t.feedback.ratingLabel}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={t.feedback.starsLabel(n)}
            className="fb-star"
            onClick={() => setRating(n)}
          >
            <Star size={24} fill={n <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>

      <textarea
        className="fb-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t.feedback.message}
        rows={4}
        minLength={3}
        maxLength={1000}
        required
      />

      {error && <p className="fb-error">{error}</p>}
      {done && <p className="fb-done">{done}</p>}

      <button type="submit" className="fb-button" disabled={loading}>
        {loading ? t.feedback.sending : t.feedback.send}
      </button>
    </form>
  );
}