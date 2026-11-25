"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import Card from "@/components/Card/Card";
import { useLang } from "@/components/LangProvider/LangProvider";
import { num, translateGroup } from "@/lib/i18n";
import type { Book } from "@/data/books";
import type { Group } from "@/lib/catalog";
import "./Books.css";

export default function Books({
  books,
  groups,
}: {
  books: Book[];
  groups: Group[];
}) {
  const { lang, t } = useLang();
  const [activeId, setActiveId] = useState(groups[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0];

  const visibleBooks = books.filter((book) =>
    (activeGroup?.categories ?? []).includes(book.category)
  );

  const countOf = (categories: string[]) =>
    num(lang, books.filter((b) => categories.includes(b.category)).length);

  const labelOf = (group: Group) => translateGroup(lang, group.id, group.label);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (id: string) => {
    setActiveId(id);
    setMenuOpen(false);
  };

  return (
    <section id="books" className="books">
      <div className="books-inner">
        <Reveal direction="up">
          <div className="books-header">
            <span className="books-badge">{t.books.badge}</span>
            <h2 className="books-title">
              {t.books.titleA}{" "}
              <span className="books-highlight">{t.books.titleB}</span>
            </h2>
            <p className="books-subtitle">{t.books.subtitle}</p>
          </div>
        </Reveal>

        {groups.length === 0 ? (
          <p className="books-subtitle">{t.books.empty}</p>
        ) : (
          <>
            <Reveal direction="up" delay={100} className="books-filter">
              {/* Desktop: tabs */}
              <div className="books-tabs" role="tablist">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    role="tab"
                    aria-selected={group.id === activeGroup.id}
                    className={`books-tab ${
                      group.id === activeGroup.id ? "active" : ""
                    }`}
                    onClick={() => setActiveId(group.id)}
                  >
                    {labelOf(group)}
                    <span className="books-tab-count">
                      {countOf(group.categories)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile: dropdown */}
              <div className="books-dropdown" ref={dropdownRef}>
                <button
                  className={`books-dropdown-button ${menuOpen ? "open" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <span className="books-dropdown-label">
                    {labelOf(activeGroup)}
                    <span className="books-tab-count">
                      {countOf(activeGroup.categories)}
                    </span>
                  </span>
                  <ChevronDown size={22} className="books-dropdown-arrow" />
                </button>

                <ul
                  className={`books-dropdown-menu ${menuOpen ? "open" : ""}`}
                  role="listbox"
                >
                  {groups.map((group) => (
                    <li key={group.id}>
                      <button
                        role="option"
                        aria-selected={group.id === activeGroup.id}
                        className={`books-dropdown-item ${
                          group.id === activeGroup.id ? "active" : ""
                        }`}
                        onClick={() => choose(group.id)}
                      >
                        <span>{labelOf(group)}</span>
                        <span className="books-dropdown-item-end">
                          <span className="books-tab-count">
                            {countOf(group.categories)}
                          </span>
                          {group.id === activeGroup.id && <Check size={18} />}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* key makes the cards re-animate every time the category changes */}
            <div className="books-grid" key={activeGroup.id}>
              {visibleBooks.map((book, i) => (
                <Reveal
                  key={book.id}
                  className="books-item"
                  direction={i % 2 === 0 ? "left" : "right"}
                  delay={(i % 4) * 100}
                >
                  <Card book={book} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}