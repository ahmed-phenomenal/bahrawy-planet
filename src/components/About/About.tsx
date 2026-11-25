import Image from "next/image";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import SectionLink from "@/components/SectionLink/SectionLink";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/langServer";
import "./About.css";

export default async function About() {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <section id="about" className="about">
      <div className="about-inner">
        <Reveal direction="left" className="about-image-wrap">
          <div className="about-image">
            <Image
              src="/about.jpg"
              alt={t.about.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <div className="about-text">
          <Reveal direction="right">
            <span className="about-badge">{t.about.badge}</span>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <h1 className="about-title">
              {t.about.titleA}{" "}
              <span className="about-highlight">{t.about.titleB}</span>
              <br />
              {t.about.titleC}
            </h1>
          </Reveal>

          <Reveal direction="right" delay={200}>
            <p className="about-paragraph">{t.about.p1}</p>
          </Reveal>

          <Reveal direction="right" delay={300}>
            <p className="about-paragraph">{t.about.p2}</p>
          </Reveal>

          <Reveal direction="right" delay={400}>
            <ul className="about-list">
              {t.about.points.map((point) => (
                <li key={point}>
                  <span className="about-check">
                    <Check size={16} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="right" delay={500}>
            <SectionLink section="books" className="about-button">
              {t.about.button}
            </SectionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}