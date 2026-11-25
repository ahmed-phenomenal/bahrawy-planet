"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useLang } from "@/components/LangProvider/LangProvider";
import { formatMoneyL, num, translateCategory } from "@/lib/i18n";
import type { Book } from "@/data/books";
import "./Card.css";

export default function Card({ book }: { book: Book }) {
  const { lang, t } = useLang();

  return (
    <Link href={`/books/${book.id}`} className="card">
      <div className="card-image">
        <Image
          src={book.coverUrl ?? "/book.jpg"}
          alt={book.title}
          fill
          unoptimized={Boolean(book.coverUrl)}
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
        />
        <span className="card-category">
          {translateCategory(lang, book.category)}
        </span>
      </div>

      <div className="card-body">
        <div className="card-top">
          <div className="card-info">
            <h3 className="card-title" dir="auto">
              {book.title}
            </h3>
            <p className="card-author" dir="auto">
              {t.card.by} {book.author}
            </p>
          </div>
          <span className="card-price">{formatMoneyL(lang, book.price)}</span>
        </div>

        <p className="card-description" dir="auto">
          {book.description}
        </p>

        <div className="card-footer">
          <span className="card-rating">
            <Star size={16} fill="currentColor" />
            {num(lang, book.rating, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>
          <span className="card-more">
            {t.card.view} <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}