"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import SectionLink from "@/components/SectionLink/SectionLink";
import { useLang } from "@/components/LangProvider/LangProvider";
import { PENDING_KEY, scrollToSection } from "@/lib/scroll";
import "./Navbar.css";

const links = [
  { id: "home" },
  { id: "about" },
  { id: "books" },
  { id: "footer" },
] as const;

export default function Navbar() {
  const { lang, t, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Coming from another page (like a book page): scroll to the chosen section
  useEffect(() => {
    if (pathname !== "/") return;

    const timer = setTimeout(() => {
      let id: string | null = null;
      try {
        id = sessionStorage.getItem(PENDING_KEY);
        sessionStorage.removeItem(PENDING_KEY);
      } catch {}
      if (id) scrollToSection(id);
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Highlight the link of the section currently in the middle of the screen
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    links.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <SectionLink
          section="home"
          className="navbar-logo"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt={t.nav.logoAlt}
            width={70}
            height={70}
            priority
          />
          <span className="navbar-name">
            {t.brand.first} <span>{t.brand.second}</span>
          </span>
        </SectionLink>

        <div className="navbar-right">
          <button
            type="button"
            className="lang-switch"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={t.nav.langLabel}
            title={t.nav.langLabel}
          >
            {t.nav.langButton}
          </button>

          <ThemeToggle />

          <div
            className={`navbar-overlay ${open ? "open" : ""}`}
            onClick={() => setOpen(false)}
          />

          <nav className={`navbar-links ${open ? "open" : ""}`}>
            <button
              className="navbar-close"
              aria-label={t.nav.closeMenu}
              onClick={() => setOpen(false)}
            >
              <X size={28} />
            </button>

            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <SectionLink
                    section={link.id}
                    className={`navbar-link ${
                      pathname === "/" && activeId === link.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setOpen(false);
                      setActiveId(link.id);
                    }}
                  >
                    {t.nav.links[link.id]}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="navbar-toggle"
            aria-label={t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}