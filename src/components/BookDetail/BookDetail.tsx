import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import SectionLink from "@/components/SectionLink/SectionLink";
import type { Book } from "@/data/books";
import {
  formatMoneyL,
  getDict,
  num,
  translateCategory,
  translateLanguage,
} from "@/lib/i18n";
import { getLang } from "@/lib/langServer";
import "./BookDetail.css";

export default async function BookDetail({ book }: { book: Book }) {
  const lang = await getLang();
  const t = getDict(lang);

  // Fields the admin left empty are not shown
  const info = [
    {
      label: t.detail.pages,
      value: book.pages ? num(lang, book.pages, { useGrouping: false }) : "",
    },
    {
      label: t.detail.language,
      value: book.language ? translateLanguage(lang, book.language) : "",
    },
    {
      label: t.detail.year,
      value: book.year ? num(lang, book.year, { useGrouping: false }) : "",
    },
    { label: t.detail.publisher, value: book.publisher },
  ].filter((item) => item.value !== "");

  return (
    <section className="detail">
      <div className="detail-inner">
        <SectionLink
          section="books"
          className="detail-back"
          aria-label={t.detail.back}
        >
          <ArrowLeft size={22} />
        </SectionLink>

        <div className="detail-grid">
          <Reveal direction="left">
            <div className="detail-image">
              <Image
                src={book.coverUrl ?? "/book.jpg"}
                alt={book.title}
                fill
                priority
                unoptimized={Boolean(book.coverUrl)}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </Reveal>

          <div className="detail-text">
            <Reveal direction="right">
              <span className="detail-category">
                {translateCategory(lang, book.category)}
              </span>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <h1 className="detail-title" dir="auto">
                {book.title}
              </h1>
              <p className="detail-author" dir="auto">
                {t.card.by} {book.author}
              </p>
            </Reveal>

            <Reveal direction="right" delay={200}>
              <div className="detail-meta">
                <span className="detail-rating">
                  <Star size={18} fill="currentColor" />
                  {num(lang, book.rating, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span className="detail-price">
                  {formatMoneyL(lang, book.price)}
                </span>
              </div>
            </Reveal>

            <Reveal direction="right" delay={300}>
              <p className="detail-description" dir="auto">
                {book.details}
              </p>
            </Reveal>

            {info.length > 0 && (
              <Reveal direction="right" delay={400}>
                <div className="detail-info">
                  {info.map((item) => (
                    <div key={item.label} className="detail-info-item">
                      <span className="detail-info-label">{item.label}</span>
                      <span className="detail-info-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}