import Image from "next/image";
import { BadgePercent, BookOpen, Truck } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import SectionLink from "@/components/SectionLink/SectionLink";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/langServer";
import "./Home.css";

const icons = [BookOpen, Truck, BadgePercent];

export default async function Home() {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="home" className="hero">
        <div className="hero-image">
          <Image
            src="/hero.jpg"
            alt={t.home.heroAlt}
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="hero-inner">
          <Reveal direction="up">
            <span className="hero-badge">{t.home.badge}</span>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <h1 className="hero-title">
              {t.brand.first}{" "}
              <span className="hero-highlight">{t.brand.second}</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <p className="hero-description">{t.home.description}</p>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div className="hero-actions">
              <SectionLink section="books" className="btn btn-primary">
                {t.home.browse}
              </SectionLink>
              <SectionLink section="about" className="btn btn-outline">
                {t.home.aboutUs}
              </SectionLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Why Choose Us ---------- */}
      <section id="features" className="features">
        <div className="section-inner">
          <Reveal direction="up">
            <h2 className="section-title">
              {t.home.whyA}{" "}
              <span className="hero-highlight">{t.home.whyB}</span>
            </h2>
          </Reveal>

          <div className="features-grid">
            {t.home.features.map((f, i) => {
              const Icon = icons[i];
              const direction = i === 0 ? "left" : i === 1 ? "up" : "right";
              return (
                <Reveal key={f.title} direction={direction} delay={i * 120}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <Icon size={28} />
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}